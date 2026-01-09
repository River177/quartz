# 5. 安全性与完整性约束

安全与完整性保障数据库在多用户环境下可靠运行。本章依次讨论安全威胁、访问控制、统计数据库泄露、防御机制以及约束与触发器。

## 5.1 引言

数据库破坏来源：

1. 系统故障（第 4 章通过恢复机制解决）。
2. 并发管理不当导致不一致（通过并发控制解决）。
3. 非法访问或恶意/误操作 —— 属于安全问题。
4. 错误数据输入或违反业务规则 —— 属于完整性约束问题。

## 5.2 数据库安全性

### 身份识别与认证

- 基于密码、实体令牌（IC 卡、钥匙）或生物特征（指纹、签名）。

### 授权与访问控制

- **基本授权**：`GRANT SELECT ON table TO user [WITH GRANT OPTION];`
- **资源权限**：CONNECT、CREATE、USAGE 等。
- **角色（Role）**：封装权限集合，简化授权与管理。
- **视图安全**：通过逻辑视图暴露部分数据，实现行/列级访问控制。

### 加密与审计

- **数据加密**：保护静态数据与传输数据。
- **审计追踪**：记录用户行为，例如
  `AUDIT SELECT, INSERT, DELETE, UPDATE ON emp WHENEVER SUCCESSFUL;`

### 查询重写

- 在解析阶段注入安全条件，确保即便用户提交的 SQL 不可信，系统仍能自动附加访问约束。

## 5.3 统计数据库安全

公开统计数据时可能泄露个体信息，攻击者可通过“追踪器”组合多个聚合查询推断敏感值。

### 个人追踪器示例

已知王是唯一的男性程序员：

1. `SELECT COUNT(*) FROM STATS WHERE SEX='M' AND OCCUPATION='programmer'; -- 结果 1`
2. `SELECT SUM(SALARY) ...` 得到工资总和即可推断王的收入。

通过提交互补条件（如 NOT(predicate)）或基数限制（`b < c < n-b`）也能推断单个元组值。

### 通用追踪器

对于谓词 $p=p_1 \land p_2$，如果存在满足特定行数范围的追踪器 $T$，则可通过以下等式将单个元组的值拆解为多个合法查询：

$$
SET(p) = SET(p \lor T) \cup SET(p \lor \neg T) - SET(T) - SET(\neg T)
$$

因此，统计数据库必须结合噪声注入、查询限制、上下文记忆等策略防止泄露。

## 5.4 完整性约束

### 类型

- **静态约束**：限制数据库状态，包含模型固有约束（如 1NF）、隐式约束（域/键/外键）、显式 CHECK/ASSERTION 等。
- **动态约束**：限制状态转换，通常借助触发器或存储过程实现。

### 键与外键处理

- 插入：外键值必须存在于被引用表主键中。
- 删除：若删除主表元组，需拒绝、级联删除或置空引用元组。
- 更新：修改外键或主键时需重复上述检查。

### 约束定义方式

- 由应用程序显式检查（代价高、易遗漏）。
- DDL 中 `CHECK` 子句或 `CONSTRAINT` 语法：

```sql
CREATE TABLE Sailors (
  sid INTEGER PRIMARY KEY,
  sname CHAR(10),
  rating INTEGER CHECK (rating BETWEEN 1 AND 10)
);
```

- 跨表约束可使用 `ASSERTION`：

```sql
CREATE ASSERTION smallClub CHECK (
  (SELECT COUNT(*) FROM Sailors) +
  (SELECT COUNT(*) FROM Boats) < 100
);
```

## 5.5 触发器（Triggers）

触发器由“事件-条件-动作”（ECA）三部分组成，在满足特定事件和条件时自动执行动作，实现主动规则。

### 示例

```sql
CREATE TRIGGER youngSailorUpdate
AFTER INSERT ON Sailors
REFERENCING NEW TABLE AS NewSailors
FOR EACH STATEMENT
INSERT INTO YoungSailors(sid, name, age, rating)
SELECT sid, name, age, rating
FROM NewSailors
WHERE age <= 18;
```

### 执行策略

- **时机**：BEFORE/AFTER；可立即执行或延迟执行。
- **粒度**：行级（FOR EACH ROW）或语句级（FOR EACH STATEMENT）。
- **级联控制**：需限制触发器嵌套深度，避免无限循环，可通过触发图记录依赖关系。

合理设计触发器与约束、视图、权限配合，方能构建既安全又保持数据一致性的数据库系统。
