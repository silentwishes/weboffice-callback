/**
 * 文档预览相关接口
 * 包括：文件信息、下载地址、用户权限等
 */

const express = require('express');
const router = express.Router();
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 获取文件信息
 * GET /v3/3rd/files/:file_id
 * 
 * 返回文件的基本信息，包括文件 ID、名称、大小、创建时间、修改时间等
 */
router.get('/:file_id', (req, res) => {
  const fileId = req.params.file_id;
  const token = req.headers['x-weboffice-token'];

  // TODO: 根据 fileId 和 token 从数据库或文件系统获取文件信息
  // 这里返回示例数据
  const fileInfo = {
    id: fileId,
    name: `文件_${fileId}.docx`,
    version: 1,
    size: 1024 * 1024, // 文件大小（字节）
    creator_id: 'user_001',
    create_time: Math.floor(Date.now() / 1000) - 86400, // 创建时间（Unix 时间戳）
    modifier_id: 'user_001',
    modify_time: Math.floor(Date.now() / 1000), // 修改时间（Unix 时间戳）
    download_url: `https://example.com/files/${fileId}/download`, // 文件下载地址
    preview_url: `https://example.com/files/${fileId}/preview`, // 文件预览地址（可选）
    thumbnail_url: `https://example.com/files/${fileId}/thumbnail` // 缩略图地址（可选）
  };

  return successResponse(res, fileInfo);
});

/**
 * 获取文件下载地址
 * GET /v3/3rd/files/:file_id/download
 * 
 * 返回文件的下载地址，支持临时下载链接
 */
router.get('/:file_id/download', (req, res) => {
  const fileId = req.params.file_id;
  const token = req.headers['x-weboffice-token'];

  // TODO: 根据 fileId 和 token 生成下载地址
  // 这里返回示例数据
  const downloadInfo = {
    download_url: `https://example.com/files/${fileId}/download?token=${token}&expires=${Date.now() + 3600000}`
  };

  return successResponse(res, downloadInfo);
});

/**
 * 获取文件权限信息
 * GET /v3/3rd/files/:file_id/permission
 * 
 * 返回当前用户对文件的权限信息
 */
router.get('/:file_id/permission', (req, res) => {
  const fileId = req.params.file_id;
  const token = req.headers['x-weboffice-token'];
  const userId = req.query.user_id; // 从 query 参数获取用户 ID

  // TODO: 根据 fileId、userId 和 token 查询用户权限
  // 这里返回示例数据
  const permission = {
    read: true,
    write: true,
    comment: true,
    copy: true,
    print: true,
    export: true,
    history: true
  };

  return successResponse(res, permission);
});

/**
 * 获取文件历史版本列表
 * GET /v3/3rd/files/:file_id/history
 * 
 * 返回文件的历史版本列表
 */
router.get('/:file_id/history', (req, res) => {
  const fileId = req.params.file_id;
  const token = req.headers['x-weboffice-token'];

  // TODO: 根据 fileId 查询历史版本
  // 这里返回示例数据
  const history = [
    {
      version: 1,
      creator_id: 'user_001',
      create_time: Math.floor(Date.now() / 1000) - 86400,
      size: 1024 * 1024
    }
  ];

  return successResponse(res, { history });
});

/**
 * 获取指定版本的文件信息
 * GET /v3/3rd/files/:file_id/versions/:version
 * 
 * 返回指定版本的文件信息
 */
router.get('/:file_id/versions/:version', (req, res) => {
  const fileId = req.params.file_id;
  const version = parseInt(req.params.version);
  const token = req.headers['x-weboffice-token'];

  // TODO: 根据 fileId 和 version 查询版本信息
  // 这里返回示例数据
  const versionInfo = {
    id: fileId,
    version: version,
    download_url: `https://example.com/files/${fileId}/versions/${version}/download`,
    creator_id: 'user_001',
    create_time: Math.floor(Date.now() / 1000) - 86400,
    size: 1024 * 1024
  };

  return successResponse(res, versionInfo);
});

module.exports = router;

