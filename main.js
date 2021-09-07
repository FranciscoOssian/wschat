const path = require('path');

const express = require('express');
const app = express();

const server = require('http').createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  maxHttpBufferSize: 1e8
});

port = process.env.PORT || 8000

//used only to run the example site ---------------------------
app.use( express.static( path.join( __dirname, 'public' ) ) )
app.set( 'views', path.join( __dirname, 'public' ) )
app.engine( 'html', require('ejs').renderFile )
app.set( 'view engine', 'html' )
app.use('/', (req, res) => {
  res.render('index.html')
})
//-------------------------------------------------------------

io.on('connection', (socket) => {
  
  console.log(`a user connected ${socket.id}`);

  socket.on('message', message => {
    console.log(`message recived:`)
    console.log(`${message.author_uid_sender} falou ${message.content} para ${message.author_uid_to}`)
    io.sockets.to(message.author_uid_to).emit('message', message);
  })

});

server.listen(port, () => {
  console.log(`listening on *:${port} port`);
});