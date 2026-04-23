这篇 **PRODIGY** 的预训练过程，核心不是“先训一个通用图编码器，之后再靠下游 fine-tune 适配任务”，而是：

**在预训练阶段就不断构造 many-shot/few-shot 的“图任务”，并把它们写成 prompt graph，让模型直接学会：看几个示例后，如何给 query 分类。**  
所以它预训练出来的，不只是表示能力，更是 **in-context learning 能力**。

我按论文里的逻辑，把预训练过程拆成 6 步说。

---

## 1\. 预训练的目标

论文先设定一个独立的预训练图 $G_{\text{pretrain}}$。它要求：模型只在这个图上预训练，之后面对**完全不同的下游图和任务**时，也能**不做任何微调**，只靠 prompt examples 直接预测 query。


所以 PRODIGY 的预训练目标，不是普通的“学一个好初始化”，而是：

-   学会从少量示例 $S$ 里读出“这是什么任务”
    
-   学会把这个任务规则应用到 query $Q$
    
-   这个过程在测试时不更新参数，只前向推理即可。


论文自己也明确说了，它的设计原则是：**每个预训练目标都要用 in-context 的形式来构造**，而不是像传统 graph pretraining 一样只学 encoder，再留到下游接 task head。


---

## 2\. 先把预训练任务写成 few-shot prompt

论文把预训练任务都写成一个 few-shot prompt：

-   一个 source/pretraining graph：$G_{\text{pretrain}}$
    
-   一组 prompt examples：$S$
    
-   一组 queries：$Q$
    

其中 $S$ 里是少量 $(x_i,y_i)$ 示例，$Q$ 里是待预测样本。样本 $x_i$ 可以是节点，也可以是边。


也就是说，预训练阶段本身就在反复模拟测试时的场景：

> 给你几个有标签的图样本示例，再给你几个 query，要求你直接推断 query 标签。

这就是它和普通 pretrain/fine-tune 最大的区别。



---

## 3\. 预训练任务怎么生成：两种方式

论文提出两类预训练任务生成方式：

-   **Neighbor Matching（PG-NM）**
    
-   **Multi-task（PG-MT）**

完整的 **PRODIGY** 就是把这两类一起用。



### 3.1 Neighbor Matching：自监督预训练任务

这是论文最核心的自监督任务。

它的思路是：  
在预训练图里随机采样 $m$ 个节点 $c_1,\dots,c_m$，每个节点对应一个“类”。但这个类不是人工语义类，而是“它的局部邻域”。具体做法是：

1.  从 $G_{\text{pretrain}}$ 里均匀采样 $m$ 个节点，作为 $m$ 个类别中心 $c_i$。
    
2.  对每个 $c_i$，取它的精确 $l$\-hop 邻居集合：
    
    $$
    N_i = \text{Neighbor}(c_i, G_{\text{pretrain}}, l)
    $$
    这定义了第 $i$ 个“邻域类”。

1.  从每个邻域 $N_i$ 中采样 $k$ 个节点，作为这个类的 support examples：
    
    $$
    S_i=\{(x_j,y_j=c_i)\}_{j=1}^k
    $$
    
2.  再从每个邻域中采样若干个节点，作为 queries：
    
    $$
    Q_i=\{(x_j,y_j=c_i)\}_{j=1}^{\lceil n/m\rceil}
    $$
    
3.  最后把所有类的 support/query 合并，形成一个 $m$\-way $k$\-shot few-shot 任务。


这个任务本质上是在问：

**“给你几个属于某个局部邻域的节点示例，query 节点属于哪个邻域？”**

所以它训练模型学会的是：  
根据 prompt examples 中的局部结构共性，去判断 query 更像哪一组示例。

如果下游是边分类，论文还给了改法：  
先把采样到的节点扩展成一条 incident edge，于是 neighbor matching 就变成“这条边属于哪个邻域类”。

这个任务的优点是：

-   完全自监督
    
-   不需要人工标签
    
-   天然就是 few-shot prompt 形式
    
-   适合大规模无标注图预训练。

---

### 3.2 Multi-task：有监督预训练任务

如果预训练图上本身有节点或边标签函数 $f(x_i)=y_i$，论文还会额外构造 supervised 的 few-shot 任务。



具体做法是：

1.  先从标签集合里采样 $m$ 个类 $c_1,\dots,c_m$。
    
    
    
2.  对每个类 $c_i$，从所有满足 $f(x)=c_i$ 的样本中采样 $k$ 个 support：
    
    $$
    S_i=\{(x_j,y_j=c_i)\}_{j=1}^k
    $$
    
3.  再采样若干 query：
    
    $$
    Q_i=\{(x_j,y_j=c_i)\}_{j=1}^{\lceil n/m\rceil}
    $$
    
4.  合并形成一个 few-shot prompt。


如果是边任务，标签函数可以直接定义成关系类型：

$$
f((v_1,v_2))=r \iff (v_1,r,v_2)\in E
$$

这样就能把知识图谱上的 relation classification 也转成同样的 few-shot prompt。


这类任务比 neighbor matching 更接近真实下游，因为它直接用“真标签”构造 few-shot 分类任务。  
但缺点是依赖标注。论文也明确说了：它的好处是更像 downstream，但没有 NM 那么通用。



---

## 4\. 把 few-shot task 变成 prompt graph

生成好 few-shot prompt 后，还不能直接喂模型。论文会把它进一步变成 **prompt graph**。这个过程包含两层。

### 4.1 先构造 data graph

对 support 和 query 里的每个样本 $x_i$，都去预训练图里取一个 $k$\-hop 邻域子图，形成它的 **data graph** $G_i^D$。  
如果样本是节点，就围绕该节点取邻域；如果是边，就围绕边里的两个节点取邻域。

这一步的目的是：

-   不直接把整张大图送入模型
    
-   但保留这个样本在原图中的局部上下文。


### 4.2 再构造 task graph

然后，论文再建一张 **task graph** $G^T$，它里面有两类节点：

-   每个样本对应一个 **data node** $v_{x_i}$
    
-   每个类别对应一个 **label node** $v_y$

连边方式是：

-   对 prompt examples：数据节点连到所有 label nodes，真实标签那条边标记为 **T**，其他标记为 **F**
    
-   对 queries：因为不知道标签，所以让所有 label nodes 都连向 query data node。

这样，support、query 和 label 就被显式放进一张任务图里了。  
这正是它所谓图上的“prompt”。


---

## 5\. 预训练时还做了图增强

在把样本转成 data graph 之后，论文没有直接拿原始 data graph 训练，而是加了 augmentation。它参考了对比学习里的图增强思路，希望模型学到对扰动不敏感的表示。


用到两种增强：

-   **DropNode**：随机删节点
    
-   **MaskNode**：随机把部分节点特征置 0。


增强后的图记作 $G_i^{aug}$。  
然后再基于这些增强后的 data graphs 去建 task graph 和整个 prompt graph。

此外，附录里还给了一个 **attribute prediction loss**：  
对被 mask 的节点特征，用学到的 embedding 经过 MLP 去重建原特征，用 MSE 训练。虽然它不是正文主损失的一部分，但在 PG-NM 的消融中影响很大，去掉后平均性能下降大约 7%。


---

## 6\. 模型如何在预训练时处理 prompt graph

预训练模型结构分两段消息传递。

### 6.1 Data graph message passing

先对每个 data graph $G^D$ 跑一个 GNN $M_D$，得到节点表示：

$$
E = M_D(G^D)
$$

然后再把整个 data graph 压成一个向量 $G_i$。

-   对节点分类任务，直接取目标节点的表示
    
-   对 link prediction / edge tasks，把两个输入节点的表示和全图 max pooling 拼起来，再线性投影回 $d$ 维。

### 6.2 Task graph message passing

接着，把每个样本向量 $G_i$ 作为 task graph 里对应 data node 的初始表示，再用另一个 attention-based GNN $M_T$ 在 task graph 上做消息传递：

$$
H = M_T(G^T)
$$

这一步让：

-   prompt examples 通过 label nodes 影响 query
    
-   label nodes 汇聚来自 support 的“类信息”
    
-   query 最终拿到一个结合了上下文示例后的任务特定表示。


最后，对 query data node 和所有 label nodes 做余弦相似度，得到分类 logits：

$$
O_i=[\text{cosine\_similarity}(H_{x_i},H_y),\forall y\in Y]
$$

这就是预训练任务上的输出。


---

## 7\. 最终预训练损失

预训练时，论文把 NM 和 MT 两类任务都写成 prompt graph，然后对 query 做交叉熵分类。最终损失写成：

$$
L= \mathbb E_{x_i\in Q^{NM}} CE(O^{NM}_i,y^{NM}_i) + \mathbb E_{x_i\in Q^{MT}} CE(O^{MT}_i,y^{MT}_i)
$$

也就是：

-   对 Neighbor Matching 任务上的 queries 算 CE
    
-   对 Multi-task 任务上的 queries 也算 CE
    
-   两者加起来一起训练。


所以完整的 PRODIGY，其实是在反复做下面这个循环：

1.  从预训练图采样一个 few-shot 任务
    
2.  把它转成 prompt graph
    
3.  让模型根据 support examples 给 query 分类
    
4.  用 query 的真实标签做损失
    
5.  更新参数。


---

## 8\. 这套预训练和普通 graph pretraining 的本质区别

普通图预训练通常是：

-   学一个 encoder
    
-   下游再接 classifier 或 fine-tune head

而 PRODIGY 预训练的是：

**“如何根据几个示例，直接做新任务”**。

所以它预训练后得到的能力，不只是“图表示学得好”，而是：

-   会看 support examples
    
-   会通过 label nodes 聚合任务信息
    
-   会把这些信息迁移给 query
    
-   测试时不需要再训练。

---

## 9\. 一句话压缩总结

这篇论文的预训练过程，本质上是：

**在大图上不断自动生成 few-shot 图任务（自监督的 Neighbor Matching + 有监督的 Multi-task），把每个任务转成 prompt graph，用 data-graph 和 task-graph 两阶段消息传递来预测 query 标签，并用 query 上的交叉熵反向训练，从而让模型学会真正的 graph in-context learning。**