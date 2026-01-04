# 4. 数据库管理系统

## 目录

DBMS的体系结构

DBMS核心的组件

DBMS的进程结构

- 数据库访问管理
- 查询优化
- 事务管理
- 并发控制
- 恢复

## 4.1 DBMS核心的组件

## 4.2 DBMS的进程结构

单进程结构

多进程结构

多线程结构

- 进程/线程之间的通信协议

### 单进程结构

- 应用程序与DBMS核心编译成一个.exe文件，作为单个进程运行。

### 多进程结构

一个应用进程对应一个DBMS核心进程

### 多线程结构

- 只有一个DBMS进程，每个应用进程对应一个DBMS核心线程。

## 4.3 数据库访问管理

对数据库的访问最终会转换为对文件（操作系统文件）的操作。文件结构及其上提供的访问路径将直接影响数据访问的速度。一种文件结构不可能对所有类型的数据访问都有效。

- 访问类型
- 文件组织
- 索引技术

### 访问类型

查询文件的所有或大部分记录（>15%）

- 查询某个特定记录
- 查询某些记录（<15%）
- 范围查询
- 更新

### 文件组织

- 堆文件：记录按照插入顺序存储，顺序检索。这是最基本和通用的文件组织形式。
- 直接文件：记录的地址通过哈希函数根据某个属性的值映射得到。
- 动态哈希
- 索引文件：索引 + 堆文件/簇
- 网格结构文件：适用于多属性查询
- 原始磁盘（注意文件的逻辑块和物理块之间的区别。通过使用原始磁盘，可以在操作系统中控制物理块）

### 索引技术

B+树（√ √）

- 聚簇索引 $(\sqrt{})$
- 倒排文件
- 动态哈希
- 网格结构文件和分区哈希函数
- **位图索引（用于数据仓库）**
- 其他

> **B+ 树是一种高效的多路平衡索引结构；聚簇索引是一种数据存储方式，其索引顺序与数据物理顺序一致，通常采用 B+ 树实现。**

> **A B+ tree is an efficient multi-way balanced index structure; a clustered index is a data storage organization in which the order of the index keys corresponds to the physical order of the data, and it is typically implemented using a B+ tree.**

## 4.4 查询优化

首先"重写"用户提交的查询语句，然后决定最有效的操作方法和步骤来获得结果。目标是以最低的成本和最短的时间获得用户查询的结果。

### 4.4.1 查询优化概述

- 代数优化
- 操作优化

### 示例

S(SNUM, SNAME, CITY)

SP(SNUM, PNUM, QUAN)

P(PNUM, PNAME, WEIGHT, SIZE)

```sql
SELECT SNAME
FROM S, SP, P
WHERE S.SNUM=SP.SNUM AND
SP.PNUM=P.PNUM AND
S.CITY='Nanjing' AND
P.PNAME='Bolt' AND
SP.QUAN>1000;
```

### 等价变换后（代数优化）：

$$
\Pi 1 = \Pi (\mathrm {S . S N U M}, \mathrm {S . S N A M E})
$$

$$
\Pi 2 = \Pi (\mathrm {S P . S N U M}, \mathrm {S P . P N U M})
$$

$$
\Pi 3 = \Pi (\mathrm {P . P N U M})
$$

### 树的操作优化

- 决定两个连接的顺序
- 对于每个连接操作，有多种计算方法：

查询优化的目标是通过成本估算从众多可能的执行策略中选择一个"好的"方案。因此这是一项复杂的任务。

### 4.4.2 查询的等价变换

这就是所谓的代数优化。它对原始查询表达式进行一系列变换，将其转换为等价的、最有效的执行形式。

#### (1) 查询树

#### (2) 关系代数的等价变换规则

1) $\rtimes / \times$ 的交换规则：E1 $\times$ E2 $\equiv$ E2 $\times$ E1

2) $\bowtie / \times$ 的结合规则：E1×(E2×E3)≡(E1×E2)×E3

3) $\Pi$ 的聚集规则：$\Pi_{\mathrm{A1...An}}(\Pi_{\mathrm{B1...Bm}}(\mathrm{E})) \equiv \Pi_{\mathrm{A1...An}}(\mathrm{E})$，当 $\mathrm{A}_1 \ldots \mathrm{A}_n$ 是 $\{\mathrm{B}_1 \ldots \mathrm{B}_m\}$ 的子集时合法

4) $\sigma$ 的聚集规则：$\sigma_{\mathrm{F1}}(\sigma_{\mathrm{F2}}(\mathrm{E})) \equiv \sigma_{\mathrm{F1} \wedge \mathrm{F2}}(\mathrm{E})$

5) $\sigma$ 和 $\Pi$ 的交换规则：$\sigma_{\mathrm{F}}(\Pi_{\mathrm{A1...An}}(\mathrm{E})) \equiv \Pi_{\mathrm{A1...An}}(\sigma_{\mathrm{F}}(\mathrm{E}))$ 如果 $\mathrm{F}$ 包含不属于 $\mathrm{A}_{1} \ldots \mathrm{A}_{n'}$ 的属性 $\mathrm{B}_{1} \ldots \mathrm{B}_{m}$，那么 $\Pi_{\mathrm{A1...An}}(\sigma_{\mathrm{F}}(\mathrm{E})) \equiv \Pi_{\mathrm{A1...An}}\sigma_{\mathrm{F}}(\Pi_{\mathrm{A1...An}}, \mathrm{B}_{1} \ldots \mathrm{B}_{m}(\mathrm{E}))$

6) 如果F中的属性都是E1中的属性，那么 $\sigma_{\mathrm{F}}(\mathrm{E}1 \times \mathrm{E}2) \equiv \sigma_{\mathrm{F}}(\mathrm{E}1) \times \mathrm{E}2$

如果 $\mathrm{F}$ 的形式为 $\mathrm{F} 1 \land \mathrm{F} 2$，并且 $\mathrm{F} 1$ 中只有 $\mathrm{E} 1^{\prime} \mathrm{s}$ 的属性，$\mathrm{F} 2$ 中只有 $\mathrm{E} 2^{\prime} \mathrm{s}$ 的属性，那么 $\sigma_{\mathrm{F}}(\mathrm{E} 1 \times \mathrm{E} 2) \equiv \sigma_{\mathrm{F} 1}(\mathrm{E} 1) \times \sigma_{\mathrm{F} 2}(\mathrm{E} 2)$

如果 $\mathrm{F}$ 的形式为 $\mathrm{F} 1 \wedge \mathrm{F} 2$，并且 $\mathrm{F} 1$ 中只有 $\mathrm{E} 1^{\prime} \mathrm{s}$ 的属性，而 $\mathrm{F} 2$ 包含 $\mathrm{E} 1$ 和 $\mathrm{E} 2$ 中的属性，那么 $\sigma_{\mathrm{F}} (\mathrm{E} 1 \times \mathrm{E} 2) \equiv \sigma_{\mathrm{F} 2} (\sigma_{\mathrm{F} 1} (\mathrm{E} 1) \times \mathrm{E} 2)$

7) $\sigma_{\mathrm{F}}(\mathrm{E}1 \cup \mathrm{E}2) \equiv \sigma_{\mathrm{F}}(\mathrm{E}1) \cup \sigma_{\mathrm{F}}(\mathrm{E}2)$

8) $\sigma_{\mathrm{F}}(\mathrm{E}1 - \mathrm{E}2) \equiv \sigma_{\mathrm{F}}(\mathrm{E}1) - \sigma_{\mathrm{F}}(\mathrm{E}2)$

假设 $A_{1} \ldots A_{n}$ 是一组属性，其中 $B_{1} \ldots B_{m}$ 是E1的属性，$C_{1} \ldots C_{k}$ 是E2的属性，那么

$$
\Pi_ {\mathrm {A 1 \ldots A n}} (\mathrm {E} 1 \times \mathrm {E} 2) \equiv \Pi_ {\mathrm {B} 1 \ldots \mathrm {B m}} (\mathrm {E} 1) \times \Pi_ {\mathrm {C} 1 \ldots \mathrm {C k}} (\mathrm {E} 2)
$$

10) $\Pi_{\mathrm{A}1\dots \mathrm{An}}(\mathrm{E}1\cup \mathrm{E}2)\equiv \Pi_{\mathrm{A}1\dots \mathrm{An}}(\mathrm{E}1)\cup \Pi_{\mathrm{A}1\dots \mathrm{An}}(\mathrm{E}2)$

```sql
SELECT S.sname
FROM Sailors S
WHERE EXISTS (SELECT * FROM Reserves R WHERE R.bid=103 AND S.sid=R.sid)
```

### 基本原则

代数优化的目标是使涉及二元操作的操作数规模尽可能小：

- 尽可能将一元操作下推
- 寻找并合并公共子表达式

### 示例

$\Pi_{\mathrm{SNUM}} \sigma_{\mathrm{AREA}} = {}^{\prime} \mathrm{NORTH}^{\prime}$ (SUPPLY $\bowtie$ DEPT)

### 4.4.3 操作优化

本节介绍如何找到"好的"访问策略来计算经过代数优化改进的查询：

- 选择操作的优化
- 投影操作的优化
- 集合操作的优化
- 连接操作的优化
- 组合操作的优化

#### 连接操作的优化

- 嵌套循环：一个关系作为外循环关系（O），另一个作为内循环关系（I）。对于O中的每个元组，扫描I一次以检查连接条件。

因为关系是以块为单位从磁盘访问的，我们可以使用块缓冲区来提高效率。对于R ≈ S，如果让R作为O，S作为I，$b_{R}$ 是R的物理块数，$b_{S}$ 是S的物理块数，系统中有 $n_{B}$ 个块缓冲区 $(n_{B} >= 2)$，$n_{B}-1$ 个缓冲区用于O，一个缓冲区用于I，那么计算R ≈ S所需的总磁盘访问次数为：

$$
\mathbf {b} _ {\mathrm {R}} + \lceil \mathbf {b} _ {\mathrm {R}} / (\mathfrak {n} _ {\mathrm {B}} - 1) \rceil \times \mathbf {b} _ {\mathrm {S}}
$$

- 归并扫描：预先在磁盘上对关系R和S排序，然后可以按顺序比较它们的元组，两个关系都只需要扫描一次。如果R和S没有预先排序，必须考虑排序成本，看是否值得使用这种方法。

- 使用索引或哈希查找映射元组：在嵌套循环方法中，如果I上有合适的访问路径（比如B+树索引），可以用它来替代顺序扫描。当连接属性上有聚簇索引或哈希时效果最好。

- 哈希连接：因为R和S的连接属性具有相同的域，R和S可以使用相同的哈希函数哈希到同一个哈希文件中，然后可以基于哈希文件计算R $\bowtie$ S。

连接操作优化的关键思想是减少I/O访问次数。

## 4.5 恢复

### 4.5.1 引言

DBMS中恢复机制的主要作用是：

(1) 降低故障发生的可能性（预防）

(2) 从故障中恢复（解决）

在发生某些故障后将数据库恢复到一致状态。

冗余是必要的。

- 应该检查所有可能的故障。

通用方法：

#### 1) 定期转储

- 变体：备份 + 增量转储

I.D --- 数据库的更新部分

这种方法易于实现且开销低，但故障发生后更新可能会丢失。因此常用于文件系统或小型DBMS。

#### 2) 备份 + 日志

日志：自上次备份副本制作以来数据库所有更改的记录。

旧值（前像 --- B.I）记录 新值（后像 --- A.I）到日志

对于更新操作：B.I A.I

插入操作：---- A.I

删除操作：B.I ----

日志故障

#### 恢复时：

- 某些事务可能只完成了一半，应该使用日志中记录的B.I撤销它们。
- 某些事务已完成但结果没有及时写入数据库，应该使用日志中记录的A.I重做它们。（完成写入数据库）

使用日志可以将数据库恢复到最近的一致状态。

### 4.5.2 事务

事务 $T$ 是对数据库操作的有限序列，具有以下特性：

- 原子性：要么全部执行，要么全部不执行。
- 一致性保持：数据库的一致状态 $\rightarrow$ 数据库的另一个一致状态。
- 隔离性：并发事务应该像彼此独立一样运行。
- 持久性：成功完成的事务的效果永久反映在数据库中，即使后来发生故障也可以恢复。

#### 示例：将金额s从账户A转移到账户B

开始事务

读取A

A:=A-s

如果A<0则显示"资金不足"

回滚 /*撤销并终止 */

否则 $\mathrm{B} : = \mathrm{B} + \mathrm{s}$

显示"转账完成"

提交 /*提交更新并终止 */

回滚 --- 异常终止。（不执行）

提交 --- 正常终止。（全部执行）

### 4.5.3 支持恢复的一些结构

恢复信息（如日志）应存储在非易失性存储中。为了支持恢复，需要存储以下信息：

1) 提交列表：已提交的TID列表。

2) 活动列表：正在进行的TID列表。

3) Log

### 4.5.4 提交规则和日志先行规则

#### 1) 提交规则

A.I必须在事务提交之前写入非易失性存储。

#### 2) 日志先行规则

如果A.I在提交之前写入数据库，则B.I必须首先写入日志。

#### 3) 恢复策略

(1) undo和redo的特性（是幂等的）：

$$
\begin{array}{l} \operatorname {u n d o} (\operatorname {u n d o} (\operatorname {u n d o} - - - \operatorname {u n d o} (x) - - -)) = \operatorname {u n d o} (x) \\ \operatorname {r e d o} (\operatorname {r e d o} (\operatorname {r e d o} - - - \operatorname {r e d o} (x) - - -)) = \operatorname {r e d o} (x) \\ \end{array}
$$

#### (2) 三种更新策略

**a) A.I $\rightarrow$ DB在提交之前**

TID $\rightarrow$ 活动列表

B.I $\rightarrow$ 日志（日志先行规则）

A.I $\rightarrow$ DB

TID $\rightarrow$ 提交列表 提交 从活动列表中删除TID

##### 这种情况下故障后的恢复

故障后重启时，对每个TID检查两个列表：

<table><tr><td>提交列表</td><td>活动列表</td><td></td></tr><tr><td></td><td>✓</td><td>Undo，从活动列表中删除TID</td></tr><tr><td>✓</td><td>✓</td><td>从活动列表中删除TID</td></tr><tr><td>✓</td><td></td><td>无需操作</td></tr></table>

**b) A.I $\rightarrow$ DB在提交之后**

TID $\rightarrow$ 活动列表

A.I $\rightarrow$ Log

TID $\rightarrow$ 提交列表 提交

A.I $\rightarrow$ DB 从活动列表中删除TID

##### 这种情况下故障后的恢复

故障后重启时，对每个TID检查两个列表：

<table><tr><td>提交列表</td><td>活动列表</td><td></td></tr><tr><td></td><td>✓</td><td>从活动列表中删除TID</td></tr><tr><td>✓</td><td>✓</td><td>redo，从活动列表中删除TID</td></tr><tr><td>✓</td><td></td><td>无需操作</td></tr></table>

**c) A.I $\rightarrow$ DB与提交并发** 

TID $\rightarrow$ 活动列表

A.I, B.I $\rightarrow$ 日志（两个规则）

A.I $\rightarrow$ DB（部分完成）

TID $\rightarrow$ 提交列表 

A.I $\rightarrow$ DB（完成）

从活动列表中删除TID

##### 这种情况下故障后的恢复

故障后重启时，对每个TID检查两个列表：

<table><tr><td>提交列表</td><td>活动列表</td><td></td></tr><tr><td></td><td>✓</td><td>Undo，从活动列表中删除TID</td></tr><tr><td>✓</td><td>✓</td><td>redo，从活动列表中删除TID</td></tr><tr><td>✓</td><td></td><td>无需操作</td></tr></table>

#### 结论

<table><tr><td></td><td>redo</td><td>undo</td></tr><tr><td>a)</td><td>×</td><td>✓</td></tr><tr><td>b)</td><td>✓</td><td>×</td></tr><tr><td>c)</td><td>✓</td><td>✓</td></tr><tr><td>d)</td><td>×</td><td>×</td></tr></table>

## 4.6 并发控制

### 4.6.1 引言

在多用户DBMS中，允许多个事务并发访问数据库。

为什么需要并发？

1) 提高系统利用率和响应时间。

2) 不同事务可能访问数据库的不同部分。

并发执行产生的问题

<table><tr><td rowspan="6">t</td><td>T1</td><td>T2</td><td>T1</td><td>T2</td><td>T1</td><td>T2</td></tr><tr><td>Read(x)</td><td></td><td></td><td>Read(t[x])</td><td>Read(x)</td><td></td></tr><tr><td></td><td>Read(x)</td><td>Write(t)</td><td></td><td></td><td>Write(x)</td></tr><tr><td>x:=x+1</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Write(x)</td><td>x:=2*x</td><td></td><td>Read(t[y])</td><td>Read(x)</td><td></td></tr><tr><td></td><td>Write(x)</td><td>(rollback)</td><td></td><td></td><td></td></tr><tr><td colspan="3">丢失更新</td><td colspan="2">脏读</td><td colspan="2">不可重复读</td></tr></table>

因此，当事务并发执行时可能存在三种冲突。它们是写-写、写-读和读-写冲突。**写-写冲突必须始终避免。写-读和读-写冲突通常应该避免，但在某些应用中是可以容忍的。**

### 4.6.2 可串行化 --- 并发一致性的标准

定义：假设 $\{\mathrm{T}_1,\mathrm{T}_2,\dots \mathrm{T}_n\}$ 是一组并发执行的事务。如果 $\{\mathrm{T}_1,\mathrm{T}_2,\dots \mathrm{T}_n\}$ 的某个调度对数据库产生的效果与这组事务的某个串行执行相同，则该调度是可串行化的。

问题：不同的调度 $\rightarrow$ 不同的等价串行执行 $\rightarrow$ 不同的结果？（是的，n!）

<table><tr><td>T_A</td><td>T_B</td><td>T_C</td><td>此调度的结果</td></tr><tr><td colspan="2">Read R1</td><td colspan="2">与串行执行相同</td></tr><tr><td>Read R2</td><td>Write R1</td><td colspan="2">执行T_A → T_B → T_C，所以它是可串行化的。等价的</td></tr><tr><td colspan="2">Write R2</td><td colspan="2">串行执行是T_A → T_B → T_C。</td></tr></table>

### 4.6.3 锁协议

锁方法是最基本的并发控制方法。可能有许多种锁协议。

#### (1) X锁

只有一种类型的锁，用于读和写。

兼容性矩阵：NL-无锁 X-X锁

Y-兼容 N-不兼容

<table><tr><td></td><td>NL</td><td>X</td></tr><tr><td>NL</td><td>Y</td><td>Y</td></tr><tr><td>X</td><td>Y</td><td>N</td></tr></table>

TA

X_lock R

Update R

X_unlockR

EOT

TB X_lock R wait X_lock R Read R

#### *两阶段锁

- **定义1：在一个事务中，如果所有加锁都在所有解锁之前，则该事务称为两阶段事务。这种限制称为两阶段锁协议。**

定义2：在一个事务中，如果它在操作对象之前首先获取该对象上的锁，则称为合式的。

定理：如果S是任何合式的两阶段事务的调度，则S是可串行化的。（证明省略）

T1

增长阶段 Lock A Lock B Lock C

收缩阶段 Unlock B Unlock C 2PL

$\mathrm{T}_{2}$ Lock A Lock B Unlock A Unlock B Lock C Unlock C 不是2PL

- **定义1：在一个事务中，如果所有加锁都在所有解锁之前，则该事务称为两阶段事务。这种限制称为两阶段锁协议。（一个事务的加锁动作都在所有释放锁动作之前）**

定义2：在一个事务中，如果它在操作对象之前首先获取该对象上的锁，则称为合式的。（如果一个事务遵循"先加锁，后操作"的原则，则称"well-formed合式"的）

#### 结论

1) 合式 + 2PL：可串行化

2) 合式 + 2PL + 在EOT释放更新锁：可串行化且可恢复。（无多米诺现象）

3) 合式 $+2 \mathrm{PL}+$ 持有所有锁到EOT：严格两阶段锁事务。

#### (2) $(S, X)$ 锁

S锁 --- 如果打算进行读访问。

X锁 --- 如果打算进行更新访问。

<table><tr><td></td><td>NL</td><td>S</td><td>X</td></tr><tr><td>NL</td><td>Y</td><td>Y</td><td>Y</td></tr><tr><td>S</td><td>Y</td><td>Y</td><td>N</td></tr><tr><td>X</td><td>Y</td><td>N</td><td>N</td></tr></table>

#### 结论

合式 + 2PL + 在EOT释放更新锁：可串行化且可恢复。（无多米诺现象）

注: EOT (End of Transaction，事务结束)

一个事务中，对带更新操作的锁在事务结束的时候（即EOT）才释放，那么不仅可串行化还可恢复（不会引起多米诺效应）。

合式 + 2PL + 持有所有锁到EOT：严格两阶段锁事务。

所有的锁都在事务结束的时候才释放。

#### 多米诺现象

由于 "Write b" 这一带更新操作的锁并没有在事务结束的时候（即EOT）释放。若事务（如T1）在锁释放之后发现问题（如写入的b发生错误），而这时由于锁已经释放，后续的事务（如T2,T3）根据b做的操作发生连锁错误，即多米诺效应。

#### 结论

1) 合式 + 2PL：可串行化

2) 合式 + 2PL + 在EOT释放更新锁：可串行化且可恢复。（无多米诺现象）

3) 合式 $+2 \mathrm{PL}+$ 持有所有锁到EOT：严格两阶段锁事务。

#### (3) (S,U,X) 锁

U锁 --- 更新锁。对于更新访问，事务首先获取U锁，然后将其提升为X锁。

目的：缩短排他时间，从而提高并发度，并减少死锁。

<table><tr><td></td><td>NL</td><td>S</td><td>U</td><td>X</td></tr><tr><td>NL</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td></tr><tr><td>S</td><td>Y</td><td>Y</td><td>Y</td><td>N</td></tr><tr><td>U</td><td>Y</td><td>Y</td><td>N</td><td>N</td></tr><tr><td>X</td><td>Y</td><td>N</td><td>N</td><td>N</td></tr></table>

### 4.6.4 死锁和活锁

死锁：循环等待，没有事务能够获得完成所需的所有资源。

活锁：尽管其他事务在有限时间内释放其资源，但某些事务在很长一段时间内无法获得所需的资源。

活锁更简单，只需要调整调度策略，如FIFO

死锁：(1) 预防（不让它发生）；(2) 解决（允许它发生，但可以解决）

#### (1) 死锁检测

1) 超时：如果事务等待某个指定时间，则假定发生死锁，应该中止该事务。

2) 通过等待图 $G = \langle V, E \rangle$ 检测死锁

V：事务集合 $\{T_i \mid T_i$ 是DBS中的事务 $(i = 1, 2, \ldots, n) \}$

E：$\{<T_i, T_j|T_i \text{ 等待 } T_j (i \neq j)\}$

如果图中存在环，则发生死锁。

何时检测？

1) 每当一个事务等待时。

2) 定期检测

检测到后做什么？

- 选择一个牺牲者（最年轻的、中止成本最小的，...）
- 中止牺牲者并释放其锁和资源
- 授予等待者
- 重启牺牲者（自动或手动）

#### (2) 死锁避免

1) 在事务初始时请求所有锁。

2) 按资源的指定顺序请求锁。

3) 一旦冲突就中止。

4) 事务重试

每个事务都有唯一的时间戳。如果 $\mathrm{T}_{\mathrm{A}}$ 请求一个已被 $\mathrm{T}_{\mathrm{B}}$ 锁定的数据对象上的锁，则使用以下方法之一：

a) 等待-死亡：如果 $T_{A}$ 比 $T_{B}$ 更老，则等待，否则它"死亡"，即被中止并自动以原始时间戳重试。

b) 伤害-等待：如果 $T_{A}$ 比 $T_{B}$ 更年轻，则等待，否则它"伤害" $T_{B}$，即 $T_{B}$ 被中止并自动以原始时间戳重试。

在上述两种方法中，都只有一个方向的等待，要么更老 $\rightarrow$ 更年轻，要么更年轻 $\rightarrow$ 更老。不可能出现循环等待，因此避免了死锁。

