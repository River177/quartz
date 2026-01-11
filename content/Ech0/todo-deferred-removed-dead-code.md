# 延后实现 TODO（清理 dead_code 后移除项）

本清单记录因 dead_code 清理而暂时移除的结构/字段，后续需要时可按模块恢复实现。

## OAuth2/OIDC 相关
- [ ] `Config` 重新加入 `oauth_client_id` / `oauth_client_secret` 读取与默认值（如需 OAuth 客户端密钥配置）。
- [ ] 重新恢复 `models/auth::OAuthBinding`（绑定信息表结构与 API 使用）。
- [ ] 衔接 `handlers/oauth.rs` 真实流程后再补模型与配置字段。

## 通用分页结果
- [ ] 如需统一分页返回体，恢复 `models/common::PageResult<T>` 并改造现有分页接口。

## Echo/标签模型
- [ ] 如需暴露底层表结构，恢复 `models/echo::Image`、`models/echo::Tag`、`models/echo::EchoTag`。

## Fediverse 模型
- [ ] 如需直接返回或复用数据库实体，恢复 `models/fediverse`（`Follow` / `Follower` / `InboxStatus`）。

## Media 结构
- [ ] `StoredFile` 如需回传原始文件名，可恢复 `original_name` 字段并在上传响应中使用。
