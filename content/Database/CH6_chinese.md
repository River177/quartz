# 6. 数据库设计

## 6.1 数据依赖与关系模式的规范化

属性之间存在一些依赖关系。

- 函数依赖（FD）：最基本的数据依赖类型。一个或一组属性的值可以决定其他属性的值。

FD 在一般数据库设计中是最重要的。

- 多值依赖（MVD）：某个属性的值可以决定其他属性的一个值组。


- 连接依赖（JD）：无损连接分解的约束。

### 1NF（第一范式）

关系的每个属性必须是原子的。

<table><tr><td rowspan="2">name</td><td rowspan="2">dept</td><td colspan="3">address</td></tr><tr><td>prov</td><td>city</td><td>street</td></tr></table>

非 1NF

<table><tr><td>name</td><td>dept</td><td>prov</td><td>city</td><td>street</td></tr></table>

1NF

### 2NF（第二范式）

- R∈1NF 且属性之间不存在部分函数依赖。

S(S#, SNAME, AGE, ADDR, C#, GRADE)

- 非 2NF

### 非 2NF 的问题：

- 插入异常：无法插入未选课学生的信息。

- 删除异常：如果学生退选所有课程，其基本信息也会丢失。

- 更新困难：由于冗余，更新时难以保持一致性。

### 解决方法：

根据"一事一地"的原则，将关系分解为 2 个新关系：

S(S#, SNAME, AGE, ADDR)

SC(S#, C#, GRADE)

### 3NF（第三范式）

- R∈2NF 且属性之间不存在传递函数依赖。

EMP(EMP#, SAL_LEVEL, SALARY)

- 非 3NF

### 非 3NF 的问题

- 插入异常：在员工的工资级别确定之前，无法输入工资级别与工资之间的对应关系。

- 删除异常：如果某个工资级别只有一个人，当这个人被删除时，该级别的工资级别与工资之间的对应关系将丢失。

- 更新困难：由于冗余，更新时难以保持一致性。

解决方法：

根据"一事一地"的原则，将关系分解为 2 个新关系：

EMP(EMP#,SAL_LEVEL)

SAL(SAL_LEVEL,SALARY)

## 6.2 ER 模型与 ER 图

- 概念模型：实体-关系，独立于实际的 DBMS。

图例：

## 6.3 数据库设计方法（1/2）

### 面向过程的方法

该方法以业务流程为中心，数据库模式的设计基本上直接按照业务中的凭证、收据、报表等进行。

由于没有对数据和数据之间的内在关系进行详细分析，虽然在项目初期速度较快，但难以保证软件质量，系统也难以适应未来需求和环境的变化。

因此，这种方法不适合大型、复杂系统的开发。

## 6.3 数据库设计方法（2/2）

### 面向数据的方法

该方法基于对业务流程中涉及的数据和数据之间的内在关系的详细分析来设计数据库模式。

它以数据为中心，而不是以流程为中心。它不仅能满足当前需求，还能满足一些潜在需求。它易于适应未来需求和环境的变化。

建议在大型、复杂系统的开发中使用。

## 数据库设计流程

### 需求分析

系统需求分析的重要组成部分。在需求分析阶段，数据字典和 DFD（或 UML）图对数据库设计最为重要。

- 字典和数据流图（DFD）

- 命名冲突

- 同音异义词（相同名称但含义不同）

- 同义词（不同名称但含义相同）

- 概念冲突

- 域冲突

关于编码

信息的标准化

- 识别实体

- 压缩信息

- 通过需求分析，所有信息必须具有唯一来源和唯一责任。

### 概念设计

基于数据字典和 DFD，分析和分类数据字典中的数据，并参考 DFD 中反映的处理需求，识别实体、属性以及实体之间的关系。然后我们可以得到数据库的概念模式。

- 识别实体

- 定义实体之间的关系

- 绘制 ER 图并与用户讨论

建议使用 ERWin、Rose 等 ER 设计工具。

### 逻辑设计

根据 ER 图中的实体和关系，在目标 DBMS 中定义表和视图。基本标准是 3NF。

- 将 ER 图中的实体和关系转换为表

- 表和属性的命名规则

- 定义每个属性的类型和域

- 适当的反规范化

- 必要的视图

- 考虑遗留系统中的表

- 接口表

### 物理设计

对于关系数据库，此阶段的主要任务是根据处理需求考虑创建必要的索引，包括单属性索引、多属性索引、聚簇索引等。通常，经常作为查询条件的属性应该有索引。

### 其他问题：

- 分区设计

- 存储过程

- 触发器

- 完整性约束

### 备注

- 仅仅在结构上达到3NF (BCNF) 是不够的。

- "一事一地"包括每项信息的唯一，要提取出问题的本质，识别出本质上同一概念的信息项。

- 对于表达类似信息，模式相似只是取值不同的表，应尽量合并。如学习经历、进修经历；奖励信息、惩处信息等。

- 考虑到效率、用途等因素，该分开的表还应分开。如本科生基本信息和研究生基本信息。

- 结合DBMS内部实现技术，合理设计索引和文件结构，为查询优化准备好存取路径。

- 在结构规范化、减少数据冗余和提高数据库访问性能之间仔细权衡，适当折中。

数据库设计实例分析



## 第一范式（1NF）——原子性要求

### 1NF定义

第一范式要求数据库表中的每个字段都是不可分割的原子值，即表中的每个列都只包含单一值，不能包含重复的组或子表。

### 1NF示例分析

不符合1NF的表结构：

```js
StudentID | StudentName | Courses
1 | 张三 | 数学,物理,化学
2 | 李四 | 英语,历史,地理
```

问题分析：

- Courses字段包含了多个值，违反了原子性原则
- 查询特定课程的学生变得困难
- 更新课程信息时可能出现数据不一致

符合1NF的规范化：

```js
StudentID | StudentName | Course
1 | 张三 | 数学
1 | 张三 | 物理
1 | 张三 | 化学
2 | 李四 | 英语
2 | 李四 | 历史
2 | 李四 | 地理
```

### 1NF实现要点

- 每个字段都必须是单一值
- 不允许存在数组、列表或重复的列
- 每行数据都应该是唯一的

```sql
CREATE TABLE StudentCourses (
    StudentID INT,
    StudentName VARCHAR(50),
    Course VARCHAR(50),
    PRIMARY KEY (StudentID, Course)
);
```

## 第二范式（2NF）——完全函数依赖

### 2NF定义

第二范式要求数据库表必须满足1NF，并且所有非主键字段都完全依赖于主键，而不是依赖于主键的一部分（针对复合主键的情况）。

### 2NF示例分析

不符合2NF的表结构：

```js
OrderDetailID | OrderID | ProductID | ProductName | Quantity | CustomerName
1 | 1001 | P001 | 笔记本电脑 | 2 | 张三
2 | 1001 | P002 | 鼠标 | 1 | 张三
3 | 1002 | P001 | 笔记本电脑 | 1 | 李四
```

问题分析：

- 存在部分依赖：CustomerName只依赖于OrderID，而不依赖于整个复合主键(OrderID, ProductID)
- 数据冗余：同一订单的CustomerName重复存储
- 更新异常：修改客户姓名需要更新多行数据

符合2NF的规范化：
Orders表：

```js
OrderID | CustomerName
1001 | 张三
1002 | 李四
```

Products表：

```js
ProductID | ProductName
P001 | 笔记本电脑
P002 | 鼠标
```

OrderDetails表：

```js
OrderDetailID | OrderID | ProductID | Quantity
1 | 1001 | P001 | 2
2 | 1001 | P002 | 1
3 | 1002 | P001 | 1
```

### 2NF实现要点

- 消除部分函数依赖
- 将部分依赖的字段分离到独立的表中
- 建立外键关系维护数据完整性

```sql
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerName VARCHAR(100)
);

CREATE TABLE Products (
    ProductID VARCHAR(20) PRIMARY KEY,
    ProductName VARCHAR(100)
);

CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY,
    OrderID INT,
    ProductID VARCHAR(20),
    Quantity INT,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
```

## 第三范式（3NF）——传递依赖消除

### 3NF定义

第三范式要求数据库表满足2NF，并且所有非主键字段都不传递依赖于主键，即非主键字段之间不能存在依赖关系。

### 3NF示例分析

不符合3NF的表结构：

```js
EmployeeID | EmployeeName | DepartmentID | DepartmentName | DepartmentManager
E001 | 张三 | D001 | 技术部 | 王五
E002 | 李四 | D001 | 技术部 | 王五
E003 | 王六 | D002 | 销售部 | 赵七
```

问题分析：

- 存在传递依赖：DepartmentManager依赖于DepartmentID，而DepartmentID依赖于主键EmployeeID
- 数据冗余：同一部门的员工重复存储部门经理信息
- 更新异常：更换部门经理需要更新多行数据

符合3NF的规范化：
Employees表：

```js
EmployeeID | EmployeeName | DepartmentID
E001 | 张三 | D001
E002 | 李四 | D001
E003 | 王六 | D002
Departments表：
DepartmentID | DepartmentName | DepartmentManager
D001 | 技术部 | 王五
D002 | 销售部 | 赵七
```

### 3NF实现要点

- 消除传递函数依赖
- 将传递依赖的字段分离到独立的表中
- 保持表之间的引用完整性

```sql
CREATE TABLE Departments (
    DepartmentID VARCHAR(20) PRIMARY KEY,
    DepartmentName VARCHAR(100),
    DepartmentManager VARCHAR(100)
);

CREATE TABLE Employees (
    EmployeeID VARCHAR(20) PRIMARY KEY,
    EmployeeName VARCHAR(100),
    DepartmentID VARCHAR(20),
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);
```
