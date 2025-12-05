/**
 * 配置文件
 * 请根据实际情况修改以下配置
 */

module.exports = {
  // WPS WebOffice 应用配置
  // 从 WPS WebOffice 控制台获取
  appId: process.env.WPS_APP_ID || 'SX20251103PQKLIL',
  appSecret: process.env.WPS_APP_SECRET || 'zWNrxBZslKEwepsEgDnxfJiQAmSwRoAF',

  // 服务器配置
  port: process.env.PORT || 3001,

  // 文件存储配置
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  
  // 是否启用签名验证（生产环境建议启用）
  enableSignatureVerification: process.env.ENABLE_SIGNATURE !== 'false',

  // 文件服务配置
  fileService: {
    baseUrl: process.env.FILE_SERVICE_BASE_URL || 'https://example.com',
    downloadUrlPrefix: process.env.DOWNLOAD_URL_PREFIX || 'https://example.com/files',
    uploadUrlPrefix: process.env.UPLOAD_URL_PREFIX || 'https://example.com/uploads'
  }
};

