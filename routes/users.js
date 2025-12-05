/**
 * 用户信息相关接口
 * 提供用户的详细信息
 */

const express = require('express');
const router = express.Router();
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 获取用户信息
 * GET /v3/3rd/users/:user_id
 * 
 * 返回用户的基本信息，包括用户 ID、姓名、头像等
 */
router.get('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const token = req.headers['x-weboffice-token'];

  // TODO: 根据 userId 和 token 从数据库获取用户信息
  // 这里返回示例数据
  const userInfo = {
    id: userId,
    name: `用户_${userId}`,
    avatar_url: `https://example.com/avatars/${userId}.jpg`,
    permission: {
      read: true,
      write: true,
      comment: true,
      copy: true,
      print: true,
      export: true
    }
  };

  return successResponse(res, userInfo);
});

/**
 * 批量获取用户信息
 * POST /v3/3rd/users/batch
 * 
 * 根据用户 ID 列表批量获取用户信息
 */
router.post('/batch', (req, res) => {
  const { user_ids } = req.body;
  const token = req.headers['x-weboffice-token'];

  if (!Array.isArray(user_ids) || user_ids.length === 0) {
    return errorResponse(res, 40000, 'Invalid user_ids parameter');
  }

  // TODO: 根据 user_ids 批量查询用户信息
  // 这里返回示例数据
  const users = user_ids.map(userId => ({
    id: userId,
    name: `用户_${userId}`,
    avatar_url: `https://example.com/avatars/${userId}.jpg`
  }));

  return successResponse(res, { users });
});

module.exports = router;

