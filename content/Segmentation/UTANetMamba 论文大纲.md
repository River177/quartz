

## 1. 标题 (Title)

**建议标题**: UTANetMamba: 基于稀疏Mamba混合专家模型与多尺度全连接解码器的医学图像分割网络 (UTANetMamba: Medical Image Segmentation with Sparse Mamba Mixture of Experts and Fast Full-Scale Decoder)

## 2. 摘要 (Abstract)

- **背景**: CNN在长距离依赖建模上的局限性，以及Transformer的高计算复杂度。
    
- **引入Mamba**: 引入状态空间模型（SSM/Mamba）以实现线性复杂度的全局上下文建模。
    
- **创新点**:
    
    1. **Multi-Gate Mamba MoE (多门控Mamba混合专家)**: 在瓶颈层引入Mamba作为专家模型，通过4个独立的门控网络生成多路差异化特征，捕捉不同的语义上下文。
        
    2. **Sparse Top-K Gating**: 采用稀疏Top-K机制，提高推理效率并保持模型容量。
        
    3. **Fast Full-Scale Decoder (快速全尺度解码器)**: 改进的全尺度跳跃连接，高效融合来自编码器、MoE输出及上一级解码器的多尺度特征。
        
- **结果**: 在[目标数据集]上取得了SOTA性能，且参数量和计算量可控。
    

## 3. 引言 (Introduction)

- **医学图像分割的重要性与挑战**: 精确分割对临床诊断的意义；器官/病灶尺度变化大、边界模糊等难点。
    
- **现有方法的局限**:
    
    - U-Net及其变体（基于CNN）：感受野受限。
        
    - Transformer-based方法：计算开销大，难以处理高分辨率特征。
        
- **Mamba/SSM的崛起**: 兼具RNN的推理效率和Transformer的建模能力。
    
- **本文动机**: 结合ResNet的特征提取能力与Mamba的全局建模能力，并利用MoE结构进一步增强特征表示的多样性。
    

## 4. 相关工作 (Related Work)

- **CNN-based Segmentation**: U-Net, Res-UNet, Dense-UNet等。
    
- **Vision Transformers & SSMs**: ViT, Swin Transformer, Vision Mamba, VM-UNet等。
    
- **Mixture of Experts (MoE)**: 动态路由机制，稀疏激活，在CV中的应用。
    
- **Feature Aggregation/Skip Connections**: UNet++, UNet 3+, Full-Scale Skip Connections.
    

## 5. 方法 (Methodology)

### 5.1 整体架构 (Overall Architecture)

- **Encoder-Decoder结构**: 采用ResNet34作为骨干网络提取多层级特征。
    
- **核心组件**: Multi-Gate Mamba MoE 瓶颈层，以及带有门控注意力机制的Fast Full-Scale Decoder。
    

### 5.2 编码器与特征融合 (Encoder & Multi-scale Fusion)

- **ResNet34 Backbone**: 提取5个层级的特征 (e_1 to e_5)。
    
- **Multi-scale Fusion**: 将e_1, e_2, e_3, e_4进行重采样和拼接，通过卷积融合为统一的特征表示，作为MoE的输入。这一步旨在为MoE提供包含丰富多尺度信息的上下文。
    

### 5.3 Multi-Gate Mamba MoE (多门控Mamba混合专家)

本模型在瓶颈层设计了一个多门控混合专家模块（Multi-Gate Mixture of Experts），旨在通过共享的Mamba专家池和差异化的门控策略，高效地捕捉全局长距离依赖并生成多路互补特征。

#### 5.3.1 Mamba专家单元 (Mamba Expert)

每个专家是一个基于状态空间模型（SSM）的 `MambaExpert` 模块，相比于传统的CNN专家，具有线性复杂度的全局感受野。

- **输入变换**: 输入特征 X \in \mathbb{R}^{B \times C \times H \times W} 被展平并转置为序列形式 X_{seq} \in \mathbb{R}^{B \times L \times C}，其中 L=H \times W。
    
- **结构**: 包含层归一化（LayerNorm）、Mamba核心块（包含SSM路径和卷积路径）、以及线性投影层。
    
- **公式**: \hat{X} = \text{LayerNorm}(X_{seq}) X_{mamba} = \text{MambaBlock}(\hat{X}) Y = \text{Linear}(X_{mamba})
    
- **输出**: 序列 Y 被重塑回图像空间特征。
    

#### 5.3.2 多门控路由机制 (Multi-Gate Routing Mechanism)

为了对接后续的多尺度解码器，我们设计了4个独立的门控网络 (`gate1` - `gate4`)。这些门控网络共享同一个专家池（N=4个Mamba专家），但学习不同的路由权重，从而产生4组差异化的输出特征 (O_1, O_2, O_3, O_4)。

- **门控计算**: 对于第 m 个门控网络 (m \in \{1,2,3,4\})：
    
    1. **全局信息聚合**: 对输入特征 X 进行全局平均池化 (GAP)，得到上下文向量 z \in \mathbb{R}^{B \times C}。
        
    2. **路由分数生成**: 通过可学习的参数矩阵 W_g^{(m)} 映射得到专家分数，并使用Softmax归一化： G^{(m)} = \text{Softmax}(z \cdot W_g^{(m)}) \in \mathbb{R}^{B \times N}
        
    3. **稀疏Top-K选择**: 为减少计算量，对每个样本仅选择分数最高的 K 个专家（本文 K=2）。 \text{Indices} = \text{TopK}(G^{(m)}, K)
        
    4. **权重重归一化**: 对选定专家的概率进行重新归一化，使其和为1。
        

#### 5.3.3 专家聚合与输出 (Expert Aggregation)

- 对于每个样本，根据Top-K索引激活对应的共享Mamba专家。
    
- **加权求和**: 将激活专家的输出按照重归一化后的门控权重进行线性组合，得到该路径的最终输出： O^{(m)}_i = \sum_{j=1}^{K} w_{i,j}^{(m)} \cdot E_{\text{Indices}_{i,j}}(X_i) 其中 E 表示共享专家池。
    
- 通过这种方式，同一个输入特征被“翻译”成了4种不同的特征表示，分别用于指导解码器的不同层级。
    

#### 5.3.4 负载均衡损失 (Load Balancing Loss)

为了防止“专家坍塌”现象（即少数专家处理绝大多数样本），引入了基于变异系数（Coefficient of Variation, CV）的负载均衡损失：

- 计算每个专家在当前Batch内的平均使用率 \bar{u}。
    
- 计算使用率的变异系数平方： L_{load} = \frac{\text{Var}(\bar{u})}{\text{Mean}(\bar{u})^2 + \epsilon}
    
- 总损失包含4个门控网络的负载均衡损失之和。这迫使系统在训练过程中均衡地利用所有Mamba专家。
    

### 5.4 Fast Full-Scale Decoder (快速全尺度解码器)

为了高效地恢复空间分辨率并融合语义信息，我们设计了快速全尺度解码器（Fast Full-Scale Decoder）。与传统的U-Net逐级解码不同，该模块能够同时聚合来自编码器、MoE瓶颈层以及深层解码器的多尺度特征。

#### 5.4.1 全尺度特征聚合 (Full-Scale Feature Aggregation)

每个解码器阶段 D_i (其中 i \in \{1, 2, 3, 4\}) 不仅接收上一级的解码特征，还接收来自不同层级的特征输入。输入列表 \mathcal{F}_i 通常包含：

1. **同层级MoE特征** O_i：提供经过长距离依赖建模的上下文信息。
    
2. **跨层级编码特征** E_k：提供原始的细节或语义信息。
    
3. **深层解码特征** D_{j} (j > i)：提供高级语义指导。
    

例如，Decoder 3 的输入包括 [O_3, D_4, E_5, O_2]，涵盖了从深层到浅层的多尺度信息。

#### 5.4.2 统一分辨率处理 (Unified Resolution Processing)

为了融合这些分辨率各异的特征，我们采用以当前层级目标分辨率为基准的统一处理策略：

- **特征投影**: 首先通过 `Conv-BN-ReLU` 模块将所有输入特征投影到统一的通道数 C_{cat}（本文设置为32）。
    
- **自适应重采样**:
    
    - 对于分辨率小于目标的特征（如深层特征），采用双线性插值（Bilinear Interpolation）进行上采样。
        
    - 对于分辨率大于目标的特征（如浅层特征），采用最大池化（Max Pooling）进行下采样。
        
- **融合**: 将所有对齐后的特征在通道维度拼接，并通过一个 3\times3 卷积层融合为输出特征 D_i。
    

#### 5.4.3 门控注意力机制 (Gated Attention)

在每个解码器输出之后，我们引入了门控注意力模块（Gated Attention）来进一步提炼特征。

- **原理**: 利用特征自身作为门控信号（Gating Signal），通过空间注意力（Spatial Attention）和通道注意力（Channel Attention）双重机制来抑制背景噪声，增强目标区域的响应。
    
- **计算过程**: \text{Att}_{spatial} = \sigma(\Psi(W_g(D_i) + W_x(D_i))) \text{Att}_{channel} = \text{SEBlock}(D_i) D_i^{refined} = D_i \cdot \text{Att}_{spatial} \cdot \text{Att}_{channel}
    
- 这种机制使得网络能够自适应地聚焦于分割目标的边界和关键区域。
    

### 5.5 损失函数 (Loss Function)

- **Deep Supervision**: 在4个解码层级均输出预测图。
    
- **混合损失**: L_{total} = L_{main} + \sum \lambda_i L_{aux_i} + \beta L_{MoE} 其中 L_{MoE} 为负载均衡损失。
    

## 6. 实验 (Experiments) (待补充)

- **数据集**: (例如 Synapse, ACDC, ISIC等)
    
- **实现细节**: 学习率、优化器、Epochs、硬件环境。
    
- **对比实验**: 与U-Net, Swin-Unet, VM-UNet等对比。
    
- **消融实验**:
    
    - 验证Mamba Experts的有效性（vs CNN Experts）。
        
    - 验证Multi-Gate机制的有效性。
        
    - 验证Fast Full-Scale Decoder的有效性。
        
    - Top-K取值的影响。
        
- **可视化**: 分割结果可视化，Attention Map可视化。
    

## 7. 结论 (Conclusion)

- 总结方法的优势：结合了Mamba的长距离建模能力和MoE的多样化特征表示，通过全尺度解码器实现了高效的特征恢复。