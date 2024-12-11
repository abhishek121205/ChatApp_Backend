export const setupSocketIO = (io, db) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  
      socket.on('send-message', (message) => {
        const newMessage = { ...message, id: Date.now().toString() };
  
        db.get('messages').push(newMessage).write();
        io.emit('new-message', newMessage);
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  };
  