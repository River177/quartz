
## **0. 这一章到底在解决什么问题**


课件开头就把本章的核心问题点出来了：

1. **为什么函数调用可以采用“栈式存储”？**
    
2. **函数调用和返回过程中需要记录哪些信息？如何记录？**
    
3. 与之配套：**内存被组织成哪些区域？什么时候分配？什么时候回收？**

理解它的关键是：程序“跑起来”之后，函数会不断被调用、返回；同一个函数甚至可能被递归调用很多次，所以同一个名字（比如局部变量 t）在运行时会对应很多个不同的“数据对象”（不同内存位置）。

---

## **1. 预备知识：Environment 与 State（环境与状态）**

### **1.1 Environment（环境）：**

### **名字 → 存储位置（l-value）**

- 环境是一个映射：name  -> storage location
    
- 直观理解：**变量名“绑定到哪里”**（地址/内存单元）
### **1.2 State（状态）：**

### **存储位置 → 值（r-value）**

- 状态也是一个映射：storage location -> value
    
- 直观理解：**那块地址里“现在存的是什么值”**

### **1.3 赋值到底改变了什么？**

课件强调：**赋值改变 state，但不改变 environment**。

- x := y
    
    - x 还是绑定到同一块内存（environment 不变）
        
    - 只是那块内存里的值被更新（state 变了）


> 你可以把 environment 想成“变量名贴在抽屉上的标签指向哪个抽屉”，state 想成“抽屉里放了什么东西”。

---

## **2. 运行时内存的总体布局：Code / Static / Heap / Stack**

课件给了典型“逻辑地址空间”的分区结构：Code、Static、Heap、Stack（以及中间的 Free Memory）。

### **2.1 Static vs Dynamic（静态 vs 动态）**

- **静态（compile time / 静态分配）**：编译期就能确定大小/位置的对象
    
    典型：全局变量、静态变量（static storage）
    
- **动态（run time / 动态分配）**：运行时才决定，甚至活得比创建它的函数更久
    
    典型：new / malloc 得到的对象（heap storage）

### **2.2 Stack（栈）用来放什么？**


课件一句话很关键：

**“Names local to a procedure are allocated on a stack.”**

也就是：**函数的局部数据（局部变量、临时量、调用信息）通常进栈，函数结束整体出栈**。

### **2.3 Heap（堆）用来放什么？**

课件也明确：

**可能“比创建它的过程调用活得更久”的数据通常放在 heap**。


例如：函数里 return p; 返回一个 malloc 出来的指针，函数返回后那块对象仍要存在。

---

## **3. 为什么函数调用适合用栈：Stack Allocation 的直觉与条件**


课件总结了栈策略的两个核心理由：

### **3.1 “集体分配、集体退出”**

- 每次调用一个过程：为它的局部变量等 **整体压栈**
    
- 过程终止：那一整块空间 **整体弹栈**  

这非常高效：移动一次栈指针 top_sp/sp 就完成分配与回收。

### **3.2 局部变量的“相对地址不变”**

课件说：**relative addresses of its local variables are always the same**。

含义：对同一个函数来说，局部变量相对“栈帧基址”的偏移量是固定的。

所以编译器可以在符号表里记录偏移，比如：

- t 永远在 FP - 12
    
- m 永远在 FP + 8
    
    （偏移示意，具体取决于 ABI/实现）
---

## **4. 7.2.1 Activation Trees（活动树）：调用的嵌套结构**

### **4.1 活动（activation）是什么？**


课件把“程序执行”称为一个 process，而程序由多个 procedures/functions 构成；执行过程中会产生这些过程的 activation（一次调用对应一次激活）。

### **4.2 活动树描述什么？**


活动树用来描绘：**控制流如何进入/离开某个过程的激活**。

- 树上的一个结点 = 一次过程激活（一次调用）
    
- 父子关系 = 谁调用了谁
    
- 关键性质：**子过程的生命期嵌套在父过程的生命期内部**（课件原话：lifetime nested within parent）  

### **4.3 为什么这个性质重要？**

因为“嵌套生命期”意味着：**后调用的先返回**（LIFO），这正是栈的行为。

所以：**只要语言的调用/返回遵循这种嵌套规律（没有奇怪的控制流破坏），栈就是天然的数据结构。**

---

## **5. 7.2.2 Activation Records（活动记录 / 栈帧）：栈里一帧到底放什么？**

课件说 control stack 用来跟踪“活着的”过程激活；每个 live activation 在栈上都有一个 activation record（frame）。

### **5.1 一个通用的 Activation Record 组成**


课件的图（Figure 7.5）给了典型字段：

1. **Actual parameters（实参区）**
    
2. **Returned values（返回值区）**（有些实现放寄存器/或 caller 预留）
    
3. **Control link（控制链 / 动态链）**
    
    - 指向 caller 的 activation record（“我是谁调用的”）
        
4. **Access link（访问链 / 静态链）**
    
    - 用于**嵌套作用域**下访问外层定义的数据（课件说“外层定义的”）。本课件后面也提示这部分可以忽略，但你要知道它存在。
        
5. **Saved machine status（保存机器状态）**
    
    - **return address**：返回地址（程序计数器 PC 值）
        
    - 被调用前需要保存、返回后要恢复的一些寄存器等
    
6. **Local data（局部变量区）**
    
7. **Temporaries（临时量区）**
    
    - 编译器产生的临时变量、表达式中间结果、块语句内变量等（后面 C 的栈帧页也强调了 temporaries）。


### **5.2 control link vs access link（别混）**

- **control link（动态链）**：服务于“返回/恢复调用者”这条控制关系（谁调用我）
    
- **access link（静态链）**：服务于“词法作用域访问外层变量”这条静态嵌套关系（我定义在哪层）

在 **C（无嵌套函数声明）** 里通常基本不需要 access link（或退化），所以课件后面重点讲“子程序非嵌套情形下（以 C 为例）”。

---

## **6. 7.2.3 Calling Sequence & Return Sequence：调用/返回到底做了什么？**

  
这一节课件强调：calling sequence 就是**为 callee 分配栈帧并填字段**；return sequence 就是**恢复机器状态让 caller 继续跑**。


### **6.1 调用序列（Calling Sequence，课件给的 4 步）**


课件给了一个典型分工（caller 做哪些、callee 做哪些）：

1. **caller 计算实参（evaluate actual parameters）**
    
2. **caller 把 return address、旧的 top_sp（或 caller 的 SP）等写入 callee 的栈帧**，并更新 top_sp 到新位置
    
3. **callee 保存寄存器值和其它状态信息**
    
4. **callee 初始化局部数据并开始执行**


配图（Figure 7.7）用“分界点”直观展示了：

- 上半部分主要是 caller 负责准备（参数/返回值位置、control link 等）
    
- 下半部分主要是 callee 自己负责（保存寄存器、局部变量、临时量等）


> 你可以把 calling sequence 想成：

> “caller 把快递（参数）打包放门口 + 写好回信地址；callee 开门把自己要用的东西（寄存器、局部区）整理好，然后开始干活。”

### **6.2 返回序列（Return Sequence，课件给的 3 步）**

  
课件对应给了 return 的过程：

1. **callee 把返回值放到参数旁边（或约定位置）**
    
2. **caller 虽然 top_sp 已经回退，但它知道返回值相对当前 top_sp 的位置，所以能取到返回值**
    
3. **callee 利用 machine-status 字段恢复 top_sp 和寄存器，然后跳转到 return address**

---

## **7. C 语言的存储组织：C 的栈帧长什么样？**


课件明确给了 C 的运行时区域：

- Global variables 的 data area
    
- main 的 activation record
    
- main 调用的函数的 activation record ……  

并给了“Activation Record of a Function in C”的典型布局字段：

- Returned Values unit（返回值单元）
    
- Internal Temporary Work Units（内部临时工作区）
    
- Local Variables storage（局部变量）
    
- Formal Parameters storage（形参）
    
- Number of Formal Parameters（形参个数）
    
- Return Address（返回地址）
    
- Caller’s SP（调用者栈指针/用于恢复）
    
- 栈顶 SP / TOP 指示

这里你要抓住两点：

### **7.1 为什么要存“参数个数”？**

某些实现/调用约定需要知道要清理多少参数，或者用于变参函数（如 printf）等情形。

### **7.2 temporaries 不只是“t1、t2”**


课件点名 temporaries 包括：

- 编译器产生的临时变量
    
- 块语句内声明的变量
    
- 表达式求值的中间结果

这解释了：为什么你写的代码很短，栈帧里看起来却可能有不少“工作单元”。

---

## **8. 递归例子：用栈帧把 “p(m)” 的调用链看清楚**

  
课件最后给了一个经典递归函数 p(m) 的例子，并画出了多个栈帧在栈上的地址/偏移示意（p(3), p(2) …）来展示：**递归=同一个函数多次激活=栈上出现多个相同布局的 frame**。


你可以用这个例子理解三件事：
### **8.1 “同名变量对应不同数据对象”**

每一层 p(m) 都有自己的局部变量 t、形参 m，它们名字相同，但绑定到不同栈帧里的不同位置（environment 在不同激活下产生不同绑定）。

### **8.2 返回值如何一路传回去**

最深层返回后，上层通过固定的相对位置取回返回值，做 t = m * p(m-1)，再返回。课件的 return sequence 正是在解释这个“固定相对位置能定位返回值”的机制。

### **8.3 为什么栈适合递归？**

因为递归调用的生命期天然嵌套：p(3) 活着时会调用 p(2)；p(2) 活着时又调用 p(1)；所以最先结束的是最内层。完全符合 LIFO。

---

## **9. 本章小结（把所有点串成一条线）**


按课件总结页，本章主要知识点就是：

1. **环境/状态**：名字到地址、地址到值；赋值只改状态
    
2. **静态/动态分配**：static 区、stack、heap 的分工
    
3. **活动树**：调用生命期嵌套 ⇒ 栈结构合理
    
4. **活动记录（栈帧）**：参数、返回值、控制链、（可选访问链）、保存机器状态、局部变量、临时量
    
5. **调用/返回序列**：谁负责准备、谁负责保存与恢复
    
6. **C 语言实现细节**：典型 frame 字段；递归导致多帧并存