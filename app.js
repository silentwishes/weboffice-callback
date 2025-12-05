/**
 * WPS WebOffice 回调服务
 * 实现完整的回调接口，支持文档预览、编辑、用户信息等功能
 * 
 * 文档参考：https://solution.wps.cn/docs/callback/summary.html
 */

const express = require('express');
const app = express();
const config = require('./config');
const { verifyWPS2Signature } = require('./middleware/signature');

// 中间件配置
app.use(express.json({ limit: '100mb' })); // 支持大文件上传
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', {
    'x-app-id': req.headers['x-app-id'],
    'x-weboffice-token': req.headers['x-weboffice-token'] ? '***' : undefined,
    'x-request-id': req.headers['x-request-id']
  });
  next();
});

// WPS-2 签名验证中间件（可选，根据配置决定是否启用）
if (config.enableSignatureVerification) {
  // Express 5.x 兼容：使用中间件函数手动检查路径
  app.use((req, res, next) => {
    if (req.path.startsWith('/v3/3rd/')) {
      return verifyWPS2Signature(config.appId, config.appSecret)(req, res, next);
    }
    next();
  });
}

// 路由配置
const filesRouter = require('./routes/files');
const saveRouter = require('./routes/save');
const usersRouter = require('./routes/users');

// 文件相关接口
app.use('/v3/3rd/files', filesRouter);
app.use('/v3/3rd/files', saveRouter);

// 用户相关接口
app.use('/v3/3rd/users', usersRouter);

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'WPS WebOffice Callback Service'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    code: 50000,
    message: err.message || 'Internal server error'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 40400,
    message: 'Not found'
  });
});

// 启动服务
if (require.main === module) {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`WPS WebOffice 回调服务已启动`);
    console.log(`服务地址: http://localhost:${PORT}`);
    console.log(`签名验证: ${config.enableSignatureVerification ? '已启用' : '已禁用'}`);
    console.log(`AppId: ${config.appId}`);
    console.log(`========================================`);
  });
}

module.exports = app; // 用于 serverless 部署（如 Vercel）
