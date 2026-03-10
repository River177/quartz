# Graph Prompt Learning

| Status |     |
| --- | --- |
| 熟悉论文草稿 | In Progress |
| 补充最新文献 | Todo |
| 润色论文 | Todo |
| 理解2个Repo | In Progress |
| 找投稿期刊/会议 |     |
| 复现一个GPL方法 |     |
| 实验改进 |     |

---

# Graph Prompt Learning: A Comprehensive Survey and Beyond

[arxiv链接$$(https://arxiv.org/abs/2311.16534)]

---

## ProG

[GitHub - sheldonresearch/ProG: A Unified Python Library for Graph Prompting$$(https://github.com/sheldonresearch/ProG)

### Prompt Method

---

#### All in One

##### 1 原始输入图

给定原图：

$$
G = (V, E, X)  
$$

其中：

- $V$: 节点集合
- $E$: 边集合
- $X \in \mathbb{R}^{|V| \times d}$: 节点特征

##### 2 定义 Prompt Token

学习一组 prompt 节点 $P$:

$$
P = \{p_1, p_2, \dots, p_m\}, \quad p_i \in \mathbb{R}^d
$$

它们不是来自数据，而是模型参数。

##### 3 Prompt 内部边

根据 token 相似度构造：

$$
S_{ij}^{inner} = \sigma(p_i^\top p_j)
$$

若 $S_{ij}^{inner} \ge \tau_{inner}$，则在 prompt 节点 $p_i$ 和 $p_j$ 之间建立 prompt 内部边。

##### 4 Prompt 与原图跨边

对于 prompt 节点 $p_i$ 和原图节点 $x_j$：

$$
S_{ij}^{cross} = \sigma(p_i^\top x_j)
$$

若 $S_{ij}^{cross} \ge \tau_{cross}$，则在 prompt 节点 $p_i$ 和原图节点 $x_j$ 之间建立跨边。

##### 5 构造增强图

构造增强图 $G'$：

$$
G' = (V \cup P, E \cup E_P \cup E_{cross})
$$

其中 $E_P$ 为 prompt 内部边集合，$E_{cross}$ 为 prompt 与原图的跨边集合。

然后用 GNN 编码：

$$
h_G = \text{GNN}(G')
$$

再分类：

$$
\hat{y} = f(h_G)
$$

训练目标是最小化任务损失：

$$
\mathcal{L}(\hat{y}, y)
$$

- [x] 优化上述公式排版

---

#### GPF (Graph Prompt Fine-tuning)

$$
x'_i = x_i + p
$$

#### GPF\_plus

$$
x'i = x_i + \sum{j=1}^{M} \alpha_{ij} p_j,\quad
\alpha_{ij} = \text{softmax}(a(x_i))
$$

其中：

- $p_j$ 是第 j 个 prompt basis
- $\alpha_{ij}$ 是第 i 个节点对第 j 个 prompt 的权重

---

#### GPPTPrompt

GPPTPrompt = 用“结构 token”先把节点按结构模式分组，再给每个组配一个专属“任务 token”分类器，对节点做分类。

##### 第一步：局部聚合

$$
h_i = \text{MeanConv}(x_i, \mathcal N(i))
$$

##### 第二步：结构打分

$$
s_{ik} = c_k^\top h_i
$$

##### 第三步：结构分配

$$
z_i = \arg\max_k s_{ik}
$$

##### 第四步：条件分类

$$
\hat{y}*i = W*{z_i} h_i
$$

如果 $W_k$ 表示第 $k$ 个 TaskToken，那么：

$$
\hat{y}*i = W*{z_i} h_i
$$

---

#### GPrompt

如果输入节点表示为：

$$
H \in \mathbb{R}^{N\times d}
$$

则 GPrompt 输出：

$$
H' = H \odot w
$$

其中：

$$
w \in \mathbb{R}^{1\times d}
$$

是唯一需要学习的 prompt 参数。

---

#### SUPT

用一个最统一、最核心的公式来概括这份代码里的 SUPT：

$$
X' = X + A(G,X; \Theta)\, P
$$

其中：

- $X \in \mathbb{R}^{N\times d}$：原始节点特征
  
- $P \in \mathbb{R}^{K\times d}$：可学习 prompt cluster embeddings
  
- $A(G,X;\Theta)\in\mathbb{R}^{N\times K}$：由图结构和节点特征决定的 assignment / routing matrix
  
- $X' \in \mathbb{R}^{N\times d}$：prompt-enhanced 节点特征
  

然后：

##### 对 DiffPoolPrompt：

$$
A(G,X;\Theta)=\mathrm{softmax}(\mathrm{GCN}(X+\mathbf{1}u^\top,E))
$$

##### 对 SAGPoolPrompt：

$$
A_{ik}(G,X;\Theta)=\frac{1}{c_i}\mathbf{1}(i\in\mathcal S_k)\,\phi(\mathrm{GCN}(X+\mathbf{1}u^\top,E))_{ik}
$$

其中：

$$
u=\sum_{k=1}^{K}p_k
$$

---

#### MultiGprompt

给定三路预训练 prompt $p_1,p_2,p_3$，主特征 $X$，辅助特征 $X^{(aux)}$：

#### 1 prompt 融合

$$
p = \alpha_1p_1+\alpha_2p_2+\alpha_3p_3
$$$$
w = \mathbf{1}+\mathrm{ELU}(p)
$$

#### 2 主特征 prompt 调制

$$
R_1 = X\odot w
$$

#### 3 下游 prompt 调制

$$
R_2 = X\odot v
$$

#### 4 融合两路

$$
R_3=\mathrm{ELU}(\beta_1R_1+\beta_2R_2)
$$

#### 5 加辅助特征

$$
R = R_3 + a_4 X^{(aux)}
$$

#### 6 类别原型

$$
c_m = \frac{1}{|\mathcal D_m|}\sum_{i:y_i=m}R_i
$$

#### 7 余弦分类

$$
s_{im}=\cos(R_i,c_m)
$$$$
\hat y_i = \mathrm{softmax}(s_i)
$$

---
