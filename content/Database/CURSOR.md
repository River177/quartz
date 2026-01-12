# 游标（Cursor）

嵌入式 SQL 在 C 语言中处理多行结果时使用游标。

## 1. 核心流程与判定

1. `DECLARE` 定义游标
2. `OPEN` 打开游标
3. `FETCH` 逐条读取
4. `SQLCA.SQLCODE == 100` 结束循环
5. `CLOSE` 关闭游标

指示变量（indicator）用于判断 NULL。

## 2. 常用模板

### 2.1 基础多元组查询（通用）

```c
/* 1. 声明宿主变量 */
EXEC SQL BEGIN DECLARE SECTION;
char SNO[7];
float GRADE;
short GRADEI;     /* indicator for NULL */
char GIVENCNO[6];
EXEC SQL END DECLARE SECTION;

/* 2. 定义游标 */
EXEC SQL DECLARE C1 CURSOR FOR
SELECT SNO, GRADE
FROM SC
WHERE CNO = :GIVENCNO;

/* 3. 打开游标 */
EXEC SQL OPEN C1;
if (SQLCA.SQLCODE < 0) exit(1);

/* 4. 逐条取数据 */
while (1) {
    EXEC SQL FETCH C1 INTO :SNO, :GRADE :GRADEI;
    if (SQLCA.SQLCODE == 100) break;

    /* 处理一条元组 */
}

/* 5. 关闭游标 */
EXEC SQL CLOSE C1;
```

### 2.2 游标 + 聚合前处理

```c
EXEC SQL BEGIN DECLARE SECTION;
float GRADE;
short GRADEI;
float SUM = 0;
int CNT = 0;
EXEC SQL END DECLARE SECTION;

EXEC SQL DECLARE C2 CURSOR FOR
SELECT GRADE
FROM SC
WHERE CNO = :GIVENCNO;

EXEC SQL OPEN C2;

while (1) {
    EXEC SQL FETCH C2 INTO :GRADE :GRADEI;
    if (SQLCA.SQLCODE == 100) break;

    if (GRADEI == 0) {
        SUM += GRADE;
        CNT++;
    }
}

EXEC SQL CLOSE C2;
```

### 2.3 游标 + 条件处理

```c
EXEC SQL BEGIN DECLARE SECTION;
char SNO[7];
float GRADE;
short GRADEI;
EXEC SQL END DECLARE SECTION;

EXEC SQL DECLARE C3 CURSOR FOR
SELECT SNO, GRADE
FROM SC;

EXEC SQL OPEN C3;

while (1) {
    EXEC SQL FETCH C3 INTO :SNO, :GRADE :GRADEI;
    if (SQLCA.SQLCODE == 100) break;

    if (GRADEI == -1) {
        /* 成绩为 NULL */
    } else if (GRADE < 60) {
        /* 不及格处理 */
    } else {
        /* 及格处理 */
    }
}

EXEC SQL CLOSE C3;
```

### 2.4 游标 + UPDATE（逐条修改）

```c
EXEC SQL BEGIN DECLARE SECTION;
char SNO[7];
float GRADE;
short GRADEI;
EXEC SQL END DECLARE SECTION;

EXEC SQL DECLARE C4 CURSOR FOR
SELECT SNO, GRADE
FROM SC
WHERE CNO = :GIVENCNO;

EXEC SQL OPEN C4;

while (1) {
    EXEC SQL FETCH C4 INTO :SNO, :GRADE :GRADEI;
    if (SQLCA.SQLCODE == 100) break;

    if (GRADEI == 0 && GRADE < 60) {
        EXEC SQL UPDATE SC
        SET GRADE = 60
        WHERE SNO = :SNO
          AND CNO = :GIVENCNO;
    }
}

EXEC SQL CLOSE C4;
```

### 2.5 动态 SQL + 游标

```c
EXEC SQL BEGIN DECLARE SECTION;
char sqlstring[200];
char SNO[7];
float GRADE;
short GRADEI;
char GIVENCNO[6];
EXEC SQL END DECLARE SECTION;

/* 构造 SQL */
strcpy(sqlstring,
 "SELECT SNO, GRADE FROM SC WHERE CNO = :c");

/* 准备语句 */
EXEC SQL PREPARE query FROM :sqlstring;

/* 声明游标 */
EXEC SQL DECLARE DC CURSOR FOR query;

/* 打开游标并传参 */
EXEC SQL OPEN DC USING :GIVENCNO;

while (1) {
    EXEC SQL FETCH DC INTO :SNO, :GRADE :GRADEI;
    if (SQLCA.SQLCODE == 100) break;

    /* 处理数据 */
}

EXEC SQL CLOSE DC;
```

### 2.6 简答题最小结构

```c
EXEC SQL DECLARE C CURSOR FOR
SELECT ... FROM ... WHERE ...;

EXEC SQL OPEN C;
while (1) {
    EXEC SQL FETCH C INTO ...;
    if (SQLCA.SQLCODE == 100) break;
}
EXEC SQL CLOSE C;
```

## 3. 速记

- 查多行，用游标
- 先声明，再打开
- 逐条 FETCH，SQLCODE == 100 结束
- 用完记得 CLOSE
