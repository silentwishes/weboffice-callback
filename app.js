// app.js
const express = require('express');
const app = express();

app.use(express.json());

// ===== 文件信息接口 =====
// GET /v3/3rd/files/:file_id
app.get('/v3/3rd/files/:file_id', (req, res) => {
  const fileId = req.params.file_id;

  // 返回最小可用信息
  res.json({
    file_id: fileId,
    download_url: "https://example.com/yourfile.docx" // 替换为实际可访问的文件 URL
  });
});

// ===== 用户信息接口 =====
// GET /v3/3rd/users/:user_id
app.get('/v3/3rd/users/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // 返回最小可用用户信息
  res.json({
    user_id: userId,
    name: "Test User",
    permission: {
      read: true,
      write: true
    }
  });
});

// ===== 启动服务 =====
// 如果本地运行用下面，部署 Vercel serverless 可忽略
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`WebOffice callback service running on port ${PORT}`);
});

module.exports = app; // Vercel serverless 部署需要
