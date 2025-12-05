# WPS WebOffice 回调服务

这是一个完整的 WPS WebOffice 回调服务实现，支持文档预览、编辑、用户信息等功能。

## 功能特性

- ✅ WPS-2 签名验证
- ✅ 文档预览接口（文件信息、下载地址、权限等）
- ✅ 文档编辑接口（单阶段/三阶段保存）
- ✅ 用户信息接口
- ✅ 统一响应格式
- ✅ 错误处理
- ✅ 请求日志

## 项目结构

```
jsapi-test/
├── app.js                 # 主应用入口
├── config.js              # 配置文件
├── middleware/            # 中间件
│   └── signature.js       # WPS-2 签名验证
├── routes/                # 路由模块
│   ├── files.js           # 文件相关接口
│   ├── save.js            # 保存相关接口
│   └── users.js           # 用户相关接口
├── utils/                 # 工具函数
│   └── response.js        # 响应格式化
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（或直接修改 `config.js`）：

```env
WPS_APP_ID=your_app_id
WPS_APP_SECRET=your_app_secret
PORT=3001
ENABLE_SIGNATURE=true
FILE_SERVICE_BASE_URL=https://example.com
```

### 3. 启动服务

```bash
npm start
```

服务将在 `http://localhost:3001` 启动。

## Vercel 部署

本项目已配置为可直接在 Vercel 上部署。

### 部署步骤

1. **安装 Vercel CLI（可选）**
   ```bash
   npm i -g vercel
   ```

2. **通过 Vercel 网站部署**
   - 访问 [Vercel](https://vercel.com/)
   - 点击 "Import Project"
   - 连接你的 Git 仓库（GitHub/GitLab/Bitbucket）
   - Vercel 会自动检测项目配置
   - 点击 "Deploy" 即可

3. **通过 CLI 部署**
   ```bash
   vercel
   ```

4. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   - `WPS_APP_ID` - WPS WebOffice 应用 ID
   - `WPS_APP_SECRET` - WPS WebOffice 应用密钥
   - `ENABLE_SIGNATURE` - 是否启用签名验证（true/false）
   - `FILE_SERVICE_BASE_URL` - 文件服务基础 URL
   - `DOWNLOAD_URL_PREFIX` - 文件下载 URL 前缀
   - `UPLOAD_URL_PREFIX` - 文件上传 URL 前缀

5. **获取部署地址**
   部署完成后，Vercel 会提供一个 URL，例如：`https://your-project.vercel.app`
   
   回调网关地址应为：`https://your-project.vercel.app/v3/3rd`

### 重要提示

⚠️ **文件存储限制**：
- Vercel 的 serverless 函数使用只读文件系统，**无法直接写入文件**
- 如果需要在 `routes/save.js` 中保存文件，请使用以下方案之一：
  1. 使用外部存储服务（如 AWS S3、阿里云 OSS、腾讯云 COS 等）
  2. 使用数据库存储文件元信息
  3. 使用 Vercel Blob Storage（Vercel 提供的存储服务）

### 项目结构（Vercel）

```
weboffice-callback/
├── api/
│   └── index.js          # Vercel serverless 入口
├── app.js                # Express 应用
├── vercel.json           # Vercel 配置
├── .vercelignore         # Vercel 忽略文件
└── ...                   # 其他文件
```

## 接口说明

### 文档预览接口

- `GET /v3/3rd/files/:file_id` - 获取文件信息
- `GET /v3/3rd/files/:file_id/download` - 获取文件下载地址
- `GET /v3/3rd/files/:file_id/permission` - 获取文件权限
- `GET /v3/3rd/files/:file_id/history` - 获取文件历史版本
- `GET /v3/3rd/files/:file_id/versions/:version` - 获取指定版本信息

### 文档编辑接口

- `GET /v3/3rd/files/:file_id/edit` - 获取编辑信息
- `POST /v3/3rd/files/:file_id/save` - 获取保存信息（三阶段保存 - 第一阶段）
- `POST /v3/3rd/files/:file_id/save/notify` - 通知保存完成（三阶段保存 - 第三阶段）
- `PUT /v3/3rd/files/:file_id/content` - 单阶段保存

### 用户信息接口

- `GET /v3/3rd/users/:user_id` - 获取用户信息
- `POST /v3/3rd/users/batch` - 批量获取用户信息

### 其他接口

- `GET /health` - 健康检查

## 响应格式

所有接口统一返回以下格式：

```json
{
  "code": 0,
  "message": "",
  "data": {
    // 具体数据
  }
}
```

- `code`: 错误码，0 表示成功
- `message`: 错误消息（成功时可省略）
- `data`: 响应数据（失败时可省略）

## 签名验证

服务支持 WPS-2 签名验证，可在 `config.js` 中配置是否启用。

签名算法说明：
- 使用 `AppSecret + Content-Md5 + Content-Type + Date` 计算 SHA1
- 对于 GET 请求，如果 Body 为空，使用 URI 计算 MD5

## 开发说明

### 自定义实现

当前实现返回的是示例数据，您需要根据实际业务需求修改：

1. **文件存储**：修改 `routes/files.js` 和 `routes/save.js` 中的文件操作逻辑
2. **用户认证**：根据 `X-WebOffice-Token` 头解析用户信息
3. **权限控制**：实现基于用户和文件的权限验证
4. **数据库集成**：连接您的数据库存储文件元信息和用户信息

### 部署要求

- 回调接口必须部署在**公网**，确保能被 WebOffice 服务器访问
- 建议使用 HTTPS
- 确保服务器有足够的存储空间和带宽

## 配置回调网关

1. 登录 [WPS WebOffice 控制台](https://solution.wps.cn/)
2. 进入应用管理 -> 回调配置
3. 设置回调网关地址：`https://your-domain.com/v3/3rd`
4. 在控制台调试各个接口
5. 调试通过后启用相应功能

## 参考文档

- [回调服务概述](https://solution.wps.cn/docs/callback/summary.html)
- [回调网关配置](https://solution.wps.cn/docs/callback/gateway.html)
- [文档预览接口](https://solution.wps.cn/docs/callback/preview.html)
- [文档编辑接口](https://solution.wps.cn/docs/callback/save.html)
- [用户信息接口](https://solution.wps.cn/docs/callback/user.html)

## 注意事项

1. 文件 ID 和用户 ID 不能以下划线开头，长度有限制
2. 历史版本号必须为正数且递增，最大不超过 2147483647
3. 所有接口都需要实现，否则可能导致功能异常
4. 生产环境建议启用签名验证

## License

ISC

