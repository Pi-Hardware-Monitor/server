const app = require('express')();
const cors = require('cors');

const datapoints = {};

app.use(cors());

const http = require('http').Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {

    let previousId;

    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    };

    socket.on("getDatapoint", datapointId => {
        safeJoin(datapointId);
        socket.emit("datapoints", datapoints[datapointId]);
    });

    socket.on("cpuUsage", datapoint => {
        console.log(datapoint)
        io.emit("cpuUsage", datapoint)
    })

    socket.on("addDatapoint", datapoint => {
        datapoints[datapoint.id] = datapoint;
        safeJoin(datapoint.id);
        io.emit("datapoints", Object.keys(datapoints));
        //io.emit("newData", datapoint)
        console.log(datapoint)
        socket.emit("datapoint", datapoint);
    });

    io.emit("datapoints", Object.keys(datapoints));

    console.log(`Socket ${socket.id} has connected`);

});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});
