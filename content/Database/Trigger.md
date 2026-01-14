# 触发器（Trigger）

触发器是数据库的 ECA（Event–Condition–Action）机制：当事件发生时，若条件成立，则执行动作。

## 1. 基本概念与三要素

- Event：INSERT / DELETE / UPDATE
- Condition：WHEN 子句（可省略）
- Action：一条或多条 SQL

| 要素 | 说明 |
| --- | --- |
| Event | INSERT / DELETE / UPDATE |
| Condition | WHEN 子句（可省略） |
| Action | 一条或多条 SQL |

## 2. 触发时机：BEFORE vs AFTER

| 需求 | 推荐 |
| --- | --- |
| 检查、拒绝非法操作 | BEFORE |
| 插入后维护派生数据 | AFTER |

**例：合法性检查（BEFORE）**

```sql
CREATE TRIGGER referential_integrity_check
BEFORE INSERT ON Reserves
REFERENCING NEW AS N
FOR EACH ROW
WHEN (
  NOT (
    EXISTS (SELECT * FROM Sailors WHERE sid = N.sid)
    AND EXISTS (SELECT * FROM Boats WHERE bid = N.bid)
  )
)
ROLLBACK;
```

## 3. 行级 vs 语句级触发器

### 3.1 行级（FOR EACH ROW）

- 访问单条元组，比较 OLD / NEW
- 每条记录分别处理

```sql
CREATE TRIGGER NoLowerPrices
AFTER UPDATE OF price ON Product
REFERENCING OLD AS O NEW AS N
FOR EACH ROW
WHEN (O.price > N.price)
UPDATE Product
SET price = O.price
WHERE name = N.name;
```

### 3.2 语句级（FOR EACH STATEMENT）

- 一条语句影响多行时统一处理
- NEW TABLE / OLD TABLE 只能用于语句级

```sql
CREATE TRIGGER insert_grade_check
AFTER INSERT ON enroll
REFERENCING NEW TABLE AS NE
FOR EACH STATEMENT
INSERT INTO failedcourse
SELECT *
FROM NE
WHERE grade < 3.0;
```

## 4. REFERENCING 子句

| 触发器类型 | 可用对象 |
| --- | --- |
| 行级 | OLD, NEW |
| 语句级 | OLD TABLE, NEW TABLE |

## 5. WHEN 子句要点

- 只负责判断是否执行动作
- WHEN 中不能写修改语句
- 可省略

**例：限制最多 10 次预约**

```sql
CREATE TRIGGER notTooManyReservations
AFTER INSERT ON Reserves
REFERENCING NEW AS N
FOR EACH ROW
WHEN (10 <= (SELECT COUNT(*) FROM Reserves WHERE sid = N.sid))
DELETE FROM Reserves
WHERE sid = N.sid
  AND day = (
    SELECT MIN(day)
    FROM Reserves
    WHERE sid = N.sid
  );
```

## 6. 参照完整性常见模式

### 6.1 父表 DELETE → 拒绝

```sql
CREATE TRIGGER boats_delete
BEFORE DELETE ON Boats
REFERENCING OLD AS O
FOR EACH ROW
WHEN (EXISTS (SELECT * FROM Reserves WHERE bid = O.bid))
ROLLBACK;
```

### 6.2 父表 DELETE → 级联删除

```sql
CREATE TRIGGER sailors_delete
AFTER DELETE ON Sailors
REFERENCING OLD AS O
FOR EACH ROW
DELETE FROM Reserves
WHERE sid = O.sid;
```

### 6.3 子表 UPDATE → 检查合法性

```sql
CREATE TRIGGER reserves_update
BEFORE UPDATE OF sid, bid ON Reserves
REFERENCING NEW AS N
FOR EACH ROW
WHEN (
  NOT (
    EXISTS (SELECT * FROM Sailors WHERE sid = N.sid)
    AND EXISTS (SELECT * FROM Boats WHERE bid = N.bid)
  )
)
ROLLBACK;
```

## 7. Trigger vs CHECK / ASSERTION

| 项目 | CHECK | ASSERTION | TRIGGER |
| --- | --- | --- | --- |
| 作用范围 | 单表 | 多表 | 指定事件 |
| 是否过程化 | 否 | 否 | 是 |
| 是否动态 | 否 | 否 | 是 |
| 优化支持 | 高 | 高 | 低 |

## 8. 何时不建议用 Trigger

- 维护汇总数据 → 优先物化视图
- 数据复制 → 优先内置复制机制
- 级联执行风险高、影响关键事务性能

## 9. 常用模板汇总

### 模板 A：合法性检查

```sql
CREATE TRIGGER trigger_name
BEFORE INSERT OR UPDATE ON 表名
REFERENCING NEW AS N
FOR EACH ROW
WHEN (不合法条件)
ROLLBACK;
```

### 模板 B：插入后派生表（语句级）

```sql
CREATE TRIGGER trigger_name
AFTER INSERT ON 表名
REFERENCING NEW TABLE AS NT
FOR EACH STATEMENT
INSERT INTO 目标表
SELECT *
FROM NT
WHERE 条件;
```

### 模板 C：数量限制（动态约束）

```sql
CREATE TRIGGER trigger_name
AFTER INSERT ON 表名
REFERENCING NEW AS N
FOR EACH ROW
WHEN ((SELECT COUNT(*) FROM 表名 WHERE 条件) >= 上限)
DELETE FROM 表名
WHERE ...;
```

### 模板 D：禁止不合理更新

```sql
CREATE TRIGGER trigger_name
AFTER UPDATE OF 列名 ON 表名
REFERENCING OLD AS O NEW AS N
FOR EACH ROW
WHEN (O.列名 > N.列名)
UPDATE 表名
SET 列名 = O.列名
WHERE 主键 = N.主键;
```

### 模板 E：子表插入 → 外键检查

```sql
CREATE TRIGGER trigger_name
BEFORE INSERT ON 子表
REFERENCING NEW AS N
FOR EACH ROW
WHEN (NOT EXISTS (SELECT * FROM 父表 WHERE 主键 = N.外键))
ROLLBACK;
```

### 模板 F：父表删除 → 拒绝删除

```sql
CREATE TRIGGER trigger_name
BEFORE DELETE ON 父表
REFERENCING OLD AS O
FOR EACH ROW
WHEN (EXISTS (SELECT * FROM 子表 WHERE 外键 = O.主键))
ROLLBACK;
```

### 模板 G：父表删除 → 级联删除

```sql
CREATE TRIGGER trigger_name
AFTER DELETE ON 父表
REFERENCING OLD AS O
FOR EACH ROW
DELETE FROM 子表
WHERE 外键 = O.主键;
```

## 10. 速记

- Trigger 是 ECA 规则：Event / Condition / Action
- BEFORE 用于检查与拒绝；AFTER 用于维护与派生
- 行级用 OLD/NEW；语句级用 OLD TABLE/NEW TABLE
- 拒绝操作常用 ROLLBACK
