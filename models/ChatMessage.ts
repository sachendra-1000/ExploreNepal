import mongoose from 'mongoose'

const ChatMessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['user', 'admin'], default: 'user' },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
})

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema)
