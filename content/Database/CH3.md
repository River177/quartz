# 3. User Interfaces and SQL Language

## 3.1 User Interfaces and SQL Language (1/4)

### User interface of DBMS

A DBMS must offer some interfaces to support user to access database, including:

- Query Languages
- Interface and maintaining tools (GUI)
- APIs
- Class Library

Query Languages

- Formal Query Language
- Tabular Query Language
- Graphic Query Language
- Limited Natural Language Query Language

### Example of Tabular Query Language

Find the names of all students in the department of Info. Science

<table><tr><td>Student</td><td>Sno</td><td>Sname</td><td>Ssex</td><td>Sage</td><td>Sdept</td></tr><tr><td>t</td><td></td><td>P.T.</td><td></td><td></td><td>IS</td></tr><tr><td colspan="3">PRINT</td><td colspan="2">Domain Variables</td><td>Condition
s</td></tr></table>

### Relational Query Languages

- Query languages: Allow manipulation and retrieval of data from a database. Relational model supports simple, powerful QLs:

- Strong formal foundation based on logic.
- Allows for much optimization.

- Query Languages! = programming languages!

- QLs not expected to be "Turing complete".
- QLs not intended to be used for complex calculations.
- QLs support easy, efficient access to large data sets.

### Formal Relational Query Languages

- Two mathematical Query Languages form the basis for "real" languages (e.g. SQL), and for implementation:

- Relational Algebra: More operational, very useful for representing execution plans.
- Relational Calculus: Let's users describe what they want, rather than how to compute it. (Non-operational, declarative.)

The most successful relational database language --- SQL (Structured Query Language; Standard Query Language (1986); Now SQL: 2023.)

### SQL Language

- It can be divided into four parts according to functions.

- Data Definition Language (DDL), used to define, delete, or alter data schema.
- Query Language (QL), used to retrieve data
- Data Manipulation Language (DML), used to insert, delete, or update data.
- Data Control Language (DCL), used to control user's access authority to data.

- QL and DML are introduced in detail in this chapter.

### Important terms and concepts

- Base table
- View
- Data type supported
- NULL
- UNIQUE
- DEFAULT
- PRIMARY KEY
- FOREIGN KEY
- CHECK (Integration Constraint)

### Levels of Abstraction: ANSI-SPARC Architecture

Many views, single conceptual (logical) schema and physical schema.

- Views describe how users see the data.
- Conceptual schema defines logical structure
- Physical schema describes the files and indexes used.

- Schemas are defined using DDL; data is modified/queried using DML.

### Example Instances

We will use these instances of the Sailors, Reserves and Boats relations in our examples.

<table><tr><td>R1</td><td>sid</td><td>bid</td><td>day</td></tr><tr><td></td><td>22</td><td>101</td><td>10/10/96</td></tr><tr><td></td><td>58</td><td>103</td><td>11/12/96</td></tr></table>

S1

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td></tr><tr><td>31</td><td>lubber</td><td>8</td><td>55.5</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td></tr></table>

B1

<table><tr><td>bid</td><td>bname</td><td>color</td></tr><tr><td>101</td><td>tiger</td><td>red</td></tr><tr><td>103</td><td>lion</td><td>green</td></tr><tr><td>105</td><td>hero</td><td>blue</td></tr></table>

s2

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td></tr><tr><td>28</td><td>yuppy</td><td>9</td><td>35.0</td></tr><tr><td>31</td><td>lubber</td><td>8</td><td>55.5</td></tr><tr><td>44</td><td>guppy</td><td>5</td><td>35.0</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td></tr></table>

### Domain Relational Calculus

$$
\{\langle \mathrm {X} _ {1}, \mathrm {X} _ {2}, \dots , \mathrm {X} _ {n} \rangle \mid \mathrm {P} (\mathrm {X} _ {1}, \mathrm {X} _ {2}, \dots , \mathrm {X} _ {n}, \mathrm {X} _ {n + 1}, \dots , \mathrm {X} _ {n + m}) \}
$$

Query has the form:

- $x_{1}, x_{2}, \ldots, x_{n}, x_{n+1}, \ldots, x_{n+m}$ are called domain variables. $x_{1}, x_{2}, \ldots, x_{n}$ appear in result.
- Find all sailors with a rating above 7
- $\{< I, N, T, A>\mid< I, N, T, A> \in \text {Sailors } \land T>7\}$
- Find out all students who need a make-up exam and the corresponding course
- $\{\langle \text{Sid}, \text{Cid} \rangle \mid \langle \text{Sid}, \text{Cid}, \text{Grade} \rangle \in \text{CourseGrade} \land \text{Grade} < 60\}$

### Tuple Relational Calculus

Query has the form:

{ t [<attribute list>] | P(t)}

- t is called tuple variable.

Answer includes all tuples $t<$ attribute list> that make the formula $P(t)$ be true.

Example query: Find all sailors' names whose rating above 7 and younger than 50; $\{t [ N ] \mid t \in S a i l o r s \land t . T > 7 \land t . A < 50\}$

### Basic SQL Query

SELECT [DISTINCT] target-list FROM relation-list WHERE qualification

- target-list A list of attributes of relations in relation-list
- DISTINCT is an optional keyword indicating that the answer should not contain duplicates. Default is that duplicates are not eliminated!
- relation-list A list of relation/table names (possibly with a range-variable after each name).
- qualification Comparisons combined using AND, OR and NOT.

### Conceptual Evaluation Strategy

Semantics of an SQL query defined in terms of the following conceptual evaluation strategy:

- Compute the cross-product of relation-list.
- Discard resulting tuples if they fail qualifications.
- Delete attributes that are not in target-list.
- If DISTINCT is specified, eliminate duplicate rows.

- This strategy is probably the least efficient way to compute a query! An optimizer will find more efficient strategies to compute the same answers.

### Simple Example

SELECT S.sname

FROM Sailors S, Reserves R

WHERE S.sid=R.sid AND R.pid=103

### A Note on Range Variables

- Really needed only if the same relation appears twice in the FROM clause. The previous query can also be written as:

SELECT S.sname

FROM Sailors S, Reserves R

WHERE S.sid=R.sid AND bid=103

It is good style, however, to use range variables always!

OR SELECT sname

FROM Sailors, Reserves

WHERE Sailors.sid=Reserves.sid

AND bid=103

### Find sailors who've reserved at least one boat

SELECT S.sid

FROM Sailors S, Reserves R

WHERE S.sid $\equiv$ R.sid

Would adding DISTINCT to this query make a difference?

What is the effect of replacing S.sid by S.sname in the SELECT clause? Would adding DISTINCT to this variant of the query make a difference?

### Expressions and Strings

SELECT S.age, age1=S.age-5, 2*S.age AS age2
FROM Sailors S
WHERE S.sname LIKE 'B_%B'

- Illustrates use of arithmetic expressions and string pattern matching: Find triples (of ages of sailors and two fields defined by expressions) for sailors whose names begin and end with B and contain at least three characters.
- As and = are two ways to name fields in result.
- LIKE is used for string matching. `__'` stands for any one character and `%'` stands for 0 or more arbitrary characters.

### Find sid's of sailors who've reserved a red or a green boat

- UNION: Can be used to compute the union of any two union-compatible sets of tuples (which are themselves the result of SQL queries).
- If we replace OR by AND in the first version, what do we get?
- Also available: EXCEPT (What do we get if we replace UNION by EXCEPT?)

SELECT S.sid

FROM Sailors S, Boats B, Reserves R WHERE S.sid=R.sid AND R.bid=B.bid AND (B.color='red' OR B.color='green')

SELECT S.sid

FROM Sailors S, Boats B, Reserves R WHERE S.sid=R.sid AND R.bid=B;bid AND B.color='red'

UNION

SELECT S.sid

FROM Sailors S, Boats B, Reserves R WHERE S.sid=R.sid AND R.bid=B;bid AND B.color='green'

### Find sid's of sailors who've reserved a red and a green boat

- INTERSECT: Can be used to compute the intersection of any two union-compatible sets of tuples.
- Included in the SQL/92 standard, but some systems don't support it.
- Contrast symmetry of the UNION and INTERSECT queries with how much the other versions differ.

SELECT S.sid

FROM Sailors S, Boats B1, Reserves R1, Boats B2, Reserves R2

WHERE S.sid=R1.sid AND R1 bids=B1.bill AND S.sid=R2.sid AND R2 bid=B2.bill AND (B1.color='red' AND B2.color='green')

SELECT S.sid

FROM Sailors S, Boats B, Reserves R WHERE S.sid=R.sid AND R.bid=B;bid AND B.color='red'

INTERSECT

SELECT S.sid

FROM Sailors S, Boats B, Reserves R

WHERE S.sid=R.sid AND R bids=B.bid AND B.color='green'

### Rewriting INTERSECT Queries Using IN

Find sid's of sailors who've reserved both a red and a green boat:

SELECT S.sid

FROM Sailors S, Boats B, Reserves R

WHERE S.sid=R.sid AND R.bid=B;bid AND B.color='red'

AND S.sid IN (SELECT S2.sid

FROM Sailors S2, Boats B2, Reserves R2

WHERE S2.sid=R2.sid AND R2 bids=B2.bill

AND B2.color='green')

Similarly, EXCEPT queries re-written using NOT IN.

To find names (not sid's) of Sailors who've reserved both red and green boats, just replace S.sid by S.sname in SELECT clause. (What about INTERSECT query?)

### Nested Queries

Find names of sailors who've reserved boat #103:

SELECT S.sname

FROM Sailors S

WHERE S.sid IN (SELECT R.sid

FROM Reserves R

WHERE R.bid=103)

A very powerful feature of SQL: a WHERE clause can itself contain an SQL query! (Actually, so can FROM and HAVING clauses.)

To find sailors who've not reserved #103, use NOT IN.

To understand semantics of nested queries, think of a nested loops evaluation: For each Sailors tuple, check the qualification by computing the subquery.

### Nested Queries with Correlation

Find names of sailors who've reserved boat #103:

SELECT S.sname

FROM Sailors S

WHERE EXISTS (SELECT *

FROM Reserves R

WHERE R bids $= 103$ AND S.sid $=$ R.sid)

- EXISTS is another set comparison operator, like IN.
- Illustrates why, in general, subquery must be re-computed for each Sailors tuple.
- How to find names of sailors who've reserved boat #103 and reserved only one time?

### Nested Queries with Correlation

- Find IDs of boats which are reserved by only one sailor.

SELECT bid

FROM Reserves R1

WHERE bid NOT IN (

SELECT bid

FROM Reserves R2

WHERE R2.sid $\neg =$ R1.sid)

### More on Set-Comparison Operators

We've already seen IN, EXISTS and UNIQUE. Can also use NOT IN, NOT EXISTS and NOT UNIQUE.

- Also available: op ANY, op ALL, op IN $< , > , = , \leq , \geq , \neq$
- Find sailors whose rating is greater than that of some sailor called Horatio:

SELECT *

FROM Sailors S

WHERE S.rating > ANY (SELECT S2.rating

FROM Sailors S2

WHERE S2.sname='Horatio')

### Division in SQL

Find sailors who've reserved all boats.

Solution 1:

SELECT S.sname

FROM Sailors S

WHERE NOT EXISTS

((SELECT B.bid

FROM Boats B)

EXCEPT

(SELECT R.bid

FROM Reserves R

WHERE R.sid=S.sid))

All boats

Boat reserved by a sailor

### Division in SQL

Solution 2:

Let's do it the hard way, without EXCEPT:

SELECT S.sname

FROM Sailors S

WHERE NOT EXISTS (SELECT B.bid

FROM Boats B

WHERE NOT EXISTS (SELECT R.bid

Sailors S such that ...

FROM Reserves R

WHERE R bids=B.bid

AND R.sid = S.sid))

there is no boat B without …

a Reserves tuple showing S reserved B

## 3.2 User Interfaces and SQL Language (2/4)

### Aggregate Operators

Significant extension of relational algebra.

- COUNT $(*)$
- COUNT ([DISTINCT] A)
- SUM ([DISTINCT] A)
- AVG ([DISTINCT] A)
- MAX (A)
- MIN (A)

A is single column

### Examples of Aggregate Operators

SELECT COUNT (*)

FROM Sailors S

SELECT COUNT (DISTINCT S.rating)

FROM Sailors S

WHERE S.sname='Bob'

SELECT AVG (S.age)

FROM Sailors S

WHERE S.rating $= 10$

SELECT AVG (DISTINCT S.age)

FROM Sailors S

WHERE S.rating $= 10$

SELECT S.sname

FROM Sailors S

WHERE S.rating = (SELECT MAX(S2.rating)

FROM Sailors S2)

### Find the name and age of the oldest sailor(s)

The first query is illegal! (We'll look into the reason a bit later, when we discuss GROUP BY.)

The third query is equivalent to the second query, and is allowed in the SQL/92 standard, but is not supported in some systems.

SELECT S.sname, MAX (S.age) FROM Sailors S

SELECT S.sname, S.age FROM Sailors S

WHERE S.age = (SELECT MAX (S2.age) FROM Sailors S2)

SELECT S.sname, S.age  
FROM Sailors S  
WHERE (SELECT MAX (S2.age) FROM Sailors S2) = S.age

### Motivation for Grouping

So far, we've applied aggregate operators to all (qualifying) tuples. Sometimes, we want to apply them to each of several groups of tuples.

- Consider: Find the age of the youngest sailor for each rating level.

In general, we don't know how many rating levels exist, and what the rating values for these levels are!

Suppose we know that rating values go from 1 to 10; we can write 10 queries that look like this (!):

For $i = 1,2,\ldots ,10$

SELECT MIN (S.age)

FROM Sailors S

WHERE S.rating = i

### Queries With GROUP BY and HAVING

SELECT [DISTINCT] target-list

FROM relation-list

WHERE qualification

GROUP BY grouping-list

HAVING group-qualification

The target-list contains

(i) attribute names  
(ii) terms with aggregate operations (e.g., MIN (S.age)).

The attribute list (i) must be a subset of grouping-list. Intuitively, each answer tuple corresponds to a group, and these attributes must have a single value per group. (A group is a set of tuples that have the same value for all attributes in grouping-list.) (Page 155)

### Conceptual Evaluation

- The cross-product of relation-list is computed, tuples that fail qualification are discarded, 'unnecessary' fields are deleted, and the remaining tuples are partitioned into groups by the value of attributes in grouping-list.

The group-qualification is then applied to eliminate some groups. Expressions in group-qualification must have a single value per group!

- In fact, an attribute in group-qualification that is not an argument of an aggregate op also appears in grouping-list. (SQL does not exploit primary key semantics here!)

I.e., the attributes appear in Select and Having clause must be a subset of the attributes appear in the group by clause.

One answer tuple is generated per qualifying group.

### Find age of the youngest sailor with age $\geq 18$ , for each rating with at least 2 such sailors

SELECT S.rating, MIN (S.age) AS minage

FROM Sailors S

WHERE S.age >= 18

GROUP BY S.rating

HAVING COUNT $(*) > 1$

Answer relation:

<table><tr><td>rating</td><td>minage</td></tr><tr><td>3</td><td>25.5</td></tr><tr><td>7</td><td>35.0</td></tr><tr><td>8</td><td>25.5</td></tr></table>

Sailors instance:

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td></tr><tr><td>29</td><td>brutus</td><td>1</td><td>33.0</td></tr><tr><td>31</td><td>lubber</td><td>8</td><td>55.5</td></tr><tr><td>32</td><td>andy</td><td>8</td><td>25.5</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td></tr><tr><td>64</td><td>horatio</td><td>7</td><td>35.0</td></tr><tr><td>71</td><td>zorba</td><td>10</td><td>16.0</td></tr><tr><td>74</td><td>horatio</td><td>9</td><td>35.0</td></tr><tr><td>85</td><td>art</td><td>3</td><td>25.5</td></tr><tr><td>95</td><td>bob</td><td>3</td><td>63.5</td></tr><tr><td>96</td><td>frodo</td><td>3</td><td>25.5</td></tr></table>

### Find age of the youngest sailor with age $\geq 18$ , for each rating with at least 2 such sailors and with every sailor under 60.

HAVING COUNT (*) > 1 AND EVERY (S.age <= 60)

What is the result of changing EVERY to ANY?

### For each red boat, find the number of reservations for this boat

SELECT B.bid, COUNT (*) AS scount FROM Boats B, Reserves R WHERE R.bid=B.bid AND B.color='red' GROUP BY B.bid

- Grouping over a join of two relations.

What do we get if we remove B.color='red' from the WHERE clause and add a HAVING clause with this condition?

SELECT B.bid, COUNT (*) AS scount

FROM Boats B, Reserves R

WHERE R bids = B.bid AND B.color = 'red'

GROUP BY B.bid

What do we get if we remove B.color='red' from the WHERE clause and add a HAVING clause with this condition?

SELECT B.bid, COUNT (*) AS scount

FROM Boats B, Reserves R

WHERE R bids = B.bid

GROUP BY B.bid, B.color='red'

HAVING B.color='red'

### Find age of the youngest sailor with age $>18$ , for each rating with at least 2 sailors (of any age)

SELECT S.rating, MIN (S.age)

FROM Sailors S

WHERE S.age > 18

GROUP BY S.rating

HAVING $1 < \left(\text{SELECT COUNT}^{*}\right)$

FROM Sailors S2

WHERE S2.rating = S-rating)

- Shows HAVING clause can also contain a sub-query.

Compare this with the query where we considered only ratings with 2 sailors over 18!

What if HAVING clause is replaced by:

HAVING COUNT(*) >1

### Find those ratings for which the average age is the minimum over all ratings

- Aggregate operations cannot be nested! WRONG:

SELECT S.rating

FROM Sailors S

WHERE S.age = (SELECT MIN (AVG(S2.age))

FROM Sailors S2)

Correct solution:

SELECT TempRating

FROM (SELECT S.rating, AVG (S.age) AS avgage

FROM Sailors S

GROUP BY S.rating) AS Temp

WHERE Temp AVGage = (SELECT MIN (Temp AVGage)

FROM Temp)

### Null Values

- Field values in a tuple are sometimes unknown (e.g., a rating has not been assigned) or inapplicable (e.g., no spouse's name).

- SQL provides a special value null for such situations.

The presence of null complicates many issues. E.g.:

- Special operators needed to check if value is/is not null.
- Is rating $> 8$ true or false when rating is equal to null? What about AND, OR and NOT connectives?

We need a 3-valued logic (true, false and unknown).

- Meaning of constructs must be defined carefully. (e.g., WHERE clause eliminates rows that don't evaluate to true.)
- New operators (in particular, outer joins) possible/needed.

### Some New Features of SQL

- CAST expression
- CASE expression
- Sub-query
- Outer Join
- Recursion

### CAST Expression

- Change the expression to the target data type
- Valid target type
- Use

- Match function parameters
- substr(string1, CAST(x AS Integer), CAST(y AS Integer))
- Change precision while calculating
- CAST (elevation AS Decimal $(5,0)$ )
- Assign a data type to NULL value

### CAST Expression

Example:

Students (name, school)

Soldiers (name, service)

CREATE VIEW prospects (name, school, service) AS SELECT name, school, CAST(NULL AS Varchar(20)) FROM Students

UNION

SELECT name, CAST(NULL AS Varchar(20)), service FROM Soldiers ;

### CASE Expression

Simple form :

Officers (name, status, rank, title)

SELECT name, CASE status

WHEN 1 THEN 'Active Duty'

WHEN 2 THEN 'Reserve'

WHEN 3 THEN 'Special Assignment'

WHEN 4 THEN 'Retired'

ELSE 'Unknown'

END AS status

FROM Officers ;

### CASE Expression

- General form (use searching condition):

Machines (serialno, type, year, hours_used, accidents)

- Find the rate of the accidents of "chain saw" in the whole accidents:

SELECT sum (CASE

WHEN type='chain saw' THEN accidents

ELSE 0e0

END) / sum (accidents)

FROM Machines;

### CASE Expression

Find the average accident rate of every kind of equipment:

SELECT type, CASE

WHEN sum(hours_used) $>0$ THEN

sum(accidents)/sum(hours_used)

ELSE NULL

END AS accident_rate

FROM Machines

GROUP BY type;

(Because some equipments maybe not in use at all, their hours_used is 0. Use CASE can prevent the expression divided by 0.)

### CASE Expression

- Compared with

SELECT type, sum(accidents)/sum(hours_used)

FROM Machines

GROUP BY type

HAVING sum(hours_used) $>0$ ;

## 3.3 User Interfaces and SQL Language (3/4)

### Some New Features of SQL

- CAST expression
- CASE expression
- Sub-query
- Outer Join
- Recursion

### Sub-query

Embedded query & embedded query with correlation

The functions of sub-queries have been enhanced in new SQL standard. Now they can be used in SELECT and FROM clause

- Scalar sub-query
- Table expression
- Common table expression

### Scalar Sub-query

The result of a sub-query is a single value. It can be used in the place where a value can occur.

- Find the departments' names whose average bonus is higher than average salary: dept (deptno, deptname, location), emp (deptno, salary, bonus)

SELECT d.deptname

FROM dept AS d

WHERE (SELECT avg(bonus)

FROM emp

WHERE deptno=d.deptno)

> (SELECT avg(salary)

FROM emp

WHERE deptno=d.deptno)

### Scalar Sub-query

List the deptno, deptname, and the max salary of all departments located in New York :

SELECT d.deptno, d.deptname, (SELECT MAX (salary)

FROM emp

WHERE deptno=d.deptno) AS maxpay

FROM dept AS d

WHERE d.location = 'New York';

How about using GROUP BY?

### Table Expression

- The result of a sub-query is a table. It can be used in the place where a table can occur.

SELECT startyear, avg/pay

FROM (SELECT name, salay+bonus AS pay, year(startdate) AS startyear FROM emp) AS emp2

GROUP BY startyear;

- Find departments whose total payment is greater than 200000

SELECT deptno, totalpay

FROM (SELECT deptno, sum(salay) + sum(bonus) AS totalpay FROM emp GROUP BY deptno) AS payroll

WHERE totalpay $>200000$

Table expressions are temporary views in fact.

### Common Table Expression

- In some complex query, a table expression may need occurring more than one time in the same SQL statements. Although it is permitted, the efficiency is low and there maybe inconsistency problem.
- WITH clause can be used to define a common table expression. In fact, it defines a temporary view.
- Find the department who has the highest total payment :

### Common Table Expression

- Find the department who has the highest total payment: (Hint: we need to use payroll table twice) WITH payroll (deptno, totalpay) AS

(SELECT deptno, sum(salary) + sum(bonus)

FROM emp

GROUP BY deptno)

SELECT deptno

FROM payroll

WHERE totalpay = (SELECT max(totalpay)

FROM payroll);

Common table expression mainly used in queries which need multi level focuses.

### Common Table Expression

- Find department pairs, in which the first department's average salary is more than two times of the second one's:

WITH deptavg (deptno, avgsal) AS

(SELECT deptno, avg(salary)

FROM emp

GROUP BY deptno)

SELECT d1.deptno, d1.avgsal, d2.deptno, d2.avgsal

FROM deptavg AS d1, deptavg AS d2

WHERE d1.avgsal $>2^{*}$ d2.avgsal;

### Outer Joins

- The extension of join operation. In join operation, only matching tuples fulfilling join conditions are left in results. Outer joins will keep unmated tuples, the vacant part is set Null:

- Left outer join $(* \bowtie)$

Keep all tuples of left relation in the result.

Right outer join $(\bowtie^{*})$

Keep all tuples of right relation in the result.

- Full outer join $(*\bowtie^{*})$

Keep all tuples of left and right relations in the result.

### Examples of Outer Joins

s1

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td></tr><tr><td>31</td><td>lubber</td><td>8</td><td>55.5</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td></tr></table>

R1

<table><tr><td>sid</td><td>bid</td><td>day</td></tr><tr><td>22</td><td>101</td><td>10/10/96</td></tr><tr><td>58</td><td>103</td><td>11/12/96</td></tr></table>

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td><td>bid</td><td>day</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td><td>101</td><td>10/10/96</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td><td>103</td><td>11/12/96</td></tr><tr><td>31</td><td>Lubber</td><td>8</td><td>55.5</td><td>null</td><td>null</td></tr></table>

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td><td>bid</td><td>day</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td><td>101</td><td>10/10/96</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td><td>103</td><td>11/12/96</td></tr></table>

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td><td>bid</td><td>day</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td><td>101</td><td>10/10/96</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td><td>103</td><td>11/12/96</td></tr><tr><td>31</td><td>Lubber</td><td>8</td><td>55.5</td><td>null</td><td>null</td></tr></table>

S1 * R1

$\mathrm{S} 1 \boxtimes^ {*} \mathrm{R} 1 =$

S1R1 (Why?)

S1 *R1

### Outer Join

Teacher (name, rank)

Course (subject, enrollment, quarter, teacher)

WITH

innerjoin(name, rank, subject, enrollment) AS

(SELECT t.name, t rankings, csubject, c.enrollment

FROM teachers AS t, courses AS c

WHERE t.name=c.teacher AND c.quarter='Fall 19')

teacher-only(name, rank) AS

(SELECT name, rank

FROM teachers

EXCEPT ALL

SELECT name, rank

FROMinnerjoin),

course-only(subject, enrollment) AS

(SELECT subject, enrollment

FROM courses

EXCEPT ALL

SELECT subject, enrollment

FROM innerjoin)

SELECT name, rank, subject, enrollment

FROM innerjoin

UNION ALL

SELECT name, rank,

CAST (NULL AS Varchar(20)) AS subject,

CAST (NULL AS Integer) AS enrollment

FROM teacher-only

UNION ALL

SELECT CAST (NULL AS Varchar(20)) AS name,

CAST (NULL AS Varchar(20)) AS rank,

subject, enrollment

FROM course-only;

### Recursion

If a common table expression uses itself in its definition, this is called recursion. It can calculate a complex recursive inference in one SQL statement. FedEmp (name, salary, manager)

- Find all employees under the management of Hoover and whose salary is more than 100000

```sql
WITH agents (name, salary) AS  
((SELECT name, salary --- initial query  
FROM FedEmp  
WHERE manager='Hoover')  
UNION ALL  
(SELECT f.name, f_salary --- recursive query  
FROM agents AS a, FedEmp AS f  
WHERE f-manager = a.name))  
SELECT name --- final query  
FROM agents  
WHERE salary > 100000;
```

### Recursive Calculation

A classical "parts searching problem"

Components

<table><tr><td>Part</td><td>Subpart</td><td>QTY</td></tr><tr><td>wing</td><td>strut</td><td>5</td></tr><tr><td>wing</td><td>aileron</td><td>1</td></tr><tr><td>wing</td><td>landing gear</td><td>1</td></tr><tr><td>wing</td><td>rivet</td><td>100</td></tr><tr><td>strut</td><td>rivet</td><td>10</td></tr><tr><td>aileron</td><td>hinge</td><td>2</td></tr><tr><td>aileron</td><td>rivet</td><td>5</td></tr><tr><td>landing gear</td><td>hinge</td><td>3</td></tr><tr><td>landing gear</td><td>rivet</td><td>8</td></tr><tr><td>hinge</td><td>rivet</td><td>4</td></tr></table>

Directed acyclic graph, which assures the recursion can be stopped

### Recursive Calculation

Find how much rivets are used in one wing?

A temporary view is defined to show the list of each subpart's quantity used in a specified part :

WITH wingpart (subpart, qty) AS

((SELECT subpart, qty ---initial query

FROM components

WHERE part='wing')

UNION ALL

(SELECT c.subpart, w.qty*c.qty ---recursive qry

FROM wingpart w, components c

WHERE w.subpart=c.partition))

wingpart

<table><tr><td>Subpart</td><td>QTY</td></tr><tr><td>strut</td><td>5</td></tr><tr><td>aileron</td><td>1</td></tr><tr><td>landing gear</td><td>1</td></tr><tr><td>rivet</td><td>100</td></tr><tr><td>rivet</td><td>50</td></tr><tr><td>hinge</td><td>2</td></tr><tr><td>rivet</td><td>5</td></tr><tr><td>hinge</td><td>3</td></tr><tr><td>rivet</td><td>8</td></tr><tr><td>rivet</td><td>8</td></tr><tr><td>rivet</td><td>12</td></tr></table>

### Recursive Calculation

- Find how much rivets are used in one wing?

WITH wingpart (subpart, qty) AS

((SELECT subpart, qty ---initial query

FROM components

WHERE part='wing')

UNION ALL

(SELECT c.subpart, w.qty*c.qty ---recursive qry

FROM wingpart w, components c

WHERE w.subpart=c.partition))

SELECT sum(qty) AS qty

FROM wingpart

WHERE subpart='rivet';

The result is :

<table><tr><td>qty</td></tr><tr><td>183</td></tr></table>

### Recursive Calculation

- Find all subparts and their total quantity needed to assemble a wing:

WITH wingpart (subpart, qty) AS

((SELECT subpart, qty ---initial query

FROM components

WHERE part='wing')

UNION ALL

(SELECT c.subpart, w.qty*c.qty ---recursive qry

FROM wingpart w, components c

WHERE w.subpart=c.partition))

SELECT subpart, sum(qty) AS qty

FROMwingpart

Group BY subpart;

The result is :

<table><tr><td>subpart</td><td>qty</td></tr><tr><td>strut</td><td>5</td></tr><tr><td>aileron</td><td>1</td></tr><tr><td>landing gear</td><td>1</td></tr><tr><td>hinge</td><td>5</td></tr><tr><td>rivet</td><td>183</td></tr></table>

### Recursive Search

Typical airline route searching problem

Find the lowest total cost route from SFO to JFK

Flights

<table><tr><td>FlightNo</td><td>Origin</td><td>Destination</td><td>Cost</td></tr><tr><td>HY 120</td><td>DFW</td><td>JFK</td><td>225</td></tr><tr><td>HY 130</td><td>DFW</td><td>LAX</td><td>200</td></tr><tr><td>HY 140</td><td>DFW</td><td>ORD</td><td>100</td></tr><tr><td>HY 150</td><td>DFW</td><td>SFO</td><td>300</td></tr><tr><td>HY 210</td><td>JFK</td><td>DFW</td><td>225</td></tr><tr><td>HY 240</td><td>JFK</td><td>ORD</td><td>250</td></tr><tr><td>HY 310</td><td>LAX</td><td>DFW</td><td>200</td></tr><tr><td>HY 350</td><td>LAX</td><td>SFO</td><td>50</td></tr><tr><td>HY 410</td><td>ORD</td><td>DFW</td><td>100</td></tr><tr><td>HY 420</td><td>ORD</td><td>JFK</td><td>250</td></tr><tr><td>HY 450</td><td>ORD</td><td>SFO</td><td>275</td></tr><tr><td>HY 510</td><td>SFO</td><td>DFW</td><td>300</td></tr><tr><td>HY 530</td><td>SFO</td><td>LAX</td><td>50</td></tr><tr><td>HY 540</td><td>SFO</td><td>ORD</td><td>275</td></tr></table>

### Recursive Search

WITH trips (destination, route, nsegs, totalcost) AS

((SELECT destination, CAST(destination AS varchar(20)), 1, cost

FROM flights

--- initial query

WHERE origin='SFO')

UNION ALL

(SELECT fdestination,

--- recursive query

CAST(t-route | $\mid \mid^{\prime \prime},\mid$ |fdestination AS varchar(20)),

t.nseqs+1, t.totalcost+f.cost

FROM trips t, flights f

WHERE tdestination $\equiv$ f.origin

AND fdestination<>SFO'

--- stopping rule 1

AND f.origin<>JFK'

--- stopping rule 2

AND t.nseqs $< = 3$

--- stopping rule 3

SELECT route, totalcost

--- final query

FROM trips

WHERE destination='JFK' AND totalcost=

--- lowest cost rule

(SELECT min(totalcost)

FROM trips

WHERE destination='JFK');

### Result

Trips

<table><tr><td>Destination</td><td>Route</td><td>Nsegs</td><td>Totalcost</td></tr><tr><td>DFW</td><td>DFW</td><td>1</td><td>300</td></tr><tr><td>ORD</td><td>ORD</td><td>1</td><td>275</td></tr><tr><td>LAX</td><td>LAX</td><td>1</td><td>50</td></tr><tr><td>JFK</td><td>DFW, JFK</td><td>2</td><td>525</td></tr><tr><td>LAX</td><td>DFW, LAX</td><td>2</td><td>500</td></tr><tr><td>ORD</td><td>DFW, ORD</td><td>2</td><td>400</td></tr><tr><td>DFW</td><td>LAX, DFW</td><td>2</td><td>250</td></tr><tr><td>DFW</td><td>ORD, DFW</td><td>2</td><td>375</td></tr><tr><td>JFK</td><td>ORD, JFK</td><td>2</td><td>525</td></tr><tr><td>DFW</td><td>DFW, LAX, DFW</td><td>3</td><td>700</td></tr><tr><td>DFW</td><td>DFW, ORD, DFW</td><td>3</td><td>500</td></tr><tr><td>JFK</td><td>DFW, ORD, JFK</td><td>3</td><td>650</td></tr><tr><td>LAX</td><td>LAX, DFW, LAX</td><td>3</td><td>450</td></tr><tr><td>JFK</td><td>LAX, DFW, JFK</td><td>3</td><td>475</td></tr><tr><td>ORD</td><td>LAX, DFW, ORD</td><td>3</td><td>350</td></tr><tr><td>LAX</td><td>ORD, DFW, LAX</td><td>3</td><td>575</td></tr><tr><td>JFK</td><td>ORD, DFW, JFK</td><td>3</td><td>600</td></tr><tr><td>ORD</td><td>ORD, DFW, ORD</td><td>3</td><td>475</td></tr></table>

Final result

<table><tr><td>route</td><td>totalcost</td></tr><tr><td>LAX, DFW, JFK</td><td>475</td></tr></table>

### Recursive Search

- Only change the final query slightly, the least transfer time routes can be found :

SELECT route, totalcost

--- final query

FROM trips

WHERE destination='JFK' AND nsecs=

--- least stop rule

(SELECT min(nsecs)

FROM trips

WHERE destination='JFK');

Final result

<table><tr><td>route</td><td>totalcost</td></tr><tr><td>DFW, JFK</td><td>525</td></tr><tr><td>ORD, JFK</td><td>525</td></tr></table>

## 3.4 User Interfaces and SQL Language (4/4)

### Summary

- Query with one table or multiple table,
- Query with nested query or correlated nest query,
- Query with set operators,
- Query with aggregator operators,
- Query with Group By,
- Query with CAST expression,
- Query with CASE expression,
- Sub-query,
- Recursion.

### SQL Language

It can be divided into four parts according to functions.

- Data Definition Language (DDL), used to define, delete, or alter data schema.
- Query Language (QL), used to retrieve data
- Data Manipulation Language (DML), used to insert, delete, or update data.
- Data Control Language (DCL), used to control user's access authority to data.

- QL and DML are introduced in detail in this chapter.

### Data Manipulation Language

### Insert

- Insert a tuple into a table
- INSERT INTO EMPLOYEES VALUES ('Smith', 'John', '1980-06-10', 'Los Angles', 16, 45000);

### Delete

- Delete tuples fulfill qualifications
- DELETE FROM Person WHERE LastName = 'Rasmussen';

### Update

- Update the attributes' value of tuples fulfill qualifications

- UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing' WHERE LastName = 'Wilson';

### View in SQL

### General view

- Virtual tables derived from base tables
- Logical data independence
- Security of data
- Update problems of view

### Temporary view and recursive query

- WITH (Common table expression)
- RECURSIVE

### Levels of Abstraction: ANSI-SPARC Architecture

Many views, single conceptual (logical) schema and physical schema.

- Views describe how users see the data.
- Conceptual schema defines logical structure
- Physical schema describes the files and indexes used.

$\boxtimes$ Schemas are defined using DDL; data is modified/queried using DML.

### View in SQL

### General view

- Virtual tables derived from base tables
- Logical data independence
- Security of data
- Update problems of view

### Temporary view and recursive query

- WITH
- RECURSIVE

### Update problems of view

- CREATE VIEW YoungSailor AS SELECT sid, sname, rating FROM Sailors WHERE age<26;
- CREATE VIEW Ratingavg AS SELECT rating, AVG(age) FROM Sailors GROUP BY rating;

### Embedded SQL

In order to access database in programs, and take further process to the query results, need to combine SQL and programming language (such as C / C++, etc.)

Problems should be solved:

- How to accept SQL statements in programming language
- How to exchange data and messages between programming language and DBMS
- The query result of DBMS is a set, how to transfer it to the variables in programming language
- The data type of DBMS and programming language may not the same exactly.

### General Solutions

### Embedded SQL

The most basic method. Through pre-compiling, transfer the embedded SQL statements to inner library functions call to access database.

### Programming APIs

- Offer a set of library functions or DLLs to programmer directly, linking with application program while compiling.

### Class Library

- Supported after emerging of OOP. Envelope the library functions to access database as a set of class, offering easier way to treat database in programming language.

### Usage of Embedded SQL (in C)

- SQL statements can be used in C program directly:

- Begin with EXEC SQL, end with ';'
- Through host variables to transfer information between C and SQL. Host variables should be defined begin with EXEC SQL.
- In SQL statements, should add ': ' before host variables to distinguish with SQL's own variable or attributes' name.
- In host language (such as C), host variables are used as general variables.
- Can't define host variables as Structure.
- A special host variable, SQLCA (SQL Communication Area) EXEC SQL INCLUDE SQLCA
- Use SQLCA.SQLCODE to justify the state of result.
- Use indicator (short int) to treat NULL in host language.

### Example of host variables defining

EXEC SQL BEGINDECLARE SECTION;

char SNO[7];

char GIVENSNO[7];

char CNO[6];

char GIVENCNO[6];

float GRADE;

short GRADEI; /*indicator of GRADE*/

EXEC SQL ENDDECLARE SECTION;

### Executable Statements

CONNECT

- EXEC SQL CONNECT :uid IDENTIFIED BY :pwd;

- Execute DDL or DML Statements

- EXEC SQL INSERT INTO SC(SNO,CNO,GRADE)

VALUES(:SNO, :CNO, :GRADE);

- Execute Query Statements

- EXEC SQL SELECT GRADE

INTO :GRADE :GRADEI

FROM SC

WHERE SNO=:GIVENSNO AND

CNO=:GIVENCNO;

- Because $\{\mathrm{SNO}, \mathrm{CNO}\}$ is the key of SC, the result of this query has only one tuple. How to treat result if it has a set of tuples?

### Cursor

1. Define a cursor

EXEC SQLDECLARECURSORname>CURSORFOR SELECT... FROM... WHERE...

2. EXEC SQL OPEN <cursor name>

Some like open a file

3. Fetch data from cursor

EXEC SQL FETCH <cursor name>

INTO :hostvar1, :hostvar2, ...;

4. SQLCA.SQLCODE will return 100 when arriving the end of cursor

5. CLOSE CURSOR <cursor name>

### Example of Query with Cursor

```txt
EXEC SQLDECLARE C1 CURSOR FOR SELECT SNO, GRADE FROM SC WHERE CNO  $=$  :GIVENCNO;   
EXEC SQL OPEN C1;   
if (SQLCA.SQLCODE  $<  0$  exit(1); /\* There is error in query\*/ while (1){ EXEC SQL FETCH C1 INTO :SNO,:GRADE:GRADEI if (SQLCA.SQLCODE  $\equiv = 100$  ) break; /\*treat data fetched from cursor, omitted\*/ ·   
}   
EXEC SQL CLOSE C1;
```

### Conceptual Evaluation

### Dynamic SQL

In above embedded SQL, the SQL statements must be written before compiling. But in some applications, the SQL statement can't decided in ahead, they need to be built dynamically while the program running.

- Dynamic SQL is supported in SQL standard and most RDBMS products

- Dynamic SQL executed directly
- Dynamic SQL with dynamic parameters
- Dynamic SQL for query

### Dynamic SQL executed directly

- Only used in the execution of non query SQL statements

：

EXEC SQL BEGINDECLARE SECTION;

char sqlstring[200];

EXEC SQL ENDDECLARE SECTION;

char cond[150];

strcpy( sqlstring, "DELETE FROM STUDENT WHERE ");

printf("Enter search condition:");

$\operatorname{scanf}(\text{"}\% \mathrm{s}^{\prime \prime}, \text{cond});$

strcat( sqlstring, cond);

EXEC SQL EXECUTE IMMEDIATE :sqlstring;

：

### Dynamic SQL with dynamic parameters

- Only used in the execution of non query SQL statements. Use place holder to realize dynamic parameter in SQL statement. Some like the macro processing method in C.

```txt
EXEC SQL BEGINDECLARE SECTION;   
char sqlstring[200];   
int birth_year;   
EXEC SQL ENDDECLARE SECTION;   
strcpy( sqlstring, "DELETE FROM STUDENT WHERE YEAR(BDATE) <= :y; ")；   
printf("Enter birth year for delete :");   
scanf("%d", &birth_year);   
EXEC SQL PREPARE purge FROM :sqlstring;   
EXEC SQL EXECUTE purge USING :birth_year;
```

### Dynamic SQL for query

Used to form query statement dynamically

EXEC SQL BEGINDECLARE SECTION;

char sqlstring[200];

char SNO[7];

float GRADE;

short GRADEI;

char GIVENCNO[6];

EXEC SQL ENDDECLARE SECTION;

char orderby[150];

strcpy(sqlstring, "SELECT SNO, GRADE FROM SC WHERE CNO= :c ");

printf("Enter the ORDER BY clause:");

$\mathrm{scanf}(\% \mathrm{s}^{\prime \prime},\mathrm{orderby});$

strcat(sqlstring, orderby);

printf("Enter the course number:");

$\operatorname{scanf}(\text{"}\% \mathrm{s}^{\prime \prime}, \text{GIVENCNO})$ ;

EXEC SQL PREPARE query FROM :sqlstring;

EXEC SQLDECLARE grade_cursor CURSOR FOR query;

EXEC SQL OPEN grade_cursor USING :GIVENCNO;

### Dynamic SQL for query (Cont.)

```c
if (SQLCA.SQLCODE  $<  0$  exit(1); /\*There is error in query\*/ while (1){ EXEC SQL FETCH grade_cursor INTO :SNO,:GRADE:GRADEI if (SQLCA.SQLCODE  $\equiv = 100$  ) break; /\*treat data fetched from cursor, omitted\*/ ·   
}   
EXEC SQL CLOSE grade_cursor;
```

### Stored Procedure

- Used to improve performance and facilitate users. With it, user can take frequently used database access program as a procedure, and store it in the database after compiling, then call it directly while need.

- Make user convenient. User can call them directly and don't need code again. They are reusable.
- Improve performance. The stored procedures have been compiled, so they don't need parsing and query optimization again while being used.
- Expand function of DBMS. (can write script)

### Example of a Stored Procedure

EXEC SQL

```sql
CREATE PROCEDURE drop_student  
(IN student_no CHAR(7),  
OUT message CHAR(30))  
BEGIN ATOMIC  
DELETE FROM STUDENT  
WHERE SNO=student_no;  
DELETE FROM SC  
WHERE SNO=student_no;  
SET message=student_no || 'droped';  
END;  
TEC SQL
```

```c
CALL drop_student(...); /* call this stored procedure later*/
```

