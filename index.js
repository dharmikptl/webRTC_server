const express = require('express')
const bodyParser = require('body-parser')
const { Server } = require('socket.io')

const io = new Server({
  cors: true
})
const app = express()

app.use(bodyParser.json())

const emailToSocketmapping = new Map()
const socketToEmailMapping = new Map()
io.on('connection', socket => {
  console.log('New Connection!')
  socket.on('join-room', data => {
    const { roomId, emailId } = data
    console.log('a user connected', emailId, 'room', roomId)
    emailToSocketmapping.set(emailId, socket.id)
    socketToEmailMapping.set(socket.id, emailId)
    socket.join(roomId)
    socket.emit('joined-room', { roomId })
    socket.broadcast.to(roomId).emit('user-connected', { emailId })
  })
  socket.on('call-user', data => {
    const { emailId, offer } = data
    const fromEmail = socketToEmailMapping.get(socket.id)
    const socketId = emailToSocketmapping.get(emailId)
    socket.to(socketId).emit('incomming-call', { offer, from: fromEmail })
  })
  socket.on('call-accepted', data => {
    const { emailId, answer } = data
    const fromEmail = socketToEmailMapping.get(socket.id)
    const socketId = emailToSocketmapping.get(emailId)
    socket.to(socketId).emit('call-accepted', { answer, from: fromEmail })
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.listen(8000, () => {
  console.log('server started on port 8000')
})
io.listen(8001, () => {
  console.log('socket.io started on port 8001')
})
