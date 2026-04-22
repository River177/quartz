
## 结论先行

如果目标是避免遗漏重要方法，目前真正需要补看的主要有两类：

- 一类是 **已经正式发表、但当前第五章和主表还没有覆盖到的主线 graph prompt 方法**；
    
- 另一类是 **2025-2026 才出现、值得在 discussion 中点出的新方向**。
    

前一类里，最值得优先补看的其实是：

- **HGPROMPT（AAAI 2024）**
    
- **Self-Pro（ECML PKDD 2024）**
    
- **PSP（ECML PKDD 2024）**
    
- **EdgePrompt（ICLR 2025）**
    
- **ProNoG（KDD 2025）**
    

### 高优先级漏项

1. **HGPROMPT: Bridging Homogeneous and Heterogeneous Graphs for Few-Shot Prompt Learning**
    
    - 发表情况：AAAI 2024
        
    - 状态：正式会议论文
        
    - 重要性：高
        
    - 推荐动作：应补入正文；如果主表还想增强 heterogeneous / few-shot 代表性，也值得考虑加入
        
    - 原因：这篇工作已经是正式发表版本，而且它直接把 homogeneous 与 heterogeneous graph prompting 联到一起。当前第五章如果只写 HetGPT，而不提 HGPROMPT，会显得异构图 prompting 线索不完整。
        
    - 链接：
        
        - arXiv: [https://arxiv.org/abs/2312.01878](https://arxiv.org/abs/2312.01878)
            
        - AAAI 2024 / DOI: [https://doi.org/10.1609/aaai.v38i15.29596](https://doi.org/10.1609/aaai.v38i15.29596)
            
2. **Self-Pro: A Self-Prompt and Tuning Framework for Graph Neural Networks**
    
    - 发表情况：ECML PKDD 2024
        
    - 状态：正式会议论文
        
    - 重要性：高
        
    - 推荐动作：建议补入正文；主表也值得认真考虑
        
    - 原因：它不是应用型扩展，而是一篇比较标准的 graph prompt 方法论文，强调 self-prompt、self-adapter 和 heterophily-aware pretext。你当前主表如果只从 GPF / All in One / GraphPrompt 直接跳到 2025 方法，会漏掉这一篇 2024 的正式代表作。
        
    - 链接：
        
        - arXiv: [https://arxiv.org/abs/2310.10362](https://arxiv.org/abs/2310.10362)
            
        - ECML PKDD 2024 研究轨接受列表: [https://ecmlpkdd.org/2024/program-accepted-papers-research-track/](https://ecmlpkdd.org/2024/program-accepted-papers-research-track/)
            
3. **PSP: Pre-Training and Structure Prompt Tuning for Graph Neural Networks**
    
    - 发表情况：ECML PKDD 2024
        
    - 状态：正式会议论文
        
    - 重要性：高
        
    - 推荐动作：建议补入正文；主表也值得考虑
        
    - 原因：它的特色是结构 prompt tuning，不只是 feature-level prompt。尤其如果你想说明 graph prompt 不是只有 token/feature prompt，而是还可以通过结构化 prototype / adjacency 方式实现，PSP 很适合补进来。
        
    - 链接：
        
        - arXiv: [https://arxiv.org/abs/2310.17394](https://arxiv.org/abs/2310.17394)
            
        - DBLP: [https://dblp.org/rec/conf/pkdd/GeZLCLWY24](https://dblp.org/rec/conf/pkdd/GeZLCLWY24)
            
4. **EdgePrompt: Edge Prompt Tuning for Graph Neural Networks**
    
    - 发表情况：ICLR 2025
        
    - 状态：正式会议论文
        
    - 重要性：高
        
    - 推荐动作：应补入正文；主表也值得考虑加入
        
    - 原因：这篇工作把 prompt 的设计点从 node feature 扩展到了 edge，是现有主表里明显缺失的一类机制。它不是简单换场景，而是在 prompt 作用位置上提供了新的代表性。
        
    - 链接：
        
        - arXiv: [https://arxiv.org/abs/2503.00750](https://arxiv.org/abs/2503.00750)
            
        - ICLR 2025: [https://proceedings.iclr.cc/paper_files/paper/2025/hash/da42cd1440728b05f60f96a4a029965e-Abstract-Conference.html](https://proceedings.iclr.cc/paper_files/paper/2025/hash/da42cd1440728b05f60f96a4a029965e-Abstract-Conference.html)
            
5. **ProNoG: Non-Homophilic Graph Pre-Training and Prompt Learning**
    
    - 发表情况：KDD 2025
        
    - 状态：正式会议论文
        
    - 重要性：高
        
    - 推荐动作：建议至少补入正文；如果你希望第五章覆盖 heterophily / non-homophily 的 prompt 方向，主表也值得考虑
        
    - 原因：这篇工作不是简单在已有 prompt 框架上做小改动，而是明确面向 non-homophilic graphs 重新设计 pre-training 与 prompt adaptation。它是 2025 年 graph prompt 主线里比较有代表性的一个分支。
        
    - 链接：
        
        - arXiv: [https://arxiv.org/abs/2408.12594](https://arxiv.org/abs/2408.12594)
            
        - KDD 2025 页面/DOI: [https://doi.org/10.1145/3690624.3709219](https://doi.org/10.1145/3690624.3709219)
            
6. **HGMP: Heterogeneous Graph Multi-Task Prompt Learning**
    
    - 发表情况：IJCAI 2025
        
    - 状态：正式会议论文
        
    - 重要性：中高
        
    - 推荐动作：如果第五章希望更完整覆盖 heterogeneous graph prompting，建议补入正文；主表可作为 HetGPT 之后的更新代表作候选
        
    - 原因：它不是简单把已有 prompt 套到异构图，而是把 heterogeneous graph、multi-task reformulation 和 contrastive pre-training 绑在一起，代表性比一些较弱的异构图 preprint 更强。
        
    - 链接：
        
        - arXiv: [https://arxiv.org/abs/2507.07405](https://arxiv.org/abs/2507.07405)
            
        - IJCAI 2025: [https://www.ijcai.org/proceedings/2025/332](https://www.ijcai.org/proceedings/2025/332)
            
7. **HePa: Heterogeneous Graph Prompting for All-Level Classification Tasks**
    
    - 发表情况：AAAI 2025
        
    - 状态：正式会议论文
        
    - 重要性：中高
        
    - 推荐动作：建议至少补入正文；主表视篇幅决定
        
    - 原因：它的定位很清楚，就是 heterogeneous graph 上的 all-level classification prompting。和 HGPROMPT、HGMP 一起看，能够把异构图 prompting 这一支线补完整。
        
    - 链接：
        
        - DBLP: [https://dblp.org/rec/conf/aaai/JinghongSLK25](https://dblp.org/rec/conf/aaai/JinghongSLK25)
            
8. **SGPT: Few-Shot Prompt Tuning for Signed Graphs**
    
    - 发表情况：CIKM 2025
        
    - 状态：正式会议论文
        
    - 重要性：中
        
    - 推荐动作：建议至少在正文提到；是否进主表取决于你是否想让主表覆盖 signed graph 这一专门方向
        
    - 原因：方法本身是完整的 graph prompt 方案，而且是正式发表；但 signed graph 仍然是比较专门的分支，不一定适合抢主表位置。
        
    - 链接：
        
        - arXiv: [https://arxiv.org/abs/2412.12155](https://arxiv.org/abs/2412.12155)
            
9. **Prompt-Based Spatio-Temporal Graph Transfer Learning**
    
    - 简称：文中通常可记为 `STGP`
        
    - 发表情况：CIKM 2024
        
    - 状态：正式会议论文
        
    - 重要性：中
        
    - 推荐动作：建议在正文里补；主表只在你想显式覆盖时空图 prompting 时再考虑加入
        
    - 原因：这是时空图方向较规范的一篇 prompt-based transfer 方法，但场景专门，放进主表会挤占通用方法的空间。
        
    - 链接：
        
        - arXiv: [https://arxiv.org/abs/2405.12452](https://arxiv.org/abs/2405.12452)
            
10. **MultiHGPT: Multi-task Heterogeneous Graph Prompt Tuning**
    
    - 发表情况：Information Processing & Management 2025
        
    - 状态：正式期刊论文
        
    - 重要性：中高
        
    - 推荐动作：如果你希望异构图 prompting 这条线写得更完整，建议在正文中提到；主表优先级略低于 HGPROMPT / HGMP
        
    - 原因：它比一些异构图 preprint 更成熟，而且是正式期刊版本；不过从“代表性”和“压缩主表”的角度看，我还是会优先保留 AAAI / IJCAI 那几篇。
        
    - 链接：
        
        - ScienceDirect: [https://www.sciencedirect.com/science/article/abs/pii/S0306457325001773](https://www.sciencedirect.com/science/article/abs/pii/S0306457325001773)
            

### 值得关注的新 preprint

1. **One Prompt Fits All: Universal Graph Adaptation for Pretrained Models**
    
    - 方法名：文中可记为 `UniPrompt`
        
    - 发表情况：NIPS 2025
        
    - 状态：未见正式发表版本
        
    - 重要性：中高
        
    - 推荐动作：建议在 discussion 或 future directions 中提到；暂不建议直接进主表
        
    - 原因：它的贡献更偏统一解释和 universal adaptation，思路重要，但目前还是 preprint。
        
    - 链接：[https://arxiv.org/abs/2509.22416](https://arxiv.org/abs/2509.22416)
        
2. **MAGPrompt: Message-Adaptive Graph Prompt Tuning for Graph Neural Networks**
    
    - 发表情况：arXiv 2026
        
    - 状态：极新 preprint
        
    - 重要性：中高
        
    - 推荐动作：建议在 discussion 中提到；主表暂缓
        
    - 原因：这篇工作把 prompt 介入点推进到 message passing 层，机制上确实新，但时间太新，尚未正式发表。
        
    - 链接：[https://arxiv.org/abs/2602.05567](https://arxiv.org/abs/2602.05567)
        
3. **Unsupervised Prompting for Graph Neural Networks**
    
    - 发表情况：arXiv 2025
        
    - 状态：未见正式发表版本
        
    - 重要性：中
        
    - 推荐动作：建议在正文讨论中一笔带到；主表暂不建议加入
        
    - 原因：它的价值主要在“无标签 prompt 适配”这一设定，而不是提出一个已经公认的核心 prompt 机制。
        
    - 链接：[https://arxiv.org/abs/2505.16903](https://arxiv.org/abs/2505.16903)
        
4. **GP2F: Cross-Domain Graph Prompting with Adaptive Fusion of Pre-trained Graph Neural Networks**
    
    - 发表情况：arXiv 2026
        
    - 状态：极新 preprint
        
    - 重要性：中
        
    - 推荐动作：如果你后面继续强化 graph domain adaptation 小节，可以提到；主表暂不建议加入
        
    - 原因：方向和第五章后半部分很相关，但目前还是太新。
        
    - 链接：[https://arxiv.org/abs/2602.11629](https://arxiv.org/abs/2602.11629)
        
5. **SUPT: Subgraph-level Universal Prompt Tuning**
    
    - 发表情况：arXiv 2024
        
    - 状态：目前仍以 preprint 为主
        
    - 重要性：中高
        
    - 推荐动作：建议在 discussion 中提到；如果后续确认正式发表，可提升优先级
        
    - 原因：它在“subgraph-level prompt”这条机制线上有明确贡献，而且被后续工作频繁引用；但目前还不像 EdgePrompt、ProNoG 这种已有强正式发表版本。
        
    - 链接：[https://arxiv.org/abs/2402.10380](https://arxiv.org/abs/2402.10380)
        
6. **MGP: Integrating Pre-Training and Few-Shot Node Classification via Meta Graph Prompt**
    
    - 发表情况：Knowledge-Based Systems 2026
        
    - 状态：正式期刊论文
        
    - 重要性：中
        
    - 推荐动作：建议在 few-shot / meta-prompting 相关讨论中提到；主表可暂缓
        
    - 原因：这是 2026 年才正式发表的一篇 few-shot 方向 prompt 方法，属于值得关注的新补充，但它更偏具体 setting，不一定要抢主表位置。
        
    - 链接：
        
        - ScienceDirect / KBS: [https://www.sciencedirect.com/science/article/pii/S0950705125019148](https://www.sciencedirect.com/science/article/pii/S0950705125019148)
            

## 已检到、但不建议优先纳入主表的方法

1. **A Unified Graph Selective Prompt Learning for Graph Neural Networks**
    
    - arXiv 2024
        
    - 价值：提出 selective prompt + edge/node unified view
        
    - 问题：目前仍是 preprint；如果要进主表，容易和后续更成熟的方法竞争位置
        
    - 链接：[https://arxiv.org/abs/2406.10498](https://arxiv.org/abs/2406.10498)
        
2. **CLEAR: Cluster-based Prompt Learning on Heterogeneous Graphs**
    
    - 2025，正式发表版本为 Springer LNCS chapter
        
    - 价值：异构图 prompt 的补充案例
        
    - 问题：venue 强度和方法代表性都不如 HGMP
        
3. **Heterogeneous Graph Prompt Learning via Adaptive Weight Pruning**
    
    - arXiv 2025
        
    - 价值：把 pruning 和 graph prompt 结合
        
    - 问题：仍是 preprint，而且更偏效率优化，不像一篇主线代表方法
        
    - 链接：[https://arxiv.org/abs/2507.09132](https://arxiv.org/abs/2507.09132)
        
4. **Event-Aware Prompt Learning for Dynamic Graphs**
    
    - arXiv 2025
        
    - 价值：动态图 prompt 的扩展
        
    - 问题：很专门，适合放到动态图/时序图 extension 里
        
    - 链接：[https://arxiv.org/abs/2510.11339](https://arxiv.org/abs/2510.11339)
        
5. **Prompt-Driven Continual Graph Learning**
    
    - arXiv 2025
        
    - 价值：continual graph learning 场景
        
    - 问题：任务设定太专门，不适合抢主表位置
        
    - 链接：[https://arxiv.org/abs/2502.06327](https://arxiv.org/abs/2502.06327)
        
6. **Killing Two Birds with One Stone: Cross-modal Reinforced Prompting for Graph and Language Tasks**
    
    - KDD 2024
        
    - 价值：对第五章的 multi-modal / graph-language prompting 小节有参考价值
        
    - 问题：它更适合放在第五章后半的多模态讨论，而不是主 graph prompt 方法表
        
    - 链接：
        
        - KDD 2024 PDF: [https://zhoujingbo.github.io/paper/2024KillingKDD.pdf](https://zhoujingbo.github.io/paper/2024KillingKDD.pdf)
            

## 对当前第五章和主表的直接建议

### 正文建议至少补进的 6 篇

- HGPROMPT（AAAI 2024）
    
- Self-Pro（ECML PKDD 2024）
    
- PSP（ECML PKDD 2024）
    
- EdgePrompt（ICLR 2025）
    
- ProNoG（KDD 2025）
    
- SGPT（CIKM 2025）
    
- STGP / Prompt-Based Spatio-Temporal Graph Transfer Learning（CIKM 2024）
    

如果要补一篇多模态相关遗漏，可以再加：

- Killing Two Birds with One Stone / CMRP（KDD 2024）
    

### 如果只想新增 1-2 篇到主表

优先顺序建议：

1. EdgePrompt
    
2. HGPROMPT
    
3. PSP
    
4. ProNoG
    

理由：

- EdgePrompt 提供了“edge-level prompt”这一当前主表没有覆盖好的机制位。
    
- HGPROMPT 补齐了 homogeneous / heterogeneous bridging 这一条已经正式成型的 2024 代表线。
    
- PSP 补齐了 structure prompt 这一类机制。
    
- ProNoG 则把 graph prompting 扩展到了 non-homophilic graph setting。
    

### 如果只想在 discussion/future work 中提到

- UniPrompt
    
- MAGPrompt
    
- Unsupervised Prompting for GNNs
    
- GP2F
    

## 当前判断

截至 2026-04-19，**最像“重要遗漏”的有 4 篇**：

- EdgePrompt
    
- HGPROMPT
    
- PSP
    
- ProNoG
    

如果只补一篇，我会先补 `EdgePrompt`。 如果补两篇，我会补 `EdgePrompt + HGPROMPT`。 如果补四篇，我会补 `EdgePrompt + HGPROMPT + PSP + ProNoG`。

如果你希望第五章在 2026 视角下更完整，那么第二梯队建议补：

- Self-Pro
    
- HGMP
    
- HePa / MultiHGPT（二选一即可）
    
- SGPT
    
- STGP
    

如果你希望把“很新的趋势”也点出来，但又不想让主表被大量 preprint 占满，可以在正文 discussion 里加一句或一小段，提：

- UniPrompt
    
- MAGPrompt
    
- GP2F