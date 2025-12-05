/**
 * WPS-2 签名验证中间件
 * 根据文档：https://solution.wps.cn/docs/callback/summary.html
 */

const crypto = require('crypto');

/**
 * 验证 WPS-2 签名
 * @param {string} appId - 应用 ID
 * @param {string} appSecret - 应用密钥
 * @returns {Function} Express 中间件函数
 */
function verifyWPS2Signature(appId, appSecret) {
  return (req, res, next) => {
    // 从请求头获取签名信息
    const date = req.headers.date;
    const contentType = req.headers['content-type'] || '';
    const contentMd5 = req.headers['content-md5'] || '';
    const authorization = req.headers.authorization;

    // 验证必需的请求头
    if (!date || !authorization) {
      return res.status(401).json({
        code: 40001,
        message: 'Missing required headers for signature verification'
      });
    }

    // 解析 Authorization 头
    // 格式：WPS-2:AppId:SHA1值
    const authParts = authorization.split(':');
    if (authParts.length !== 3 || authParts[0] !== 'WPS-2') {
      return res.status(401).json({
        code: 40001,
        message: 'Invalid authorization format'
      });
    }

    const requestAppId = authParts[1];
    const requestSha1 = authParts[2];

    // 验证 AppId
    if (requestAppId !== appId) {
      return res.status(401).json({
        code: 40001,
        message: 'AppId mismatch'
      });
    }

    // 计算 Content-MD5（如果 Body 为空，使用 URI）
    let calculatedMd5 = contentMd5;
    if (!contentMd5 && req.method === 'GET') {
      const uri = req.originalUrl || req.url;
      calculatedMd5 = crypto
        .createHash('md5')
        .update(uri)
        .digest('hex')
        .toLowerCase();
    }

    // 计算 SHA1
    // SHA1( AppSecret + Content-Md5 + Content-Type + Date)
    const stringToSign = appSecret + calculatedMd5 + contentType + date;
    const calculatedSha1 = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex')
      .toLowerCase();

    // 验证签名
    if (calculatedSha1 !== requestSha1.toLowerCase()) {
      return res.status(401).json({
        code: 40001,
        message: 'Signature verification failed'
      });
    }

    // 签名验证通过，继续处理请求
    next();
  };
}

module.exports = {
  verifyWPS2Signature
};

