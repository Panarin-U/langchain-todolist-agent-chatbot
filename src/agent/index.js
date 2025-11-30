import * as line from '@line/bot-sdk'
import express from 'express'
import { config as dotenvConfig } from "dotenv"
import apiRouter from '../api/index.js'
import { processMessageWithLLM } from './llms.js'

dotenvConfig()

const config = {
  channelSecret: process.env.CHANNEL_SECRET || '',
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
}

// Initialize LINE client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
})

const app = express()

// Serve static files
app.use(express.static('public'))

// API routes
app.use('/api', apiRouter)

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  res.status(200).end()

  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Event handling error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
      res.status(500).end()
    })
})

// Custom error handler for LINE middleware
app.use((err, req, res, next) => {
  if (err) {
    console.error('LINE webhook error:', {
      name: err.name,
      message: err.message,
      signature: req.headers['x-line-signature'],
      hasChannelSecret: !!config.channelSecret,
      channelSecretLength: config.channelSecret?.length,
      body: req.body
    })
    return res.status(err.name === 'SignatureValidationFailed' ? 401 : 500).json({
      error: err.name,
      message: err.message
    })
  }
  next()
})

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null)
  }

  const userMessage = event.message.text

  const replyText = await processMessageWithLLM(userMessage)

  console.log('Reply text:', replyText)

  // Ensure replyText is a string and not empty
  const finalReply = typeof replyText === 'string' && replyText.trim()
    ? replyText
    : 'ขออภัย เกิดข้อผิดพลาดในการประมวลผล'

  await client.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: "text",
        text: finalReply
      }
    ]
  })
}

// listen on port
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
