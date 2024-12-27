exports.init = function(io) {

  // the chat namespace
  const chat = io
      .of('/chat')
      .on('connection', function (socket) {
        try {
          /**
           * it creates or joins a room
           */
          socket.on('create or join', function (room, userId) {
            socket.join(room);
            chat.to(room).emit('joined', room, userId); // Notifie tous les utilisateurs dans la room
          });

          socket.on('chat', function (room, userId, chatText) {
            chat.to(room).emit('chat', room, userId, chatText); // Diffuse le message dans la room
          });

          socket.on('disconnect', function(){
            console.log('someone disconnected');
          });
        } catch (e) {
          console.error('Error in chat namespace:', e);
        }
      });

  // the news namespace
  const news = io
      .of('/news')
      .on('connection', function (socket) {
        try {
          /**
           * it creates or joins a room
           */
          socket.on('news', function (userId, newsText) {
            news.emit('news', userId, newsText); // Diffuse les messages de news
          });

          socket.on('disconnect', function(){
            console.log('someone disconnected from news');
          });
        } catch (e) {
          console.error('Error in news namespace:', e);
        }
      });
}
