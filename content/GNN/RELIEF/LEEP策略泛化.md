这篇论文里的 LEEP 可以分成三层理解。

### 1\. 先把训练集拆成多个 bootstrap 环境

设整个训练图集合为 $D$。LEEP 不直接在 $D$ 上训练一个策略，而是先从 $D$ 中 bootstrap 采样出 $l$ 个子集：

$$
D_1, D_2, \dots, D_l
$$

每个子集都对应一个子策略。这样做的直觉是：  
每个子策略只看到训练分布的一个扰动版本，于是它们学到的偏好会不同；最后把这些不同偏好的策略融合起来，比单一策略更稳。



---

### 2\. 对离散策略的 LEEP：学多个 discrete sub-policies，再逼近 joint policy

RELIEF 里离散动作是“选哪个节点”。因此先学 $l$ 个离散子策略：

$$
\pi_{d,1}, \pi_{d,2}, \dots, \pi_{d,l}
$$

每个 $\pi_{d,i}$ 都在对应的 bootstrap 子集 $D_i$ 上训练。



但它不是各学各的，而是在 PPO 目标外再加一个 KL 正则项，让每个子策略不要偏离 joint policy 太远。论文写成：

$$
L_{d,i}=L^{PPO}_{d,i}-\alpha_d \,\mathbb E_{s\sim \pi_{d,i},D_i} \left[ D_{KL}\big(\pi_{d,i}(a|s)\,\|\,\pi_{d,J}(a|s)\big) \right]
$$

这里：

-   $L^{PPO}_{d,i}$ 是第 $i$ 个离散 actor 原本的 PPO 目标
    
-   $\alpha_d$ 是离散策略的正则强度
    
-   $D_{KL}$ 用来衡量当前子策略和 joint policy 的差异。
    
    
    

也就是说，训练目标有两部分：

-   一部分让子策略自己在对应环境里拿高回报
    
-   一部分让它不要和总体策略分歧太大。
    
    
    

#### 离散 joint policy 怎么构造

论文把 joint discrete policy 定义为：

$$
\pi_{d,J}(a|s) = \frac{\max_{i=1,\dots,l}\pi_{d,i}(a|s)} {\sum_{a'}\max_{i=1,\dots,l}\pi_{d,i}(a'|s)}
$$

意思是：对每个候选动作 $a$，先看哪一个子策略给它的概率最高，再把这些“最大值”归一化。



这个设计很有意思。它不是平均，而是 **max-pooling over sub-policies**。直觉上等于：

**只要有某个子策略非常确信某个节点值得 prompt，这个动作就在 joint policy 里被保留下来。**

所以 joint policy 更像一个“多专家取强项”的机制。



---

### 3\. 对连续策略的 LEEP：从离散扩展到 hybrid action space

原始 LEEP 是给离散动作空间设计的，但 RELIEF 的动作还有连续部分：给选中的节点加什么 prompt 向量。于是作者把 LEEP 扩展到了连续策略。



同样地，学 $l$ 个连续子策略：

$$
\pi_{c,1}, \pi_{c,2}, \dots, \pi_{c,l}
$$

每个都在自己的 $D_i$ 上训练。每个连续子策略的目标写成：

$$
L_{c,i}=L^{PPO}_{c,i}-\alpha_c \,\mathbb E_{s\sim \pi_{c,i},D_i} \left[ D_{KL}\big(\pi_{c,i}(z|s,a)\,\|\,\pi_{c,J}(z|s,a)\big) \right]
$$

这里 $\alpha_c$ 是连续策略的正则强度。



#### 连续 joint policy 怎么构造

和离散不同，连续 joint policy 用的是均值：

$$
\pi_{c,J}(z|s,a) = \frac{1}{l}\sum_{i=1}^{l}\pi_{c,i}(z|s,a) = \frac{1}{l}\sum_{i=1}^{l}\mu_i(s,a)
$$

因为 RELIEF 里连续 actor 实际输出的是高斯分布的均值 $\mu_i(s,a)$，所以 joint continuous policy 就是把这些均值平均起来。



直觉上，这表示：

**不同子策略对“这个节点应该加多大的 prompt”各有判断，最终 joint continuous policy 取一个折中平均。**

所以离散和连续的融合方式不同：

-   离散：保留最有把握的动作，用 max
    
-   连续：避免极端值，用 mean。
    
    
    

---

### 4\. 在 RELIEF 中，LEEP 最终长什么样

把上面两部分合起来后，RELIEF 的 policy network 不再是：

-   1 个 discrete actor
    
-   1 个 continuous actor
    
-   1 个 critic
    

而变成：

-   $l$ 个 discrete actors
    
-   $l$ 个 continuous actors
    
-   1 个共享 critic。
    
    
    

训练时：

-   每一对子策略 $(\pi_{d,i},\pi_{c,i})$ 在自己的 bootstrap 数据 $D_i$ 上更新
    
-   discrete actor 用上面的 $L_{d,i}$
    
-   continuous actor 用 $L_{c,i}$
    
-   critic 仍然共用，按原来的 $L_{Critic}$ 更新。
    
    
    

推理时则不用单个子策略，而是用：

-   joint discrete policy $\pi_{d,J}$
    
-   joint continuous policy $\pi_{c,J}$
    

来一步一步往图里加 prompt。  
也就是说，**训练时分而治之，测试时集成为一个更稳的统一策略。**



---

### 5\. 它为什么能提升泛化

论文的动机其实很清楚：  
few-shot prompt tuning 下，单一 RL 策略很容易只适应训练图的小分布，导致验证/测试泛化差。LEEP 用多子策略 + joint policy 的方式，相当于让策略在多个“训练分布扰动”上都要表现合理，所以最后学出来的 joint policy 更不容易过拟合。



可以把它类比成：

-   单一策略：像只听一个老师的经验
    
-   LEEP：像同时听多个老师的经验，再综合成一个共同决策规则
    

这样面对新图时更稳。



---

### 6\. 和 RELIEF 主方法的关系

你可以把 RELIEF 主体理解成三部分：

-   **MDP formulation**：把 prompt insertion 写成序列决策
    
-   **H-PPO**：解决离散选点 + 连续 prompt 向量的混合动作
    
-   **LEEP**：给这个 RL 策略加一个“防过拟合、强泛化”的 ensemble 正则层。
    
    
    

所以 LEEP 不是替代 H-PPO，而是叠加在 H-PPO 上，专门解决 few-shot 下 policy 的泛化问题。论文甚至明确说：当 $l=1$ 时，就退化成没有 policy generalization 的普通情形。



---

### 7\. 一句话总结

**LEEP 在 RELIEF 里，就是通过 bootstrap 训练多个离散/连续子策略，并用 KL 正则约束它们靠近 joint policy，最终在推理时用 max-融合的离散 joint policy 和均值融合的连续 joint policy 来生成 prompts，从而缓解 few-shot 场景下 RL 策略对训练图的过拟合。**