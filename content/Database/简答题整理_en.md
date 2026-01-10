### 1. Database System Architecture and Model Theory
This section mainly tests understanding of foundational database concepts.

* **Basic concepts and system components:**
    * **Question:** Explain the concepts of data, database, DBMS, and database system and their relationships; what parts make up a database system?
    * **Key points:**
        1. **Data**: symbolic records describing things, including numbers, text, graphics, images, sound, etc.; must be understood with semantics.
        2. **Database (DB)**: a shareable collection of data stored long-term in a computer and organized by a data model; low redundancy, high independence, easy to expand.
        3. **Database Management System (DBMS)**: data management software between users and the operating system, providing data definition, storage organization, query/update, transaction and runtime management.
        4. **Database System (DBS)**: the overall system consisting of the database, DBMS (and development tools), applications, and the DBA; applications rely on the DBMS to operate on the database.
        5. **Relationship**: DBS is the superset; DBMS manages the database and exposes interfaces, and the DBA/applications use them to query, update, and delete data.

* **File management vs. database management:**
    * **Question:** Compare the main differences between file management and database management.
    * **Key points:** The database system introduces the DBMS between applications and data; most storage management and consistency work is handled by the DBMS, decoupling applications from storage. In a file system, applications must directly handle physical structures, so storage changes affect programs and are hard to maintain.

* **Data model concept and layers:**
    * **Question:** Explain the concept of a data model; why is it divided into two layers?
    * **Key points:** A data model should represent the real world, be easy to understand, and be easy to implement. A single model cannot satisfy all goals, so databases are divided into two layers: the **conceptual data model** (business semantics) and the **organizational data model** (implementation), which helps both description and realization.

* **Three-schema and two-level mapping:**
    * **Question:** What are the three schema levels in a database system? What do the two mappings do? What are the advantages of the three-schema architecture?
    * **Key points:**
        - **Three schemas**: external schema (user-specific local views), conceptual schema (global logical structure), internal schema (physical storage structure).
        - **External/conceptual mapping**: maintains consistency between external and conceptual schemas; when the conceptual schema changes, adjust the mapping to keep external schemas unchanged.
        - **Conceptual/internal mapping**: defines the correspondence between conceptual structure and physical structure; when physical storage changes, adjust the mapping to keep the conceptual schema unchanged.
        - **Advantages**: decouples user views, logical structure, and physical structure to achieve **logical independence** (schema changes do not affect applications) and **physical independence** (storage changes do not affect schemas), reducing mutual interference.

* **Data independence (high frequency):**
    * **Question:** How do modern databases achieve data independence? Why is higher data independence better? How do multi-level schemas affect independence? What are physical and logical data-program independence?
    * **Key points:** Must mention the **three-schema architecture** (external, conceptual, internal) and **two mappings** (external/conceptual mapping and conceptual/internal mapping). Physical independence means that when the physical storage structure changes, adjusting the conceptual/internal mapping keeps the conceptual schema and applications unchanged. Logical independence means that when the conceptual schema changes, adjusting the external/conceptual mapping keeps external schemas and applications unchanged. The higher the independence, the more localized the changes, which improves maintenance and evolution.

* **Data model comparison:**
    * **Question:** Relational model vs. network/hierarchical model (how to represent M:N relationships and the fundamental difference).
    * **Key points:** Network/hierarchical models use pointers/links (navigational), while the relational model uses tables/foreign keys (declarative, set-based).

* **Normal form theory:**
    * **Question:** In database design, are higher normal forms always better?
    * **Key points:** **No.** Higher normal forms reduce redundancy and anomalies but increase the number of tables and join operations, which can reduce query performance. You must balance normalization and performance.

### Views

* **Benefits of views:**
    * **Question:** What advantages do views provide?
    * **Key points:** (1) simplify complex queries; (2) allow users to view the same data from different perspectives; (3) hide underlying details and improve security; (4) provide some degree of logical independence.

* **Views and performance:**
    * **Question:** "Using views can speed up queries" -- is that correct?
    * **Key points:** No. When querying a view, the DBMS merges the view definition with the query and translates it into an equivalent query on the base tables; it still accesses the base tables and does not inherently speed up the query.

### 2. Indexes and Query Optimization
This section tests understanding of low-level performance mechanisms.

* **Index efficiency analysis (high frequency):**
    * **Question:** Does a dense index always improve efficiency? Why can a non-clustered index be worse when the proportion of qualifying tuples is high (>20%)?
    * **Key points:** Not necessarily. If the table is small or the result set is large (low selectivity), a non-clustered index causes many **random I/Os**, which can be slower than a full table scan (sequential I/O).
    * **Question:** Why is a primary index usually built on the primary key? Why is the B-tree mainstream?
    * **Example:** Compute the B+ tree order (degree). If the block size is 492B and pointer size is 6B, and Sailors record fields are sid 2B, sname 4B, rating 1B, age 1B, master 2B, delete flag 1B, then:
        1. **rating clustered index**: index node satisfies `2k*1 + (2k+1)*6 <= 492`, leaf node satisfies `2k*1 + 2*6 + 2k*6 <= 492`, solve for k.
        2. **sid primary index**: index node `2k*2 + (2k+1)*6 <= 492`, leaf node `2k*2 + 2*6 + 2k*(6+2) <= 492`.

* **SQL optimization:**
    * **Question:** Why should `OR` be avoided in `WHERE` whenever possible?
    * **Key points:** `OR` is hard to use with indexes (often leading to full table scans), or requires separate queries and a union, both of which are costly.
    * **Question:** Why is query optimization more important for relational databases than for network/hierarchical databases?
    * **Key points:** Relational databases are **non-procedural** (specify what), so the system chooses the execution plan and optimizer quality directly impacts performance. Network/hierarchical databases are navigational (specify how), so the path is fixed by the programmer and optimization space is limited.

* **Data model optimization:**
    * **Question:** What methods are included in data model optimization?
    * **Key points:** (1) list and analyze functional dependencies; (2) minimize dependencies and remove redundancy; (3) determine the normal form of each schema and choose an appropriate level; (4) evaluate decomposition or merging based on requirements, and denormalize when needed for performance.

### 3. Transaction Concurrency Control (Hard)
This section focuses on lock mechanisms and schedule correctness, especially the **U lock**.

* **Lock protocol and deadlock:**
    * **Question:** What problems do (S, X) locks have? How do (S, U, X) locks improve concurrency/efficiency?
    * **Key points:** (S, X) locks can cause **upgrade deadlocks** (both transactions hold S and want to upgrade to X, so they wait on each other). (S, U, X) adds the **U lock (update lock)**, which allows reads but is incompatible with U; this serializes update intent and prevents upgrade deadlocks.
    * **Question:** Can locks completely solve deadlocks?
    * **Key points:** No. They can avoid upgrade deadlocks but cannot solve deadlocks caused by cyclic waits on multiple resources.
    * **Question:** Explain the two-phase locking protocol (2PL).
    * **Key points:** A transaction has two phases: in the growing phase it only acquires locks, and in the shrinking phase it releases locks and cannot acquire new ones. Following 2PL ensures serializability and is the basis of strict lock scheduling.

* **Schedule correctness judgment:**
    * **Question:** Given a concurrent schedule (operation sequences for T1 and T2), compute the final result and judge whether the schedule is correct.
    * **Key points:** Check whether the result matches the result of **serial execution** (T1 then T2, or T2 then T1). If not (not serializable), the schedule is incorrect.

* **Need for concurrency control:**
    * **Question:** Why must databases have concurrency control mechanisms?
    * **Key points:** Multiple users share the same data; without synchronization, problems like lost updates and dirty reads break consistency. Concurrency control via locks or timestamps ensures transaction isolation and correctness.

### 4. Recovery
This section is highly fixed, and **media failure** is almost always tested.

* **Logging and write-ahead rule:**
    * **Question:** Why must the log be written before the database when recording logs?
    * **Key points:** If the database is written first and the log is missing, recovery is impossible after a crash. Writing the log first ensures that even if the database write fails, UNDO can roll back changes, ensuring write-ahead logging (WAL) safety.

* **Transaction ACID properties:**
    * **Question:** Which subsystem guarantees each of the four transaction properties, and what is the meaning?
    * **Key points:** Atomicity (transaction manager, ensures all-or-nothing); Consistency (integrity subsystem, maintains constraints); Isolation (concurrency control subsystem, ensures serial-equivalent execution); Durability (recovery manager, ensures committed results persist).

* **Media failure recovery (must-know):**
    * **Question:** In media failure (disk damage), should committed transactions **before** the last checkpoint be redone?
    * **Key points:** **Yes, redo is required.**
    * **Reason:** Media failure means the disk data is completely lost. Recovery is based on a **backup** copy, which is usually old. Even if the checkpoint ensured data was on disk at that time, the disk is now damaged. Therefore all committed transactions after the backup point must be redone.

* **Log management:**
    * **Question:** When can the log (CTL/Log) be cleared?
    * **Key points:** Only after a new **database dump (backup)** has completed can old logs be cleared.

* **System failure recovery:**
    * **Question:** How do you recover from a system crash?
    * **Key points:** Scan the log forward to find committed and incomplete transactions and build REDO and UNDO lists; scan backward to UNDO incomplete transactions; scan forward again to REDO committed transactions and restore consistency.

* **Media failure recovery:**
    * **Question:** What are the steps to recover from media damage?
    * **Key points:** Load the most recent database backup (including logs from the start of the dump if needed); then load logs after the backup and redo all committed transactions to restore the database to a consistent state before the failure.

* **Transaction failure recovery:**
    * **Question:** How do you recover from a single transaction failure?
    * **Key points:** Scan the log backward from the end, find update operations of that transaction, and write back the "old values" to undo them until the transaction begin record is reached.

* **Checkpoint recovery:**
    * **Question:** What are the steps for the checkpoint method?
    * **Key points:** Locate the latest checkpoint from the restart file and get the active list; build UNDO-LIST and REDO-LIST; scan forward from the checkpoint, add new transactions to UNDO, and move committed transactions to REDO; after the scan, undo transactions in UNDO and redo transactions in REDO.

* **Database mirroring:**
    * **Question:** What is database mirroring and what is it used for?
    * **Key points:** The DBMS automatically copies the database or key data to another disk in real time, keeping the primary and mirror consistent. It enables quick failover and recovery in media failures, and can also offload read requests under normal operation to improve availability.
