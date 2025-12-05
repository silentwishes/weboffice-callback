/**
 * 统一响应格式工具
 * 根据文档要求：返回 application/json 格式，包含 code、message、data 字段
 */

/**
 * 成功响应
 * @param {Object} res - Express 响应对象
 * @param {Object} data - 响应数据
 * @param {string} message - 可选的成功消息
 */
function successResponse(res, data, message = '') {
  return res.json({
    code: 0,
    message: message,
    data: data
  });
}

/**
 * 错误响应
 * @param {Object} res - Express 响应对象
 * @param {number} code - 错误码
 * @param {string} message - 错误消息
 */
function errorResponse(res, code, message) {
  return res.json({
    code: code,
    message: message
  });
}

module.exports = {
  successResponse,
  errorResponse
};

