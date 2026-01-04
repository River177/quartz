# 5. 安全性和完整性约束

## 5.1 引言

数据库的破坏通常由以下因素引起：

- 系统故障
- 并发访问导致的不一致性
- 人为破坏（故意或意外）
- 输入的数据不正确，更新事务没有遵守一致性保持规则

在上述因素中，1和2应该通过DBMS的恢复机制来解决（第4章）；3属于数据库安全性；4属于完整性约束

## 5.2 数据库安全性

- 保护数据库不被非法访问。

### 访问控制

- 普通用户
- 具有资源特权的用户
- DBA（数据库管理员）

### 用户识别和认证

- 密码
- 特殊物品，如钥匙、IC卡等
- 个人特征，如指纹、签名等

### 授权

- GRANT CONNECT TO JOHN IDENTIFIED BY xyzabc;
- GRANT SELECT ON TABLES TO U1 WITH GRANT OPTION;

### 角色

### 数据加密

### 审计跟踪

- AUDIT SELECT, INSERT, DELETE, UPDATE ON emp WHENEVER SUCCESSFUL;

### 视图和查询重写

## 5.3 统计数据库安全性

在许多情况下，统计数据是公开的，而详细的个人数据是保密的。公共统计数据库。

- 但一些详细的个人数据可以从公共统计数据中推导出来

如何防止这种泄露？--- 这不是一件容易的事

### 个人追踪器

- 假设我们知道王是男性程序员，STATS中的工资是保密的，但其他信息是公开的，我们可以从公开数据中获取王的工资。

```sql
Q1: SELECT COUNT(*) FROM STATS WHERE SEX='M' AND OCCUPATION='programmer';
-- result = 1

Q2: SELECT SUM(SALARY) FROM STATS WHERE SEX='M' AND OCCUPATION='programmer';
-- result = 120
```

#### 个人追踪器 $(c > b, b = 2)$

```sql
Q3: SELECT COUNT(*)
FROM STATs;
-- result = 10

Q4: SELECT COUNT(*)
FROM STATS
WHERE NOT(SEX='M' AND OCCUPATION='programmer');
-- result = 9
```

现在我们只知道一个男性程序员，那一定是王。

```sql
Q5: SELECT SUM(SALARY)
FROM STATs;
-- result = 1420

Q6: SELECT SUM(SALARY)
FROM STATS
WHERE NOT(SEX='M' AND OCCUPATION='programmer');
-- result = 1300
```

王的工资 = Q5 - Q6 = 120

#### 个人追踪器 (b<c<n-b, b=2, n is 10)

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

现在我们只知道一个男性程序员，那一定是王。

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

王的工资 = Q9 - Q10 = 120

### 通用追踪器

假设谓词 $p = {p}_{1}$ 和 ${p}_{2}$，SET(p) 是满足 $p$ 的元组集合，那么

$$
\Rightarrow \operatorname{SET}(p) = \operatorname{SET}(p_{1} \text{ and } p_{2}) = \operatorname{SET}(p_{1}) - \operatorname{SET}(p_{1} \text{ and not } p_{2})
$$

它是一个满足以下条件的谓词 $T$：

$$
2 \mathrm {b} \leq | \operatorname {S E T} (T) | \leq (\mathrm {n - 2 b}), \mathrm {b <   n / 4}
$$

假设一个元组 $R$ 可以通过谓词 $p$ 唯一限定，即 $\operatorname{SET}(p) = \{R\}$，那么

$$
\mathrm {S E T} (p) = \mathrm {S E T} (p \mathrm {o r} T) \underline {{\cup}} \mathrm {S E T} (p \mathrm {o r n o t} T) - \mathrm {S E T} (T) - \mathrm {S E T} (\mathrm {n o t} T)
$$

$\triangleright$ $\underline{\mathsf{U}}$ 表示不消除重复元组的并集。

## 5.4 完整性约束

完整性约束（IC）描述了关系的每个合法实例必须满足的条件。

- 违反IC的插入/删除/更新是不允许的。
- 可用于确保应用语义（例如，sid是键），或防止不一致（例如，sname必须是字符串，age必须 $< 200$）

### 完整性约束的类型

静态约束：对数据库状态的约束

- 固有约束（数据模型），如1NF
- 隐式约束：在数据模式中隐含，通常由DDL指示。如域约束、主键约束、外键约束。
  - 域约束：字段值必须是正确的类型。总是被强制执行。
- 显式约束或一般约束

- 动态约束：数据库从一个状态转换到另一个状态时的约束。可以与触发器结合使用。

### 外键

外键：一个关系中的属性集，用于"引用"另一个关系中的元组。必须对应于第二个关系的主键。就像一个"逻辑指针"。

例如，sid是引用Students的外键：

- Students sid: string, name: string, login: string, age: integer, gpa: decimals)
- Enrolled sid: string, cid: string, grade: string)

### 数据库修改

如果 $\alpha$ 是 $\mathbf{r}_2$ 中的外键，引用 $\mathbf{r}_1$ 中的K1，则必须进行以下测试以保持以下引用完整性约束：

$$
\Pi_ {\alpha} (r _ {2}) \subseteq \Pi_ {K 1} (r _ {1})
$$

- 插入。如果将元组 $t_2$ 插入到 $r_2$ 中，系统必须确保在 $r_1$ 中存在元组 $t_1$，使得 $t_1[K_1] = t_2[\alpha]$。即

$$
t _ {2} \left[ \alpha \right] \in \prod_ {K 1} \left(r _ {1}\right)
$$

- 删除。如果从 $r_1$ 中删除元组 $t_1$，系统必须计算 $r_2$ 中引用 $t_1$ 的元组集：

$$
\sigma_ {\alpha = t 1 [ \mathrm {K} 1 ]} (r _ {2})
$$

如果此集合不为空，要么拒绝删除命令作为错误，要么必须删除引用 $t_1$ 的元组（级联删除是可能的）。

### 数据库修改（续）

更新。有两种情况：

如果在关系 $r_2$ 中更新元组 $t_2$，并且更新修改了外键 $\alpha$ 的值，则进行类似于插入情况的测试。让 $t_2'$ 表示元组 $t_2$ 的新值。系统必须确保

$$
t _ {2} ^ {\prime} [ \alpha ] \in \prod_ {\mathrm {K 1}} (r _ {1})
$$

如果在 $r_1$ 中更新元组 $t_1$，并且更新修改了主键 $(K_1)$ 的值，则进行类似于删除情况的测试。系统必须计算

$$
\sigma_ {\alpha = t 1 [ \mathrm {K} 1 ]} (r _ {2})
$$

使用 $t_1$ 的旧值（应用更新之前的值）。如果此集合不为空，更新可能被拒绝作为错误，或者更新可能级联到集合中的元组，或者集合中的元组可能被删除。

### 完整性约束的定义

- 用过程指示

让应用程序负责检查完整性约束。

- 用ASSERTION指示

- 用断言规范语言定义，由DBMS自动检查
- ASSERT balanceCons ON account: balance>=0;

- 在基表定义中用CHECK子句指示，由DBMS自动检查

### 一般约束

当涉及比键更一般的IC时很有用。

可以使用查询来表达约束。

约束可以被命名。

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

### 跨多个关系的约束

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

- 笨拙且错误！
- 如果Sailors为空，Boats元组的数量可以是任何值！

船只数量加上水手数量 $< 100$

### 断言

- 断言是正确的解决方案；不与任何表关联。

```sql
CREATE ASSERTION smallClub
CHECK
( (SELECT COUNT (S.sid) FROM Sailors S)
+ (SELECT COUNT (B.bid) FROM Boats B) < 100 )
```

## 5.5 触发器

- 触发器：如果DBMS发生指定更改，则自动启动的过程

三个部分：

- 事件（激活触发器）
- 条件（测试触发器是否应该运行）
- 动作（如果触发器运行会发生什么）

主动数据库规则（ECA规则）

### 触发器：示例

```sql
CREATE TRIGGER youngSailorUpdate
AFTER INSERT ON SAILORS
REFERENCING NEW TABLE NewSailors
FOR EACH STATEMENT
INSERT
INTO YoungSailors(sid, name, age, rating)
SELECT sid, name, age, rating
FROM NewSailors N
WHERE N.age <= 18
```

### 规则的执行

- 立即执行
- 延迟执行
- 解耦或分离模式
- 级联触发器
  - 控制规则的嵌套执行
  - 防止非终止
- 触发图
  - 指定级联次数的上限

因此应该合理使用触发器

### ECA的实现

- 松散耦合
- 紧密耦合（DB2、Oracle等）
- 嵌套方法

规则嵌套到事务中，由DBMS作为事务的一部分执行。

- 嫁接方法
- 查询修改方法

