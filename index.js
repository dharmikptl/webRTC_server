const { Server } = require('socket.io')

const io = new Server({
  cors: true
})

io.on('connection', socket => {
  console.log('A user connected')

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })

  // Signaling messages
  socket.on('offer', offer => {
    socket.broadcast.emit('offer', offer)
  })

  socket.on('answer', answer => {
    socket.broadcast.emit('answer', answer)
  })

  socket.on('icecandidate', candidate => {
    socket.broadcast.emit('icecandidate', candidate)
  })
})

io.listen(process.env.PORT || 8000, () => {
  console.log('socket.io started on port 8000')
})
