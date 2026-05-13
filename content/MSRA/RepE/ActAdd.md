这篇论文的核心方法叫 **Activation Addition，简称 ActAdd**。它的目标是：**不微调模型、不改模型权重，只在推理时修改中间层激活，从而控制模型输出方向**。论文把这类方法称为 **activation engineering，激活工程**。

可以把它理解成一句话：

找到模型内部表示某种语义属性的“方向向量”，然后在生成时把模型的中间激活往这个方向推一下。

---

## **1. 方法的基本直觉**

假设我们想让模型输出更积极、更友善的内容。

传统方法可能是：

“请用积极的语气回答。”

这属于 prompt engineering。

ActAdd 的做法不是改 prompt，而是构造一个内部向量：
$$v = h(\text{Love}) - h(\text{Hate})$$

其中：

- `Love` 是正向提示词；
- `Hate` 是负向提示词；
- h(\cdot) 是模型在某一层的中间激活；
- 二者相减得到一个方向向量。

作者认为，这个向量大致表示模型内部的 **“从 Hate 到 Love 的语义方向”**。之后，当用户输入任何 prompt 时，在模型生成过程中，把这个向量加到某一层的 residual stream 上，就可以把模型输出往 “Love / positive / less toxic” 的方向推。论文中明确说明，ActAdd 通过一对自然语言 prompt (p^+, p^-) 构造 steering vector，其中 p^+ 表示想强调的属性，p^- 表示相反或缺失的属性，两者在某层的激活差值就是 steering vector。 

---

## **2. ActAdd 操作的是 Transformer 的哪里？**

论文主要针对 **decoder-only Transformer**，比如 GPT、OPT、LLaMA 这类模型。

Transformer 每一层都有一个 **residual stream**，可以粗略理解为：模型在每一层传递和更新的“隐藏状态主干”。

ActAdd 干预的位置是：

h^l

也就是第 l 层输入处的 residual stream。论文说明，ActAdd 操纵的是输入到某一层 l 的 residual stream activation，而不是模型权重、token embedding 或最终 logits。 

这点很重要，因为它说明 ActAdd 不是：

- 不是 fine-tuning；
- 不是 prompt tuning；
- 不是 soft prompt；
- 不是 decoding-time reranking；
- 而是 **inference-time activation intervention**。

---

## **3. 方法流程**

ActAdd 的完整流程可以拆成四步。

### **第一步：选一对对比 prompt**

选择两个短文本：

p^+, p^-

其中：

- p^+：代表你想增强的属性；
- p^-：代表相反属性或中性属性。

例如：

|**目标**|p^+|p^-|
|---|---|---|
|更积极|Love|Hate|
|更喜欢婚礼话题|I talk about weddings constantly|I do not talk about weddings constantly|
|降低毒性|Love|Hate|
|增强某话题|weddings|空白 token|

这一步的关键是：**两个 prompt 最好只在目标属性上有明显差异**。这样二者激活差值更可能对应目标语义，而不是其他无关因素。

---

### **第二步：分别前向传播，记录中间激活**

把两个 prompt 分别送入模型，记录第 l 层的激活：

h^l_+ = M(p^+)_l

h^l_- = M(p^-)_l

其中 M 是冻结的预训练语言模型。

论文中特别强调，这个过程只需要 forward pass，不需要 backward pass，也不需要梯度下降。 

---

### **第三步：相减得到 steering vector**

构造激活方向：

h^l_A = h^l_+ - h^l_-

这就是所谓的 **activation addition vector / steering vector**。

直觉上：

h^l_+ - h^l_-

保留了两个 prompt 在第 l 层表示中的差异。若 p^+=\text{Love}，p^-=\text{Hate}，那么这个差异就可能近似表示 “更 Love、更正向、更少 Hate” 的内部方向。

论文的核心假设是：大模型的激活空间中存在一些较线性的高层语义方向，比如 sentiment、topic、toxicity、truthfulness 等；沿着这些方向移动激活，会因果性地影响后续生成。作者认为，ActAdd 的成功为“特征在激活空间中近似线性表示”提供了实验性证据。 

---

### **第四步：推理时把向量加到用户 prompt 的激活上**

对于用户输入：

p^*

模型正常前向传播到第 l 层时，会得到用户 prompt 的激活：

h^l(p^*)

ActAdd 做的是：

\tilde{h}^l(p^*) = h^l(p^*) + c \cdot h^l_A

其中：

- h^l_A：前面构造出的 steering vector；
- c：injection coefficient，也就是注入强度；
- l：注入层；
- a：sequence alignment，即把向量加到哪个 token 位置附近。

然后模型从修改后的激活继续向后传播，生成输出。论文的 Algorithm 1 正是这个流程：先对 (p^+, p^-) 做 forward，取第 l 层激活差值，再把 c h^l_A 加到用户 prompt 的第 l 层激活上继续生成。 

---

## **4. 三个关键超参数**

ActAdd 方法虽然简单，但效果高度依赖三个超参数。

### **1）注入层** l

也就是在哪一层加 steering vector。

论文发现，一般 **中间层效果最好**。太浅的层还偏 token/词形信息，太深的层可能已经接近输出分布，干预空间较小。作者也提到他们会通过简单 grid search 选择 l，通常中间层更有效。 

例如在 wedding topic steering 实验中，作者发现某些较早到中间的层能显著提高模型生成婚礼相关内容的概率，而较后层效果下降。

---

### **2）注入强度** c

也就是：

h^l + c \cdot h^l_A

中的 c。

如果 c 太小，steering 效果不明显；如果太大，模型可能变得不自然、重复、跑题，甚至破坏流畅性。

可以把它理解为控制旋钮：

- c=0：不干预；
- c>0：往 p^+ 方向推；
- c<0：反方向推，也就是往 p^- 方向推；
- |c| 越大，干预越强。

论文把 c 称为 intervention strength，因为它会乘到 steering vector 上，控制该向量对 residual stream 的贡献。 

---

### **3）序列对齐位置** a

因为 prompt 通常是多个 token，steering vector 也是按 token 位置得到的。那要把它加到用户输入的哪个 token 位置上？

论文中用 a 表示 sequence alignment，即把 h_A 和用户 prompt 激活 h_{p^*} 对齐的位置。 

通俗说，就是：

这个 steering vector 加到输入序列的哪个位置？

不同实现中可以选择：

- 只加到第一个 token；
- 加到最后一个 token；
- 加到所有 token；
- 加到某个固定位置；
- 或在生成每个新 token 时重复加入。

论文中提到，他们实践中常固定使用某种简单对齐方式，但这个参数仍然是 ActAdd 的可调部分。

---

## **5. 一个具体例子**

假设我们要让模型生成更积极的内容。

选择：

p^+ = \text{"Love"}

p^- = \text{"Hate"}

在第 l 层得到：

v_{\text{love}} = h^l(\text{"Love"}) - h^l(\text{"Hate"})

用户输入：

I hate you because…

原模型可能续写出非常负面的内容。

加入 ActAdd 后：

h^l_{\text{user}} \leftarrow h^l_{\text{user}} + c \cdot v_{\text{love}}

模型的后续生成就会更倾向于积极、温和、亲近的表达。论文表 1 中展示了类似例子：未干预时模型生成明显负面内容，加入 “Love - Hate” 向量后，输出会转向更正向的表达。 

---

## **6. 为什么这种方法可能有效？**

ActAdd 背后的核心理论假设是：

大语言模型的 residual stream 中，某些高层语义属性可以近似表示为线性方向。

比如：

- love vs hate；
- truthful vs false；
- toxic vs non-toxic；
- wedding topic vs non-wedding topic；
- refusal vs compliance。

如果这个假设成立，那么在激活空间中做向量加减，就类似于在语义空间中移动模型当前状态。

这和 Word2Vec 里的经典类比有点像：

\text{king} - \text{man} + \text{woman} \approx \text{queen}

ActAdd 做的是更高维、更深层的版本：

\text{activation(Love)} - \text{activation(Hate)}

然后把这个方向直接加到模型内部计算过程中。

论文也强调，这不是简单的“把某个词塞进 prompt”。因为 ActAdd 可以连续调节强度 c，而 token 是离散的；而且它干预的是中间层激活，不占用上下文窗口。 

---

## **7. 和 prompt engineering 的区别**

ActAdd 和 prompt engineering 都能控制输出，但机制不同：

|**方法**|**控制位置**|**是否改权重**|**是否需要训练**|**是否需要模型内部激活**|
|---|---|---|---|---|
|Prompt engineering|输入文本|否|否|否|
|Fine-tuning|模型权重|是|是|否|
|Soft prompt|embedding / prefix|部分参数|是|通常需要|
|ActAdd|中间层 residual stream|否|否|是|

ActAdd 的优势是：

- 不需要训练；
- 不需要大量数据；
- 甚至一对 prompt 就能构造向量；
- 推理时即可控制模型；
- 可以连续调节强度；
- 不占上下文窗口。

缺点是：

- 必须能访问模型内部激活；
- API 黑盒模型一般不能用；
- 需要调 l、c、a；
- 干预过强可能影响流畅性和相关性；
- 目前更多适合控制风格、情绪、主题、安全倾向，不太适合“教会模型新知识”。

---

## **8. 论文中的实验设计**

作者主要验证两个问题：

1. steering vector 是否真的能改变模型行为；
2. 改变目标行为时，是否尽量不破坏模型通用能力。

他们做了几类实验。

### **主题控制**

用如 “weddings” 之类的向量让模型更频繁讨论某个主题。作者发现，注入 wedding vector 后，模型对婚礼相关文本的 perplexity 降低，说明模型更倾向于预测婚礼相关内容。 

### **毒性降低**

在 RealToxicityPrompts 上测试，使用 Love-Hate 类向量降低 toxic continuation。论文报告 ActAdd 在 OPT 和 LLaMA-3 上都能降低毒性。

### **情感迁移**

在 IMDb 情感数据集上测试，让模型把负面评论续写成正面，或把正面评论续写成负面。ActAdd 在 negative-to-positive 方向上表现尤其强。

### **通用能力保持**

作者还用 ConceptNet / LAMA 风格任务测试 off-target performance，发现 wedding steering 对无关事实预测影响很小。论文据此认为 ActAdd 可以在一定程度上控制目标属性，同时保持模型一般能力。 

---

## **9. 方法本质总结**

ActAdd 的方法本质可以总结为：

\text{目标行为控制} = \text{用户原始激活} + \text{语义方向向量}

其中：

\text{语义方向向量} = \text{正向 prompt 激活} - \text{负向 prompt 激活}

它不是在语言层面告诉模型“你要怎样回答”，而是在模型内部计算过程中直接调整其状态。

所以 ActAdd 的创新点不在于复杂训练，而在于证明了一个简单但强的想法：

LLM 内部激活空间中存在可操作的语义方向；只要找到这些方向，就可以在推理时直接控制模型行为。

---

## **10. 和你做 safety / refusal vector 的关系**

这篇论文和你现在关注的 **安全残差空间、refusal vector、safety transfer** 很相关。

你的方向可以类比为：

v_{\text{safety}} = h(\text{safe/refusal examples}) - h(\text{unsafe/compliance examples})

然后在小模型或学生模型中，希望让模型激活往安全方向靠近。

ActAdd 更偏推理时干预：

h \leftarrow h + c v_{\text{safety}}

而你做 safety transfer 时可能更偏训练时对齐：

\mathcal{L}_{align} = 1 - \cos(h_{\text{student}}, P h_{\text{teacher}})

也就是说：

- ActAdd 是 **inference-time steering**；
- 你的 safety residual transfer 更像 **training-time representation alignment**；
- 但二者都建立在同一个前提上：**安全、拒答、情感、主题等高层行为在激活空间中存在可提取、可迁移、可操控的方向结构**。