# 3. 用户界面与 SQL 语言

SQL 是关系数据库用户最主要的接口，本章以统一结构梳理交互方式、查询语义、高级特性以及与编程语言的结合方式。

## 3.1 DBMS 用户接口概览

- **交互形态**：命令行、图形工具（GUI）、API、类库、嵌入式/动态 SQL。
- **查询语言种类**：形式化（关系代数/演算）、表格化、图形化、受限自然语言。
- **关键术语**：基表、视图、数据类型、NULL、UNIQUE、PRIMARY KEY、FOREIGN KEY、CHECK。

## 3.2 SQL 查询基础

### 抽象层次回顾

遵循 ANSI-SPARC 三层架构：视图-概念-物理。模式由 DDL 定义，数据由 DML 操作。

### SELECT-FROM-WHERE 语义

```sql
SELECT [DISTINCT] target_list
FROM relation_list
WHERE qualification;
```

- `target_list`：输出列或表达式；`DISTINCT` 默认关闭。
- `relation_list`：FROM 子句中的表及范围变量。
- `qualification`：由布尔表达式、AND/OR/NOT 组成。
- 概念评估：生成笛卡尔积 → 过滤 → 投影 → 可选去重。实际执行由优化器重新规划。

### 范围变量与联接

始终为表定义别名（`Sailors S`），便于多次引用或自连接。JOIN 条件通常出现在 WHERE 子句，也可使用显式 `JOIN ... ON` 语法。

### 集合运算符

- `UNION [ALL]`、`INTERSECT`、`EXCEPT`（某些系统为 `MINUS`），要求输入并兼容。
- 可用 `IN`/`NOT IN`、`EXISTS`/`NOT EXISTS`、`ANY`/`ALL` 重写集合运算。

### 子查询与相关子查询

- 嵌入 WHERE、FROM、SELECT 子句。
- 相关子查询会引用外层变量，需对外层每个元组执行。
- `EXISTS` 检查子查询是否返回元组；`UNIQUE` 检查结果是否无重复。

### 表达式与字符串匹配

- SQL 支持算术/逻辑表达式、别名（`AS` 或 `=`）。
- 字符串模式匹配用 `LIKE`（`_` 单字符，`%` 任意串）。

## 3.3 聚合、分组与 HAVING

### 聚合函数

`COUNT`, `SUM`, `AVG`, `MIN`, `MAX` 可选 `DISTINCT`。`COUNT(*)` 统计元组总数。

### GROUP BY / HAVING 规则

- SELECT 中非聚合列必须全部出现在 GROUP BY 中。
- HAVING 在分组后过滤组，可包含聚合或子查询。
- 示例：

```sql
SELECT S.rating, MIN(S.age) AS min_age
FROM Sailors AS S
WHERE S.age >= 18
GROUP BY S.rating
HAVING COUNT(*) > 1;
```

### 常见陷阱

- 聚合不能嵌套；如需比较聚合结果，使用子查询或派生表。
- WHERE 先于 GROUP BY 执行，用于过滤单行；HAVING 过滤组。

## 3.4 SQL 扩展特性

### NULL 与三值逻辑

- NULL 表示未知或不适用，需要 `IS NULL / IS NOT NULL` 判断。
- 布尔结果增加“未知”值；WHERE 只保留结果为真（TRUE）的行。

### CAST 表达式

`CAST(expr AS target_type)` 可改变精度或赋予 NULL 具体类型。例如将两个结果集合并时为缺失列填充 NULL 并指定类型。

### CASE 表达式

- 简单 CASE：`CASE status WHEN 1 THEN 'Active' ... END`。
- 搜索 CASE：`CASE WHEN condition THEN ... ELSE ... END`。
- 常用于分段计算、避免除零等逻辑。

## 3.5 子查询与公共表表达式（CTE）

### 标量与表子查询

- 标量子查询返回单值，可嵌入 SELECT 列表或条件中。
- 表子查询（派生表）可出现在 FROM 子句，供外层查询继续处理。

### WITH / 公共表表达式

```sql
WITH summary AS (
  SELECT deptno, AVG(salary) AS avg_salary
  FROM emp
  GROUP BY deptno
)
SELECT * FROM summary WHERE avg_salary > 100000;
```

- 可定义多个命名子查询；默认只在当前语句内可见。

### 递归 CTE

````sql
WITH RECURSIVE agents(name, salary) AS (
  SELECT name, salary FROM FedEmp WHERE manager = 'Hoover'
  UNION ALL
  SELECT f.name, f.salary
  FROM agents AS a JOIN FedEmp AS f ON f.manager = a.name
)
SELECT name FROM agents WHERE salary > 100000;
````

- 包含初始查询与递归查询两个部分，常用于层级遍历、物料清单（BOM）展开、路径搜索等，需设置终止条件防止无限循环。

## 3.6 DML、视图与权限

### 数据操作

- `INSERT INTO table [(cols)] VALUES (...)` 或 `INSERT ... SELECT ...`。
- `DELETE FROM table WHERE ...` 删除满足条件的行。
- `UPDATE table SET col = expr WHERE ...` 修改行。

### 视图（VIEW）

- 从基表派生的虚拟表，提供逻辑数据独立性与安全隔离。
- 可基于单表或多表；复杂视图存在更新限制。
- 临时视图可借助 WITH 子句；递归视图使用 `WITH RECURSIVE`。

### 权限与控制

- DCL 提供 `GRANT`/`REVOKE` 控制访问。
- 视图、行列级权限及审计结合使用以满足安全需求。

## 3.7 嵌入式 SQL 与游标

当应用程序需进一步处理查询结果时，可在宿主语言（如 C/C++）中嵌入 SQL。

### 基本机制

- SQL 语句以 `EXEC SQL ... ;` 形式出现，编译前需经预编译器转化为库函数调用。
- 宿主变量必须放在 `EXEC SQL BEGIN DECLARE SECTION` 块中，并在 SQL 里以 `:var` 访问。
- `SQLCA`（通信区）提供执行状态，`SQLCODE`=0 表示成功，100 表示无更多数据。
- 指示符（indicator）变量处理 NULL 值（<0 表示对应列为 NULL）。

### 处理结果集：游标

1. DECLARE：`EXEC SQL DECLARE c1 CURSOR FOR SELECT ...`。
2. OPEN：执行查询。
3. FETCH：逐行取数，直到 `SQLCODE = 100`。
4. CLOSE：释放资源。

示例：

```c
EXEC SQL DECLARE grade_cur CURSOR FOR
  SELECT sno, grade FROM SC WHERE cno = :course_no;
EXEC SQL OPEN grade_cur;
while (1) {
  EXEC SQL FETCH grade_cur INTO :sno, :grade :grade_ind;
  if (SQLCA.SQLCODE == 100) break;
  // 业务处理
}
EXEC SQL CLOSE grade_cur;
```

## 3.8 动态 SQL 与存储过程

### 动态 SQL

- **EXECUTE IMMEDIATE**：直接执行运行期构造的非查询语句。
- **PREPARE + EXECUTE**：预处理带占位符的语句，可多次运行。
- **动态查询**：结合游标与 `USING` 子句，运行期决定 SELECT 或 ORDER BY。

### 存储过程

- 将常用逻辑封装在 DBMS 端，编译后存储并通过 `CALL` 执行。
- 优势：重用、集中管理权限、减少网络往返、可扩展 DBMS 功能。

```sql
CREATE PROCEDURE drop_student (
  IN student_no CHAR(7),
  OUT message CHAR(30)
)
BEGIN ATOMIC
  DELETE FROM STUDENT WHERE SNO = student_no;
  DELETE FROM SC WHERE SNO = student_no;
  SET message = student_no || ' dropped';
END;
```

## 3.9 小结

- SQL 结合声明式语义与结构化语法，提供丰富的查询、聚合、集合、子查询与递归能力。
- CAST/CASE、CTE、递归等特性强化表达力；视图与 DML 支撑日常操作。
- 嵌入式与动态 SQL 将 DBMS 与主流编程语言整合，游标负责将集合结果映射为逐行处理。
- 在实际应用中，理解语义与执行策略同样重要，以便编写可维护且高效的 SQL。
