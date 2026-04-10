# Graph Prompt Survey Revision

  

- Goal

  - Refresh the 2023 graph prompt survey into a 2026-ready version

  - Preserve the existing taxonomy backbone

  - Route recent methods that do not fit the taxonomy into Applications or Discussion

- Scope And Constraints

  - Keep the top-level section order in `tex/0.main.tex`

  - Keep the taxonomy tree in `tex/pic/taxonomy.tex` unchanged unless a factual error forces a minimal patch

  - Prefer textual updates over structural rewrites

  - Use `2024-01-01` to `2026-03-22` as the main refresh window

  - Keep the taxonomy chapter as the center of the survey

- Completed Checkpoints

  - CP0 Baseline Frozen

    - Build the current manuscript

    - Record warnings, stale claims, and revision boundary

    - Confirm the policy of keeping the taxonomy unchanged

  - CP1 Recent Paper Pool Ready

    - Build the 2024-2026 candidate paper pool

    - Label each paper as taxonomy, Applications, Discussion, or discard

  - CP2 Taxonomy Mapping Locked

    - Map every retained paper to `tex/5.tex`, `tex/6.Applications.tex`, or `tex/8.Discussion.tex`

    - Identify active taxonomy leaves and mostly historical leaves

    - Confirm that no taxonomy redesign is required

  - CP3 Front Matter Updated

    - Remove the old submission note

    - Rewrite stale novelty claims and year phrasing

    - Add comparisons with post-2023 graph-prompt surveys in `Connection to Existing Work`

    - Unify academic tone across abstract, introduction, and methodology

- Current Focus

  - CP4 Core Taxonomy Updated

    - Update `tex/5.tex` under the existing taxonomy only

    - Integrate recent representative methods into existing subsections

    - Keep paragraph order stable where possible

    - Update summary tables alongside the paragraph text

- Next Checkpoints

  - CP5 Overflow Coverage Added

    - Add a compact overflow subsection in `tex/6.Applications.tex`

    - Add trend-level discussion in `tex/8.Discussion.tex`

    - Explain why non-taxonomy papers still matter

  - CP6 References And Assets Synced

    - Clean and normalize `tex/zotero.bib`

    - Synchronize paper counts, statistics, and summary tables

    - Decide whether to regenerate venue and keyword figures

  - CP7 Release Candidate Built

    - Rebuild until cross-references and bibliography stabilize

    - Fix unresolved citations and broken references

    - Record any remaining limitations in a closeout note
