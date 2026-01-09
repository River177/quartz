根据这五份笔记（16-17, 17-18, 18-19, 19-20, 21-22），历年考试中的 SQL 题目具有极高的重复性和规律性。

我将这些题目归纳为 **四大核心考点** 和 **两个高级考点**，并为你总结了复习重点。

---

### 一、 四大核心 SQL 查询模式（必考）

这四类查询在每年的试题中几乎都会出现，是复习的重中之重。

#### 1. “全部/所有”查询（除法运算）
这是 SQL 中最难的逻辑，通常对应关系代数中的除法（$\div$）。
*   **典型题目：**
    *   查询预定过**所有**房间的客人 ([[16-17]])。
    *   查询选修了 Computer Sci 系开设的**全部**课程的学生 ([[21-22]])。
*   **复习重点：**
    *   背诵 **双重 `NOT EXISTS`** 的模板。
    *   **逻辑口诀：** “查询一个学生，不存在一门 CS 课程，他没有选修”。
    *   **代码结构：**
        ```sql
        SELECT ... FROM A WHERE NOT EXISTS (
            SELECT * FROM B WHERE ... AND NOT EXISTS (
                SELECT * FROM C WHERE ...
            )
        )
        ```

#### 2. “只有/恰好”查询（分组与筛选）
考察 `GROUP BY` 和 `HAVING` 的配合使用。
*   **典型题目：**
    *   查询 2016 年 1 月**只有一人**预定的房间号 ([[16-17]])。
    *   查询**只有一人**选修的课程 ([[21-22]])。
    *   查询仅参加过**一台**手术的医生 ([[19-20]])。
    *   查询接受**唯一**投资方投资的项目 ([[18-19]])。
    *   查询**只有一人**预订的蓝色船 ([[17-18]])。
*   **复习重点：**
    *   熟练使用 `GROUP BY 分组列 HAVING COUNT(*) = 1`。
    *   注意：如果题目要求显示非分组列（如姓名），通常需要配合子查询或连接查询（如 `WHERE id IN (SELECT id ... HAVING COUNT=1)`）。

#### 3. “最值/极值”查询
考察如何在分组中找到最大/最小值，或者找到拥有最大值的那个实体。
*   **典型题目：**
    *   查询每位客人单月预订房间的**最大次数** ([[16-17]])。
    *   查询各门课程的**最高分**及学生学号 ([[21-22]])。
    *   查询完成手术次数**最多**的医生 ([[19-20]])。
    *   查询投资项目**最多**的投资方 ([[18-19]])。
    *   查询预定船只次数**最多**的水手的师傅 ([[17-18]])。
*   **复习重点：**
    *   **方法一（通用）：** 使用 `ALL` 或 `NOT EXISTS`。例如：“不存在另一个人比他更多”。
    *   **方法二（简单）：** 先查出 `MAX(数量)`，再查谁的数量等于这个 Max。
    *   **方法三（特定数据库）：** `ORDER BY 数量 DESC LIMIT 1`（笔记 [[18-19]] 中出现过）。

#### 4. 复杂连接与多表查询
考察基本的 `JOIN` 或 `WHERE` 连接条件，通常结合日期处理。
*   **典型题目：**
    *   查询某日期、某手术室的医生姓名 ([[19-20]])。
    *   查询某员工负责协调的所有项目及相关方名称 ([[18-19]])。
    *   查询预定了特定编号、特定颜色船的水手 ([[17-18]])。
*   **复习重点：**
    *   **日期函数：** `getYear()`, `getMonth()` 的使用。
    *   **去重：** 注意何时需要加 `DISTINCT`（例如 [[18-19]] 中查询投资方投资的公司名称）。
    *   **自连接：** [[17-18]] 中查询“水手的师傅”，需要 `Sailors` 表连接自己 (`s.master = m.sid`)。

---

### 二、 两个高级考点（代码编写）

#### 1. 触发器 (Trigger)
每套题必考一道触发器编写题。
*   **考察形式：**
    *   **完整性约束（拒绝操作）：** 插入数据不合法时回滚。
        *   例：退房日期为空则回滚 ([[16-17]])；水手徒弟超过 2 个则报错 ([[17-18]])；未完成项目超过 5 个则拒绝 ([[18-19]])。
    *   **级联操作（自动执行）：** 插入数据后自动修改其他表。
        *   例：插入不及格成绩自动存入不及格表 ([[21-22]])。
*   **复习重点：**
    *   **语法结构：** `CREATE TRIGGER ... BEFORE/AFTER INSERT ... FOR EACH ROW`。
    *   **变量引用：** 使用 `NEW.column` (或 `:NEW`) 获取新数据。
    *   **逻辑控制：** `IF ... THEN ROLLBACK/ERROR`。

#### 2. 嵌入式 SQL (Embedded SQL in C)
考察在 C 语言中嵌入 SQL 的逻辑，主要是**游标 (Cursor)** 的使用。
*   **典型题目：**
    *   打印成绩点 3.5 以上的学生名单 ([[21-22]])。
    *   打印水手 "Li" 没有预订过的船 ([[17-18]])。
*   **复习重点：**
    *   **四步曲：**
        1.  `EXEC SQL DECLARE cursor_name CURSOR FOR SELECT ...` (定义游标)
        2.  `EXEC SQL OPEN cursor_name` (打开游标)
        3.  `EXEC SQL FETCH cursor_name INTO :var1, :var2` (循环获取数据)
        4.  `EXEC SQL CLOSE cursor_name` (关闭游标)
    *   **宿主变量：** 变量前要加冒号 `:`。
    *   **循环终止：** 检查 `SQLCA.SQLCODE` 是否为 100。

---

### 三、 总结：复习优先级建议

1.  **第一优先级（死记硬背）：**
    *   **双重 `NOT EXISTS`** 写法（解决“全部”问题）。
    *   **`GROUP BY ... HAVING COUNT(*) ...`** 写法（解决“只有/至少”问题）。
    *   **触发器** 的基本定义框架。

2.  **第二优先级（理解逻辑）：**
    *   **游标** 的声明、打开、循环、关闭流程。
    *   **自连接** 的逻辑（如师傅-徒弟，上级-下级）。

3.  **第三优先级（细节）：**
    *   日期函数的具体写法。
    *   `DISTINCT` 的使用时机。

只要掌握了上述模式，这五份笔记中 90% 的 SQL 题目你都能从容应对。

---
### 四、 相关题目

####  **“全部/所有”查询（关系除法思想）**
 基于三张表：

- **S**(SNO, SNAME, AGE, SEX, SDEPT)
    
- **SC**(SNO, CNO, GRADE)
    
- **C**(CNO, CNAME, CDEPT, TNAME)
    

先给一个通用模板（最稳、最通用）：

> **x 满足“对所有 y 都成立”**

```sql
SELECT x.*
FROM X x
WHERE NOT EXISTS (
  SELECT 1
  FROM Y y
  WHERE NOT EXISTS (
    SELECT 1
    FROM R r
    WHERE r.x = x.x AND r.y = y.y
  )
);
```

---

##### 1) 选修了**所有课程**的学生

**题目**：查询选修了课程表 C 中**全部课程**的学生（SNO, SNAME）。

```sql
SELECT s.SNO, s.SNAME
FROM S s
WHERE NOT EXISTS (
  SELECT 1
  FROM C c
  WHERE NOT EXISTS (
    SELECT 1
    FROM SC sc
    WHERE sc.SNO = s.SNO AND sc.CNO = c.CNO
  )
);
```

---

##### 2) 选修了**本系开设的全部课程**的学生

**题目**：查询选修了其所在院系（SDEPT）开设的**全部课程**的学生。

```sql
SELECT s.SNO, s.SNAME
FROM S s
WHERE NOT EXISTS (
  SELECT 1
  FROM C c
  WHERE c.CDEPT = s.SDEPT
    AND NOT EXISTS (
      SELECT 1
      FROM SC sc
      WHERE sc.SNO = s.SNO AND sc.CNO = c.CNO
    )
);
```

---

##### 3) 选修了某老师讲授的**全部课程**的学生

**题目**：查询选修了教师 **'王老师'** 讲授的全部课程的学生。

```sql
SELECT s.SNO, s.SNAME
FROM S s
WHERE NOT EXISTS (
  SELECT 1
  FROM C c
  WHERE c.TNAME = '王老师'
    AND NOT EXISTS (
      SELECT 1
      FROM SC sc
      WHERE sc.SNO = s.SNO AND sc.CNO = c.CNO
    )
);
```

---

##### 4) 每门已选课程都**及格(>=60)** 的学生（“对所有已选课都满足”）

**题目**：查询所有**已选课程成绩都 ≥ 60** 的学生（要求至少选过一门课）。

```sql
SELECT s.SNO, s.SNAME
FROM S s
WHERE EXISTS (SELECT 1 FROM SC sc0 WHERE sc0.SNO = s.SNO)
  AND NOT EXISTS (
    SELECT 1
    FROM SC sc
    WHERE sc.SNO = s.SNO
      AND (sc.GRADE < 60 OR sc.GRADE IS NULL)
  );
```

---

##### 5) 学号 'S01' 的学生选修了某教师的**全部课程**（返回这些教师）

**题目**：查询满足：学生 **'S01'** 选修了该老师讲授的**全部课程** 的教师姓名。

```sql
SELECT t.TNAME
FROM (SELECT DISTINCT TNAME FROM C) t
WHERE NOT EXISTS (
  SELECT 1
  FROM C c
  WHERE c.TNAME = t.TNAME
    AND NOT EXISTS (
      SELECT 1
      FROM SC sc
      WHERE sc.SNO = 'S01' AND sc.CNO = c.CNO
    )
);
```

---

##### 6) 被某院系所有学生都选修过的课程

**题目**：查询被 **'CS'** 系（SDEPT='CS'）的**所有学生**都选修过的课程（CNO, CNAME）。

```sql
SELECT c.CNO, c.CNAME
FROM C c
WHERE NOT EXISTS (
  SELECT 1
  FROM S s
  WHERE s.SDEPT = 'CS'
    AND NOT EXISTS (
      SELECT 1
      FROM SC sc
      WHERE sc.SNO = s.SNO AND sc.CNO = c.CNO
    )
);
```

---

##### 7) 被**所有女生**都选修过的课程

**题目**：查询被 SEX='F' 的**所有女生**都选修过的课程。

```sql
SELECT c.CNO, c.CNAME
FROM C c
WHERE NOT EXISTS (
  SELECT 1
  FROM S s
  WHERE s.SEX = 'F'
    AND NOT EXISTS (
      SELECT 1
      FROM SC sc
      WHERE sc.SNO = s.SNO AND sc.CNO = c.CNO
    )
);
```

---

##### 8) 选修了某系全部课程，且这些课成绩都 ≥ 80 的学生

**题目**：查询选修了 **'Math'** 系（CDEPT='Math'）全部课程，且这些课成绩都 ≥ 80 的学生。

```sql
SELECT s.SNO, s.SNAME
FROM S s
WHERE NOT EXISTS (
  SELECT 1
  FROM C c
  WHERE c.CDEPT = 'Math'
    AND NOT EXISTS (
      SELECT 1
      FROM SC sc
      WHERE sc.SNO = s.SNO
        AND sc.CNO = c.CNO
        AND sc.GRADE >= 80
    )
);
```

---

##### 9) “每门课都至少被外系学生选修过”的系别

**题目**：查询课程系别 CDEPT，使得该系别下的**每门课程**都至少被**外系学生**（SDEPT ≠ CDEPT）选修过。

```sql
SELECT d.CDEPT
FROM (SELECT DISTINCT CDEPT FROM C) d
WHERE NOT EXISTS (
  SELECT 1
  FROM C c
  WHERE c.CDEPT = d.CDEPT
    AND NOT EXISTS (
      SELECT 1
      FROM SC sc
      JOIN S s ON s.SNO = sc.SNO
      WHERE sc.CNO = c.CNO
        AND s.SDEPT <> d.CDEPT
    )
);
```

---

##### 10) 选修课程集合 **覆盖** 某学生全部已选课程的学生

**题目**：查询那些学生，他们选修的课程集合 **包含** 学生 **'S02'** 选修的全部课程（即“学过 S02 学过的所有课”）。

```sql
SELECT s.SNO, s.SNAME
FROM S s
WHERE NOT EXISTS (
  SELECT 1
  FROM SC sc2
  WHERE sc2.SNO = 'S02'
    AND NOT EXISTS (
      SELECT 1
      FROM SC sc1
      WHERE sc1.SNO = s.SNO
        AND sc1.CNO = sc2.CNO
    )
);
```

---

#### **“只有/恰好”查询**

---

##### 1) 恰好选修 **3 门课** 的学生

```sql
SELECT s.SNO, s.SNAME
FROM S s
JOIN SC sc ON sc.SNO = s.SNO
GROUP BY s.SNO, s.SNAME
HAVING COUNT(DISTINCT sc.CNO) = 3;
```

---

##### 2) 恰好选修 **4 门课** 且 **全部及格(>=60)** 的学生

```sql
SELECT s.SNO, s.SNAME
FROM S s
JOIN SC sc ON sc.SNO = s.SNO
GROUP BY s.SNO, s.SNAME
HAVING COUNT(DISTINCT sc.CNO) = 4
   AND SUM(CASE WHEN sc.GRADE < 60 OR sc.GRADE IS NULL THEN 1 ELSE 0 END) = 0;
```

---

##### 3) 恰好被 **5 个学生**选修过的课程

```sql
SELECT c.CNO, c.CNAME
FROM C c
JOIN SC sc ON sc.CNO = c.CNO
GROUP BY c.CNO, c.CNAME
HAVING COUNT(DISTINCT sc.SNO) = 5;
```

---

##### 4) 只选修了**本院系开设课程**的学生（且至少选过一门）

> “只有”典型写法：`坏的数量=0`

```sql
SELECT s.SNO, s.SNAME
FROM S s
JOIN SC sc ON sc.SNO = s.SNO
JOIN C  c  ON c.CNO = sc.CNO
GROUP BY s.SNO, s.SNAME
HAVING COUNT(DISTINCT sc.CNO) > 0
   AND SUM(CASE WHEN c.CDEPT <> s.SDEPT THEN 1 ELSE 0 END) = 0;
```

---

##### 5) 只选修了 **'CS' 系**开设课程的学生（且至少选过一门）

```sql
SELECT s.SNO, s.SNAME
FROM S s
JOIN SC sc ON sc.SNO = s.SNO
JOIN C  c  ON c.CNO = sc.CNO
GROUP BY s.SNO, s.SNAME
HAVING COUNT(DISTINCT sc.CNO) > 0
   AND SUM(CASE WHEN c.CDEPT <> 'CS' THEN 1 ELSE 0 END) = 0;
```

---

##### 6) 只选修了 **'王老师'** 授课课程的学生（且至少选过一门）

```sql
SELECT s.SNO, s.SNAME
FROM S s
JOIN SC sc ON sc.SNO = s.SNO
JOIN C  c  ON c.CNO = sc.CNO
GROUP BY s.SNO, s.SNAME
HAVING COUNT(DISTINCT sc.CNO) > 0
   AND SUM(CASE WHEN c.TNAME <> '王老师' THEN 1 ELSE 0 END) = 0;
```

---

##### 7) “只被女生选修过”的课程（至少有学生选）

```sql
SELECT c.CNO, c.CNAME
FROM C c
JOIN SC sc ON sc.CNO = c.CNO
JOIN S  s  ON s.SNO = sc.SNO
GROUP BY c.CNO, c.CNAME
HAVING COUNT(DISTINCT sc.SNO) > 0
   AND SUM(CASE WHEN s.SEX <> 'F' THEN 1 ELSE 0 END) = 0;
```

---

##### 8) 恰好由 **3 位老师**授课的课程系别（CDEPT）

> 这里的含义：该系开设的课程中，出现过的任课老师数量恰好为 3（一个老师可能教多门）。

```sql
SELECT c.CDEPT
FROM C c
GROUP BY c.CDEPT
HAVING COUNT(DISTINCT c.TNAME) = 3;
```

---

##### 9) 恰好上过 **2 位老师**课的学生

```sql
SELECT s.SNO, s.SNAME
FROM S s
JOIN SC sc ON sc.SNO = s.SNO
JOIN C  c  ON c.CNO = sc.CNO
GROUP BY s.SNO, s.SNAME
HAVING COUNT(DISTINCT c.TNAME) = 2;
```

---

##### 10) 学生选修课程集合 **恰好等于** “王老师开的全部课程”

> 这题把“只有 + 恰好”结合：
> 
> - 不能多：不能选王老师以外的课
>     
> - 不能少：选的课数 = 王老师开的课数
>     

```sql
SELECT s.SNO, s.SNAME
FROM S s
JOIN SC sc ON sc.SNO = s.SNO
JOIN C  c  ON c.CNO = sc.CNO
GROUP BY s.SNO, s.SNAME
HAVING SUM(CASE WHEN c.TNAME <> '王老师' THEN 1 ELSE 0 END) = 0
   AND COUNT(DISTINCT sc.CNO) = (
       SELECT COUNT(DISTINCT CNO)
       FROM C
       WHERE TNAME = '王老师'
   );
```




#### **“最值/极值”查询**

---

##### 1) 每门课的最高分、最低分、平均分

```sql
SELECT c.CNO, c.CNAME,
       MAX(sc.GRADE) AS max_grade,
       MIN(sc.GRADE) AS min_grade,
       AVG(sc.GRADE) AS avg_grade
FROM C c
JOIN SC sc ON sc.CNO = c.CNO
GROUP BY c.CNO, c.CNAME;
```

---

##### 2) 每门课的最高分获得者（并列都要）

```sql
SELECT c.CNO, c.CNAME, s.SNO, s.SNAME, sc.GRADE
FROM C  c
JOIN SC sc ON sc.CNO = c.CNO
JOIN S  s  ON s.SNO = sc.SNO
WHERE sc.GRADE = (
  SELECT MAX(sc2.GRADE)
  FROM SC sc2
  WHERE sc2.CNO = c.CNO
);
```

---

##### 3) 每门课最低分获得者（并列都要）

```sql
SELECT c.CNO, c.CNAME, s.SNO, s.SNAME, sc.GRADE
FROM C  c
JOIN SC sc ON sc.CNO = c.CNO
JOIN S  s  ON s.SNO = sc.SNO
WHERE sc.GRADE = (
  SELECT MIN(sc2.GRADE)
  FROM SC sc2
  WHERE sc2.CNO = c.CNO
);
```

---

##### 4) 平均分最高的课程（并列都要）

```sql
SELECT c.CNO, c.CNAME, AVG(sc.GRADE) AS avg_grade
FROM C c
JOIN SC sc ON sc.CNO = c.CNO
GROUP BY c.CNO, c.CNAME
HAVING AVG(sc.GRADE) >= ALL (
  SELECT AVG(sc2.GRADE)
  FROM SC sc2
  GROUP BY sc2.CNO
);
```

---

##### 5) 选课人数最多的课程（并列都要）

```sql
SELECT c.CNO, c.CNAME, COUNT(DISTINCT sc.SNO) AS stu_cnt
FROM C c
JOIN SC sc ON sc.CNO = c.CNO
GROUP BY c.CNO, c.CNAME
HAVING COUNT(DISTINCT sc.SNO) >= ALL (
  SELECT COUNT(DISTINCT sc2.SNO)
  FROM SC sc2
  GROUP BY sc2.CNO
);
```

---

##### 6) 每个院系（SDEPT）中，年龄最大的学生（并列都要）

```sql
SELECT s.SDEPT, s.SNO, s.SNAME, s.AGE
FROM S s
WHERE s.AGE = (
  SELECT MAX(s2.AGE)
  FROM S s2
  WHERE s2.SDEPT = s.SDEPT
);
```

---

##### 7) 每个院系（SDEPT）中，选课门数最多的学生（并列都要）

```sql
SELECT t.SDEPT, t.SNO, t.SNAME, t.course_cnt
FROM (
  SELECT s.SDEPT, s.SNO, s.SNAME, COUNT(DISTINCT sc.CNO) AS course_cnt
  FROM S s
  LEFT JOIN SC sc ON sc.SNO = s.SNO
  GROUP BY s.SDEPT, s.SNO, s.SNAME
) t
WHERE t.course_cnt = (
  SELECT MAX(t2.course_cnt)
  FROM (
    SELECT s2.SDEPT, s2.SNO, COUNT(DISTINCT sc2.CNO) AS course_cnt
    FROM S s2
    LEFT JOIN SC sc2 ON sc2.SNO = s2.SNO
    GROUP BY s2.SDEPT, s2.SNO
  ) t2
  WHERE t2.SDEPT = t.SDEPT
);
```

---

##### 8) 任课老师中：平均分最高的老师（按其所有授课课程的所有成绩汇总）

```sql
SELECT c.TNAME, AVG(sc.GRADE) AS avg_grade
FROM C c
JOIN SC sc ON sc.CNO = c.CNO
GROUP BY c.TNAME
HAVING AVG(sc.GRADE) >= ALL (
  SELECT AVG(sc2.GRADE)
  FROM C c2
  JOIN SC sc2 ON sc2.CNO = c2.CNO
  GROUP BY c2.TNAME
);
```

---

##### 9) “总成绩（已选课成绩求和）最高”的学生（并列都要）

> 也可以换成平均分最高/最低，写法类似。

```sql
SELECT t.SNO, t.SNAME, t.total_grade
FROM (
  SELECT s.SNO, s.SNAME, SUM(sc.GRADE) AS total_grade
  FROM S s
  JOIN SC sc ON sc.SNO = s.SNO
  GROUP BY s.SNO, s.SNAME
) t
WHERE t.total_grade = (
  SELECT MAX(t2.total_grade)
  FROM (
    SELECT SUM(sc2.GRADE) AS total_grade
    FROM SC sc2
    GROUP BY sc2.SNO
  ) t2
);
```

---

##### 10) 每个学生：他/她“最高分的那门课”（并列都要）

```sql
SELECT s.SNO, s.SNAME, c.CNO, c.CNAME, sc.GRADE
FROM S s
JOIN SC sc ON sc.SNO = s.SNO
JOIN C  c  ON c.CNO = sc.CNO
WHERE sc.GRADE = (
  SELECT MAX(sc2.GRADE)
  FROM SC sc2
  WHERE sc2.SNO = s.SNO
);
```

---

#### 复杂连接与多表查询


---

##### 1) 查询每个学生选修课程的详细信息（学生+课程+教师+课程系）

**题目**：输出 `SNO, SNAME, CNO, CNAME, TNAME, CDEPT, GRADE`。

```sql
SELECT s.SNO, s.SNAME, c.CNO, c.CNAME, c.TNAME, c.CDEPT, sc.GRADE
FROM S  s
JOIN SC sc ON sc.SNO = s.SNO
JOIN C  c  ON c.CNO = sc.CNO
ORDER BY s.SNO, c.CNO;
```

---

##### 2) 查询“跨系选课”的记录（学生系 ≠ 课程系）

```sql
SELECT s.SNO, s.SNAME, s.SDEPT AS student_dept,
       c.CNO, c.CNAME, c.CDEPT AS course_dept, sc.GRADE
FROM S  s
JOIN SC sc ON sc.SNO = s.SNO
JOIN C  c  ON c.CNO = sc.CNO
WHERE s.SDEPT <> c.CDEPT
ORDER BY s.SNO, c.CNO;
```

---

##### 3) 查询没有选过任何课的学生（外连接 + 空值筛选）

```sql
SELECT s.SNO, s.SNAME
FROM S s
LEFT JOIN SC sc ON sc.SNO = s.SNO
WHERE sc.SNO IS NULL;
```

---

##### 4) 查询从未被选修过的课程

```sql
SELECT c.CNO, c.CNAME, c.TNAME, c.CDEPT
FROM C c
LEFT JOIN SC sc ON sc.CNO = c.CNO
WHERE sc.CNO IS NULL;
```

---

##### 5) 查询每个老师教的课中：被多少不同学生选过、平均分是多少

```sql
SELECT c.TNAME,
       COUNT(DISTINCT sc.SNO) AS student_cnt,
       COUNT(DISTINCT c.CNO)  AS course_cnt,
       AVG(sc.GRADE)          AS avg_grade
FROM C c
JOIN SC sc ON sc.CNO = c.CNO
GROUP BY c.TNAME
ORDER BY student_cnt DESC, avg_grade DESC;
```

---

##### 6) 查询同一院系中“至少一起上过一门课”的学生对（自连接）

**题目**：输出同院系学生对 `(sno1, sno2)`，要求他们选过同一门课至少一次（去重：sno1 < sno2）。

```sql
SELECT DISTINCT s1.SNO AS sno1, s1.SNAME AS name1,
                s2.SNO AS sno2, s2.SNAME AS name2,
                s1.SDEPT
FROM S s1
JOIN S s2 ON s1.SDEPT = s2.SDEPT AND s1.SNO < s2.SNO
JOIN SC sc1 ON sc1.SNO = s1.SNO
JOIN SC sc2 ON sc2.SNO = s2.SNO AND sc2.CNO = sc1.CNO;
```

---

##### 7) 查询每个院系中：平均成绩最高的课程（“分组后取极值” + 多表）

```sql
SELECT x.CDEPT, x.CNO, x.CNAME, x.avg_grade
FROM (
  SELECT c.CDEPT, c.CNO, c.CNAME, AVG(sc.GRADE) AS avg_grade
  FROM C c
  JOIN SC sc ON sc.CNO = c.CNO
  GROUP BY c.CDEPT, c.CNO, c.CNAME
) x
WHERE x.avg_grade = (
  SELECT MAX(x2.avg_grade)
  FROM (
    SELECT c2.CDEPT, c2.CNO, AVG(sc2.GRADE) AS avg_grade
    FROM C c2
    JOIN SC sc2 ON sc2.CNO = c2.CNO
    GROUP BY c2.CDEPT, c2.CNO
  ) x2
  WHERE x2.CDEPT = x.CDEPT
)
ORDER BY x.CDEPT, x.CNO;
```
