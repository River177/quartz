

![[backup0125.drawio.svg]]




# 编码器部分

下面按你 `UTANetMamba.py` 里的实现，把**编码器（Encoder）**从“模块构成→forward 逐步走一遍→每个输出的意义/给后续谁用”讲清楚，并把**每一步的张量 shape**都写出来（默认 `img_size=224`、输入 `x: (B,3,224,224)`）。

---

## 1）编码器用的是什么：ResNet34 的“骨干 + 你自定义的 stem”

你在 `__init__` 里写得很明确：**Encoder = ResNet34**，但第一层不是用 ResNet 原来的 `7×7 conv + stride2`，而是你自己写了一个 `3×3 conv` 的 `conv1`，并且 **maxpool 是你自己定义的**。

### (A) 你自定义的 stem

```python
self.conv1 = Conv3×3(in=n_channels,out=64,stride=1,pad=1) + BN + ReLU
self.maxpool = MaxPool2d(2,2)
```

这和标准 ResNet 的差异是：标准 ResNet 通常一上来就 stride=2 压分辨率，你这里 **先保持 224×224**，再用 `maxpool` 统一降到 112×112。

### (B) ResNet34 的四个 stage（layer1~layer4）

```python
self.conv2 = resnet.layer1  # 64
self.conv3 = resnet.layer2  # 128
self.conv4 = resnet.layer3  # 256
self.conv5 = resnet.layer4  # 512
```

这些就是标准 ResNet 的 4 个 stage（每个 stage 内部是若干 BasicBlock + 残差连接），用于逐级下采样、提升语义抽象。

---

## 2）forward 里编码器的完整流程（逐行 + shape）

编码器部分在 forward 里是这一段：

### Step 1：conv1（stem）

```python
e1 = self.conv1(x)  # 64, 224
```

- 输入：`x: (B,3,224,224)`
    
- 输出：`e1: (B,64,224,224)`
    

**含义**：最浅层特征，保留大量边缘/纹理细节（分辨率最高）。

---

### Step 2：maxpool（下采样×2）

```python
e1_maxp = self.maxpool(e1)  # 64, 112
```

- 输出：`e1_maxp: (B,64,112,112)`
    

**含义**：开始降低空间分辨率，进入 ResNet 主干的 stage1 输入尺度。

---

### Step 3：layer1（ResNet stage1）

```python
e2 = self.conv2(e1_maxp)  # 64, 112
```

- 输出：`e2: (B,64,112,112)`
    

**含义**：浅层语义增强（仍然是 112×112），后面会被当作第二路特征使用。

---

### Step 4：layer2（ResNet stage2，下采样×2）

```python
e3 = self.conv3(e2)  # 128, 56
```

- 输出：`e3: (B,128,56,56)`
    

**含义**：进入更语义化层次，空间减半，通道增加。

---

### Step 5：layer3（ResNet stage3，下采样×2）

```python
e4 = self.conv4(e3)  # 256, 28
```

- 输出：`e4: (B,256,28,28)`
    

**含义**：更高语义、更粗尺度的特征（常作为 U-Net 的深层 skip）。

---

### Step 6：layer4（ResNet stage4，下采样×2）

```python
e5 = self.conv5(e4)  # 512, 14
```

- 输出：`e5: (B,512,14,14)`
    

**含义**：最深层语义特征（全局语义最强，分辨率最低），后续 decoder 多次用到它。

---

## 3）编码器输出会被后面怎么用（与你的方法强相关）

你这里和普通 U-Net 最大不同：**encoder 的 e1~e4 不只是作为 skip 给 decoder**，而是先被送到 TA-MoSC / MoE 做融合与路由，生成 `o1~o4` 作为 decoder 的“多尺度输入”。

### (A) 先把 e1/e3/e4 resize 到 e2 的尺度（112×112）

```python
e1_resized = interpolate(e1, scale_factor=0.5)  # 224->112
e3_resized = interpolate(e3, scale_factor=2)    # 56->112
e4_resized = interpolate(e4, scale_factor=4)    # 28->112
fused = cat([e1_resized, e2, e3_resized, e4_resized], dim=1)
```

此时：

- `e1_resized: (B,64,112,112)`

- `e2: (B,64,112,112)`
    
- `e3_resized: (B,128,112,112)`
    
- `e4_resized: (B,256,112,112)`
    
- concat 后 `fused: (B,512,112,112)`
    

### (B) fuse（1×1）把 512 压到 64，作为 MoE 的输入

```python
fused = self.fuse(fused)  # 512 -> 64
```

输出：`fused: (B,64,112,112)`
**含义**：把多尺度拼接后的高维特征压到轻量维度，送进 MoE 路由。

### (C) 编码器特征并不是直接给 decoder，而是变成 o1~o4

```python
o1, o2, o3, o4, loss = self.moe(fused)
```

然后再通过 DOC（docker1~4）把通道适配成 decoder 期望的通道：
最后再把分辨率调成 224/112/56/28：

---

## 4）为什么你这里 encoder 的设计要这么做？

从实现角度，encoder 的输出 e1~e5 有两条路径：

1. **传统路径**：e5 作为最深语义，直接参与 decoder（你 decoder4/decoder3 都吃 e5）。

2. **你提出的方法路径**：e1~e4 先“对齐到同尺度→拼接→压到 64→MoE 路由→DOC→多尺度 o1~o4”，再给 decoder 做全尺度融合。


这样做的直观好处是：

- 在进入 decoder 之前，你就已经把 **多尺度信息聚合 + 通过 MoE 做了“专家化”的全局建模**（MambaExpert）；

- decoder 不是简单用原始 skip，而是用“MoE 增强后的多尺度输入 o1~o4”。


---

## 5）你写论文/画图时，编码器部分建议怎么标注

你图上 encoder 输出可以按这 5 个 feature map 标：

- `E1: 64×224×224`

- `E2: 64×112×112`

- `E3: 128×56×56`

- `E4: 256×28×28`

- `E5: 512×14×14`



# Mamba 专家部分


## 1) 它在 UTANetMamba 的什么位置？输入是什么？输出给谁用？

这块发生在 **Encoder 之后、Decoder 之前**，只在 `pretrained=True` 时启用（你的代码里叫 _TA-MoSC_）。流程是：

1. 编码器得到多尺度特征 `e1,e2,e3,e4`（空间分别 224/112/56/28）
    
2. 把它们 resize 到同一空间尺度 **112×112** 后拼接，再用 `self.fuse` 压到 **64 通道**，得到 `fused`
    
3. 把 `fused` 喂进 `self.moe`（Mamba MoE），得到 `o1,o2,o3,o4` + `loss`
    
4. 再用 `docker1..4` 把 `o1..o4` 的通道对齐成后续解码器需要的 **64/64/128/256**，并把空间再调回 224/112/56/28 送入解码器分支
    

所以，**MoE 的输入就是融合后的 `fused`：`(B,64,112,112)`**，输出是 **4 路特征 `o1..o4`（同分辨率 112×112）+ 一个负载均衡 loss**，然后再由 `docker` 做通道/尺度适配 。

---

## 2) “Mamba 专家模块”到底是什么？（MoE 与 Expert 的分工）

你这套实现分两层：

- **Router / Gate（路由器）**：负责“这一张图（这个样本）该用哪几个专家”，用的是 **GAP + 线性映射 + softmax + top-k**。
    
- **Expert（专家网络）**：被选中后才真正做特征变换；你的专家是 **MambaExpert：LayerNorm → Mamba → Linear**。
    

> 你之前问的“mamba模块不选择专家，只是对选择的专家进行Mamba处理？”——**对**：选择发生在 Router；Mamba 是每个 Expert 内部的计算核心。

---

## 3) 单个 MambaExpert：输入输出是什么？逐步做了什么？

**输入**：`x ∈ (B,C,H,W)`
**输出**：`out ∈ (B,C,H,W)`（形状完全不变）

核心原因：Mamba（SSM）通常按“序列”处理，所以你把二维特征图摊平成长度 `H*W` 的序列，再还原回来：

1. **展平为序列**
    `(B,C,H,W) → (B,H*W,C)`：把每个像素位置当成一个 token

2. **LayerNorm**
    稳定训练、让不同通道尺度一致

3. **Mamba 前向**
    在序列维度上建模长程依赖（全局感受野的味道）

4. **Linear 投影 + reshape 回图像**
    `(B,H*W,C) → (B,C,H,W)`


> 直觉：**把 112×112 的特征图当成 12544 个 token 的序列，让 Mamba 去做“全局信息传播”，再折回二维。**

---

## 4) MoE（Mamba Experts）内部：输入输出、每一步干什么 & 为什么这样做？

### 4.1 输入输出（MoE 这一层）

- **输入**：`x = fused ∈ (B,64,112,112)`（在 UTANetMamba 里就是 fused）

- **输出**：`o1,o2,o3,o4 ∈ (B,64,112,112)` + `loss`


注意：**MoE 内部 4 个输出 shape 一样**；通道变成 64/128/256 是后面的 `docker1..4` 做的，不是 MoE 自己变的 。

---

### 4.2 Router（Gate）怎么选专家？（Top-K 路由）

对“某一个 gate”（比如 gate1）来说：

1. **GAP 压缩空间信息**：`x_gap = GAP(x) → (B,C)`
    目的：用一个全局向量代表该样本当前特征，作为路由依据

2. **线性打分**：`gate_logits = x_gap @ gate_weights → (B,num_experts)`
    这里 `gate_weights` 是你说的“可学习参数矩阵”（`C×E`），表示“通道特征如何投影到专家偏好”。

3. **softmax 得到概率**：`gate_probs`
    目的：把“倾向程度”变成可比较的分布

4. **top-k 选专家**：取每个样本概率最大的 K 个专家（默认 `topk=2`）
    
5. **归一化 top-k 权重**：保证选中专家的权重和为 1，便于加权融合
    

---

### 4.3 “只算被选中的专家”是怎么实现的？（你的 sparse 粒度）

你代码里做了一个“**batch 级别的稀疏**”：

- 把整个 batch 里所有样本选到的专家 index 合并成 `selected_experts`（去重）
    
- **只对这些专家**跑 forward（没被选到的专家完全不算）
    

⚠️但要注意一个细节：
虽然只算了“被选中的专家集合”，但是 **每个被选中的专家 forward 时是对整个 batch 的 x 都算了一遍**（输出 `(B,C,H,W)`），不是只算“分配给它的那部分样本”。

- 优点：实现简单、确实比“算全部专家”省（当 `selected_experts` 少于 `num_experts` 时）
    
- 进一步可优化：真正按专家分发样本子集（mask/index_select → expert → scatter 回去），那才是“样本级稀疏”。
    

---

### 4.4 专家输出怎么融合回一个结果？

对每个样本 `i`：

- 它会取自己 top-k 的专家输出（从 `expert_outputs[expert_idx][i]` 取那一张）

- 按 `topk_probs` 做加权求和：
    `output[i] = Σ_j weight(i,j) * expert_j(x)[i]`


所以 **MoE 输出 shape 和输入 x 完全一致**。

---

### 4.5 负载均衡 loss 是干嘛的？怎么来的？

你这里算的是：

- `expert_usage = gate_probs.mean(dim=0)`：每个专家在 batch 上平均被“偏好”的程度
    
- `loss = cv_squared(expert_usage)`：用变异系数平方惩罚“使用不均衡”
    

直觉：防止训练塌缩成“永远只用某 1 个专家”，让 4 个专家都有机会被用、被训练。

---

## 5) 为什么会输出 4 个 o1~o4？

因为你的 MoE 里不是一个 gate，而是 **4 个 gate1..gate4**，每个 gate 都会独立路由并产出一个输出：

在 UTANetMamba 里，这 4 路输出随后会被 `docker1..docker4` 映射成不同通道数，并 resize 成 4 个尺度（224/112/56/28）去喂给解码器各层（相当于给 U-Net 四个尺度的 skip/支路提供“更强的、多样化的特征”）。

---

## 6) 你问过的：四个专家怎么确定？参数怎么更新？

### 6.1 “四个专家怎么确定的？”

代码里就是 `num_experts=4`，初始化了 4 个 **结构完全一样、参数互不共享** 的 `MambaExpert`：
它们不是先验“人为定义用途”，而是训练中靠路由分配数据后逐渐分工。

### 6.2 专家参数根据什么更新？

反向传播时：

- 某个 expert 只有在本 batch 中 **被 selected_experts 选到** 才会参与 forward，从而在 loss 的梯度里出现并更新参数
    
- gate 矩阵（`gate1..4`）是可学习参数（`nn.Parameter`），会通过 `gate_probs → topk_probs → 加权融合 output` 这条路径拿到梯度（再加上 load-balance loss 的梯度）
    

---

## 7) “docker” 到底是什么？为什么需要它？

`docker` 在你代码里是一个很标准的 **1×1 Conv + BN + ReLU**：

它的作用就一句话：**把 MoE 输出的 64 通道，投影成解码器每一层需要的通道数**（64/64/128/256），同时做一点点非线性整形，方便后续 decoder 拼接/融合 。

## 6) Final Head：得到 logits（主输出）

- `logits = self.final(d1_att)`  
    `final` 是 `32→16→n_classes` 的 1×1 conv 组合：  
    输出尺寸：`(B, n_classes, 224, 224)`。
    

---

## 7) Deep Supervision：为什么 forward 返回一个 list？

当 `self.deep_supervision=True`：

- 用 `ds4/ds3/ds2/ds1` 把 `d4_att/d3_att/d2_att/d1_att` 各自映射到 `n_classes`，再 **统一上采样到 input size**。
    
- 返回值是：
    
    ```
    [ds4_out, ds3_out, ds2_out, ds1_out, logits]
    ```
    
    也就是：从最粗到最细的 4 个辅助输出 + 最终主输出。
    

---

## 8) 两个非常关键的“实现细节/坑”（理解 forward 时一定要注意）

1. **MoE 的 `loss` 在 UTANetMamba.forward 里算出来了，但没有返回，也没有被用到**：  
    `o1,o2,o3,o4, loss = self.moe(fused)` 之后就再也没用 `loss`。  
    如果你训练时希望 MoE 的负载均衡约束生效，需要你在外面把它加进总 loss（`modules_fast.py` 里其实提供了支持 `moe_loss` 的 `DeepSupervisionLoss` 写法）。
    
2. `UTANetMamba.py` import 了 `DeepSupervisionHead`，但 forward 实际没用它，而是直接用 `nn.Conv2d` + interpolate 做深度监督。
    

---

下面是 **按默认参数**（`img_size=224, topk=2, num_experts=4, pretrained=True, deep_supervision=True, cat_channels=32, n_classes=1`）把 `forward()` **逐行 trace** 成一张“形状流水表”。

> 记号：`B`=batch size；张量形状用 `(B, C, H, W)`（序列展开会写成 `(B, L, C)`）。  
> forward 主干（Encoder/TA-MoSC/Decoder/DeepSup）见 `UTANetMamba.forward`  
> 默认参数与 MoE 设置（`topk=2, num_experts=4, img_size=224, cat_channels=32`）见 `__init__`

---

### 逐行 Trace 表（默认 forward 路径：TA-MoSC + MoE + Deep Supervision）

|   # | 操作（对应 forward 语句/语义）                      | 张量名                     | Shape                                     | 含义 & 为什么这么做                                                                         |
| --: | ----------------------------------------- | ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
|   0 | 输入图像                                      | `x`                     | **(B,3,224,224)**                         | 原始 RGB 图像张量，后续要编码成多尺度语义特征。                                                          |
|   1 | `e1 = conv1(x)`                           | `e1`                    | (B,64,224,224)                            | 初级卷积块：把 3 通道映射到 64 通道，提取边缘/纹理等浅层特征。                                                 |
|   2 | `e1_maxp = maxpool(e1)`                   | `e1_maxp`               | (B,64,112,112)                            | 下采样一半：扩大感受野、降低计算量，为 ResNet 主干进入更深层做准备。                                              |
|   3 | `e2 = conv2(e1_maxp)` (ResNet layer1)     | `e2`                    | (B,64,112,112)                            | ResNet 第1阶段：保留较高分辨率的结构信息（适合定位/边界）。                                                  |
|   4 | `e3 = conv3(e2)` (ResNet layer2)          | `e3`                    | (B,128,56,56)                             | 更深层：分辨率减半、通道加倍，语义更强但细节更少。                                                           |
|   5 | `e4 = conv4(e3)` (ResNet layer3)          | `e4`                    | (B,256,28,28)                             | 深层语义特征：适合表达“是什么”，用于解码器高语义分支。                                                        |
|   6 | `e5 = conv5(e4)` (ResNet layer4)          | `e5`                    | (B,512,14,14)                             | 最深层语义：最强语义、最小分辨率，用于指导粗尺度解码。                                                         |
|   7 | `e1_resized = interp(e1,×0.5)`            | `e1_resized`            | (B,64,112,112)                            | 把浅层高分辨率特征对齐到 112：为了能和 `e2/e3/e4` 在同一空间尺度融合。                                         |
|   8 | `e3_resized = interp(e3,×2)`              | `e3_resized`            | (B,128,112,112)                           | 把 56×56 上采样到 112×112：统一尺度融合，避免跨尺度直接 concat 的错位。                                     |
|   9 | `e4_resized = interp(e4,×4)`              | `e4_resized`            | (B,256,112,112)                           | 把 28×28 上采样到 112×112：把深层语义搬到中等分辨率，利于 MoE 全局建模。                                      |
|  10 | `fused = cat([e1r,e2,e3r,e4r],dim=1)`     | `fused_cat`             | (B,512,112,112)                           | 通道拼接聚合多尺度信息：浅层细节 + 中层结构 + 深层语义一起提供给后续 MoE。                                          |
|  11 | `fused = self.fuse(fused)` (1×1:512→64)   | `fused`                 | (B,64,112,112)                            | 1×1 “压通道”：减少 MoE 输入维度，显著省算力/显存，同时做一次线性重混合。                                          |
|  12 | 调用 `o1,o2,o3,o4, loss = moe(fused)`       | —                       | —                                         | 进入 **稀疏 Mamba MoE**：用门控选择少量 expert 执行，获得全局依赖建模能力且更高效。MoE 配置 `num_experts=4, top=2`。 |
|  13 | MoE(单 gate)：`x_gap = GAP(x)`              | `x_gap`                 | (B,64)                                    | 用全局平均池化把空间信息压成全局描述向量：门控要基于“整图/整特征”的语义做 expert 选择。                                   |
|  14 | MoE：`gate_logits = x_gap @ gateW`         | `gate_logits`           | (B,4)                                     | 线性打分每个 expert：得到对 4 个 expert 的偏好分数。                                                 |
|  15 | MoE：`gate_probs = softmax(logits)`        | `gate_probs`            | (B,4)                                     | 概率化：把偏好变成可解释的分配概率（后续用于 top-k 与加权融合）。                                                |
|  16 | MoE：`topk(..., k=2)`                      | `topk_probs/topk_idx`   | (B,2)/(B,2)                               | **稀疏关键点**：每个样本只选 2 个 expert，计算量≈2/4；也是“路由”的核心。                                      |
|  17 | MoE：`selected_experts = unique(topk_idx)` | `selected_experts`      | list（≤4）                                  | 跨 batch 合并需要计算的 expert：避免对未被任何样本选中的 expert 做无用计算。                                   |
|  18 | MoE：只跑被选中的 experts                        | `expert_outputs[e]`     | 各为 (B,64,112,112)                         | 真正“稀疏执行”：只 forward 选中的 expert（实现上是遍历 `selected_experts`）。                           |
|  19 | MoE：按 topk 权重融合 expert 输出                 | `out_gate`              | (B,64,112,112)                            | 对每个样本，把它选到的 2 个 expert 输出按权重加权求和 → 得到该 gate 的输出特征。                                  |
|  20 | MoE：负载均衡 loss                             | `loss_gate`             | 标量                                        | 防止所有样本都挤到同一个 expert（塌缩），鼓励 expert 使用更均匀。                                            |
|  21 | MoE.forward：4 个 gate 各跑一遍 `_process_gate` | `o1,o2,o3,o4, moe_loss` | `o*`均 (B,64,112,112)，`moe_loss` 标量        | 4 个 gate 对应“4 个尺度/分支”的路由输出（实现上是 gate1~gate4 各跑一次）。                                  |
|  22 | MambaExpert：2D→序列 `(B,C,H,W)->(B,H*W,C)`  | `x_flat`                | (B,12544,64)                              | Mamba 以序列方式建模长程依赖：把每个像素位置当 token，序列长度 L=112×112。                                    |
|  23 | MambaExpert：Mamba+投影，再 reshape 回 2D       | `out`                   | (B,64,112,112)                            | 做全局建模后回到卷积特征图形态，便于后续 CNN/decoder 处理。                                                |
|  24 | `o1 = docker1(o1)` (64→64)                | `o1`                    | (B,64,112,112)                            | “docker”是 1×1+BN+ReLU：把 MoE 输出映射到对应分支需要的通道数/分布。                                     |
|  25 | `o2 = docker2(o2)` (64→64)                | `o2`                    | (B,64,112,112)                            | 同上：保持 64 通道，作为 112×112 的中尺度特征。                                                      |
|  26 | `o3 = docker3(o3)` (64→128)               | `o3`                    | (B,128,112,112)                           | 通道抬升到 128：匹配后续 56×56 分支（更深、更语义）的表达容量。                                               |
|  27 | `o4 = docker4(o4)` (64→256)               | `o4`                    | (B,256,112,112)                           | 通道抬升到 256：匹配 28×28 的深层分支容量。                                                         |
|  28 | `o1 = interp(o1,×2)`                      | `o1`                    | (B,64,224,224)                            | 人为“拉回高分辨率”：让 `o1` 对齐到解码器最细尺度（224）。                                                  |
|  29 | `o2` 保持不变                                 | `o2`                    | (B,64,112,112)                            | 112×112 作为中间桥梁尺度，连接高分辨率细节与低分辨率语义。                                                   |
|  30 | `o3 = interp(o3,×0.5)`                    | `o3`                    | (B,128,56,56)                             | 下采样到 56：匹配 decoder3 的目标尺度，形成“语义更强”的中低分辨率特征。                                         |
|  31 | `o4 = interp(o4,×0.25)`                   | `o4`                    | (B,256,28,28)                             | 下采样到 28：匹配 decoder4 的目标尺度（最粗层解码）。                                                   |
|  32 | Decoder4 输入列表                             | `[o4,e5,o3]`            | 256@28 + 512@14 + 128@56                  | **解码从粗到细**：以 `o4(28)`为主尺度，融合更深 `e5(14)` 和更细 `o3(56)` 的信息。                           |
|  33 | Decoder4：目标尺寸取 `features[0]`              | `target=(28,28)`        | —                                         | FastFullScaleDecoder 规定第 1 个特征为“对齐目标”，简化多尺度融合逻辑。                                    |
|  34 | Decoder4：每路 `Conv→cat_channels(32)`       | `x0,x1,x2`              | (B,32,28/14/56,28/14/56)                  | 统一通道到 32：减少拼接后的宽度，显存更省（“Fast”设计）。                                                   |
|  35 | Decoder4：大图 pool，小图 upsample 到 28×28      | `x0,x1,x2`              | (B,32,28,28)×3                            | 动态对齐：比目标大用 MaxPool；比目标小用双线性插值，保证空间对齐后可 concat。                                      |
|  36 | Decoder4：concat+fusion 输出                 | `d4`                    | concat:(B,96,28,28)→out:(B,256,28,28)     | concat 汇聚多尺度，再用 3×3 conv 融合成指定 `out_channels`（这里是 256）。                             |
|  37 | `d4_att = att4(d4,d4)`                    | `d4_att`                | (B,256,28,28)                             | 门控注意力：生成空间注意力(1,H,W)+通道注意力(C,1,1)去重标定特征，突出关键区域/通道。                                  |
|  38 | Decoder3 输入列表                             | `[o3,d4_att,e5,o2]`     | 128@56 + 256@28 + 512@14 + 64@112         | 在 56 尺度上融合：把粗层结果 `d4_att` 和深层 `e5` 注入，同时引入 `o2` 的更细信息。                              |
|  39 | Decoder3：目标=56，对齐+concat+fusion           | `d3`                    | concat:(B,128,56,56)→out:(B,128,56,56)    | 4 路输入→各压到 32 通道→concat 得到 128 通道→fusion 输出 128；在该尺度完成强语义融合。                         |
|  40 | `d3_att = att3(d3,d3)`                    | `d3_att`                | (B,128,56,56)                             | 同上：对 56×56 特征进行空间+通道重标定，提升中尺度分割/定位能力。                                               |
|  41 | Decoder2 输入列表                             | `[o2,d3_att,d4_att,o1]` | 64@112 + 128@56 + 256@28 + 64@224         | 在 112 尺度融合：引入更细的 `o1(224)` 与更粗的 `d4_att(28)`，实现全尺度聚合。                               |
|  42 | Decoder2：目标=112，对齐+concat+fusion          | `d2`                    | concat:(B,128,112,112)→out:(B,64,112,112) | 4 路→各压到 32→concat 128→fusion 输出 64：在更细尺度恢复结构与边界信息。                                  |
|  43 | `d2_att = att2(d2,d2)`                    | `d2_att`                | (B,64,112,112)                            | 对接近输入尺度的特征再过滤一次噪声，提升细节一致性与稳定性。                                                      |
|  44 | Decoder1 输入列表                             | `[o1,d2_att,d3_att]`    | 64@224 + 64@112 + 128@56                  | 最终在 224 尺度融合：以 `o1` 为主，叠加来自 d2/d3 的多尺度上下文。                                          |
|  45 | Decoder1：目标=224，对齐+concat+fusion          | `d1`                    | concat:(B,96,224,224)→out:(B,32,224,224)  | 3 路→各压到 32→concat 96→fusion 输出 32：在最高分辨率生成用于最终预测的融合特征。                              |
|  46 | `d1_att = att1(d1,d1)`                    | `d1_att`                | (B,32,224,224)                            | 最后一层注意力：更偏向“边界/小目标/细纹理”的精修，提高最终 mask 质量。                                            |
|  47 | `logits = final(d1_att)`（32→16→1）         | `logits`                | **(B,1,224,224)**                         | 1×1 conv 头：把特征映射到类别 logits（未 sigmoid），供 BCEWithLogits 等损失使用。                        |
|  48 | DeepSup：`ds4(d4_att)` 并上采样到输入             | `ds4_out`               | (B,1,28,28)→(B,1,224,224)                 | 深度监督：给粗层也加预测头/梯度，帮助深层语义学习更稳定、收敛更快。                                                  |
|  49 | DeepSup：`ds3(d3_att)` 上采样                 | `ds3_out`               | (B,1,56,56)→(B,1,224,224)                 | 同理：中粗层辅助输出，强化多尺度一致性。                                                                |
|  50 | DeepSup：`ds2(d2_att)` 上采样                 | `ds2_out`               | (B,1,112,112)→(B,1,224,224)               | 同理：中层辅助输出，尤其帮助边界/结构学习。                                                              |
|  51 | DeepSup：`ds1(d1_att)`（本来就是 224）           | `ds1_out`               | (B,1,224,224)                             | 最细层辅助输出，通常权重较小，但能稳定高分辨率分支。                                                          |
|  52 | 返回 list（默认 deep_supervision=True）         | `return`                | `[ds4,ds3,ds2,ds1,logits]`                | 训练时可对多输出加权求 loss；推理时通常用最后一个 `logits`。                                               |

---

#### 你如果想要“真正逐行到 MoE 四个 gate 各自的 o1~o4”

上表里 MoE 部分已经按 **单个 gate** 展示了一遍（#13~#20），实际 forward 会对 gate1~gate4 走四次同样流程并返回 `(o1,o2,o3,o4, loss_sum)`，这一点在 `MoE.forward()` 明确写了。

---

如果你希望我把 **Decoder4/3/2/1 内部每一路特征是“pool 还是 upsample”，以及 pool 的 kernel/stride（比如 224→112 用 (2,2)）** 也列成更细的 trace（会更长但更“逐条可复现”），我也可以继续把表格扩展到那个粒度。
# 解码器部分
