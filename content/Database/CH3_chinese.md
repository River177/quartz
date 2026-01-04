# 3. 用户界面和SQL语言

## 3.1 用户界面和SQL语言 (1/4)

### DBMS的用户界面

DBMS必须提供一些接口来支持用户访问数据库，包括：

- 查询语言
- 界面和维护工具（GUI）
- API
- 类库

查询语言

- 形式化查询语言
- 表格查询语言
- 图形查询语言
- 受限自然语言查询语言

### 表格查询语言示例

查找信息科学系所有学生的姓名

<table><tr><td>Student</td><td>Sno</td><td>Sname</td><td>Ssex</td><td>Sage</td><td>Sdept</td></tr><tr><td>t</td><td></td><td>P.T.</td><td></td><td></td><td>IS</td></tr><tr><td colspan="3">PRINT</td><td colspan="2">域变量</td><td>条件
s</td></tr></table>

### 关系查询语言

- 查询语言：允许操作和检索数据库中的数据。关系模型支持简单、强大的查询语言：

- 基于逻辑的强形式化基础。
- 允许大量优化。

- 查询语言！= 编程语言！

- 查询语言不期望是"图灵完备"的。
- 查询语言不打算用于复杂计算。
- 查询语言支持轻松、高效地访问大型数据集。

### 形式化关系查询语言

- 两种数学查询语言构成了"真实"语言（如SQL）和实现的基础：

- 关系代数：更具操作性，对表示执行计划非常有用。
- 关系演算：让用户描述他们想要什么，而不是如何计算它。（非操作性的，声明式的。）

最成功的关系数据库语言 --- SQL（结构化查询语言；标准查询语言（1986）；现在SQL: 2023。）

### SQL语言

- 根据功能可以划分为四个部分。

- 数据定义语言（DDL），用于定义、删除或修改数据模式。
- 查询语言（QL），用于检索数据
- 数据操作语言（DML），用于插入、删除或更新数据。
- 数据控制语言（DCL），用于控制用户对数据的访问权限。

- 本章详细介绍QL和DML。

### 重要术语和概念

- 基表
- 视图
- 支持的数据类型
- NULL
- UNIQUE
- DEFAULT
- PRIMARY KEY
- FOREIGN KEY
- CHECK（完整性约束）

### 抽象层次：ANSI-SPARC架构

多个视图，单一概念（逻辑）模式和物理模式。

- 视图描述用户如何看待数据。
- 概念模式定义逻辑结构
- 物理模式描述使用的文件和索引。

- 模式使用DDL定义；数据使用DML修改/查询。

### 示例实例

我们将在示例中使用Sailors、Reserves和Boats关系的这些实例。

<table><tr><td>R1</td><td>sid</td><td>bid</td><td>day</td></tr><tr><td></td><td>22</td><td>101</td><td>10/10/96</td></tr><tr><td></td><td>58</td><td>103</td><td>11/12/96</td></tr></table>

S1

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td></tr><tr><td>31</td><td>lubber</td><td>8</td><td>55.5</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td></tr></table>

B1

<table><tr><td>bid</td><td>bname</td><td>color</td></tr><tr><td>101</td><td>tiger</td><td>red</td></tr><tr><td>103</td><td>lion</td><td>green</td></tr><tr><td>105</td><td>hero</td><td>blue</td></tr></table>

s2

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td></tr><tr><td>28</td><td>yuppy</td><td>9</td><td>35.0</td></tr><tr><td>31</td><td>lubber</td><td>8</td><td>55.5</td></tr><tr><td>44</td><td>guppy</td><td>5</td><td>35.0</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td></tr></table>

### 域关系演算

$$
\{\langle \mathrm {X} _ {1}, \mathrm {X} _ {2}, \dots , \mathrm {X} _ {n} \rangle \mid \mathrm {P} (\mathrm {X} _ {1}, \mathrm {X} _ {2}, \dots , \mathrm {X} _ {n}, \mathrm {X} _ {n + 1}, \dots , \mathrm {X} _ {n + m}) \}
$$

查询具有以下形式：

- $x_{1}, x_{2}, \ldots, x_{n}, x_{n+1}, \ldots, x_{n+m}$ 称为域变量。$x_{1}, x_{2}, \ldots, x_{n}$ 出现在结果中。
- 查找所有等级高于7的水手
- $\{< I, N, T, A>\mid< I, N, T, A> \in \text {Sailors } \land T>7\}$
- 找出所有需要补考的学生及相应的课程
- $\{\langle \text{Sid}, \text{Cid} \rangle \mid \langle \text{Sid}, \text{Cid}, \text{Grade} \rangle \in \text{CourseGrade} \land \text{Grade} < 60\}$

### 元组关系演算

查询具有以下形式：

{ t [<attribute list>] | P(t)}

- t 称为元组变量。

答案包括所有使公式 $P(t)$ 为真的元组 $t<$ attribute list>。

示例查询：查找所有等级高于7且年龄小于50的水手姓名；$\{t [ N ] \mid t \in S a i l o r s \land t . T > 7 \land t . A < 50\}$

### 基本SQL查询

SELECT [DISTINCT] target-list FROM relation-list WHERE qualification

- target-list 关系列表中关系的属性列表
- DISTINCT是一个可选关键字，表示答案不应包含重复项。默认情况下不消除重复！
- relation-list 关系/表名列表（每个名称后可能带有范围变量）。
- qualification 使用AND、OR和NOT组合的比较。

### 概念评估策略

SQL查询的语义根据以下概念评估策略定义：

- 计算relation-list的笛卡尔积。
- 如果结果元组不符合条件，则丢弃它们。
- 删除不在target-list中的属性。
- 如果指定了DISTINCT，则消除重复行。

- 这种策略可能是计算查询效率最低的方式！优化器将找到更高效的策略来计算相同的答案。

### 简单示例

SELECT S.sname

FROM Sailors S, Reserves R

WHERE S.sid=R.sid AND R.pid=103

### 关于范围变量的说明

- 只有当同一关系在FROM子句中出现两次时才真正需要。前面的查询也可以写成：

SELECT S.sname

FROM Sailors S, Reserves R

WHERE S.sid=R.sid AND bid=103

然而，始终使用范围变量是良好的风格！

或者 SELECT sname

FROM Sailors, Reserves

WHERE Sailors.sid=Reserves.sid

AND bid=103

### 查找至少预订了一艘船的水手

SELECT S.sid

FROM Sailors S, Reserves R

WHERE S.sid $\equiv$ R.sid

向此查询添加DISTINCT会有区别吗？

在SELECT子句中将S.sid替换为S.sname的效果是什么？向此查询变体添加DISTINCT会有区别吗？

### 表达式和字符串

SELECT S.age, age1=S.age-5, 2*S.age AS age2
FROM Sailors S
WHERE S.sname LIKE 'B_%B'

- 说明算术表达式和字符串模式匹配的使用：查找姓名以B开头和结尾且至少包含三个字符的水手的三元组（水手年龄和由表达式定义的两个字段）。
- AS和=是命名结果中字段的两种方式。
- LIKE用于字符串匹配。`__'` 代表任意一个字符，`%'` 代表0个或多个任意字符。

### 查找预订了红色或绿色船的水手的sid

- UNION：可用于计算任何两个并兼容的元组集合的并集（它们本身是SQL查询的结果）。
- 如果我们在第一个版本中用AND替换OR，我们会得到什么？
- 也可用：EXCEPT（如果我们将UNION替换为EXCEPT，我们会得到什么？）

SELECT S.sid

FROM Sailors S, Boats B, Reserves R WHERE S.sid=R.sid AND R.bid=B.bid AND (B.color='red' OR B.color='green')

SELECT S.sid

FROM Sailors S, Boats B, Reserves R WHERE S.sid=R.sid AND R.bid=B;bid AND B.color='red'

UNION

SELECT S.sid

FROM Sailors S, Boats B, Reserves R WHERE S.sid=R.sid AND R.bid=B;bid AND B.color='green'

### 查找预订了红色和绿色船的水手的sid

- INTERSECT：可用于计算任何两个并兼容的元组集合的交集。
- 包含在SQL/92标准中，但某些系统不支持它。
- 对比UNION和INTERSECT查询的对称性与其他版本的差异。

SELECT S.sid

FROM Sailors S, Boats B1, Reserves R1, Boats B2, Reserves R2

WHERE S.sid=R1.sid AND R1 bids=B1.bill AND S.sid=R2.sid AND R2 bid=B2.bill AND (B1.color='red' AND B2.color='green')

SELECT S.sid

FROM Sailors S, Boats B, Reserves R WHERE S.sid=R.sid AND R.bid=B;bid AND B.color='red'

INTERSECT

SELECT S.sid

FROM Sailors S, Boats B, Reserves R

WHERE S.sid=R.sid AND R bids=B.bid AND B.color='green'

### 使用IN重写INTERSECT查询

查找预订了红色和绿色船的水手的sid：

SELECT S.sid

FROM Sailors S, Boats B, Reserves R

WHERE S.sid=R.sid AND R.bid=B;bid AND B.color='red'

AND S.sid IN (SELECT S2.sid

FROM Sailors S2, Boats B2, Reserves R2

WHERE S2.sid=R2.sid AND R2 bids=B2.bill

AND B2.color='green')

类似地，使用NOT IN重写EXCEPT查询。

要查找预订了红色和绿色船的水手的姓名（不是sid），只需在SELECT子句中将S.sid替换为S.sname。（INTERSECT查询呢？）

### 嵌套查询

查找预订了船#103的水手姓名：

SELECT S.sname

FROM Sailors S

WHERE S.sid IN (SELECT R.sid

FROM Reserves R

WHERE R.bid=103)

SQL的一个非常强大的特性：WHERE子句本身可以包含SQL查询！（实际上，FROM和HAVING子句也可以。）

要查找未预订#103的水手，使用NOT IN。

要理解嵌套查询的语义，考虑嵌套循环评估：对于每个Sailors元组，通过计算子查询来检查条件。

### 带相关性的嵌套查询

查找预订了船#103的水手姓名：

```sql
SELECT S.sname
FROM Sailors S
WHERE EXISTS (SELECT *
FROM Reserves R
WHERE R bids $= 103$ AND S.sid $=$ R.sid)
```

- EXISTS是另一个集合比较运算符，类似于IN。
- 说明为什么，一般来说，子查询必须为每个Sailors元组重新计算。
- 如何查找预订了船#103且只预订一次的水手姓名？

### 带相关性的嵌套查询

- 查找只被一个水手预订的船的ID。

```sql
SELECT bid
FROM Reserves R1
WHERE bid NOT IN (
SELECT bid
FROM Reserves R2
WHERE R2.sid $\neg =$ R1.sid)
```

### 关于集合比较运算符的更多内容

我们已经看到了IN、EXISTS和UNIQUE。也可以使用NOT IN、NOT EXISTS和NOT UNIQUE。

- 也可用：op ANY、op ALL、op IN $< , > , = , \leq , \geq , \neq$
- 查找等级大于某个名为Horatio的水手的等级的水手：

```sql
SELECT *
FROM Sailors S
WHERE S.rating > ANY (SELECT S2.rating
FROM Sailors S2
WHERE S2.sname='Horatio')
```

**找出“rating 大于至少一个 Horatio 的 rating”的水手。**

### SQL中的除法

查找预订了所有船的水手。

解决方案1：

```sql
SELECT S.sname
FROM Sailors S
WHERE NOT EXISTS
((SELECT B.bid
FROM Boats B)
EXCEPT
(SELECT R.bid
FROM Reserves R
WHERE R.sid=S.sid))
```

所有船

水手预订的船

### SQL中的除法

解决方案2：

让我们用困难的方式来做，不使用EXCEPT：

SELECT S.sname

FROM Sailors S

WHERE NOT EXISTS (SELECT B.bid

FROM Boats B

WHERE NOT EXISTS (SELECT R.bid

水手S使得...

FROM Reserves R

WHERE R bids=B.bid

AND R.sid = S.sid))

没有船B没有...

显示S预订了B的Reserves元组

**双重否定，找到这样的水手使得没有一艘船是没有预定过的**

## 3.2 用户界面和SQL语言 (2/4)

### 聚合运算符

关系代数的重要扩展。

- COUNT $(*)$
- COUNT ([DISTINCT] A)
- SUM ([DISTINCT] A)
- AVG ([DISTINCT] A)
- MAX (A)
- MIN (A)

A是单列

### 聚合运算符示例

```sql
SELECT COUNT (*)

FROM Sailors S
```

```sql
SELECT COUNT (DISTINCT S.rating)

FROM Sailors S

WHERE S.sname='Bob'
```

```sql
SELECT AVG (S.age)

FROM Sailors S

WHERE S.rating = 10
```

```sql
SELECT AVG (DISTINCT S.age)

FROM Sailors S

WHERE S.rating = 10
```

```sql
SELECT S.sname

FROM Sailors S

WHERE S.rating = (SELECT MAX(S2.rating)

FROM Sailors S2)
```



### 查找最年长的水手的姓名和年龄

第一个查询是非法的！（我们稍后会查看原因，当我们讨论GROUP BY时。）

第三个查询等价于第二个查询，在SQL/92标准中是允许的，但在某些系统中不支持。

```sql
SELECT S.sname, MAX (S.age) FROM Sailors S
```

```sql
SELECT S.sname, S.age 
FROM Sailors S
WHERE S.age = (SELECT MAX (S2.age) FROM Sailors S2)
```

```sql
SELECT S.sname, S.age  
FROM Sailors S  
WHERE (SELECT MAX (S2.age) FROM Sailors S2) = S.age
```



### 分组的动机

到目前为止，我们已经将聚合运算符应用于所有（符合条件的）元组。有时，我们希望将它们应用于几个元组组中的每一个。

- 考虑：查找每个等级级别的最年轻水手的年龄。

一般来说，我们不知道存在多少个等级级别，以及这些级别的等级值是什么！

假设我们知道等级值从1到10；我们可以编写10个这样的查询（！）：

对于 $i = 1,2,\ldots ,10$

```sql
SELECT MIN (S.age)

FROM Sailors S

WHERE S.rating = i
```



### 带GROUP BY和HAVING的查询

```sql
SELECT [DISTINCT] target-list

FROM relation-list

WHERE qualification

GROUP BY grouping-list

HAVING group-qualification
```

target-list包含

(i) 属性名  
(ii) 带聚合操作的项（例如，MIN (S.age)）。

属性列表(i)必须是grouping-list的子集。直观地说，每个答案元组对应一个组，这些属性在每个组中必须具有单个值。（组是具有相同grouping-list中所有属性值的元组集合。）（第155页）

**SELECT 里的非聚合属性必须出现在 GROUP BY 里**

### 概念评估

- 计算relation-list的笛卡尔积，丢弃不符合条件的元组，删除"不必要的"字段，然后根据grouping-list中属性的值将剩余元组划分为组。

然后应用group-qualification来消除某些组。group-qualification中的表达式必须在每个组中具有单个值！

- 实际上，group-qualification中不是聚合操作参数的属性也出现在grouping-list中。（SQL在这里不利用主键语义！）

即，出现在Select和Having子句中的属性必须是出现在group by子句中的属性的子集。

为每个符合条件的组生成一个答案元组。

### 查找年龄 $\geq 18$ 的最年轻水手的年龄，对于每个至少有2个这样的水手的等级

```sql
SELECT S.rating, MIN (S.age) AS minage
FROM Sailors S
WHERE S.age >= 18
GROUP BY S.rating
HAVING COUNT (*) > 1
```

答案关系：

<table><tr><td>rating</td><td>minage</td></tr><tr><td>3</td><td>25.5</td></tr><tr><td>7</td><td>35.0</td></tr><tr><td>8</td><td>25.5</td></tr></table>

Sailors实例：

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td></tr><tr><td>29</td><td>brutus</td><td>1</td><td>33.0</td></tr><tr><td>31</td><td>lubber</td><td>8</td><td>55.5</td></tr><tr><td>32</td><td>andy</td><td>8</td><td>25.5</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td></tr><tr><td>64</td><td>horatio</td><td>7</td><td>35.0</td></tr><tr><td>71</td><td>zorba</td><td>10</td><td>16.0</td></tr><tr><td>74</td><td>horatio</td><td>9</td><td>35.0</td></tr><tr><td>85</td><td>art</td><td>3</td><td>25.5</td></tr><tr><td>95</td><td>bob</td><td>3</td><td>63.5</td></tr><tr><td>96</td><td>frodo</td><td>3</td><td>25.5</td></tr></table>

### 查找年龄 $\geq 18$ 的最年轻水手的年龄，对于每个至少有2个这样的水手且每个水手都小于60的等级

HAVING COUNT (*) > 1 AND EVERY (S.age <= 60)

将EVERY改为ANY的结果是什么？

### 对于每艘红色船，查找此船的预订数量

```sql
SELECT B.bid, COUNT (*) AS scount FROM Boats B, Reserves R WHERE R.bid=B.bid AND B.color='red' GROUP BY B.bid
```



- 对两个关系的连接进行分组。

如果我们将B.color='red'从WHERE子句中移除，并在HAVING子句中添加此条件，我们会得到什么？

```sql
SELECT B.bid, COUNT (*) AS scount

FROM Boats B, Reserves R

WHERE R bids = B.bid AND B.color = 'red'

GROUP BY B.bid
```

如果我们将B.color='red'从WHERE子句中移除，并在HAVING子句中添加此条件，我们会得到什么？

```sql
SELECT B.bid, COUNT (*) AS scount

FROM Boats B, Reserves R

WHERE R bids = B.bid

GROUP BY B.bid, B.color='red'

HAVING B.color='red'
```

**上面的不合法** B.color不在聚合列里

### 查找年龄 $>18$ 的最年轻水手的年龄，对于每个至少有2个水手（任何年龄）的等级

```sql
SELECT S.rating, MIN (S.age)

FROM Sailors S

WHERE S.age > 18

GROUP BY S.rating

HAVING 1 < ( SELECT COUNT (*)

FROM Sailors S2

WHERE S2.rating = S.rating)
```



- 显示HAVING子句也可以包含子查询。

将此与只考虑有2个超过18岁的水手的等级的查询进行比较！

如果HAVING子句替换为：

HAVING COUNT(*) >1

### 查找平均年龄是所有等级中最小值的那些等级

- 聚合操作不能嵌套！错误：

```sql
SELECT S.rating
FROM Sailors S
WHERE S.age = (SELECT MIN (AVG(S2.age))
FROM Sailors S2)
```

正确解决方案：

```sql
SELECT Temp.rating
FROM (
  SELECT S.rating, AVG(S.age) AS avgage
  FROM Sailors S
  GROUP BY S.rating
) AS Temp
WHERE Temp.avgage = (
  SELECT MIN(Temp2.avgage)
  FROM (
    SELECT AVG(S2.age) AS avgage
    FROM Sailors S2
    GROUP BY S2.rating
  ) AS Temp2
);
```



### 空值

- 元组中的字段值有时是未知的（例如，尚未分配等级）或不适用的（例如，没有配偶姓名）。

- SQL为这种情况提供了一个特殊值null。

空值的存在使许多问题复杂化。例如：

- 需要特殊运算符来检查值是否为空/不为空。
- 当rating等于null时，rating $> 8$ 是真还是假？AND、OR和NOT连接词呢？

我们需要三值逻辑（真、假和未知）。

- 必须仔细定义构造的含义。（例如，WHERE子句消除不评估为真的行。）
- 可能/需要新运算符（特别是外连接）。

### SQL的一些新特性

- CAST表达式
- CASE表达式
- 子查询
- 外连接
- 递归

### CAST表达式

- 将表达式转换为目标数据类型
- 有效目标类型
- 用途

- 匹配函数参数
- substr(string1, CAST(x AS Integer), CAST(y AS Integer))
- 计算时更改精度
- CAST (elevation AS Decimal $(5,0)$ )
- 为NULL值分配数据类型

### CAST表达式

示例：

Students (name, school)

Soldiers (name, service)

```sql
CREATE VIEW prospects (name, school, service) AS 
SELECT name, school, CAST(NULL AS Varchar(20)) FROM Students
UNION
SELECT name, CAST(NULL AS Varchar(20)), service FROM Soldiers;
```



### CASE表达式

简单形式：

Officers (name, status, rank, title)

```sql
SELECT name, CASE status
WHEN 1 THEN 'Active Duty'
WHEN 2 THEN 'Reserve'
WHEN 3 THEN 'Special Assignment'
WHEN 4 THEN 'Retired'
ELSE 'Unknown'
END AS status
FROM Officers ;
```



### CASE表达式

- 一般形式（使用搜索条件）：

Machines (serialno, type, year, hours_used, accidents)

- 查找"链锯"在整个事故中的事故率：

```sql
SELECT sum (CASE
WHEN type='chain saw' THEN accidents
ELSE 0e0
END) / sum (accidents)
FROM Machines;
```



### CASE表达式

查找每种设备的平均事故率：

```sql
SELECT type, CASE
WHEN sum(hours_used) >0 THEN
sum(accidents)/sum(hours_used)
ELSE NULL
END AS accident_rate
FROM Machines
GROUP BY type;
```

（因为某些设备可能根本没有使用，它们的hours_used为0。使用CASE可以防止表达式除以0。）

### CASE表达式

- 与以下比较：

```sql
SELECT type, sum(accidents)/sum(hours_used)
FROM Machines
GROUP BY type
HAVING sum(hours_used) >0;
```



## 3.3 用户界面和SQL语言 (3/4)

### SQL的一些新特性

- CAST表达式
- CASE表达式
- 子查询
- 外连接
- 递归

### 子查询

嵌入查询和带相关性的嵌入查询

子查询的功能在新SQL标准中得到了增强。现在它们可以在SELECT和FROM子句中使用

- 标量子查询
- 表表达式
- 公共表表达式

### 标量子查询

子查询的结果是单个值。它可以在值可以出现的地方使用。

- 查找平均奖金高于平均工资的部门名称：dept (deptno, deptname, location), emp (deptno, salary, bonus)

```sql
SELECT d.deptname
FROM dept AS d
WHERE
  (SELECT AVG(e.bonus)
   FROM emp AS e
   WHERE e.deptno = d.deptno)
  >
  (SELECT AVG(e.salary)
   FROM emp AS e
   WHERE e.deptno = d.deptno);
```



### 标量子查询

列出位于纽约的所有部门的deptno、deptname和最大工资：

```sql
SELECT d.deptno, d.deptname, (SELECT MAX (salary)

FROM emp

WHERE deptno=d.deptno) AS maxpay

FROM dept AS d

WHERE d.location = 'New York';
```

使用GROUP BY怎么样？

### 表表达式

- 子查询的结果是一个表。它可以在表可以出现的地方使用。

```sql
SELECT startyear, avg(pay)

FROM (SELECT name, salay+bonus AS pay, year(startdate) AS startyear FROM emp) AS emp2

GROUP BY startyear;
```

- 查找总支付大于200000的部门

```sql
SELECT deptno, totalpay

FROM (SELECT deptno, sum(salay) + sum(bonus) AS totalpay FROM emp GROUP BY deptno) AS payroll

WHERE totalpay >200000;
```

表表达式实际上是临时视图。

### 公共表表达式

- 在某些复杂查询中，表表达式可能需要在同一SQL语句中出现多次。虽然这是允许的，但效率低且可能存在一致性问题。
- WITH子句可用于定义公共表表达式。实际上，它定义了一个临时视图。
- 查找总支付最高的部门：

### 公共表表达式

- 查找总支付最高的部门：（提示：我们需要使用payroll表两次） 

  ```sql
  WITH payroll (deptno, totalpay) AS
  (SELECT deptno, sum(salary) + sum(bonus)
  FROM emp
  GROUP BY deptno)
  SELECT deptno
  FROM payroll
  WHERE totalpay = (SELECT max(totalpay)
  FROM payroll);
  ```

公共表表达式主要用于需要多级关注的查询。

### 公共表表达式

- 查找部门对，其中第一个部门的平均工资是第二个部门的两倍以上：

```sql
WITH deptavg (deptno, avgsal) AS
(SELECT deptno, avg(salary)
FROM emp
GROUP BY deptno)
SELECT d1.deptno, d1.avgsal, d2.deptno, d2.avgsal
FROM deptavg AS d1, deptavg AS d2
WHERE d1.avgsal >2*d2.avgsal;
```



### 外连接

- 连接操作的扩展。在连接操作中，只有满足连接条件的匹配元组保留在结果中。外连接将保留未匹配的元组，空缺部分设置为Null：

- 左外连接 $(* \bowtie)$

在结果中保留左关系的所有元组。

右外连接 $(\bowtie^{*})$

在结果中保留右关系的所有元组。

- 全外连接 $(*\bowtie^{*})$

在结果中保留左关系和右关系的所有元组。

### 外连接示例

s1

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td></tr><tr><td>31</td><td>lubber</td><td>8</td><td>55.5</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td></tr></table>

R1

<table><tr><td>sid</td><td>bid</td><td>day</td></tr><tr><td>22</td><td>101</td><td>10/10/96</td></tr><tr><td>58</td><td>103</td><td>11/12/96</td></tr></table>

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td><td>bid</td><td>day</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td><td>101</td><td>10/10/96</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td><td>103</td><td>11/12/96</td></tr><tr><td>31</td><td>Lubber</td><td>8</td><td>55.5</td><td>null</td><td>null</td></tr></table>

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td><td>bid</td><td>day</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td><td>101</td><td>10/10/96</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td><td>103</td><td>11/12/96</td></tr></table>

<table><tr><td>sid</td><td>sname</td><td>rating</td><td>age</td><td>bid</td><td>day</td></tr><tr><td>22</td><td>dustin</td><td>7</td><td>45.0</td><td>101</td><td>10/10/96</td></tr><tr><td>58</td><td>rusty</td><td>10</td><td>35.0</td><td>103</td><td>11/12/96</td></tr><tr><td>31</td><td>Lubber</td><td>8</td><td>55.5</td><td>null</td><td>null</td></tr></table>

S1 * R1

$\mathrm{S} 1 \boxtimes^ {*} \mathrm{R} 1 =$

S1R1 (为什么？)

S1 *R1

### 外连接

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

### 递归

如果公共表表达式在其定义中使用自身，这称为递归。它可以在一个SQL语句中计算复杂的递归推理。FedEmp (name, salary, manager)

- 查找Hoover管理下且工资超过100000的所有员工

```sql
WITH agents (name, salary) AS  
((SELECT name, salary --- 初始查询  
FROM FedEmp  
WHERE manager='Hoover')  
UNION ALL  
(SELECT f.name, f.salary --- 递归查询  
FROM agents AS a, FedEmp AS f  
WHERE f.manager = a.name))  
SELECT name --- 最终查询  
FROM agents  
WHERE salary > 100000;
```

### 递归计算

经典的"零件搜索问题"

Components

<table><tr><td>Part</td><td>Subpart</td><td>QTY</td></tr><tr><td>wing</td><td>strut</td><td>5</td></tr><tr><td>wing</td><td>aileron</td><td>1</td></tr><tr><td>wing</td><td>landing gear</td><td>1</td></tr><tr><td>wing</td><td>rivet</td><td>100</td></tr><tr><td>strut</td><td>rivet</td><td>10</td></tr><tr><td>aileron</td><td>hinge</td><td>2</td></tr><tr><td>aileron</td><td>rivet</td><td>5</td></tr><tr><td>landing gear</td><td>hinge</td><td>3</td></tr><tr><td>landing gear</td><td>rivet</td><td>8</td></tr><tr><td>hinge</td><td>rivet</td><td>4</td></tr></table>

有向无环图，确保递归可以停止

### 递归计算

查找一个机翼使用了多少铆钉？

定义临时视图以显示指定零件中每个子零件的数量列表：

```sql
WITH wingpart (subpart, qty) AS

((SELECT subpart, qty ---初始查询

FROM components

WHERE part='wing')

UNION ALL

(SELECT c.subpart, w.qty*c.qty ---递归查询

FROM wingpart w, components c

WHERE w.subpart=c.partition))
```

wingpart

<table><tr><td>Subpart</td><td>QTY</td></tr><tr><td>strut</td><td>5</td></tr><tr><td>aileron</td><td>1</td></tr><tr><td>landing gear</td><td>1</td></tr><tr><td>rivet</td><td>100</td></tr><tr><td>rivet</td><td>50</td></tr><tr><td>hinge</td><td>2</td></tr><tr><td>rivet</td><td>5</td></tr><tr><td>hinge</td><td>3</td></tr><tr><td>rivet</td><td>8</td></tr><tr><td>rivet</td><td>8</td></tr><tr><td>rivet</td><td>12</td></tr></table>

### 递归计算

- 查找一个机翼使用了多少铆钉？

```sql
WITH wingpart (subpart, qty) AS
((SELECT subpart, qty ---初始查询
FROM components
WHERE part='wing')
UNION ALL
(SELECT c.subpart, w.qty*c.qty ---递归查询
FROM wingpart w, components c
WHERE w.subpart=c.partition))
SELECT sum(qty) AS qty
FROM wingpart
WHERE subpart='rivet';
```

结果是：

<table><tr><td>qty</td></tr><tr><td>183</td></tr></table>

### 递归计算

- 查找组装一个机翼所需的所有子零件及其总数量：

```sql
WITH wingpart (subpart, qty) AS
((SELECT subpart, qty ---初始查询
FROM components
WHERE part='wing')
UNION ALL
(SELECT c.subpart, w.qty*c.qty ---递归查询
FROM wingpart w, components c
WHERE w.subpart=c.partition))
SELECT subpart, sum(qty) AS qty
FROM wingpart
Group BY subpart;
```

结果是：

<table><tr><td>subpart</td><td>qty</td></tr><tr><td>strut</td><td>5</td></tr><tr><td>aileron</td><td>1</td></tr><tr><td>landing gear</td><td>1</td></tr><tr><td>hinge</td><td>5</td></tr><tr><td>rivet</td><td>183</td></tr></table>

### 递归搜索

典型的航空公司路线搜索问题

查找从SFO到JFK的最低总成本路线

Flights

<table><tr><td>FlightNo</td><td>Origin</td><td>Destination</td><td>Cost</td></tr><tr><td>HY 120</td><td>DFW</td><td>JFK</td><td>225</td></tr><tr><td>HY 130</td><td>DFW</td><td>LAX</td><td>200</td></tr><tr><td>HY 140</td><td>DFW</td><td>ORD</td><td>100</td></tr><tr><td>HY 150</td><td>DFW</td><td>SFO</td><td>300</td></tr><tr><td>HY 210</td><td>JFK</td><td>DFW</td><td>225</td></tr><tr><td>HY 240</td><td>JFK</td><td>ORD</td><td>250</td></tr><tr><td>HY 310</td><td>LAX</td><td>DFW</td><td>200</td></tr><tr><td>HY 350</td><td>LAX</td><td>SFO</td><td>50</td></tr><tr><td>HY 410</td><td>ORD</td><td>DFW</td><td>100</td></tr><tr><td>HY 420</td><td>ORD</td><td>JFK</td><td>250</td></tr><tr><td>HY 450</td><td>ORD</td><td>SFO</td><td>275</td></tr><tr><td>HY 510</td><td>SFO</td><td>DFW</td><td>300</td></tr><tr><td>HY 530</td><td>SFO</td><td>LAX</td><td>50</td></tr><tr><td>HY 540</td><td>SFO</td><td>ORD</td><td>275</td></tr></table>

### 递归搜索

```sql
WITH trips (destination, route, nsegs, totalcost) AS
((SELECT destination, CAST(destination AS varchar(20)), 1, cost
FROM flights
--- 初始查询
WHERE origin='SFO')
UNION ALL
(SELECT fdestination,
--- 递归查询
CAST(t-route || ',' || fdestination AS varchar(20)),
t.nseqs+1, t.totalcost+f.cost
FROM trips t, flights f
WHERE tdestination = f.origin
AND fdestination<>'SFO'
--- 停止规则1
AND f.origin<>'JFK'
--- 停止规则2
AND t.nseqs $< = 3$
--- 停止规则3
SELECT route, totalcost
--- 最终查询
FROM trips
WHERE destination='JFK' AND totalcost=
--- 最低成本规则
(SELECT min(totalcost)
FROM trips
WHERE destination='JFK');
```



### 结果

Trips

<table><tr><td>Destination</td><td>Route</td><td>Nsegs</td><td>Totalcost</td></tr><tr><td>DFW</td><td>DFW</td><td>1</td><td>300</td></tr><tr><td>ORD</td><td>ORD</td><td>1</td><td>275</td></tr><tr><td>LAX</td><td>LAX</td><td>1</td><td>50</td></tr><tr><td>JFK</td><td>DFW, JFK</td><td>2</td><td>525</td></tr><tr><td>LAX</td><td>DFW, LAX</td><td>2</td><td>500</td></tr><tr><td>ORD</td><td>DFW, ORD</td><td>2</td><td>400</td></tr><tr><td>DFW</td><td>LAX, DFW</td><td>2</td><td>250</td></tr><tr><td>DFW</td><td>ORD, DFW</td><td>2</td><td>375</td></tr><tr><td>JFK</td><td>ORD, JFK</td><td>2</td><td>525</td></tr><tr><td>DFW</td><td>DFW, LAX, DFW</td><td>3</td><td>700</td></tr><tr><td>DFW</td><td>DFW, ORD, DFW</td><td>3</td><td>500</td></tr><tr><td>JFK</td><td>DFW, ORD, JFK</td><td>3</td><td>650</td></tr><tr><td>LAX</td><td>LAX, DFW, LAX</td><td>3</td><td>450</td></tr><tr><td>JFK</td><td>LAX, DFW, JFK</td><td>3</td><td>475</td></tr><tr><td>ORD</td><td>LAX, DFW, ORD</td><td>3</td><td>350</td></tr><tr><td>LAX</td><td>ORD, DFW, LAX</td><td>3</td><td>575</td></tr><tr><td>JFK</td><td>ORD, DFW, JFK</td><td>3</td><td>600</td></tr><tr><td>ORD</td><td>ORD, DFW, ORD</td><td>3</td><td>475</td></tr></table>

最终结果

<table><tr><td>route</td><td>totalcost</td></tr><tr><td>LAX, DFW, JFK</td><td>475</td></tr></table>

### 递归搜索

- 只需稍微更改最终查询，就可以找到最少转机时间的路线：

```sql
SELECT route, totalcost
--- 最终查询
FROM trips
WHERE destination='JFK' AND nsecs=
--- 最少停靠规则
(SELECT min(nsecs)
FROM trips
WHERE destination='JFK');
```

最终结果

<table><tr><td>route</td><td>totalcost</td></tr><tr><td>DFW, JFK</td><td>525</td></tr><tr><td>ORD, JFK</td><td>525</td></tr></table>

## 3.4 用户界面和SQL语言 (4/4)

### 总结

- 单表或多表查询，
- 嵌套查询或相关嵌套查询，
- 集合运算符查询，
- 聚合运算符查询，
- Group By查询，
- CAST表达式查询，
- CASE表达式查询，
- 子查询，
- 递归。

### SQL语言

根据功能可以划分为四个部分。

- 数据定义语言（DDL），用于定义、删除或修改数据模式。
- 查询语言（QL），用于检索数据
- 数据操作语言（DML），用于插入、删除或更新数据。
- 数据控制语言（DCL），用于控制用户对数据的访问权限。

- 本章详细介绍QL和DML。

### 数据操作语言

### Insert

- 向表中插入一个元组
- INSERT INTO EMPLOYEES VALUES ('Smith', 'John', '1980-06-10', 'Los Angles', 16, 45000);

### Delete

- 删除满足条件的元组
- DELETE FROM Person WHERE LastName = 'Rasmussen';

### Update

- 更新满足条件的元组的属性值

- UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing' WHERE LastName = 'Wilson';

### SQL中的视图

### 一般视图

- 从基表派生的虚拟表
- 逻辑数据独立性
- 数据安全性
- 视图的更新问题

### 临时视图和递归查询

- WITH（公共表表达式）
- RECURSIVE

### 抽象层次：ANSI-SPARC架构

多个视图，单一概念（逻辑）模式和物理模式。

- 视图描述用户如何看待数据。
- 概念模式定义逻辑结构
- 物理模式描述使用的文件和索引。

$\boxtimes$ 模式使用DDL定义；数据使用DML修改/查询。

### SQL中的视图

### 一般视图

- 从基表派生的虚拟表
- 逻辑数据独立性
- 数据安全性
- 视图的更新问题

### 临时视图和递归查询

- WITH
- RECURSIVE

### 视图的更新问题

- CREATE VIEW YoungSailor AS SELECT sid, sname, rating FROM Sailors WHERE age<26;
- CREATE VIEW Ratingavg AS SELECT rating, AVG(age) FROM Sailors GROUP BY rating;

### 嵌入式SQL

为了在程序中访问数据库，并对查询结果进行进一步处理，需要将SQL和编程语言（如C / C++等）结合使用

需要解决的问题：

- 如何在编程语言中接受SQL语句
- 如何在编程语言和DBMS之间交换数据和消息
- DBMS的查询结果是一个集合，如何将其传输到编程语言中的变量
- DBMS和编程语言的数据类型可能不完全相同。

### 一般解决方案

### 嵌入式SQL

最基本的方法。通过预编译，将嵌入式SQL语句转换为内部库函数调用来访问数据库。

### 编程API

- 直接向程序员提供一组库函数或DLL，在编译时与应用程序链接。

### 类库

- 在OOP出现后得到支持。将访问数据库的库函数封装为一组类，提供在编程语言中处理数据库的更容易方式。

### 嵌入式SQL的使用（在C中）

- SQL语句可以直接在C程序中使用：

- 以EXEC SQL开头，以';'结尾
- 通过宿主变量在C和SQL之间传输信息。宿主变量应以EXEC SQL开头定义。
- 在SQL语句中，应在宿主变量前添加': '以区别于SQL自己的变量或属性名。
- 在宿主语言（如C）中，宿主变量用作一般变量。
- 不能将宿主变量定义为结构体。
- 特殊宿主变量，SQLCA（SQL通信区） EXEC SQL INCLUDE SQLCA
- 使用SQLCA.SQLCODE来判断结果的状态。
- 使用指示符（short int）在宿主语言中处理NULL。

### 宿主变量定义示例

```c
EXEC SQL BEGINDECLARE SECTION;

char SNO[7];

char GIVENSNO[7];

char CNO[6];

char GIVENCNO[6];

float GRADE;

short GRADEI; /*GRADE的指示符*/

EXEC SQL ENDDECLARE SECTION;
```



### 可执行语句

CONNECT

- EXEC SQL CONNECT :uid IDENTIFIED BY :pwd;

- 执行DDL或DML语句

- EXEC SQL INSERT INTO SC(SNO,CNO,GRADE)

VALUES(:SNO, :CNO, :GRADE);

- 执行查询语句

- EXEC SQL SELECT GRADE

INTO :GRADE :GRADEI

FROM SC

WHERE SNO=:GIVENSNO AND

CNO=:GIVENCNO;

- 因为 $\{\mathrm{SNO}, \mathrm{CNO}\}$ 是SC的键，此查询的结果只有一个元组。如果结果有多个元组，如何处理？

### 游标

1. 定义游标

EXEC SQL DECLARE <CURSORname> CURSORFOR SELECT... FROM... WHERE...

2. EXEC SQL OPEN <cursor name>

类似于打开文件

3. 从游标获取数据

EXEC SQL FETCH <cursor name>

INTO :hostvar1, :hostvar2, ...;

4. 当到达游标末尾时，SQLCA.SQLCODE将返回100

5. CLOSE CURSOR <cursor name>

### 使用游标的查询示例

```c
EXEC SQLDECLARE C1 CURSOR FOR SELECT SNO, GRADE FROM SC WHERE CNO  $=$  :GIVENCNO;   
EXEC SQL OPEN C1;   
if (SQLCA.SQLCODE  <  0  exit(1); /* 查询中有错误*/
while (1){ 
  EXEC SQL FETCH C1 INTO :SNO,:GRADE:GRADEI 
  if (SQLCA.SQLCODE = 100 ) break; /*处理从游标获取的数据，省略*/   
}   
EXEC SQL CLOSE C1;
```



#### 为什么需要嵌入式 SQL？

SQL 是**声明式语言**：你告诉 DBMS “要什么”，DBMS 返回一个**集合/结果集**。

但程序（C/C++）更像**命令式**：一步步处理数据，通常需要把结果放进变量、循环处理、做业务逻辑。

所以要解决四件事（你列得很标准）：

1. **程序里如何写 SQL**（语法/编译支持）
2. **程序与 DBMS 如何交换数据和状态**（参数、错误码、消息）
3. **SQL 返回的是集合，程序变量是标量/结构**：如何把集合搬进程序？
4. **类型与 NULL 问题**：C 没有 NULL 值语义，需要额外机制

#### 三类“把数据库接入程序”的方案差别

A) 嵌入式 SQL（Embedded SQL）**

- 在 C 源码里直接写 SQL（EXEC SQL ...;）
- 通过 **预编译器（precompiler）** 把 SQL 语句翻译成底层库函数调用
- 优点：SQL 语句直观、接近标准；缺点：需要预编译工具链、写法更“老派”

B) 编程 API（如 ODBC/JDBC、某 DB 的 C API）

- 你直接调用库函数：prepare、bind、execute、fetch…
- 优点：控制力强、无需预编译；缺点：代码更啰嗦、SQL 藏在字符串里

C) 类库/ORM（OOP 封装）

- 把连接/语句/结果集封装成对象（甚至自动映射到类）
- 优点：更易用；缺点：抽象层可能掩盖 SQL 细节、性能可控性下降

#### 嵌入式 SQL 的核心机制：预编译 + 宿主变量

EXEC SQL ...;

- EXEC SQL 开头 + 分号结尾
- 预编译器识别这些片段，把它们翻译成 DBMS 的运行库调用

#### 宿主变量（host variables）

你在 C 里定义变量，让 SQL 读/写它们：

- 在 C 中：它就是普通变量（char 数组、int、float…）
- 在 SQL 中引用时：前面加 :，如 :SNO

必须放在：

```
EXEC SQL BEGIN DECLARE SECTION;
...
EXEC SQL END DECLARE SECTION;
```

这是告诉预编译器：这些变量需要参与 SQL 的绑定。

> 你提到“不能把宿主变量定义为结构体”：很多教材这么写是为了简化（避免复杂类型映射）；实际产品里可能支持结构体或记录映射，但考试通常按“标量/数组”来。

####  SQLCA：如何拿到执行状态/错误信息

```
EXEC SQL INCLUDE SQLCA;
```

会引入一个通信区结构（SQL Communication Area）：

- SQLCA.SQLCODE：最常用的状态码
  - **0**：成功
  - **>0**：成功但有告警（例如截断）
  - **<0**：错误（例如没找到、违反约束等）
- 还可能有 SQLERRM（错误消息）、影响行数等（不同实现细节不同）

#### NULL 怎么办？指示符变量（indicator）

C 里没有 SQL 的 NULL 概念。解决方法：给每个可能为 NULL 的列配一个 **indicator**（通常 short int）。

例子：

```
float GRADE;
short GRADEI;  // indicator
```

在 SELECT ... INTO 时写成：

```
EXEC SQL SELECT GRADE
INTO :GRADE :GRADEI
FROM SC
WHERE ...;
```

规则（常见约定）：

- GRADEI = 0：GRADE 非 NULL，值有效
- GRADEI < 0：GRADE 为 NULL（常用 -1）
- GRADEI > 0：可能表示截断/溢出等告警（依实现）

所以程序里要先看 GRADEI 再用 GRADE。

你给的单行查询：为什么可以**SELECT ... INTO**？

```
EXEC SQL SELECT GRADE
INTO :GRADE :GRADEI
FROM SC
WHERE SNO=:GIVENSNO AND CNO=:GIVENCNO;
```

因为 {SNO, CNO} 是 SC 的键 → 最多返回 **0 或 1 行**：

0 行：通常是 “NOT FOUND”（SQLCODE 可能是 100，依实现）

1 行：把值装入宿主变量（并设置 indicator）



#### 如果结果可能有多行（多个元组），怎么办？

**标准答案：用游标（cursor）**。

#### 为什么需要游标？

SQL 结果是集合，而 C 需要“逐行取”。游标就是 DBMS 给你的一个“结果集迭代器”。

#### 游标的典型四步（考试必背）

1. **DECLARE**：声明游标对应的查询
2. **OPEN**：执行查询，生成结果集
3. **FETCH**：一行一行取到宿主变量
4. **CLOSE**：关闭游标释放资源

####  典型代码骨架（你可以直接背/抄到卷子上）

```c
/* 1) 声明游标 */
EXEC SQL DECLARE c1 CURSOR FOR
    SELECT SNO, CNO, GRADE
    FROM SC
    WHERE SNO = :GIVENSNO;

/* 2) 打开游标 */
EXEC SQL OPEN c1;

/* 3) 逐行提取 */
while (1) {
    EXEC SQL FETCH c1 INTO :SNO, :CNO, :GRADE :GRADEI;

    if (SQLCA.SQLCODE == 100) break;   // no more rows
    if (SQLCA.SQLCODE < 0) { /* handle error */ break; }

    /* 在C里处理这一行 */
    if (GRADEI < 0) {
        /* grade is NULL */
    } else {
        /* use GRADE */
    }
}

/* 4) 关闭游标 */
EXEC SQL CLOSE c1;
```

#### 多行结果还有两种常见策略（理解题）

- **游标逐行处理**：最常见、最通用（上面）
- **把结果做聚合/限制成单行**：如果业务允许
  - 例如你只要最大/最小：MAX/MIN
  - 只要一行：FETCH FIRST 1 ROW ONLY / LIMIT 1（方言）
  - 只要计数：COUNT(*)

但当题目明确说“结果有多个元组如何处理”，课程标准答案几乎一定是：**cursor**。

#### 一句话总结你这页内容

- 嵌入式 SQL：把 SQL 写进 C，用预编译器翻译成库调用
- 宿主变量：C 与 SQL 的参数/结果通道（SQL里用 :var）
- SQLCA：拿执行状态与错误码
- indicator：处理 NULL
- 多行结果：**必须用游标 OPEN/FETCH/CLOSE**



### 概念评估

### 动态SQL

在上述嵌入式SQL中，SQL语句必须在编译前编写。但在某些应用程序中，SQL语句无法提前决定，需要在程序运行时动态构建。

- 动态SQL在SQL标准和大多数RDBMS产品中得到支持

- 直接执行的动态SQL
- 带动态参数的动态SQL
- 用于查询的动态SQL

### 直接执行的动态SQL

- 仅用于执行非查询SQL语句

```c
EXEC SQL BEGINDECLARE SECTION;
char sqlstring[200];
EXEC SQL ENDDECLARE SECTION;
char cond[150];
strcpy( sqlstring, "DELETE FROM STUDENT WHERE ");
printf("Enter search condition:");
scanf("%s", cond});
strcat( sqlstring, cond);
EXEC SQL EXECUTE IMMEDIATE :sqlstring;
```

### 带动态参数的动态SQL

- 仅用于执行非查询SQL语句。使用占位符在SQL语句中实现动态参数。类似于C中的宏处理方法。

```c
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

### 用于查询的动态SQL

用于动态形成查询语句

```c
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
scanf("%s", orderby);
strcat(sqlstring, orderby);
printf("Enter the course number:");
scanf("%s", GIVENCNO);
EXEC SQL PREPARE query FROM :sqlstring;
EXEC SQLDECLARE grade_cursor CURSOR FOR query;
EXEC SQL OPEN grade_cursor USING :GIVENCNO;
if (SQLCA.SQLCODE < 0 exit(1); /*查询中有错误*/ 
while (1){ 
  EXEC SQL FETCH grade_cursor INTO :SNO,:GRADE:GRADEI 
  if (SQLCA.SQLCODE = 100) break; /*处理从游标获取的数据，省略*/ ·   
}   
EXEC SQL CLOSE grade_cursor;
```



### 存储过程

- 用于提高性能并方便用户。有了它，用户可以将经常使用的数据库访问程序作为过程，编译后存储在数据库中，然后在需要时直接调用。

- 方便用户。用户可以直接调用它们，无需再次编码。它们是可重用的。
- 提高性能。存储过程已经编译，因此在使用时不需要再次解析和查询优化。
- 扩展DBMS的功能。（可以编写脚本）

### 存储过程示例

```sql
EXEC SQL
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
CALL drop_student(...); /* 稍后调用此存储过程*/
```

