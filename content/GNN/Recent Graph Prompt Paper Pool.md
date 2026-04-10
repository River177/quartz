
Date: 2026-03-22

## Scope

This pool supports the 2026 refresh of the graph prompt survey. It covers papers from `2024-01-01` to `2026-03-22` that are relevant to graph prompt learning, graph prompt tuning, graph prompt transfer, graph in-context prompting, and application-driven graph prompting.

## Source and screening rule

- Primary source verification: arXiv API exact-title lookup on 2026-03-22
- Retain if the paper contributes a prompt mechanism, prompt tuning strategy, prompt-driven transfer setup, or a trend-critical resource such as theory, benchmarking, privacy, or robustness
- Exclude if the paper is mainly a survey, a generic graph foundation model paper, or an application/system paper where prompting is not a central technical contribution
- `Preliminary disposition` is only for Task 2 and will be finalized in Task 3

## Retained pool


| Bib key                | Year | Venue          | Title                                                                                                   | Link                                                                 | Task type                            | Prompt type                              | Preliminary disposition | One-line note                                                                                            |
| ---------------------- | ---- | -------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `zi2024prog`           | 2024 | arXiv preprint | ProG: A Graph Prompt Learning Benchmark                                                                 | [https://arxiv.org/abs/2406.05346](https://arxiv.org/abs/2406.05346) | Benchmarking                         | Evaluation benchmark                     | discussion/trend        | Strong candidate for the evaluation and comparison discussion rather than the core taxonomy.             |
| `wang2024does`         | 2024 | arXiv preprint | Does Graph Prompt Work? A Data Operation Perspective with Theoretical Analysis                          | [https://arxiv.org/abs/2410.01635](https://arxiv.org/abs/2410.01635) | Theory                               | Theory/analysis                          | discussion/trend        | Important for the why-prompt and limitation discussion.                                                  |
| `jiang2024unified`     | 2024 | arXiv preprint | A Unified Graph Selective Prompt Learning for Graph Neural Networks                                     | [https://arxiv.org/abs/2406.10498](https://arxiv.org/abs/2406.10498) | General graph tasks                  | Selective token prompt                   | core taxonomy           | Natural fit for prompt token design and tuning updates.                                                  |
| `chen2024temporal`     | 2024 | arXiv preprint | Prompt Learning on Temporal Interaction Graphs                                                          | [https://arxiv.org/abs/2402.06326](https://arxiv.org/abs/2402.06326) | Temporal interaction graphs          | Dynamic prompt tuning                    | core taxonomy           | Useful to show prompt learning beyond static graphs while still fitting the tuning story.                |
| `hu2024spatiotemporal` | 2024 | arXiv preprint | Prompt-Based Spatio-Temporal Graph Transfer Learning                                                    | [https://arxiv.org/abs/2405.12452](https://arxiv.org/abs/2405.12452) | Spatio-temporal transfer             | Transfer prompt                          | applications overflow   | Better handled as an application-driven transfer direction than as a new taxonomy leaf.                  |
| `zhai2024sgpt`         | 2024 | arXiv preprint | SGPT: Few-Shot Prompt Tuning for Signed Graphs                                                          | [https://arxiv.org/abs/2412.12155](https://arxiv.org/abs/2412.12155) | Signed graph tasks                   | Few-shot prompt tuning                   | core taxonomy           | Fits task-specific prompt tuning and specialized graph settings.                                         |
| `jiang2024graphsparse` | 2024 | arXiv preprint | Reliable and Compact Graph Fine-tuning via GraphSparse Prompting                                        | [https://arxiv.org/abs/2410.21749](https://arxiv.org/abs/2410.21749) | General graph tasks                  | Sparse prompt tuning                     | core taxonomy           | Strong efficiency-oriented addition for prompt tuning.                                                   |
| `zhu2024relief`        | 2024 | arXiv preprint | RELIEF: Reinforcement Learning Empowered Graph Feature Prompt Tuning                                    | [https://arxiv.org/abs/2408.03195](https://arxiv.org/abs/2408.03195) | General graph tasks                  | RL-based feature prompt                  | core taxonomy           | Good fit for the prompt-learning-strategy subsection.                                                    |
| `guo2024asymmetric`    | 2024 | arXiv preprint | Against Multifaceted Graph Heterogeneity via Asymmetric Federated Prompt Learning                       | [https://arxiv.org/abs/2411.02003](https://arxiv.org/abs/2411.02003) | Federated heterogeneous graphs       | Federated prompt learning                | applications overflow   | Important but better treated as a scenario-driven extension in Applications.                             |
| `chen2025dagprompt`    | 2025 | arXiv preprint | DAGPrompT: Pushing the Limits of Graph Prompting with a Distribution-aware Graph Prompt Tuning Approach | [https://arxiv.org/abs/2501.15142](https://arxiv.org/abs/2501.15142) | General graph tasks                  | Distribution-aware tuning                | core taxonomy           | Candidate for the recent prompt tuning update with a generalization focus.                               |
| `wang2025clear`        | 2025 | arXiv preprint | CLEAR: Cluster-based Prompt Learning on Heterogeneous Graphs                                            | [https://arxiv.org/abs/2502.08918](https://arxiv.org/abs/2502.08918) | Heterogeneous graphs                 | Cluster-based prompt                     | core taxonomy           | Extends the heterogeneity branch without requiring taxonomy redesign.                                    |
| `wang2025continual`    | 2025 | arXiv preprint | Prompt-Driven Continual Graph Learning                                                                  | [https://arxiv.org/abs/2502.06327](https://arxiv.org/abs/2502.06327) | Continual graph learning             | Continual prompt adaptation              | discussion/trend        | More valuable as an emerging setting in Discussion than as a main taxonomy method.                       |
| `fu2025edge`           | 2025 | arXiv preprint | Edge Prompt Tuning for Graph Neural Networks                                                            | [https://arxiv.org/abs/2503.00750](https://arxiv.org/abs/2503.00750) | General graph tasks                  | Edge prompt / insertion pattern          | core taxonomy           | Directly extends the inserting-pattern discussion toward edge-level prompting.                           |
| `xu2025dpgpl`          | 2025 | arXiv preprint | DP-GPL: Differentially Private Graph Prompt Learning                                                    | [https://arxiv.org/abs/2503.10544](https://arxiv.org/abs/2503.10544) | Privacy-constrained graph learning   | Private prompt tuning                    | discussion/trend        | Better placed under reliability/privacy discussion.                                                      |
| `lv2025graphprompter`  | 2025 | arXiv preprint | GraphPrompter: Multi-stage Adaptive Prompt Optimization for Graph In-Context Learning                   | [https://arxiv.org/abs/2505.02027](https://arxiv.org/abs/2505.02027) | Graph in-context learning            | Multi-stage adaptive prompt optimization | discussion/trend        | Important for the in-context learning trend and likely belongs in later discussion or overflow sections. |
| `huang2025oneprompt`   | 2025 | arXiv preprint | One Prompt Fits All: Universal Graph Adaptation for Pretrained Models                                   | [https://arxiv.org/abs/2509.22416](https://arxiv.org/abs/2509.22416) | Cross-task / cross-domain adaptation | Universal adaptation prompt              | core taxonomy           | Good fit for the domain-adaptation branch under the existing taxonomy.                                   |
| `zhang2026adversarial` | 2026 | arXiv preprint | Robust Graph Fine-Tuning with Adversarial Graph Prompting                                               | [https://arxiv.org/abs/2601.00229](https://arxiv.org/abs/2601.00229) | Robust graph fine-tuning             | Adversarial prompt tuning                | discussion/trend        | Best used for the robustness discussion rather than the main taxonomy.                                   |
| `nguyen2026magprompt`  | 2026 | arXiv preprint | MAGPrompt: Message-Adaptive Graph Prompt Tuning for Graph Neural Networks                               | [https://arxiv.org/abs/2602.05567](https://arxiv.org/abs/2602.05567) | General graph tasks                  | Message-adaptive prompt                  | core taxonomy           | A front-edge prompt tuning variant that still fits the existing prompt-design and tuning frame.          |
| `he2026gp2f`           | 2026 | arXiv preprint | GP2F: Cross-Domain Graph Prompting with Adaptive Fusion of Pre-trained Graph Neural Networks            | [https://arxiv.org/abs/2602.11629](https://arxiv.org/abs/2602.11629) | Cross-domain adaptation              | Adaptive fusion prompt                   | core taxonomy           | Strong recent addition for semantic and structural transfer under the existing domain-adaptation branch. |


## Not retained in the formal pool at this stage

These items appeared in earlier local notes but are not retained in the current formal pool because they are either surveys, application-specific side cases, or not yet strong enough for the main refresh pass:

- `Graph Prompting for Graph Learning Models: Recent Advances and Future Directions`
- `Towards Graph Prompt Learning: A Survey and Beyond`
- `GPT4Rec: Graph Prompt Tuning for Streaming Recommendation`
- other unverified local-note titles that may be revisited only if Task 3 reveals a genuine coverage gap

## Task 2 status

This file completes the paper-pool part of Task 2:

- recent candidate papers collected
- exact-title source verification completed for retained arXiv items
- preliminary dispositions assigned
- retained papers inserted into `tex/zotero.bib`

