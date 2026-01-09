---
title: Ech0 数据库设计文档
tags:
  - ech0
  - database
  - doc
---

# Ech0 数据库设计文档

本文件基于 `Ech0/internal/database/database.go` 与 `Ech0/internal/model/*` 中的 GORM 模型整理。

## 相关文档
- [[ech0-features|Ech0 功能清单]]
- [[ech0-api|Ech0 API 设计文档]]
- [[ech0-data-models|Ech0 数据模型设计文档]]

## 1. 存储与迁移
- **数据库类型**：SQLite（默认 `data/ech0.db`）。
- **ORM**：GORM AutoMigrate 自动建表。
- **命名规则**：采用 GORM 默认表名（驼峰结构体名 → 下划线复数）。
- **特殊迁移**：修复旧 Echo 布局字段（NULL/空 → `waterfall`）。

## 2. 表结构概览

### 2.1 用户与认证

**User**
- `id` (PK, uint)
- `username` (varchar(255), unique, not null)
- `password` (varchar(255), not null)
- `is_admin` (bool)
- `avatar` (varchar(255))

**OAuthBinding**
- `id` (PK)
- `user_id` (index)
- `provider` (index)
- `oauth_id` (index)
- `issuer`
- `auth_type`

**Passkey**
- `id` (PK)
- `user_id` (index)
- `credential_id` (unique index: uid_cred)
- `credential_json` (text)
- `public_key` (text)
- `sign_count` (uint32)
- `last_used_at`
- `device_name` (varchar(128))
- `aaguid` (varchar(36))
- `created_at`, `updated_at`

**AccessTokenSetting**
- `id` (PK, int)
- `user_id`
- `token`
- `name`
- `expiry` (nullable)
- `created_at`

### 2.2 Echo 内容与标签

**Echo**
- `id` (PK)
- `content` (text, not null)
- `username` (varchar(100))
- `layout` (varchar(50), default `waterfall`)
- `private` (bool, default false)
- `user_id` (index, not null)
- `extension` (text)
- `extension_type` (varchar(100))
- `fav_count` (int, default 0)
- `created_at`

**Image**
- `id` (PK)
- `message_id` (index, not null) 备注：实际关联 Echo
- `image_url` (text)
- `image_source` (varchar(20))
- `object_key` (text)
- `width` (int)
- `height` (int)

**Tag**
- `id` (PK)
- `name` (varchar(50), unique, not null)
- `usage_count` (int, default 0)
- `created_at`

**EchoTag**（多对多关联表）
- `echo_id` (PK, no auto increment)
- `tag_id` (PK, no auto increment)

### 2.3 待办与连接

**Todo**
- `id` (PK)
- `content` (text, not null)
- `user_id` (index, not null)
- `username` (varchar(100))
- `status` (uint, default 0)
- `created_at`

**Connected**
- `id` (PK)
- `connect_url`

### 2.4 收件箱与系统数据

**Inbox**
- `id` (PK)
- `source` (varchar(50), not null)
- `content` (text)
- `type` (varchar(50), not null)
- `read` (bool, default false)
- `read_count` (int, default 0)
- `meta` (text)
- `read_at` (int64, unix)
- `created_at` (int64, unix)

**KeyValue**
- `key` (PK)
- `value` (string)

**TempFile**
- `id` (PK)
- `file_name`
- `storage` (local/s3/r2)
- `file_type` (image/audio)
- `bucket`
- `object_key`
- `deleted` (bool)
- `created_at` (unix)
- `last_accessed_at` (unix)

### 2.5 Webhook 与任务队列

**Webhook**
- `id` (PK)
- `name`
- `url`
- `secret`
- `is_active` (bool, default true)
- `last_status`
- `last_trigger`
- `created_at`, `updated_at`

**DeadLetter**
- `id` (PK, int64)
- `type`
- `payload` (bytes/JSON)
- `error_msg`
- `retry_count`
- `next_retry`
- `status`
- `created_at`, `updated_at`

### 2.6 Fediverse（联邦）

**Follow**
- `id` (PK)
- `user_id` (index)
- `actor_id` (index)
- `object_id` (index)
- `activity_id`
- `status`
- `created_at`, `updated_at`

**Follower**
- `id` (PK)
- `actor_id` (index)
- `user_id` (index)
- `created_at`

**InboxStatus**
- `id` (PK)
- `user_id` (index: idx_user_activity)
- `activity_id` (index: idx_user_activity)
- `actor_id`
- `actor_preferred_username`
- `actor_display_name`
- `actor_avatar`
- `object_id`
- `object_type`
- `object_attributed_to`
- `summary`
- `content`
- `to` (json string)
- `cc` (json string)
- `raw_activity` (text)
- `raw_object` (text)
- `published_at` (index)
- `created_at`, `updated_at`

## 3. 逻辑数据与 KeyValue 映射
系统设置使用 `key_values` 表存储 JSON 字符串：
- `system_settings` → SystemSetting
- `comment_setting` → CommentSetting
- `s3_setting` → S3Setting
- `oauth2_setting` → OAuth2Setting
- `fediverse_setting` → FediverseSetting
- `backup_schedule` → BackupSchedule
- `agent_setting` → AgentSetting
- `server_url` / `release_version` / `db_migration:message_to_echo:v1` 等内部键

## 4. 关系与约束摘要
- **Echo ↔ Image**：一对多，`images.message_id` 关联 Echo。
- **Echo ↔ Tag**：多对多，`echo_tags` 为中间表。
- **User ↔ Echo/Todo/Passkey/OAuthBinding/AccessToken**：一对多。
- **Fediverse**：`followers`/`follows` 记录关注关系，`inbox_statuses` 存储远端动态缓存。

## 5. 非持久化模型
以下模型用于协议/接口，不参与 AutoMigrate：
- Activity / Object / Actor（ActivityPub 协议对象）
- SystemSetting / CommentSetting / S3Setting / OAuth2Setting / FediverseSetting / AgentSetting（逻辑配置）
- Metrics（系统监控指标）
