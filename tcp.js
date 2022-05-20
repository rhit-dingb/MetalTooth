// import TcpSocket from 'react-native-tcp-socket';

// const server = new TcpSocket.Server();
// const client = new TcpSocket.Socket();
// const socketList = [];
// var infoString;

// function init() {
//   server.on('connection', socket => {
//     socket.write('Echo server\r\n');
//   });

//   server.listen({port: 0, host: '127.0.0.1', reuseAddress: true}, () => {
//     const port = server.address()?.port;
//     //if (!port) throw new Error('Server port not found');
//     // client.connect(
//     //   {
//     //     port: port,
//     //     host: '127.0.0.1',
//     //     localAddress: '127.0.0.1',
//     //     reuseAddress: true,
//     //     // localPort: 20000,
//     //     // interface: "wifi",
//     //     // tls: true
//     //   },
//     //   () => {
//     //     client.write('Hello, server! Love, Client.');
//     //   },
//     // );
//   });

//   client.on('data', () => {
//     //client.destroy(); // kill client after server's response
//   });
// }

// server.on('connection', socket => {
//   console.log(
//     'Client connected to server on ' + JSON.stringify(socket.address()),
//   );
//   socketList.push(socket);

//   socket.on('data', data => {
//     console.log(
//       'Server client received: ' +
//         (data.length < 500 ? data : data.length + ' bytes'),
//     );
//   });

//   socket.on('error', error => {
//     console.log('Server client error ' + error);
//   });

//   socket.on('close', error => {
//     console.log('Server client closed ' + (error ? error : ''));
//   });
// });

// server.on('error', error => {
//   console.log('Server error ' + error);
// });

// server.on('close', () => {
//   console.log('Server closed');
// });

// client.on('connect', () => {
//   console.log('Opened client on ' + JSON.stringify(client.address()));
// });

// client.on('drain', () => {
//   console.log('Client drained');
// });

// client.on('data', data => {
//   console.log(
//     'Client received: ' + (data.length < 500 ? data : data.length + ' bytes'),
//     updateMusicStatus(data),
//   );
// });

// client.on('error', error => {
//   console.log('Client error ' + error);
// });

// client.on('close', error => {
//   console.log('Client closed ' + (error ? error : ''));
// });

// module.exports = {init, server, client, socketList};
// // © 2022 GitHub, Inc.
// // Terms
// // Privacy
// // Security
// // Status
