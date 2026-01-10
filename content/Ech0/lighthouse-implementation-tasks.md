# Lighthouse 技术栈对照实现任务拆解（基于现有 Vue + Axum + SQLite）

本任务拆解以当前 Lighthouse 结构为基准：
- 后端：Rust + Axum + SQLx + SQLite + JWT + OpenAPI(utoipa)
- 前端：Vue 3 + Vite + TypeScript + Pinia + UnoCSS + ECharts
- 目录约定：`backend/src/{handlers,services,models,routes.rs}`、`frontend/src/{api,stores,views}`

## A. 后端实现任务（Axum/Rust）

### A1. 基础工程与模块骨架
- [x] 补齐 `backend/src/routes.rs`：按模块注册路由（echo、media、settings、auth、connect、inbox、todo、fediverse、dashboard、webhook、backup）。
- [x] 统一错误响应与结果包装（对齐现有 `backend/src/error.rs` 风格）。
- [x] JWT 中间件（Bearer token + public route 例外）。
- [x] OpenAPI 文档注解：为新增模块补充 utoipa 注解。

### A2. 数据库与模型（SQLx + Migration）
- [ ] 新增迁移文件（SQLite）：
  - `users`, `oauth_bindings`, `passkeys`, `access_tokens`
  - `echos`, `images`, `tags`, `echo_tags`
  - `todos`, `connects`, `inbox`
  - `key_values`, `temp_files`
  - `webhooks`, `dead_letters`
  - `follows`, `followers`, `inbox_statuses`
- [ ] 在 `backend/src/models/` 建模（serde + sqlx FromRow）。
- [ ] 统一时间字段（UTC + chrono）。
- [ ] 关键索引/唯一约束（tag.name, passkeys.credential_id, echo_tags(echo_id,tag_id)）。

### A3. Auth 与用户模块
- [ ] `POST /api/auth/login`：用户登录（JWT）。
- [ ] `POST /api/auth/register`：用户注册（可控开关）。
- [ ] `GET /api/users/me`：当前用户信息。
- [ ] `PATCH /api/users/me`：更新用户信息。
- [ ] `DELETE /api/users/:id`：删除用户（管理员）。
- [ ] 角色/权限模型：admin 与普通用户。
- [ ] OAuth2/OIDC 绑定流程（如需，先建表与接口骨架）。
- [ ] Passkey（WebAuthn）流程（后期里程碑可延后）。

### A4. Echo 核心模块
- [ ] Echo CRUD：
  - `POST /api/echo`
  - `PATCH /api/echo/:id`
  - `DELETE /api/echo/:id`
  - `GET /api/echo/:id`
  - `GET /api/echo/page`（分页）
  - `GET /api/echo/today`
- [ ] Echo 结构校验：内容/图片/扩展卡片至少一项。
- [ ] 布局枚举约束（waterfall/grid/horizontal/carousel）。
- [ ] 标签绑定与使用计数（事务内处理）。
- [ ] 点赞接口：
  - `PUT /api/echo/:id/like`

### A5. 媒体与存储模块
- [ ] 图片上传/删除（multipart + 本地存储）。
- [ ] 音频上传/删除（multipart + 本地存储）。
- [ ] S3 预签名上传：
  - `PUT /api/storage/s3/presign`
- [ ] TempFile 回收任务（防止孤儿文件）。

### A6. RSS 模块
- [ ] RSS/Atom 生成（feed-rs 或 rss crate）。
- [ ] `GET /rss` 输出 XML。
- [ ] 输出字段映射：标题、链接、作者、发布时间、内容摘要。

### A7. Connect 模块
- [ ] Connect 表 CRUD：
  - `POST /api/connect`
  - `DELETE /api/connect/:id`
- [ ] Connect 公共读取：
  - `GET /api/connect`
  - `GET /api/connect/list`
  - `GET /api/connects/info`
- [ ] 并发抓取 + 超时 + 重试策略（tokio + timeout）。

### A8. Inbox 模块
- [ ] Inbox CRUD：
  - `GET /api/inbox`（分页+搜索）
  - `GET /api/inbox/unread`
  - `PUT /api/inbox/:id/read`
  - `DELETE /api/inbox/:id`
  - `DELETE /api/inbox`
- [ ] Admin-only 权限。

### A9. Todo 模块
- [ ] Todo CRUD：
  - `GET /api/todo`
  - `POST /api/todo`
  - `PUT /api/todo/:id`
  - `DELETE /api/todo/:id`
- [ ] 最大未完成数量限制（3）。

### A10. Settings 模块
- [ ] System Setting（key_value 存 JSON）：
  - `GET /api/settings`
  - `PUT /api/settings`
- [ ] Comment 设置、OAuth2 设置、S3 设置、Fediverse 设置：
  - `GET/PUT /api/settings/{comment|oauth2|s3|fediverse}`
- [ ] Agent 设置：
  - `GET /api/agent/info`
  - `GET/PUT /api/agent/settings`
- [ ] Backup Schedule：
  - `GET /api/backup/schedule`
  - `POST /api/backup/schedule`
- [ ] Access Tokens：
  - `GET /api/access-tokens`
  - `POST /api/access-tokens`
  - `DELETE /api/access-tokens/:id`

### A11. Webhook 与事件总线
- [ ] 事件总线（tokio broadcast 或 mpsc + dispatcher）。
- [ ] Webhook CRUD：
  - `GET /api/webhooks`
  - `POST /api/webhooks`
  - `PUT /api/webhooks/:id`
  - `DELETE /api/webhooks/:id`
- [ ] Webhook 重试 + 死信队列（dead_letters 表）。
- [ ] 事件触发点：Echo 创建/更新/删除、备份、用户变更。

### A12. Fediverse / ActivityPub
- [ ] WebFinger：`/.well-known/webfinger`
- [ ] Actor：`/users/:username`
- [ ] Inbox：`/users/:username/inbox`
- [ ] Outbox：`/users/:username/outbox`
- [ ] Followers/Following：`/users/:username/followers`、`/users/:username/following`
- [ ] Object：`/objects/:id`
- [ ] Activity/Actor/Object 转换（Echo -> AS2）。
- [ ] HTTP Signature 验签与签名。

### A13. Dashboard 指标
- [ ] 系统指标采集（sysinfo crate）。
- [ ] `GET /api/dashboard/metrics`
- [ ] `GET /ws/dashboard/metrics`（WebSocket 推送）。

### A14. Agent（LLM）
- [ ] 近期活动摘要：
  - `GET /api/agent/recent`
- [ ] Provider 抽象与实现（OpenAI/DeepSeek/Anthropic/Gemini/本地）。
- [ ] 缓存（key_value）。

### A15. 备份与恢复
- [ ] 数据库与资产文件压缩备份（zip）。
- [ ] `GET /api/backup`
- [ ] `GET /api/backup/export?token=...`
- [ ] `POST /api/backup/import`
- [ ] 定时备份任务（cron）。

## B. 前端实现任务（Vue 3 + Pinia）

### B1. API Client
- [ ] `frontend/src/api/` 新增模块：
  - `echo.ts`, `media.ts`, `settings.ts`, `auth.ts`, `connect.ts`
  - `inbox.ts`, `todo.ts`, `fediverse.ts`, `dashboard.ts`, `webhook.ts`, `backup.ts`
- [ ] 统一错误处理与 token 注入（复用 `frontend/src/api/client.ts`）。

### B2. Store 模块
- [ ] `stores/echo.ts`：echo 列表/详情/分页。
- [ ] `stores/settings.ts`：系统设置/存储设置/联邦设置。
- [ ] `stores/auth.ts`：登录态、token、用户信息。
- [ ] `stores/connect.ts`：connect 列表与 info。
- [ ] `stores/inbox.ts`：收件箱、未读、分页。
- [ ] `stores/dashboard.ts`：指标数据与 ws 订阅。

### B3. 视图与组件对齐
- [ ] Home/Editor：Echo 发布与列表（复用 `views/Home.vue`/`views/Editor.vue`）。
- [ ] Upload：媒体上传（复用 `views/Upload.vue`）。
- [ ] Charts：指标展示（复用 `views/Charts.vue`）。
- [ ] Panel：设置中心（新增系统/存储/联邦/备份/Webhook/AccessToken）。
- [ ] Connect/Hub：跨实例列表与概览。
- [ ] Inbox/Todo：管理页（列表 + 操作）。

### B4. 路由与权限
- [ ] 路由元信息标记需要登录/管理员。
- [ ] 未登录引导与错误页面（`views/NotFound.vue` 已存在）。

## C. 工程与运维

### C1. 配置与环境变量
- [ ] `backend/env.example` 增补新模块配置。
- [ ] 前端 `.env` 增补 API Base URL。

### C2. 测试
- [ ] 单元测试：service 层与 repository 层。
- [ ] 集成测试：Echo CRUD、RSS、上传、Webhooks。
- [ ] ActivityPub 互操作测试（最小化用例）。

### C3. 部署
- [ ] Dockerfile + docker-compose（SQLite 卷 + assets）。
- [ ] 生产环境使用 PostgreSQL（可选后续）。

## D. 里程碑建议

1. **M1：Echo + Auth + RSS + 基础设置**
2. **M2：Media + Inbox + Todo + Dashboard**
3. **M3：Webhook + Backup + Connect**
4. **M4：Fediverse + Agent + 高级设置**

