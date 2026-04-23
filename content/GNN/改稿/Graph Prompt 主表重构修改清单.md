

这份文档用于指导 [graph_prompt_summary.tex](typora://app/D:/GPL/gpl-survey/tex/table/graph_prompt_summary.tex) 的重构。 核心目标不是继续“堆方法”，而是把主表收敛成一张**标准 graph prompt 方法主线表**，并把异构图、带符号图、时空图、动态图、跨模态、跨域等专门场景的方法移到第五章正文中介绍。

## 1. 重构目标

主表应该回答的问题是：

- 标准 graph prompt 方法是如何设计 prompt 的？
    
- 它们如何把 downstream task 对齐到 pre-training task？
    
- 它们的 inserting pattern 和 prompt tuning 机制分别是什么？
    

因此，主表不再追求覆盖“所有带 prompt 的图论文”，而是优先覆盖：

1. **通用 graph prompt / graph prompt tuning 方法**
    
2. **可以自然落入当前表头 taxonomy 的方法**
    
3. **对 prompt 机制本身有代表性贡献的方法**
    
4. **尽量优先正式发表版本**
    

## 2. 主表新的纳入标准

一篇论文要进入主表，至少应满足以下三点中的两点：

1. 它研究的是**通用 graph prompt 机制**，而不是某个专门图类型上的 prompt 变体。
    
2. 它的核心贡献在于 **prompt components / inserting pattern / prompt tuning / answering function** 之一，而不是纯应用迁移。
    
3. 它能比较自然地和 `GPPT / GPF / All in One / GraphPrompt / DAGPrompT` 这条主线放在一起比较。
    

以下类型原则上**不进主表**，而是放正文：

- heterogeneous graph prompting
    
- signed graph prompting
    
- text-attributed graph prompting
    
- spatio-temporal / dynamic graph prompting
    
- cross-modal graph-language prompting
    
- continual / federated / cross-domain specialized prompting
    

## 3. 当前主表问题

当前主表包含的方法里，已经混入了几类“更适合正文、不适合主表”的论文。

### 3.1 当前主表中明显属于专门场景的方法

1. `HetGPT`
    
    - 类型：heterogeneous graph prompting
        
    - 判断：应从主表移出，放到正文异构图小节中
        
2. `P2TAG`
    
    - 类型：text-attributed graph / graph-text prompting
        
    - 判断：应从主表移出，放到正文 TAG / graph-text 小节中
        

### 3.2 当前主表中代表性偏弱、可被更新方法替换的条目

这些方法不一定“有问题”，但如果要把主表更新到 2026 投稿版本，它们优先级已经不高：

1. `PGCL`
    
    - 状态：arXiv
        
    - 问题：graph-level contrastive prompt 的代表性已经不如更新方法
        
2. `SGL-PT`
    
    - 状态：arXiv
        
    - 问题：机制较单一，且没有正式发表加持
        
3. `ULTRA-DP`
    
    - 状态：arXiv
        
    - 问题：更偏 task embedding / multi-task transfer，主表代表性不足
        
4. `SAP`
    
    - 状态：arXiv
        
    - 问题：对比学习视角有价值，但方法影响力和普适性弱于后续正式论文
        

## 4. 主表建议保留的方法

这些方法仍然构成 graph prompt 主线，建议保留在主表中。

1. `GPPT`
    
2. `GPF`
    
3. `All in One`
    
4. `GraphPrompt`
    
5. `PRODIGY`
    
6. `GraphPrompter`
    
7. `GPF-Plus`
    
8. `RELIEF`
    
9. `DeepGPT`
    
10. `DAGPrompT`
    
11. `IGAP`
    
12. `VNT`
    

### 条件保留

以下方法可以保留，但如果表格篇幅太紧，也可以作为第二梯队考虑替换：

1. `VNT`
    
    - 优点：self-attention / token concatenation 这一插入模式仍有代表性
        
    - 风险：比较依赖 graph transformer backbone
        
2. `DeepGPT`
    
    - 优点：prefix-style / deep prompt tuning 视角仍然重要
        
    - 风险：年份偏早，且仍是 arXiv
        

## 5. 建议新增到主表的标准方法

这几篇是当前最适合补进主表的“标准 graph prompt 方法”。

### 第一优先级

1. `Self-Pro`
    
    - 发表：ECML PKDD 2024
        
    - 原因：是完整的标准 graph prompt 方法论文，不依赖专门图类型
        
2. `PSP`
    
    - 发表：ECML PKDD 2024
        
    - 原因：补上了 structure prompt tuning 这条机制线
        
3. `EdgePrompt`
    
    - 发表：ICLR 2025
        
    - 原因：把 prompt 作用点推进到 edge，是当前主表明显缺的一类机制
        
4. `ProNoG`
    
    - 发表：KDD 2025
        
    - 原因：虽然强调 non-homophilic graph，但方法本身仍属于较标准的 graph pre-training + prompt learning 路线，且正式发表、代表性强
        

### 第二优先级

5. `Subgraph-level Universal Prompt Tuning (SUPT)`
    
    - 发表：Information Sciences 2026
        
    - 原因：subgraph-level universal prompt tuning 视角较新，且已经有正式期刊版本
        
    - 备注：如果你想控制主表长度，可以把它放到 discussion，而不一定进主表
        

## 6. 不建议加入主表，但建议在正文补充的方法

这些论文有价值，但更适合作为 specialized setting 的代表作写在正文中。

### 异构图

1. `HetGPT`
    
2. `HGPROMPT`
    
3. `HGMP`
    
4. `HePa`
    
5. `MultiHGPT`
    
6. `CLEAR`
    
7. `Heterogeneous Graph Prompt Learning via Adaptive Weight Pruning`
    

### 带符号图

1. `SGPT`
    

### TAG / graph-text

1. `P2TAG`
    

### 时空图 / 动态图

1. `Prompt-Based Spatio-Temporal Graph Transfer Learning`
    
2. `Event-Aware Prompt Learning for Dynamic Graphs`
    

### 跨域 / 持续学习

1. `One Prompt Fits All`
    
2. `GP2F`
    
3. `Prompt-Driven Continual Graph Learning`
    

### 多模态 / graph-language

1. `Killing Two Birds with One Stone: Cross-modal Reinforced Prompting for Graph and Language Tasks`
    

## 7. 不建议进主表，只建议在 discussion 或 future work 中提到

这些论文更适合放在第五章的讨论部分，而不是主表。

1. `MAGPrompt`
    
    - 太新，且尚未正式发表
        
2. `Unsupervised Prompting for Graph Neural Networks`
    
    - 有意思，但目前还更像新方向而不是“已稳定代表作”
        
3. `MGP`
    
    - few-shot / meta graph prompt 方向有价值，但不必抢主表位置
        

## 8. 主表具体修改建议

## 8.1 先从主表移出的条目

1. `HetGPT`
    
2. `P2TAG`
    

## 8.2 建议替换掉的旧条目

建议按下面顺序替换：

1. 用 `Self-Pro` 替换 `SGL-PT`
    
2. 用 `PSP` 替换 `PGCL`
    
3. 用 `EdgePrompt` 替换 `ULTRA-DP`
    
4. 用 `ProNoG` 替换 `SAP`
    

如果还要继续压缩主表，可以进一步考虑：

5. 若想控制篇幅，可将 `VNT` 转为正文 discussion，并用 `SUPT` 替换 但这一步不是必须
    

## 8.3 主表重构后的建议版本

如果采用“保留 12 篇 + 新增 4 篇”的方案，主表可收敛为以下 16 篇：

1. `GPPT`
    
2. `GPF`
    
3. `All in One`
    
4. `GraphPrompt`
    
5. `PRODIGY`
    
6. `GraphPrompter`
    
7. `GPF-Plus`
    
8. `RELIEF`
    
9. `DeepGPT`
    
10. `DAGPrompT`
    
11. `IGAP`
    
12. `VNT`
    
13. `Self-Pro`
    
14. `PSP`
    
15. `EdgePrompt`
    
16. `ProNoG`
    

如果想做成更完整的 17 篇版本，可以再加入：

17. `SUPT`
    

## 9. 第五章正文的重组建议

主表移出的论文不应该消失，而应该在第五章正文中按场景组织。

### 建议新增或强化的正文结构

1. **Prompting on Heterogeneous Graphs**
    
    - `HetGPT`
        
    - `HGPROMPT`
        
    - `HePa`
        
    - `HGMP`
        
    - `MultiHGPT`
        
    - `CLEAR`
        
2. **Prompting on Signed, Temporal, and Dynamic Graphs**
    
    - `SGPT`
        
    - `Prompt-Based Spatio-Temporal Graph Transfer Learning`
        
    - `Event-Aware Prompt Learning for Dynamic Graphs`
        
3. **Prompting on Text-Attributed and Cross-Modal Graph Settings**
    
    - `P2TAG`
        
    - `Killing Two Birds with One Stone`
        
4. **Prompting under Cross-Domain or Continual Settings**
    
    - `One Prompt Fits All`
        
    - `GP2F`
        
    - `Prompt-Driven Continual Graph Learning`
        
5. **Very Recent Directions**
    
    - `MAGPrompt`
        
    - `Unsupervised Prompting for GNNs`
        
    - `MGP`
        

## 10. 实施顺序

建议按以下顺序修改，避免来回返工。

1. 先改主表的纳入标准和目标
    
2. 从主表移出 `HetGPT` 与 `P2TAG`
    
3. 替换 `PGCL / SGL-PT / ULTRA-DP / SAP`
    
4. 新增 `Self-Pro / PSP / EdgePrompt / ProNoG`
    
5. 再决定是否加入 `SUPT`
    
6. 最后统一正文中的 specialized-setting 小节，让被移出的论文有合适位置
    

## 11. 推荐执行方案

如果你希望做一版**稳妥且易于收敛的修改**，我建议采用下面这个版本：

### 主表中移出

- `HetGPT`
    
- `P2TAG`
    

### 主表中替换

- `SGL-PT` → `Self-Pro`
    
- `PGCL` → `PSP`
    
- `ULTRA-DP` → `EdgePrompt`
    
- `SAP` → `ProNoG`
    

### 正文中补充

- 异构图：`HGPROMPT`, `HePa`, `HGMP`, `MultiHGPT`
    
- 带符号图：`SGPT`
    
- 时空/动态图：`Prompt-Based Spatio-Temporal Graph Transfer Learning`, `Event-Aware Prompt Learning`
    
- 多模态/跨域：`Killing Two Birds with One Stone`, `One Prompt Fits All`, `GP2F`
    
- very recent：`MAGPrompt`, `Unsupervised Prompting`, `MGP`
    

这个版本的优点是：

- 主表更干净，真正聚焦“标准 graph prompt 方法主线”
    
- specialized settings 仍然被完整保留在正文中
    
- 新增方法大多是 2024-2025 的正式发表论文
    
- 不会让主表继续膨胀成一张“所有 prompt 论文汇总表”
    

## 12. 下一步

基于这份清单，下一步应直接修改两个文件：

1. [graph_prompt_summary.tex](typora://app/D:/GPL/gpl-survey/tex/table/graph_prompt_summary.tex)
    
2. [5.tex](typora://app/D:/GPL/gpl-survey/tex/5.tex)
    

建议先改表，再改正文。因为表格会反过来决定正文该怎么组织主线与 specialized settings。