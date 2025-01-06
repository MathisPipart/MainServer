exports.init = function(io) {
    // the chat namespace
    const chat = io
        .of('/chat')
        .on('connection', function (socket) {
            try {
                /**
                 * It creates or joins a room
                 */
                socket.on('create or join', function (room, userId) {
                    socket.join(room);
                    const timestamp = Date.now();
                    chat.to(room).emit('joined', room, userId, timestamp);
                });

                /**
                 * Handles chat messages
                 */
                socket.on('chat', function (room, userId, chatText) {
                    const timestamp = Date.now();
                    chat.to(room).emit('chat', room, userId, chatText, timestamp);
                });

                socket.on('disconnect', function() {
                    console.log('Someone disconnected');
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
                 * Handles news messages
                 */
                socket.on('news', function (userId, newsText) {
                    const timestamp = Date.now();
                    news.emit('news', userId, newsText, timestamp);
                });

                socket.on('disconnect', function() {
                    console.log('Someone disconnected from news');
                });
            } catch (e) {
                console.error('Error in news namespace:', e);
            }
        });
};
