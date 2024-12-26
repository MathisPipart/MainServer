
exports.init = function(io) {

  // the chat namespace
  const chat= io
      .of('/chat')
      .on('connection', function (socket) {
    try {
      /**
       * it creates or joins a room
       */
      socket.on('create or join', function (room, userId) {
        socket.join(room);
        chat.to(room).emit('joined', room, userId);
      });

      socket.on('chat', function (room, userId, chatText) {
        chat.to(room).emit('chat', room, userId, chatText);
      });

      socket.on('disconnect', function(){
        console.log('someone disconnected');
      });
    } catch (e) {
    }
  });

  // the news namespace
  const news= io
        .of('/news')
        .on('connection', function (socket) {
      try {
        /**
         * it creates or joins a room
         */
        socket.on('create or join', function (userId) {
          news.emit('joined', userId);
        });

        socket.on('news', function (userId, newsText) {
          news.emit('news', userId, newsText);
        });

        socket.on('disconnect', function(){
          console.log('someone disconnected');
        });
      } catch (e) {
      }
    });
}
