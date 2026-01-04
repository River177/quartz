# 5. The Security and Integrity Constraints

## 5.1 Introduction

The destruction of database is generally caused by the following factors:

- System failure
- Inconsistency caused by concurrent access
- Man-caused destruction (intentionally or accidentally)
- The data inputted is incorrect, the updating transaction didn't obey the rule of consistency preservation

In above factors, 1 and 2 should be resolved by recovery mechanism of DBMS (Chapter 4); 3 belongs to database security; 4 belongs to integrity constraints

## 5.2 Security of Database

- Protect databases not be accessed illegally.

### Access control

- General user
- User with resource privilege
- DBA

### Identification and authentication of users

- Password
- Special articles, such as key, IC card, etc.
- Personal features, such as fingerprint, signature, etc.

### Authorization

- GRANT CONNECT TO JOHN IDENTIFIED BY xyzabc;
- GRANT SELECT ON TABLES TO U1 WITH GRANT OPTION;

### Role

### Data encryption

### Audit trail

- AUDIT SELECT, INSERT, DELETE, UPDATE ON emp WHENEVER SUCCESSFUL;

### View and query rewriting

## 5.3 Security of Statistical Database

In many situations, the statistical data is public while the detailed individual data is secret. Public statistical database.

- But some detailed individual data can be derived from public statistical data

How prevent this leak? --- not an easy thing

### Individual Tracker

- Suppose we know Wang is a male programmer, and salary in STATS is secret but other information is public, we can get wang's salary from public data.

```sql
Q1: SELECT COUNT(*) FROM STATS WHERE SEX='M' AND OCCUPATION='programmer';
-- result = 1

Q2: SELECT SUM(SALARY) FROM STATS WHERE SEX='M' AND OCCUPATION='programmer';
-- result = 120
```

#### Individual Tracker $(c > b, b = 2)$

```sql
Q3: SELECT COUNT(*)
FROM STATs;
-- result = 10

Q4: SELECT COUNT(*)
FROM STATS
WHERE NOT(SEX='M' AND OCCUPATION='programmer');
-- result = 9
```

Now we know only one male programmer, that must be Wang.

```sql
Q5: SELECT SUM(SALARY)
FROM STATs;
-- result = 1420

Q6: SELECT SUM(SALARY)
FROM STATS
WHERE NOT(SEX='M' AND OCCUPATION='programmer');
-- result = 1300
```

Wang's salary = Q5 - Q6 = 120

#### Individual Tracker (b<c<n-b, b=2, n is 10)

```sql
Q7: SELECT COUNT(*)
FROM STATS
WHERE SEX = 'M';
-- result = 4

Q8: SELECT COUNT(*)
FROM STATS
WHERE SEX='M' AND NOT(OCCUPATION='programmer');
-- result = 3
```

Now we know only one male programmer, that must be Wang.

```sql
Q9: SELECT SUM(SALARY)
FROM STATS
WHERE SEX = 'M';
-- result = 520

Q10: SELECT SUM(SALARY)
FROM STATS
WHERE SEX='M' AND NOT(OCCUPATION='programmer');
-- result = 400
```

Wang's salary = Q9 - Q10 = 120

### General Tracker

Suppose predicate $p = {p}_{1}$ and ${p}_{2}$ ,SET(p) is set of tuples which fulfill $p$ ,then

$$
\Rightarrow \operatorname{SET}(p) = \operatorname{SET}(p_{1} \text{ and } p_{2}) = \operatorname{SET}(p_{1}) - \operatorname{SET}(p_{1} \text{ and not } p_{2})
$$

It is a predicate $T$ which fulfill:

$$
2 \mathrm {b} \leq | \operatorname {S E T} (T) | \leq (\mathrm {n - 2 b}), \mathrm {b <   n / 4}
$$

Suppose a tuple $R$ can be limited uniquely by predicate $p$ , that is $\operatorname{SET}(p) = \{R\}$ , then

$$
\mathrm {S E T} (p) = \mathrm {S E T} (p \mathrm {o r} T) \underline {{\cup}} \mathrm {S E T} (p \mathrm {o r n o t} T) - \mathrm {S E T} (T) - \mathrm {S E T} (\mathrm {n o t} T)
$$

$\triangleright$ $\underline{\mathsf{U}}$ means union without eliminating repeated tuples.

## 5.4 Integrity Constraints

An IC describes conditions that every legal instance of a relation must satisfy.

- Inserts/deletes/updates that violate IC's are disallowed.
- Can be used to ensure application semantics (e.g., sid is a key), or prevent inconsistencies (e.g., sname has to be a string, age must be $< 200$ )

### Types of Integrity Constraints

Static constraints: constraints to database state

- Inherent constraints (data model), such as 1NF
- Implicit constraints: implied in data schema, indicated by DDL generally. Such as domain constraints, primary key constraints, foreign key constraints.
  - Domain constraints: Field values must be of right type. Always enforced.
- Explicit constraints or general constraints

- Dynamic constraints: constraints while database transferring from one state to another. Can be combined with trigger.

### Foreign Keys

Foreign key : Set of attributes in one relation that is used to 'refer' to a tuple in another relation. Must correspond to primary key of the second relation. Like a 'logical pointer'.

E.g. sid is a foreign key referring to Students:

- Students sid: string, name: string, login: string, age: integer, gpa: decimals)
- Enrolled sid: string, cid: string, grade: string)

### Database Modification

If $\alpha$ is foreign key in $\mathbf{r}_2$ which references to K1 in $\mathbf{r}_1$ , the following tests must be made in order to preserve the following referential integrity constraint:

$$
\Pi_ {\alpha} (r _ {2}) \subseteq \Pi_ {K 1} (r _ {1})
$$

- Insert. If a tuple $t_2$ is inserted into $r_2$ , the system must ensure that there is a tuple $t_1$ in $r_1$ such that $t_1[K_1] = t_2[\alpha]$ . That is

$$
t _ {2} \left[ \alpha \right] \in \prod_ {K 1} \left(r _ {1}\right)
$$

- Delete. If a tuple, $t_1$ is deleted from $r_1$ , the system must compute the set of tuples in $r_2$ that reference $t_1$ :

$$
\sigma_ {\alpha = t 1 [ \mathrm {K} 1 ]} (r _ {2})
$$

If this set is not empty, either the delete command is rejected as an error, or the tuples that reference $t_1$ must themselves be deleted (cascading deletions are possible).

### Database Modification (Cont.)

Update. There are two cases:

If a tuple $t_2$ is updated in relation $r_2$ and the update modifies values for foreign key $\alpha$ , then a test similar to the insert case is made. Let $t_2'$ denote the new value of tuple $t_2$ . The system must ensure that

$$
t _ {2} ^ {\prime} [ \alpha ] \in \prod_ {\mathrm {K 1}} (r _ {1})
$$

If a tuple $t_1$ is updated in $r_1$ , and the update modifies values for the primary key $(K_1)$ , then a test similar to the delete case is made. The system must compute

$$
\sigma_ {\alpha = t 1 [ \mathrm {K 1} ]} (r _ {2})
$$

using the old value of $t_1$ (the value before the update is applied). If this set is not empty, the update may be rejected as an error, or the update may be cascaded to the tuples in the set, or the tuples in the set may be deleted.

### Definition of Integrity Constraints

- Indicated with procedure

Let application programs responsible for the checking of integrity constrains.

- Indicated with ASSERTION

- Defined with assertion specification language, and checked by DBMS automatically
- ASSERT balanceCons ON account: balance>=0;

- Indicated with CHECK clause in base table definition, and checked by DBMS automatically

### General Constraints

Useful when more general ICs than keys are involved.

Can use queries to express constraint.

Constraints can be named.

```sql
CREATE TABLE Reserves
(sname CHAR(10),
bid INTEGER,
day DATE,
PRIMARY KEY (bid, day),
CONSTRAINT noInterlakeRes
CHECK ('Interlake' <>
( SELECT B.bname
FROM Boats B
WHERE B.bid = bid)))
```

```sql
CREATE TABLE Sailors
(sid INTEGER,
sname CHAR(10),
rating INTEGER,
age REAL,
PRIMARY KEY (sid),
CHECK (rating >= 1)
AND rating <= 10))
```

### Constraints Over Multiple Relations

```sql
CREATE TABLE Sailors
(sid INTEGER,
sname CHAR(10),
rating INTEGER,
age REAL,
PRIMARY KEY (sid),
CHECK
( (SELECT COUNT (S.sid) FROM Sailors S)
+ (SELECT COUNT (B.bid) FROM Boats B) < 100 )
```

- Awkward and wrong!
- If Sailors is empty, the number of Boats tuples can be anything!

Number of boats plus number of sailors is $< 100$

### Assertion

- Assertion is the right solution; not associated with either table.

```sql
CREATE ASSERTION smallClub
CHECK
( (SELECT COUNT (S.sid) FROM Sailors S)
+ (SELECT COUNT (B.bid) FROM Boats B) < 100 )
```

## 5.5 Triggers

- Trigger: procedure that starts automatically if specified changes occur to the DBMS

Three parts:

- Event (activates the trigger)
- Condition (tests whether the triggers should run)
- Action (what happens if the trigger runs)

Active database rules (ECA rules)

### Triggers: Example

```sql
CREATE TRIGGER youngSailorUpdate
AFTER INSERT ON SAILORS
REFERENCING NEW TABLE NewSailors
FOR EACH STATEMENT
INSERT
INTO Young Sailors(sid, name, age, rating)
SELECT sid, name, age, rating
FROM NewSailors N
WHERE N.age <= 18
```

### Execution of Rules

- Immediate execution
- Deferred execution
- Decoupled or detached mode
- Cascading trigger
  - Control nested execution of rules
  - Prevent nontermination
- Triggering graph
  - Specify the upper limit of cascading times

So triggers should be used reasonably

### Implementation of ECA

- Loosely coupling
- Tightly coupling (DB2, Oracle, etc.)
- Nested method

The rules are nested into transaction and executed by DBMS as a part of the transaction.

- Grafting method
- Query modification method

