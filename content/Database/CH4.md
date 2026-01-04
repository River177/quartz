# 4. Database Management Systems

## Contents

The Architecture of DBMS

The components of DBMS core

The process structure of DBMS

- Database Access Management
- Query Optimization
- Transaction Management
- Concurrent Control
- Recovery

## 4.1 The Components of DBMS Core

## 4.2 The Process Structure of DBMS

Single process structure

Multi processes structure

Multi threads structure

- Communication protocols between processes / threads

### Single process structure

- The application program is compiled with DBMS core as a single .exe file, running as a single process.

### Multi processes structure

One application process corresponding to one DBMS core process

### Multi threads structure

- Only one DBMS process, every application process corresponding to a DBMS core thread.

## 4.3 Database Access Management

The access to database is transferred to the operations on files (of OS) eventually. The file structure and access route offered on it will affect the speed of data access directly. It is impossible that one kind of file structure will be effective for all kinds of data access.

- Access types
- File organization
- Index technique

### Access Types

Query all or most records of a file (>15%)

- Query some special record
- Query some records (<15%)
- Scope query
- Update

### File Organization

- Heap file: records stored according to their inserted order, and retrieved sequentially. This is the most basic and general form of file organization.
- Direct file: the record address is mapped through hash function according to some attribute's value.
- Dynamic hashing
- Indexed file: index + heap file/cluster
- Grid structure file: suitable for multi attributes queries
- Raw disk (notice the difference between the logical block and physical block of file. You can control physical blocks in OS by using raw disk)

### Index Technique

B+ Tree (√ √)

- Clustering index $(\sqrt{})$
- Inverted file
- Dynamic hashing
- Grid structure file and partitioned hash function
- **Bitmap index (used in data warehouse)**
- Others

## 4.4 Query Optimization

"Rewrite" the query statements submitted by user first, and then decide the most effective operating method and steps to get the result. The goal is to gain the result of user's query with the lowest cost and in shortest time.

### 4.4.1 Summary of Query Optimization

- Algebra Optimization
- Operation Optimization

### Example

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

### After equivalent transform (Algebra optimization):

$$
\Pi 1 = \Pi (\mathrm {S . S N U M}, \mathrm {S . S N A M E})
$$

$$
\Pi 2 = \Pi (\mathrm {S P . S N U M}, \mathrm {S P . P N U M})
$$

$$
\Pi 3 = \Pi (\mathrm {P . P N U M})
$$

### The operation optimization of the tree

- Decide the order of two joins
- For every join operation, there are many computing method:

The goal of query optimization is to select a "good" solution from so many possible execution strategies through cost estimation. So it is a complex task.

### 4.4.2 The Equivalent Transform of a Query

That is so called algebra optimization. It takes a series of transform on original query expression, and transform it into an equivalent, most effective form to be executed.

#### (1) Query tree

#### (2) The equivalent transform rules of relational algebra

1) Exchange rule of $\rtimes / \times$ : E1 $\times$ E2 $\equiv$ E2 $\times$ E1

2) Combination rule of $\bowtie / \times$ : E1×(E2×E3)≡(E1×E2)×E3

3) Cluster rule of $\Pi$ : $\Pi_{\mathrm{A1...An}}(\Pi_{\mathrm{B1...Bm}}(\mathrm{E})) \equiv \Pi_{\mathrm{A1...An}}(\mathrm{E})$ , legal when $\mathrm{A}_1 \ldots \mathrm{A}_n$ is the sub set of $\{\mathrm{B}_1 \ldots \mathrm{B}_m\}$

4) Cluster rule of $\sigma$ : $\sigma_{\mathrm{F1}}(\sigma_{\mathrm{F2}}(\mathrm{E})) \equiv \sigma_{\mathrm{F1} \wedge \mathrm{F2}}(\mathrm{E})$

5) Exchange rule of $\sigma$ and $\Pi$ : $\sigma_{\mathrm{F}}(\Pi_{\mathrm{A1...An}}(\mathrm{E})) \equiv \Pi_{\mathrm{A1...An}}(\sigma_{\mathrm{F}}(\mathrm{E}))$ if $\mathrm{F}$ includes attributes $\mathrm{B}_{1} \ldots \mathrm{B}_{m}$ which don't belong to $\mathrm{A}_{1} \ldots \mathrm{A}_{n'}$ then $\Pi_{\mathrm{A1...An}}(\sigma_{\mathrm{F}}(\mathrm{E})) \equiv \Pi_{\mathrm{A1...An}}\sigma_{\mathrm{F}}(\Pi_{\mathrm{A1...An}}, \mathrm{B}_{1} \ldots \mathrm{B}_{m}(\mathrm{E}))$

6) If the attributes in F are all the attributes in E1, then $\sigma_{\mathrm{F}}(\mathrm{E}1 \times \mathrm{E}2) \equiv \sigma_{\mathrm{F}}(\mathrm{E}1) \times \mathrm{E}2$

if $\mathrm{F}$ in the form of $\mathrm{F} 1 \land \mathrm{F} 2$ , and there are only $\mathrm{E} 1^{\prime} \mathrm{s}$ attributes in $\mathrm{F} 1$ , and there are only $\mathrm{E} 2^{\prime} \mathrm{s}$ attributes in $\mathrm{F} 2$ , then $\sigma_{\mathrm{F}}(\mathrm{E} 1 \times \mathrm{E} 2) \equiv \sigma_{\mathrm{F} 1}(\mathrm{E} 1) \times \sigma_{\mathrm{F} 2}(\mathrm{E} 2)$

if $\mathrm{F}$ in the form of $\mathrm{F} 1 \wedge \mathrm{F} 2$ , and there are only $\mathrm{E} 1^{\prime} \mathrm{s}$ attributes in $\mathrm{F} 1$ , while $\mathrm{F} 2$ includes the attributes both in $\mathrm{E} 1$ and $\mathrm{E} 2$ , then $\sigma_{\mathrm{F}} (\mathrm{E} 1 \times \mathrm{E} 2) \equiv \sigma_{\mathrm{F} 2} (\sigma_{\mathrm{F} 1} (\mathrm{E} 1) \times \mathrm{E} 2)$

7) $\sigma_{\mathrm{F}}(\mathrm{E}1 \cup \mathrm{E}2) \equiv \sigma_{\mathrm{F}}(\mathrm{E}1) \cup \sigma_{\mathrm{F}}(\mathrm{E}2)$

8) $\sigma_{\mathrm{F}}(\mathrm{E}1 - \mathrm{E}2) \equiv \sigma_{\mathrm{F}}(\mathrm{E}1) - \sigma_{\mathrm{F}}(\mathrm{E}2)$

Suppose $A_{1} \ldots A_{n}$ is a set of attributes, in which $B_{1} \ldots B_{m}$ are E1's attributes, and $C_{1} \ldots C_{k}$ are E2's attributes, then

$$
\Pi_ {\mathrm {A 1 \ldots A n}} (\mathrm {E} 1 \times \mathrm {E} 2) \equiv \Pi_ {\mathrm {B} 1 \ldots \mathrm {B m}} (\mathrm {E} 1) \times \Pi_ {\mathrm {C} 1 \ldots \mathrm {C k}} (\mathrm {E} 2)
$$

10) $\Pi_{\mathrm{A}1\dots \mathrm{An}}(\mathrm{E}1\cup \mathrm{E}2)\equiv \Pi_{\mathrm{A}1\dots \mathrm{An}}(\mathrm{E}1)\cup \Pi_{\mathrm{A}1\dots \mathrm{An}}(\mathrm{E}2)$

```sql
SELECT S.sname
FROM Sailors S
WHERE EXISTS (SELECT * FROM Reserves R WHERE R.bid=103 AND S.sid=R.sid)
```

### Basic principles

The target of algebra optimization is to make the scale of the operands which involved in binary operations be as small as possible :

- Push down the unary operations as low as possible
- Look for and combine the common sub-expression

### Example

$\Pi_{\mathrm{SNUM}} \sigma_{\mathrm{AREA}} = {}^{\prime} \mathrm{NORTH}^{\prime}$ (SUPPLY $\bowtie$ DEPT)

### 4.4.3 The Operation Optimization

How to find a "good" access strategy to compute the query improved by algebra optimization is introduced in this section:

- Optimization of select operation
- Optimization of project operation
- Optimization of set operation
- Optimization of join operation
- Optimization of combined operations

#### Optimization of join operation

- Nested loop: one relation acts as outer loop relation (O), the other acts as inner loop relation (I). For every tuple in O, scan I one time to check join condition.

Because the relation is accessed from disk in the unit of block, we can use block buffer to improve efficiency. For R ≈ S, if let R as O, S as I, $b_{R}$ is physical block number of R, $b_{S}$ is physical block number of S, there are $n_{B}$ block buffers in system $(n_{B} >= 2)$ , and $n_{B}-1$ buffers used for O, one buffer used for I, then the total disk access times needed to compute R ≈ S is:

$$
\mathbf {b} _ {\mathrm {R}} + \lceil \mathbf {b} _ {\mathrm {R}} / (\mathfrak {n} _ {\mathrm {B}} - 1) \rceil \times \mathbf {b} _ {\mathrm {S}}
$$

- Merge scan: order the relation R and S on disk in ahead, then we can compare their tuples in order, and both relation only need to scan one time. If R and S have not ordered in ahead, must consider the ordering cost to see if it is worth to use this method.

- Using index or hash to look for mapping tuples: in nested loop method, if there is suitable access route on I (say B+ tree index), it can be used to substitute sequence scan. It is best when there is cluster index or hash on join attributes.

- Hash join: because the join attributes of R and S have the same domain, R and S can be hashed into the same hash file using the same hash function, then R $\bowtie$ S can be computed based on the hash file.

The key idea of the Optimization of join operation is reducing the I/O access times.

## 4.5 Recovery

### 4.5.1 Introduction

The main roles of recovery mechanism in DBMS are:

(1) Reducing the likelihood of failures (prevention)

(2) Recover from failures (solving)

Restore DB to a consistent state after some failures.

Redundancy is necessary.

- Should inspect all possible failures.

General method:

#### 1) Periodical dumping

- Variation: Backup + Incremental dumping

I.D --- updated parts of DB

This method is easy to be implemented and the overhead is low, but the update maybe lost after failure occurring. So it is often used in file system or small DBMS.

#### 2) Backup + Log

Log : record of all changes on DB since the last backup copy was made.

Old value (Before Image --- B.I) Recorded New value (After Image --- A.I) into Log

For update op.: B.I A.I

insert op. : ---- A.I

delete op. : B.I ----

Log failure

#### While recovering:

- Some transactions maybe half done, should undo them with B.I recorded in Log.
- Some transactions have finished but the results have not been written into DB in time, should redo them with A.I recorded in Log. (finish writing into DB)

It is possible to recover DB to the most recent consistent state with Log.

### 4.5.2 Transaction

A transaction $T$ is a finite sequence of actions on DB exhibiting the following effects:

- Atomic action: Nothing or All.
- Consistency preservation: consistency state of DB $\rightarrow$ another consistency state of DB.
- Isolation: concurrent transactions should run as if they are independent each other.
- Durability: The effects of a successfully completed transaction are permanently reflected in DB and recoverable even failure occurs later.

#### Example: transfer money s from account A to account B

Begin transaction

read A

A:=A-s

if A<0 then Display "insufficient fund"

Rollback /*undo and terminate */

else $\mathrm{B} : = \mathrm{B} + \mathrm{s}$

Display "transfer complete"

Commit /*commit the update and terminate */

Rollback --- abnormal termination. (Nothing)

Commit --- normal termination. (All)

### 4.5.3 Some Structures to Support Recovery

Recovery information (such as Log) should be stored in nonvolatile storage. The following information need to be stored in order to support recovery:

1) Commit list : list of TID which have been committed.

2) Active list : list of TID which is in progress.

3) $\log :$

### 4.5.4 Commit Rule and Log Ahead Rule

#### 1) Commit Rule

A.I must be written to nonvolatile storage before commit of the transaction.

#### 2) Log Ahead Rule

If A.I is written to DB before commit then B.I must first written to log.

#### 3) Recovery strategies

(1) The features of undo and redo (are idempotent):

$$
\begin{array}{l} \operatorname {u n d o} (\operatorname {u n d o} (\operatorname {u n d o} - - - \operatorname {u n d o} (x) - - -)) = \operatorname {u n d o} (x) \\ \operatorname {r e d o} (\operatorname {r e d o} (\operatorname {r e d o} - - - \operatorname {r e d o} (x) - - -)) = \operatorname {r e d o} (x) \\ \end{array}
$$

#### (2) Three kinds of update strategy

a) A.I $\rightarrow$ DB before commit

TID $\rightarrow$ active list

B.I $\rightarrow$ Log (Log Ahead Rule) A.I $\rightarrow$ DB

TID $\rightarrow$ commit list commit delete TID from active list

##### The recovery after failure in this situation

Check two lists for every TID while restarting after failure:

<table><tr><td>Commit list</td><td>Active list</td><td></td></tr><tr><td></td><td>✓</td><td>Undo, delete TID from active list</td></tr><tr><td>✓</td><td>✓</td><td>delete TID from active list</td></tr><tr><td>✓</td><td></td><td>nothing to do</td></tr></table>

b) A.I $\rightarrow$ DB after commit

TID $\rightarrow$ active list

$\left\{ \begin{array}{l} \mathrm{A.I} \rightarrow \mathrm{Log} \\ \end{array} \right.$ (Commit Rule)

：

TID $\rightarrow$ commit list commit{ A.I $\rightarrow$ DB delete TID from active list

##### The recovery after failure in this situation

Check two lists for every TID while restarting after failure:

<table><tr><td>Commit list</td><td>Active list</td><td></td></tr><tr><td></td><td>✓</td><td>delete TID from active list</td></tr><tr><td>✓</td><td>✓</td><td>redo, delete TID from active list</td></tr><tr><td>✓</td><td></td><td>nothing to do</td></tr></table>

c) A.I $\rightarrow$ DB concurrently with commit TID $\rightarrow$ active list

(A.I, B.I $\rightarrow$ Log (Two Rules) A.I $\rightarrow$ DB (partially done)

TID $\rightarrow$ commit list commit{ A.I $\rightarrow$ DB (completed) delete TID from active list

##### The recovery after failure in this situation

Check two lists for every TID while restarting after failure:

<table><tr><td>Commit list</td><td>Active list</td><td></td></tr><tr><td></td><td>✓</td><td>Undo, delete TID from active list</td></tr><tr><td>✓</td><td>✓</td><td>redo, delete TID from active list</td></tr><tr><td>✓</td><td></td><td>nothing to do</td></tr></table>

#### Conclusion

<table><tr><td></td><td>redo</td><td>undo</td></tr><tr><td>a)</td><td>×</td><td>✓</td></tr><tr><td>b)</td><td>✓</td><td>×</td></tr><tr><td>c)</td><td>✓</td><td>✓</td></tr><tr><td>d)</td><td>×</td><td>×</td></tr></table>

## 4.6 Concurrency Control

### 4.6.1 Introduction

In multi users DBMS, permit multi transaction access the database concurrently.

Why concurrency?

1) Improving system utilization & response time.

2) Different transaction may access to different parts of database.

Problems arise from concurrent executions

<table><tr><td rowspan="6">t</td><td>T1</td><td>T2</td><td>T1</td><td>T2</td><td>T1</td><td>T2</td></tr><tr><td>Read(x)</td><td></td><td></td><td>Read(t[x])</td><td>Read(x)</td><td></td></tr><tr><td></td><td>Read(x)</td><td>Write(t)</td><td></td><td></td><td>Write(x)</td></tr><tr><td>x:=x+1</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Write(x)</td><td>x:=2*x</td><td></td><td>Read(t[y])</td><td>Read(x)</td><td></td></tr><tr><td></td><td>Write(x)</td><td>(rollback)</td><td></td><td></td><td></td></tr><tr><td colspan="3">Lost update</td><td colspan="2">Dirty read</td><td colspan="2">Unrepeatable read</td></tr></table>

So there maybe three kinds of conflict when transactions execute concurrently. They are write - write, write - read, and read - write conflicts. Write - write conflict must be avoided anytime. Write - read and read - write conflicts should be avoided generally, but they are endurable in some applications.

### 4.6.2 serialization --- the criterion for concurrency consistency

Definition: suppose $\{\mathrm{T}_1,\mathrm{T}_2,\dots \mathrm{T}_n\}$ is a set of transactions executing concurrently. If a schedule of $\{\mathrm{T}_1,\mathrm{T}_2,\dots \mathrm{T}_n\}$ produces the same effect on database as some serial execution of this set of transactions, then the schedule is serializable.

Problem: different schedule $\rightarrow$ different equivalent serial execution $\rightarrow$ different result? (yes, n!)

<table><tr><td>T_A</td><td>T_B</td><td>T_C</td><td>The result of this schedule</td></tr><tr><td colspan="2">Read R1</td><td colspan="2">is the same as serial</td></tr><tr><td>Read R2</td><td>Write R1</td><td colspan="2">execution T_A → T_B → T_C, so it is serializable. The</td></tr><tr><td colspan="2">Write R2</td><td colspan="2">equivalent serial execution is T_A → T_B → T_C.</td></tr></table>

### 4.6.3 Locking Protocol

Locking method is the most basic concurrency control method. There maybe many kinds of locking protocols.

#### (1) X locks

Only one type of lock, for both read and write.

Compatibility matrix : NL- no lock X-X lock

Y -compatible N-incompatible

<table><tr><td></td><td>NL</td><td>X</td></tr><tr><td>NL</td><td>Y</td><td>Y</td></tr><tr><td>X</td><td>Y</td><td>N</td></tr></table>

TA

X_lock R

Update R

X_unlockR

EOT

TB X_lock R wait X_lock R Read R

#### *Two Phase Locking

- **Definition1: In a transaction, if all locks precede all unlocks, then the transaction is called two phase transaction. This restriction is called two phase locking protocol.**

Definition2: In a transaction, if it first acquires a lock on the object before operating on it, it is called well-formed.

Theorem: If S is any schedule of well-formed and two phase transactions, then S is serializable. (proving is omitted)

T1

Growth A Lock A

phase Lock B Lock C

ShrinkingA Unlock B

phase Unlock C 2PL

$\mathrm{T}_{2}$ Lock A Lock B Unlock A Unlock B Lock C Unlock C not 2PL

- **Definition1: In a transaction, if all locks precede all unlocks, then the transaction is called two phase transaction. This restriction is called two phase locking protocol.（一个事务的加锁动作都在所有释放锁动作之前）**

Definition2: In a transaction, if it first acquires a lock on the object before operating on it, it is called well-formed. (如果一个事务遵循"先加锁，后操作"的原则，则称"well-formed合式"的)

#### Conclusions

1) Well-formed + 2PL : serializable

2) Well-formed + 2PL + unlock update at EOT: serialize and recoverable. (without domino phenomena)

3) Well-formed $+2 \mathrm{PL}+$ holding all locks to EOT: strict two phase locking transaction.

#### (2) $(S, X)$ locks

S lock --- if read access is intended.

X lock --- if update access is intended.

<table><tr><td></td><td>NL</td><td>S</td><td>X</td></tr><tr><td>NL</td><td>Y</td><td>Y</td><td>Y</td></tr><tr><td>S</td><td>Y</td><td>Y</td><td>N</td></tr><tr><td>X</td><td>Y</td><td>N</td><td>N</td></tr></table>

#### Conclusions

Well-formed + 2PL + unlock update at EOT: serializable and recoverable. (without domino phenomena)

注: EOT (End of Time)

一个事务中，对带更新操作的锁在事务结束的时候（即EOT）才释放，那么不仅可串行化还可恢复（不会引起多米诺效应）。

Well-formed + 2PL + holding all locks to EOT: strict two phase locking transaction.

所有的锁都在事务结束的时候才释放。

#### Domino Phenomena

由于 "Write b" 这一带更新操作的锁并没有在事务结束的时候（即EOT）释放。若事务（如T1）在锁释放之后发现问题（如写入的b发生错误），而这时由于锁已经释放，后续的事务（如T2,T3）根据b做的操作发生连锁错误，即多米诺效应。

#### Conclusions

1) Well-formed + 2PL : serializable

2) Well-formed + 2PL + unlock update at EOT: serializable and recoverable. (without domino phenomena)

3) Well-formed $+2 \mathrm{PL}+$ holding all locks to EOT: strict two phase locking transaction.

#### (3) (S,U,X) locks

U lock --- update lock. For an update access the transaction first acquires a U-lock and then promote it to X-lock.

Purpose: shorten the time of exclusion, so as to boost concurrency degree, and reduce deadlock.

<table><tr><td></td><td>NL</td><td>S</td><td>U</td><td>X</td></tr><tr><td>NL</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td></tr><tr><td>S</td><td>Y</td><td>Y</td><td>Y</td><td>N</td></tr><tr><td>U</td><td>Y</td><td>Y</td><td>N</td><td>N</td></tr><tr><td>X</td><td>Y</td><td>N</td><td>N</td><td>N</td></tr></table>

### 4.6.4 Deadlock & Live Lock

Dead lock: wait in cycle, no transaction can obtain all of resources needed to complete.

Live lock: although other transactions release their resource in limited time, some transaction can not get the resources needed for a very long time.

Live lock is simpler, only need to adjust schedule strategy, such as FIFO

Deadlock: (1) Prevention(don't let it occur); (2) Solving(permit it occurs, but can solve it)

#### (1) Deadlock Detection

1) Timeout: If a transaction waits for some specified time then deadlock is assumed and the transaction should be aborted.

2) Detect deadlock by wait-for graph $G = \langle V, E \rangle$

V: set of transactions $\{T_i \mid T_i$ is a transaction in DBS $(i = 1, 2, \ldots, n) \}$

E: $\{<T_i, T_j|T_i \text{ waits for } T_j (i \neq j)\}$

If there is cycle in the graph, the deadlock occurs.

When to detect?

1) whenever one transaction waits.

2) periodically

What to do when detected?

- Pick a victim (youngest, minimum abort cost, ...)
- Abort the victim and release its locks and resources
- Grant a waiter
- Restart the victim (automatically or manually)

#### (2) Deadlock avoidance

1) Requesting all locks at initial time of transaction.

2) Requesting locks in a specified order of resource.

3) Abort once conflicted.

4) Transaction Retry

Every transaction is uniquely time stamped. If $\mathrm{T}_{\mathrm{A}}$ requires a lock on a data object that is already locked by $\mathrm{T}_{\mathrm{B}}$ , one of the following methods is used:

a) Wait-die: $T_{A}$ waits if it is older than $T_{B}$ , otherwise it "dies", i.e. it is aborted and automatically retracted with original timestamp.

b) Wound-wait: $T_{A}$ waits if it is younger than $T_{B}$ , otherwise it "wound" $T_{B}$ , i.e. $T_{B}$ is aborted and automatically retracted with original timestamp.

In above, both have only one direction wait, either older $\rightarrow$ younger or younger $\rightarrow$ older. It is impossible to occur wait in cycle, so the dead lock is avoided.

