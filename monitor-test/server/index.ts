import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()

// 启用CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}))
// 解析JSON请求体
app.use(bodyParser.json())

// 错误上报接口
app.post('/api/errors', (req, res) => {
  console.log('收到错误上报:', JSON.stringify(req.body, null, 2))
  res.status(200).json({ message: 'Error logged' })
})

// 图片上报接口
app.get('/api/errors', (req, res) => {
  const data = req.query.data
  console.log('收到图片上报:', data)
  
  // 返回1x1像素的透明图片
  const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': img.length
  })
  res.end(img)
})

app.listen(3000, () => {
  console.log('错误上报服务器运行在 http://localhost:3000')
}) 