/**
 * 文档编辑相关接口
 * 处理文档的保存操作
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 获取文件保存信息（三阶段保存 - 第一阶段）
 * POST /v3/3rd/files/:file_id/save
 * 
 * 三阶段保存流程：
 * 1. 获取保存信息（本接口）
 * 2. 上传文件内容
 * 3. 通知保存完成
 */
router.post('/:file_id/save', async (req, res) => {
  const fileId = req.params.file_id;
  const token = req.headers['x-weboffice-token'];
  const { size, md5 } = req.body; // 文件大小和 MD5 值

  try {
    // TODO: 验证用户权限，检查文件是否存在等

    // 生成上传 URL 和上传 ID
    const uploadId = crypto.randomBytes(16).toString('hex');
    const uploadUrl = `https://example.com/uploads/${uploadId}`;

    // TODO: 保存上传信息到数据库或缓存，用于后续验证

    return successResponse(res, {
      upload_url: uploadUrl,
      upload_id: uploadId,
      expire_time: Math.floor(Date.now() / 1000) + 3600 // 1小时后过期
    });
  } catch (error) {
    return errorResponse(res, 50000, `Save failed: ${error.message}`);
  }
});

/**
 * 通知文件保存完成（三阶段保存 - 第三阶段）
 * POST /v3/3rd/files/:file_id/save/notify
 * 
 * WebOffice 上传文件内容后，调用此接口通知保存完成
 */
router.post('/:file_id/save/notify', async (req, res) => {
  const fileId = req.params.file_id;
  const token = req.headers['x-weboffice-token'];
  const { upload_id, download_url, md5, size } = req.body;

  try {
    // TODO: 验证 upload_id 是否有效
    // TODO: 从 download_url 下载文件并保存到文件系统
    // TODO: 更新文件版本号
    // TODO: 记录保存历史

    // 示例：保存文件信息
    const newVersion = 2; // TODO: 从数据库获取最新版本号并加1

    return successResponse(res, {
      file_id: fileId,
      version: newVersion,
      download_url: download_url,
      modify_time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    return errorResponse(res, 50000, `Save notify failed: ${error.message}`);
  }
});

/**
 * 单阶段保存（直接保存）
 * PUT /v3/3rd/files/:file_id/content
 * 
 * 适用于小文件，直接通过请求体上传文件内容
 */
router.put('/:file_id/content', async (req, res) => {
  const fileId = req.params.file_id;
  const token = req.headers['x-weboffice-token'];

  try {
    // TODO: 验证用户权限
    // TODO: 保存文件内容到文件系统
    // TODO: 更新文件版本号

    // 示例：保存文件
    const newVersion = 2; // TODO: 从数据库获取最新版本号并加1
    const savePath = path.join(__dirname, '../uploads', `${fileId}_v${newVersion}`);

    // 确保上传目录存在
    const uploadDir = path.dirname(savePath);
    await fs.mkdir(uploadDir, { recursive: true });

    // 保存文件（这里假设文件内容在 req.body 中，实际可能需要处理二进制流）
    // await fs.writeFile(savePath, req.body);

    return successResponse(res, {
      file_id: fileId,
      version: newVersion,
      modify_time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    return errorResponse(res, 50000, `Save content failed: ${error.message}`);
  }
});

/**
 * 获取文件在线编辑信息
 * GET /v3/3rd/files/:file_id/edit
 * 
 * 返回文件在线编辑所需的信息
 */
router.get('/:file_id/edit', (req, res) => {
  const fileId = req.params.file_id;
  const token = req.headers['x-weboffice-token'];

  // TODO: 根据 fileId 和 token 获取编辑信息
  const editInfo = {
    file_id: fileId,
    download_url: `https://example.com/files/${fileId}/download`,
    user_id: 'user_001', // 从 token 解析用户 ID
    user_name: 'Test User',
    user_avatar: 'https://example.com/avatars/user_001.jpg',
    permission: {
      read: true,
      write: true,
      comment: true,
      copy: true,
      print: true,
      export: true
    }
  };

  return successResponse(res, editInfo);
});

module.exports = router;

