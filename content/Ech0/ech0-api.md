---
title: Ech0 API 设计文档
tags:
  - ech0
  - api
  - doc
---

# Ech0 API 设计文档

本文件基于 `Ech0/internal/router`、`Ech0/internal/handler` 与 `Ech0/internal/swagger/swagger.json` 汇总当前全部接口。

## 相关文档
- [[ech0-features|Ech0 功能清单]]
- [[ech0-data-models|Ech0 数据模型设计文档]]
- [[ech0-database|Ech0 数据库设计文档]]

## 1. 通用约定

### 1.1 基础路径
- **REST API**：默认以 `/api` 为前缀。
- **ActivityPub/资源**：位于根路径（如 `/.well-known/webfinger`、`/users/:username`、`/rss`）。
- **WebSocket**：`/ws/dashboard/metrics`。

### 1.2 响应结构
所有 JSON 响应统一封装为：
```json
{
  "code": 1,
  "msg": "请求成功",
  "data": {}
}
```
`code=1` 表示成功，`code=0` 表示失败。错误时通常返回 HTTP 400/401 并包含 `msg`。

### 1.3 认证方式
- **JWT Bearer**：`Authorization: Bearer <token>`。
- **匿名可访问**：
  - `GET /api/echo/page`、`GET /api/echo/today`、`GET /api/echo/:id`、`GET /api/echo/tag/:tagid`
  - `GET /api/s3/settings`（返回脱敏信息）
- **特殊 Token**：
  - `GET /api/backup/export`：`token` 查询参数
  - `GET /ws/dashboard/metrics`：`token` 查询参数

## 2. REST API（/api）

### 2.1 用户与认证
- `POST /api/login` 登录（body: LoginDto）
- `POST /api/register` 注册（body: RegisterDto）
- `GET /api/user` 获取当前用户信息（JWT）
- `PUT /api/user` 更新当前用户（JWT，body: UserInfoDto）
- `DELETE /api/user/:id` 删除用户（JWT，管理员）
- `PUT /api/user/admin/:id` 更新用户管理员权限（JWT，管理员）
- `GET /api/allusers` 获取用户列表（公开）

### 2.2 OAuth2 / OIDC（根路径 + /api）
- `GET /oauth/github/login` 登录跳转（query: redirect_uri）
- `GET /oauth/github/callback` 回调（query: code, state）
- `GET /oauth/google/login` 登录跳转（query: redirect_uri）
- `GET /oauth/google/callback` 回调（query: code, state）
- `GET /oauth/qq/login` 登录跳转（query: redirect_uri）
- `GET /oauth/qq/callback` 回调（query: code, state）
- `GET /oauth/custom/login` 登录跳转（query: redirect_uri）
- `GET /oauth/custom/callback` 回调（query: code, state）
- `POST /api/oauth/github/bind` 绑定 GitHub（JWT，body: {redirect_uri}）
- `POST /api/oauth/google/bind` 绑定 Google（JWT，body: {redirect_uri}）
- `POST /api/oauth/qq/bind` 绑定 QQ（JWT，body: {redirect_uri}）
- `POST /api/oauth/custom/bind` 绑定自定义 OAuth（JWT，body: {redirect_uri}）
- `GET /api/oauth/info` 查询绑定信息（JWT，query: provider）

### 2.3 Passkey（WebAuthn）
- `POST /api/passkey/login/begin` 开始 Passkey 登录（公开）
- `POST /api/passkey/login/finish` 完成 Passkey 登录（公开，body: PasskeyFinishReq）
- `POST /api/passkey/register/begin` 开始 Passkey 绑定（JWT，body: PasskeyRegisterBeginReq）
- `POST /api/passkey/register/finish` 完成 Passkey 绑定（JWT，body: PasskeyFinishReq）
- `GET /api/passkeys` 列出设备（JWT）
- `DELETE /api/passkeys/:id` 删除设备（JWT）
- `PUT /api/passkeys/:id` 更新设备名称（JWT，body: PasskeyUpdateDeviceNameReq）

### 2.4 Echo 与标签
- `POST /api/echo` 创建 Echo（JWT，body: Echo）
- `PUT /api/echo` 更新 Echo（JWT，body: Echo）
- `DELETE /api/echo/:id` 删除 Echo（JWT）
- `GET /api/echo/:id` 获取 Echo 详情（JWT 或匿名）
- `GET|POST /api/echo/page` 分页查询 Echo（JWT 或匿名，query 或 body: PageQueryDto）
- `GET /api/echo/today` 获取今日 Echo（JWT 或匿名）
- `PUT /api/echo/like/:id` 点赞 Echo（公开）
- `GET /api/echo/tag/:tagid` 按标签查询 Echo（JWT 或匿名，支持分页 query）
- `GET /api/tags` 获取全部标签（公开）
- `DELETE /api/tag/:id` 删除标签（JWT）

### 2.5 媒体与资源
- `POST /api/images/upload` 上传图片（JWT，multipart form: file + ImageSource）
- `DELETE /api/images/delete` 删除图片（JWT，body: ImageDto）
- `POST /api/audios/upload` 上传音频（JWT，multipart form: file）
- `DELETE /api/audios/delete` 删除音频（JWT）
- `PUT /api/s3/presign` 获取 S3 预签名（JWT，body: GetPresignURLDto）

### 2.6 系统状态与公共信息
- `GET /api/status` 系统状态（公开）
- `GET /api/heatmap` 发布热力图（公开）
- `GET /api/hello` 版本与欢迎信息（公开）
- `GET /api/getmusic` 获取可播放音乐 URL（公开）
- `GET /api/playmusic` 音频流播放（公开）
- `GET /api/website/title` 获取网站标题（公开，query: website_url）
- `GET /rss` RSS 订阅源（公开，资源路由）

### 2.7 待办事项
- `GET /api/todo` 获取待办列表（JWT）
- `POST /api/todo` 新增待办（JWT，body: Todo）
- `PUT /api/todo/:id` 完成待办（JWT）
- `DELETE /api/todo/:id` 删除待办（JWT）

### 2.8 收件箱
- `GET /api/inbox` 收件箱分页（JWT，query: page/pageSize/search）
- `GET /api/inbox/unread` 未读消息（JWT）
- `PUT /api/inbox/:id/read` 标记已读（JWT）
- `DELETE /api/inbox/:id` 删除消息（JWT）
- `DELETE /api/inbox` 清空收件箱（JWT）

### 2.9 Ech0 Connect
- `GET /api/connect` 获取本实例信息（公开）
- `GET /api/connect/list` 获取已添加连接列表（公开）
- `GET /api/connects/info` 获取已添加实例详情（公开）
- `POST /api/addConnect` 添加连接（JWT，body: Connected）
- `DELETE /api/delConnect/:id` 删除连接（JWT）

### 2.10 设置与管理
- `GET /api/settings` 获取系统设置（公开）
- `PUT /api/settings` 更新系统设置（JWT，body: SystemSettingDto）
- `GET /api/comment/settings` 获取评论设置（公开）
- `PUT /api/comment/settings` 更新评论设置（JWT，body: CommentSettingDto）
- `GET /api/s3/settings` 获取 S3 设置（公开，脱敏）
- `PUT /api/s3/settings` 更新 S3 设置（JWT，body: S3SettingDto）
- `GET /api/oauth2/settings` 获取 OAuth2 设置（JWT）
- `PUT /api/oauth2/settings` 更新 OAuth2 设置（JWT，body: OAuth2SettingDto）
- `GET /api/oauth2/status` 获取 OAuth2 状态（公开）
- `GET /api/fediverse/settings` 获取联邦设置（JWT）
- `PUT /api/fediverse/settings` 更新联邦设置（JWT，body: FediverseSettingDto）
- `GET /api/agent/info` 获取 Agent 配置摘要（公开）
- `GET /api/agent/settings` 获取 Agent 设置（JWT）
- `PUT /api/agent/settings` 更新 Agent 设置（JWT，body: AgentSettingDto）
- `GET /api/backup/schedule` 获取备份计划（JWT）
- `POST /api/backup/schedule` 更新备份计划（JWT，body: BackupScheduleDto）
- `GET /api/access-tokens` 列出访问令牌（JWT）
- `POST /api/access-tokens` 创建访问令牌（JWT，body: AccessTokenSettingDto）
- `DELETE /api/access-tokens/:id` 删除访问令牌（JWT）

### 2.11 Webhook
- `GET /api/webhook` 获取 Webhook 列表（JWT）
- `POST /api/webhook` 创建 Webhook（JWT，body: WebhookDto）
- `PUT /api/webhook/:id` 更新 Webhook（JWT，body: WebhookDto）
- `DELETE /api/webhook/:id` 删除 Webhook（JWT）

### 2.12 备份
- `GET /api/backup` 执行备份（JWT）
- `GET /api/backup/export` 导出备份（公开，query: token）
- `POST /api/backup/import` 导入备份（JWT，multipart form: file）

### 2.13 Dashboard 与监控
- `GET /api/dashboard/metrics` 获取系统指标（JWT）
- `GET /ws/dashboard/metrics` WebSocket 指标订阅（query: token）

### 2.14 Agent
- `GET /api/agent/recent` 生成近期活动总结（公开）

## 3. ActivityPub / Fediverse（根路径）

### 3.1 Discovery
- `GET /.well-known/webfinger?resource=acct:username@domain`
  - 返回 `application/jrd+json`

### 3.2 Actor / Inbox / Outbox
- `GET /users/:username` 获取 Actor（`application/activity+json`）
- `POST /users/:username/inbox` 接收 Activity
- `GET /users/:username/outbox` 获取 Outbox 概览或分页
  - `page`/`pageSize` 可选

### 3.3 Followers / Following
- `GET /users/:username/followers` 获取粉丝集合或分页
  - `page`/`pageSize` 可选
- `GET /users/:username/following` 获取关注集合或分页

### 3.4 Object
- `GET /objects/:id` 获取内容对象

## 4. Swagger 文档
- `GET /swagger/*any`：OpenAPI UI

## 5. 路径差异提醒
> [!warning] 注意
> 由于 Swagger 注释与路由注册存在差异，实际路径以 `internal/router/*.go` 为准：
> - Webhook 更新接口：Swagger 使用 `/api/webhook/{id}`，但路由当前注册为 `PUT /api/webhook`；更新逻辑依赖 `id` 路径参数。
> - Dashboard 指标：Swagger 使用 `/api/metrics` 与 `/ws/metrics`，但路由注册为 `/api/dashboard/metrics` 与 `/ws/dashboard/metrics`。
> - RSS 订阅：Swagger 基础路径为 `/api`，但实际路由为根路径 `/rss`。
