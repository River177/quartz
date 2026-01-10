# Jibun 连接通知协议 & 串门协议

本文档是对外协议规范，精确定义 Jibun ↔ Jibun 的交互。

## 一、连接通知协议

### 1.1 术语
- 本地实例（Local）：发起“添加连接”的实例。
- 远端实例（Remote）：被添加的实例。
- 连接记录（Connect）：Local 保存的远端实例连接配置。
- 入站记录（Inbound）：Remote 保存的“收到通知”的连接记录。
- `inviteToken`：由 Local 生成的共享密钥，用于 Remote 回调验证与后续串门签名。

### 1.2 总览流程
1) Local 生成 `inviteToken` 并向 Remote 发送入站通知（`POST {remote}/api/connect/inbound`）。
2) Remote 收到通知后，回调 Local 验证（`POST {local}/api/connect/verify`）。
3) 验证通过：Remote 记录该入站连接。

要求：
- 若 Remote 未返回成功（或不可达），Local 必须视为通知失败并终止连接建立。

### 1.3 时序示意
```
Local -> Remote: POST /api/connect/inbound
Remote -> Local: POST /api/connect/verify
Local -> Remote: 200 OK
Remote: mark inbound verified
```

### 1.4 接口明细

#### 1.4.1 接收入站通知（Remote）
`POST /api/connect/inbound`

请求体（JSON）：
```json
{
  "server_name": "string",
  "server_url": "string",
  "logo": "string",
  "sys_username": "string",
  "token": "string"
}
```
约束：
- `server_url` 必须为 Local 的绝对 URL（含 `http` 或 `https`）。
- `token` 必须为 Local 生成的 `inviteToken`。

响应体（JSON）：
```json
{
  "code": 1 | 0,
  "msg": "string",
  "data": {
    "id": 1,
    "serverName": "string",
    "serverUrl": "string",
    "serverLogo": "string",
    "sysUsername": "string",
    "tokenHint": "string",
    "verifiedAt": "string"
  }
}
```

行为规范：
- Remote 必须回调 Local 的 `/api/connect/verify` 来校验 `token`。
- 校验通过后 Remote 才能标记该入站连接为“已验证”。

---

#### 1.4.2 验证入站通知（Local）
`POST /api/connect/verify`

请求体（JSON）：
```json
{
  "server_url": "string",
  "token": "string"
}
```

响应体（JSON）：
```json
{
  "code": 1 | 0,
  "msg": "string",
  "data": {
    "valid": true
  }
}
```

验证规则（必须全部满足）：
- `server_url` 与本地已有连接的 `connectUrl` 完全一致（字符串完全相等）。
- `token` 与该连接的 `inviteToken` 完全一致。
- 若该连接实例类型非 JIBUN，则还需 `inviteExpiresAt` 未过期。

---

### 1.5 删除连接（JIBUN ↔ JIBUN，两次握手）
当 Local 删除一条 JIBUN 连接时，必须先通知 Remote 删除其入站记录，完成双向确认后再删除本地连接。ECH0 连接不参与该流程，可直接删除本地连接。

#### 1.5.1 发起删除通知（Local -> Remote）
`POST {remote}/api/connect/inbound/revoke`

请求头（必须）：
- `X-Timestamp: <unix_ms>`
- `X-Signature: <hex_hmac_sha256>`

签名计算：
- `payload = <timestamp>.<raw_body>`
- `signature = HMAC-SHA256(inviteToken, payload)`

请求体（JSON）：
```json
{
  "server_url": "string" // Local 的实例 URL
}
```

行为规范：
- Remote 必须校验签名与时间窗口（≤ 300 秒）。
- Remote 必须使用 `server_url` 找到对应的入站记录。
- Remote 必须在删除入站记录前，回调 Local 的 `/api/connect/verify` 进行二次确认。

响应体（JSON）：
```json
{
  "code": 1 | 0,
  "msg": "string",
  "data": null
}
```

#### 1.5.2 二次确认（Remote -> Local）
Remote 调用 Local 的验证接口：
`POST {local}/api/connect/verify`

请求体（JSON）：
```json
{
  "server_url": "string", // Remote 的实例 URL
  "token": "string"       // inviteToken
}
```

行为规范：
- Local 验证通过后，Remote 才能删除入站记录并返回成功。
- 若验证失败，Remote 必须返回失败，不得删除入站记录。

---

## 二、串门协议

### 2.1 目标
当 A 添加了 B（且 A/B 都是 JIBUN）时，B 的管理员在本地面板直接向 A 申请账号并自动登录。

### 2.2 核心流程
1) B 管理员在本地面板填写 email/password 等信息。
2) B 向 A 发送“创建账号并发放一次性登录 token”的请求。
3) A 校验签名与请求合法性，创建账号（默认 POSTER）。
4) A 返回一次性 `login_token` 与跳转地址。
5) B 打开新窗口跳转至 A；A 使用 `login_token` 签发正常登录态。

### 2.3 签名与时间要求（必须）
- 共享密钥：`inviteToken`（由连接通知阶段产生）。
- 时间戳：Unix 毫秒（UTC）。
- 签名原文：`<timestamp>.<raw_body>`。
- `raw_body` 为原始 JSON 字符串（UTF-8，字节序不变），**不得对字段排序/重排/美化**。
- 签名算法：HMAC-SHA256，输出十六进制小写字符串。
- 验证窗口：A 必须拒绝 `X-Timestamp` 超过 300 秒（±300 秒）之外的请求。

### 2.4 接口明细

#### 2.4.1 申请账号（A 端）
`POST /api/connect/issue-account`

请求头（必须）：
- `X-Timestamp: <unix_ms>`
- `X-Signature: <hex_hmac_sha256>`

签名计算：
- `payload = <timestamp>.<raw_body>`
- `signature = HMAC-SHA256(inviteToken, payload)`

请求体（JSON）：
```json
{
  "server_url": "string",
  "email": "string",
  "password": "string",
  "display_name": "string | null",
  "avatar_url": "string | null"
}
```

约束：
- `server_url` 必须等于 B 的实例 URL（绝对地址）。
- `email` 必须为合法邮箱格式。
- 若 `email` 已存在于 A，必须返回失败。
- 账号角色必须为 `POSTER`，不允许客户端传入角色字段。

响应体（成功，JSON）：
```json
{
  "code": 1,
  "msg": "string",
  "data": {
    "login_token": "string",
    "expires_at": "string",
    "redirect": "string"
  }
}
```
约束：
- `expires_at` 必须为 ISO-8601 UTC。
- `redirect` 必须为 `https://A/auth/auto?token=...` 形式。

响应体（失败，JSON）：
```json
{
  "code": 0,
  "msg": "email exists" | "invalid signature" | "invalid payload" | "connect not found" | "expired"
}
```

---

#### 2.4.2 自动登录（A 端）
`GET /auth/auto?token=...`

行为规范：
- A 必须验证该 token：未过期且未使用。
- A 必须在验证通过后立即使该 token 失效（只允许使用一次）。
- A 必须为关联用户签发正常登录态（JWT 或 Cookie）。
- A 必须以 302 重定向结束流程。

---

### 2.5 B 端 UI 行为
- 管理面板展示“可串门”的连接（instanceType=JIBUN）。
- 点击后弹窗填写 email/password。
- 调用 A 的 `/api/connect/issue-account`。
- 成功后执行：先同步 `window.open('about:blank', '_blank')`，再将该窗口 `location.href = redirect`。

---

## 统一错误约定
- `email exists`：A 端邮箱已存在。
- `invalid signature`：签名校验失败。
- `invalid payload`：请求字段缺失或格式错误。
- `connect not found`：`server_url` 未能匹配有效连接。
- `expired`：时间戳超出允许窗口或 token 已过期。
- `token used`：一次性 token 已使用（仅限 `/auth/auto`）。
- `verify failed`：二次确认失败（仅限删除连接握手）。
