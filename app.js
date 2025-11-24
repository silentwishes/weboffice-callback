const express = require('express');
const app = express();

app.use(express.json());

// ===== 回调接口：获取文件信息 =====
// GET /v3/3rd/files/:file_id
app.get('/v3/3rd/files/:file_id', (req, res) => {
  const fileId = req.params.file_id;

  // 这里返回你自己系统中该 file_id 对应的文件信息
  res.json({
    file_id: fileId,
    name: "example.docx",
    size: 102400, // Bytes
    download_url: "https://your-public-file-url.com/example.docx",
    version: "1",
  });
});

// ===== 回调接口：获取用户信息 =====
// GET /v3/3rd/users/:user_id
app.get('/v3/3rd/users/:user_id', (req, res) => {
  const userId = req.params.user_id;

  res.json({
    user_id: userId,
    name: "Test User",
    avatar: "https://example.com/avatar.png",
    permission: {
      read: true,
      write: true,
    }
  });
});


// 服务器启动
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`WebOffice Callback Service running on port ${PORT}`);
});
