---
title: Ech0 数据模型设计文档
tags:
  - ech0
  - data-models
  - doc
---

# Ech0 数据模型设计文档

本文件基于 `Ech0/internal/model` 目录所有模型与 DTO 汇总，覆盖持久化与非持久化数据结构。

## 相关文档
- [[ech0-features|Ech0 功能清单]]
- [[ech0-api|Ech0 API 设计文档]]
- [[ech0-database|Ech0 数据库设计文档]]

## 1. 通用响应模型

**Result<T>**
- `code`：1 成功 / 0 失败
- `msg`：提示信息
- `data`：响应主体

**handler.Response**
- `code`：自定义业务码（可选）
- `data`：响应数据
- `msg`：提示信息

## 2. 基础 DTO

**PageQueryDto**
- `page`、`pageSize`、`search`

**ImageDto**
- `url`、`source`、`object_key`、`width`、`height`

**GetPresignURLDto / PresignDto**
- 请求：`file_name`、`content_type`
- 响应：`object_key`、`presign_url`、`file_url`

**GetWebsiteTitleDto**
- `website_url`

## 3. Echo 领域模型

**Echo**
- `id`、`content`、`username`、`layout`、`private`
- `user_id`、`extension`、`extension_type`
- `images`（Image[]）、`tags`（Tag[]）
- `fav_count`、`created_at`

**Image**
- `id`、`message_id`（关联 Echo）
- `image_url`、`image_source`、`object_key`
- `width`、`height`

**Tag / EchoTag**
- Tag：`id`、`name`、`usage_count`、`created_at`
- EchoTag：`echo_id`、`tag_id`

**扩展类型与布局**
- Extension：`MUSIC` / `VIDEO` / `GITHUBPROJ` / `WEBSITE`
- Layout：`waterfall` / `grid` / `horizontal` / `carousel`
- ImageSource：`local` / `url` / `s3`

## 4. 用户与认证

**User**
- `id`、`username`、`password`、`is_admin`、`avatar`

**OAuthBinding**
- `user_id`、`provider`、`oauth_id`
- `issuer`、`auth_type`

**UserInfoDto**
- `username`、`password`、`is_admin`、`avatar`

**OAuthInfoDto**
- `provider`、`user_id`、`oauth_id`、`issuer`、`auth_type`

**JWT Claims**
- `user_id`、`username` + 标准 claims

**OAuth2/OIDC 辅助结构**
- `OAuthState`：`action`、`user_id`、`nonce`、`redirect`、`exp`、`provider`
- 各 Provider Token/User DTO：GitHub/Google/QQ 等

**Passkey / WebAuthn**
- `Passkey`：`credential_id`、`credential_json`、`public_key`、`sign_count` 等
- `PasskeyRegisterBeginReq`、`PasskeyRegisterBeginResp`
- `PasskeyLoginBeginResp`
- `PasskeyFinishReq`
- `PasskeyDeviceDto`
- `PasskeyUpdateDeviceNameReq`

## 5. 设置模型

**SystemSetting / SystemSettingDto**
- `site_title`、`server_logo`、`server_name`
- `server_url`、`allow_register`
- `ICP_number`、`meting_api`、`custom_css`、`custom_js`

**CommentSetting / CommentSettingDto**
- `enable_comment`、`provider`、`comment_api`

**S3Setting / S3SettingDto**
- `enable`、`provider`、`endpoint`、`access_key`、`secret_key`
- `bucket_name`、`region`、`use_ssl`
- `cdn_url`、`path_prefix`、`public_read`

**OAuth2Setting / OAuth2SettingDto**
- `enable`、`provider`、`client_id`、`client_secret`
- `redirect_uri`、`scopes`、`auth_url`、`token_url`、`user_info_url`
- `is_oidc`、`issuer`、`jwks_url`

**AccessTokenSetting / AccessTokenSettingDto**
- `name`、`expiry`（DTO）
- `id`、`user_id`、`token`、`created_at`（实体）

**FediverseSetting / FediverseSettingDto**
- `enable`、`server_url`

**AgentSetting / AgentSettingDto**
- `enable`、`provider`、`model`、`api_key`、`prompt`、`base_url`

**BackupSchedule / BackupScheduleDto**
- `enable`、`cron_expression`

## 6. Connect / Inbox / Todo

**Connect**
- `server_name`、`server_url`、`logo`
- `total_echos`、`today_echos`、`sys_username`

**Connected**
- `id`、`connect_url`

**Inbox**
- `id`、`source`、`type`、`content`
- `read`、`read_count`、`meta`、`read_at`、`created_at`

**Todo**
- `id`、`content`、`user_id`、`username`、`status`、`created_at`

## 7. Webhook 与队列

**Webhook / WebhookDto**
- `name`、`url`、`secret`、`is_active`
- `last_status`、`last_trigger`、`created_at`、`updated_at`

**DeadLetter**
- `type`、`payload`、`error_msg`
- `retry_count`、`next_retry`、`status`
- `created_at`、`updated_at`

## 8. ActivityPub / Fediverse 模型

**WebFingerResponse**
- `subject`、`aliases`、`links`

**Actor**
- `id`、`type`、`name`、`preferredUsername`、`summary`
- `icon`、`image`、`followers`、`following`、`inbox`、`outbox`
- `publicKey`

**Activity**
- `@context`、`id`、`type`、`actor`、`object`
- `published`、`to`、`cc`、`summary`

**Object**
- `id`、`type`、`attributedTo`
- `content`、`source`、`attachment`、`published`

**Outbox / Followers / Following**
- `OutboxResponse`、`OutboxPage`
- `FollowersResponse`、`FollowersPage`
- `FollowingResponse`、`FollowingPage`

**Follow / Follower**
- `Follow`：`actor_id`、`object_id`、`status` 等
- `Follower`：`actor_id`、`user_id`

**InboxStatus / TimelineItem**
- 记录远端 Activity 与 Object 的快照内容及索引信息

## 9. 监控模型

**Metrics**
- `CPU`、`Memory`、`Disk`、`Network`、`System`

## 10. 常量与枚举

**文件与存储**
- `UploadFileType`：`image` / `audio`
- `FileStorageType`：`local` / `s3`

**评论服务**
- `twikoo` / `artalk` / `waline` / `giscus`

**S3 Provider**
- `aws` / `aliyun` / `tencent` / `r2` / `minio` / `other`

**OAuth Provider**
- `github` / `google` / `qq` / `custom`

**Agent Provider**
- `openai` / `deepseek` / `anthropic` / `gemini` / `qwen` / `ollama` / `custom`

**Inbox 类型与来源**
- 类型：`echo` / `notification`
- 来源：`system` / `agent` / `user`

**DeadLetter**
- 类型：`webhook` / `push_echo_fediverse`
- 状态：`pending` / `processing` / `failed` / `completed` / `discarded`

**AccessToken 过期策略**
- `8_hours` / `1_month` / `never`

**Todo 状态**
- `0` 未完成 / `1` 已完成

**ActivityPub**
- ActivityType：`Create` / `Follow` / `Like` / `Accept` / `Announce` / `Undo`
- FollowStatus：`none` / `pending` / `accepted` / `rejected`

**OAuth2**
- OAuth2Action：`login` / `register` / `bind`
- AuthType：`oauth2` / `oidc`
