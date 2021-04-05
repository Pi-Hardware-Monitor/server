const app = require('express')();
const cors = require('cors');

app.use(cors());

const http = require('http').Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {

    socket.on("memory", datapoint => {
        console.log(datapoint)
        io.emit("memory", datapoint)
    })

    socket.on("cpu", datapoint => {
        console.log(datapoint)
        io.emit("cpu", datapoint)
    })

    socket.on("gpu", datapoint => {
        console.log(datapoint)
        io.emit("gpu", datapoint)
    })

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});
