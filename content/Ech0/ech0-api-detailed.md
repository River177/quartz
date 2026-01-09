# Ech0 API Detailed Module Specs

This doc expands the API into module-level, implementation-ready endpoint/field lists.
Source: `Ech0/internal/router`, `Ech0/internal/handler`, `Ech0/internal/model`, `Ech0/internal/swagger/swagger.json`.

## 0. Common Conventions

### 0.1 Base Paths
- REST base: `/api`
- ActivityPub + RSS + Swagger: root paths (no `/api` prefix)
- WebSocket: `/ws/dashboard/metrics`

### 0.2 Auth
- JWT Bearer: `Authorization: Bearer <token>`
- Anonymous allowed on:
  - `GET /api/echo/page`
  - `GET /api/echo/today`
  - `GET /api/echo/:id`
  - `GET /api/echo/tag/:tagid`
  - `GET /api/s3/settings` (returns masked fields)

### 0.3 Response Envelope (JSON)
```json
{
  "code": 1,
  "msg": "string",
  "data": {}
}
```

### 0.4 Pagination DTO
```json
{
  "page": 1,
  "pageSize": 10,
  "search": "optional"
}
```

## 1. Auth Module

### 1.1 Login
- **POST** `/api/login`
- **Auth**: none
- **Body** (LoginDto)
  - `username` (string, required)
  - `password` (string, required)
- **Response data**: `string` (JWT token)

### 1.2 Register
- **POST** `/api/register`
- **Auth**: none
- **Body** (RegisterDto)
  - `username` (string, required)
  - `password` (string, required)
- **Response data**: empty

## 2. User Module

### 2.1 Get Current User
- **GET** `/api/user`
- **Auth**: JWT
- **Response data** (UserInfoDto)
  - `username`, `password` (empty), `is_admin`, `avatar`

### 2.2 Update Current User
- **PUT** `/api/user`
- **Auth**: JWT
- **Body** (UserInfoDto)
  - `username`, `password`, `is_admin`, `avatar`
- **Response data**: empty

### 2.3 Delete User
- **DELETE** `/api/user/:id`
- **Auth**: JWT (admin)
- **Path params**: `id` (int)
- **Response data**: empty

### 2.4 Set Admin
- **PUT** `/api/user/admin/:id`
- **Auth**: JWT (admin)
- **Path params**: `id` (int)
- **Response data**: empty

### 2.5 List Users
- **GET** `/api/allusers`
- **Auth**: none
- **Response data**: `[]User`

## 3. OAuth2 / OIDC Module

### 3.1 OAuth Login Redirect (root path)
- **GET** `/oauth/{provider}/login`
- **Auth**: none
- **Query**: `redirect_uri` (string)
- **Providers**: `github`, `google`, `qq`, `custom`
- **Response**: 302 redirect

### 3.2 OAuth Callback (root path)
- **GET** `/oauth/{provider}/callback`
- **Auth**: none
- **Query**: `code`, `state`
- **Response**: 302 redirect to `redirect_uri` with token

### 3.3 OAuth Bind (API)
- **POST** `/api/oauth/{provider}/bind`
- **Auth**: JWT
- **Body**: `{ "redirect_uri": "string" }`
- **Response data**: `string` (bind URL)

### 3.4 OAuth Info
- **GET** `/api/oauth/info`
- **Auth**: JWT
- **Query**: `provider` (github|google|qq|custom)
- **Response data** (OAuthInfoDto)

## 4. Passkey (WebAuthn) Module

### 4.1 Passkey Login Begin
- **POST** `/api/passkey/login/begin`
- **Auth**: none
- **Body**: empty
- **Response data** (PasskeyLoginBeginResp)
  - `nonce`
  - `publicKey` (WebAuthn request options)

### 4.2 Passkey Login Finish
- **POST** `/api/passkey/login/finish`
- **Auth**: none
- **Body** (PasskeyFinishReq)
  - `nonce`
  - `credential` (JSON)
- **Response data**: `string` (JWT token)

### 4.3 Passkey Register Begin
- **POST** `/api/passkey/register/begin`
- **Auth**: JWT
- **Body** (PasskeyRegisterBeginReq)
  - `device_name` (optional)
- **Response data** (PasskeyRegisterBeginResp)
  - `nonce`
  - `publicKey` (WebAuthn creation options)

### 4.4 Passkey Register Finish
- **POST** `/api/passkey/register/finish`
- **Auth**: JWT
- **Body** (PasskeyFinishReq)
- **Response data**: empty

### 4.5 List / Delete / Update Passkeys
- **GET** `/api/passkeys` -> `[]PasskeyDeviceDto`
- **DELETE** `/api/passkeys/:id` (JWT)
- **PUT** `/api/passkeys/:id` (JWT)
  - Body: `{ "device_name": "string" }`

## 5. Echo Module

### 5.1 Create Echo
- **POST** `/api/echo`
- **Auth**: JWT (admin)
- **Body** (Echo)
  - `content` (string, optional if images/extension present)
  - `layout` (waterfall|grid|horizontal|carousel)
  - `private` (bool)
  - `extension` (string)
  - `extension_type` (MUSIC|VIDEO|GITHUBPROJ|WEBSITE)
  - `images` (Image[])
  - `tags` (Tag[])
- **Response data**: empty

### 5.2 Update Echo
- **PUT** `/api/echo`
- **Auth**: JWT (admin)
- **Body** (Echo) with `id`
- **Response data**: empty

### 5.3 Delete Echo
- **DELETE** `/api/echo/:id`
- **Auth**: JWT (admin)
- **Response data**: empty

### 5.4 Like Echo
- **PUT** `/api/echo/like/:id`
- **Auth**: none
- **Response data**: empty

### 5.5 Get Echo by ID
- **GET** `/api/echo/:id`
- **Auth**: JWT or anon (private content hidden)
- **Response data**: Echo

### 5.6 List Echo (Pagination)
- **GET** `/api/echo/page`
- **POST** `/api/echo/page`
- **Auth**: JWT or anon
- **Request**: query or body PageQueryDto
- **Response data** (PageQueryResult)
  - `total`
  - `items` (Echo[])

### 5.7 Today Echo
- **GET** `/api/echo/today`
- **Auth**: JWT or anon
- **Response data**: Echo[]

### 5.8 Echo by Tag
- **GET** `/api/echo/tag/:tagid`
- **Auth**: JWT or anon
- **Query**: `page`, `pageSize`, `search`
- **Response data**: PageQueryResult Echo[]

## 6. Tag Module

### 6.1 List Tags
- **GET** `/api/tags`
- **Auth**: none
- **Response data**: Tag[]

### 6.2 Delete Tag
- **DELETE** `/api/tag/:id`
- **Auth**: JWT (admin)
- **Response data**: empty

## 7. Media Module

### 7.1 Upload Image
- **POST** `/api/images/upload`
- **Auth**: JWT (admin)
- **Content-Type**: multipart/form-data
- **Form fields**
  - `file` (file, required)
  - `ImageSource` (string, optional; local|s3)
- **Response data** (ImageDto)
  - `url`, `source`, `object_key`, `width`, `height`

### 7.2 Delete Image
- **DELETE** `/api/images/delete`
- **Auth**: JWT (admin)
- **Body** (ImageDto)
  - `url` (required)
  - `source` (required)
  - `object_key` (required for s3)
- **Response data**: empty

### 7.3 Upload Audio
- **POST** `/api/audios/upload`
- **Auth**: JWT (admin)
- **Form**: `file`
- **Response data**: `string` (audio URL)

### 7.4 Delete Audio
- **DELETE** `/api/audios/delete`
- **Auth**: JWT (admin)
- **Response data**: empty

### 7.5 S3 Presign
- **PUT** `/api/s3/presign`
- **Auth**: JWT (admin)
- **Body** (GetPresignURLDto)
  - `file_name` (required)
  - `content_type`
- **Response data** (PresignDto)
  - `object_key`, `presign_url`, `file_url`

## 8. RSS Module

### 8.1 RSS Feed
- **GET** `/rss`
- **Auth**: none
- **Response**: RSS XML (Atom)

## 9. Connect Module

### 9.1 Get Local Instance Info
- **GET** `/api/connect`
- **Auth**: none
- **Response data** (Connect)
  - `server_name`, `server_url`, `logo`
  - `total_echos`, `today_echos`, `sys_username`

### 9.2 List Added Connects
- **GET** `/api/connect/list`
- **Auth**: none
- **Response data**: Connected[]

### 9.3 Get Added Connects Info (fan-out)
- **GET** `/api/connects/info`
- **Auth**: none
- **Response data**: Connect[]

### 9.4 Add / Delete Connect
- **POST** `/api/addConnect` (JWT)
  - Body: Connected `{ connect_url }`
- **DELETE** `/api/delConnect/:id` (JWT)

## 10. Inbox Module

### 10.1 List Inbox (pagination)
- **GET** `/api/inbox`
- **Auth**: JWT (admin)
- **Query**: `page`, `pageSize`, `search`
- **Response data**: PageQueryResult Inbox[]

### 10.2 Unread Inbox
- **GET** `/api/inbox/unread`
- **Auth**: JWT (admin)
- **Response data**: Inbox[]

### 10.3 Mark Read / Delete / Clear
- **PUT** `/api/inbox/:id/read` (JWT, admin)
- **DELETE** `/api/inbox/:id` (JWT, admin)
- **DELETE** `/api/inbox` (JWT, admin)

## 11. Todo Module

### 11.1 List / Add / Update / Delete
- **GET** `/api/todo`
- **POST** `/api/todo` (Body: Todo)
- **PUT** `/api/todo/:id`
- **DELETE** `/api/todo/:id`
- **Auth**: JWT (admin)

## 12. Settings Module

### 12.1 System Settings
- **GET** `/api/settings` (public)
- **PUT** `/api/settings` (JWT, admin)
- **Body** (SystemSettingDto)
  - `site_title`, `server_logo`, `server_name`, `server_url`
  - `allow_register`, `ICP_number`, `meting_api`
  - `custom_css`, `custom_js`

### 12.2 Comment Settings
- **GET** `/api/comment/settings` (public)
- **PUT** `/api/comment/settings` (JWT, admin)
- **Body** (CommentSettingDto)
  - `enable_comment`, `provider`, `comment_api`

### 12.3 S3 Settings
- **GET** `/api/s3/settings` (public, masked)
- **PUT** `/api/s3/settings` (JWT, admin)
- **Body** (S3SettingDto)
  - `enable`, `provider`, `endpoint`, `access_key`, `secret_key`
  - `bucket_name`, `region`, `use_ssl`
  - `cdn_url`, `path_prefix`, `public_read`

### 12.4 OAuth2 Settings
- **GET** `/api/oauth2/settings` (JWT)
- **PUT** `/api/oauth2/settings` (JWT, admin)
- **Body** (OAuth2SettingDto)
  - `enable`, `provider`, `client_id`, `client_secret`
  - `redirect_uri`, `scopes`, `auth_url`, `token_url`, `user_info_url`
  - `is_oidc`, `issuer`, `jwks_url`

### 12.5 OAuth2 Status
- **GET** `/api/oauth2/status` (public)
- **Response data**: `{ enabled, provider }`

### 12.6 Fediverse Settings
- **GET** `/api/fediverse/settings` (JWT)
- **PUT** `/api/fediverse/settings` (JWT, admin)
- **Body** (FediverseSettingDto)
  - `enable`, `server_url`

### 12.7 Agent Settings
- **GET** `/api/agent/info` (public, summary)
- **GET** `/api/agent/settings` (JWT)
- **PUT** `/api/agent/settings` (JWT, admin)
- **Body** (AgentSettingDto)
  - `enable`, `provider`, `model`, `api_key`, `prompt`, `base_url`

### 12.8 Backup Schedule
- **GET** `/api/backup/schedule` (JWT)
- **POST** `/api/backup/schedule` (JWT, admin)
- **Body** (BackupScheduleDto)
  - `enable`, `cron_expression`

### 12.9 Access Tokens
- **GET** `/api/access-tokens` (JWT)
- **POST** `/api/access-tokens` (JWT, admin)
- **Body** (AccessTokenSettingDto)
  - `name`, `expiry` (8_hours|1_month|never)
- **DELETE** `/api/access-tokens/:id` (JWT, admin)

## 13. Webhook Module

### 13.1 CRUD
- **GET** `/api/webhook` (JWT, admin)
- **POST** `/api/webhook` (JWT, admin)
  - Body: WebhookDto `{ name, url, secret, is_active }`
- **PUT** `/api/webhook/:id` (JWT, admin)
  - Body: WebhookDto
- **DELETE** `/api/webhook/:id` (JWT, admin)

## 14. Backup Module

### 14.1 Execute Backup
- **GET** `/api/backup` (JWT, admin)

### 14.2 Export Backup
- **GET** `/api/backup/export?token=...` (public)
- **Response**: zip stream

### 14.3 Import Backup
- **POST** `/api/backup/import` (JWT, admin)
- **Form**: `file`

## 15. Dashboard / Metrics Module

### 15.1 Get Metrics
- **GET** `/api/dashboard/metrics` (JWT)
- **Response data**: Metrics

### 15.2 WebSocket Metrics
- **GET** `/ws/dashboard/metrics?token=...`
- **Response**: JSON push every 5s

## 16. Agent Module

### 16.1 Recent Summary
- **GET** `/api/agent/recent` (public)
- **Response data**: `string`

## 17. ActivityPub Module

### 17.1 WebFinger
- **GET** `/.well-known/webfinger?resource=acct:username@domain`
- **Response**: WebFingerResponse (application/jrd+json)

### 17.2 Actor
- **GET** `/users/:username`
- **Response**: Actor (application/activity+json)

### 17.3 Inbox (receive Activity)
- **POST** `/users/:username/inbox`
- **Body**: Activity (AS2 JSON)
- **Response**: 202 on success

### 17.4 Outbox
- **GET** `/users/:username/outbox`
- **Query**: `page`, `pageSize` (optional)
- **Response**: OutboxResponse or OutboxPage

### 17.5 Followers / Following
- **GET** `/users/:username/followers`
- **GET** `/users/:username/following`
- **Query**: `page`, `pageSize` (optional)

### 17.6 Object
- **GET** `/objects/:id`
- **Response**: Object

## 18. Path Mismatch Notes
- Webhook update path: Swagger shows `/api/webhook/{id}`; router registers `PUT /api/webhook` but handler expects `:id`.
- Metrics path: Swagger shows `/api/metrics` and `/ws/metrics`; router registers `/api/dashboard/metrics` and `/ws/dashboard/metrics`.
- RSS path: Swagger basePath is `/api`, but RSS is `/rss` at root.

