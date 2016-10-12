import io from 'socket.io-client';



function initNsp(socket) {
  return new Promise((resolve) => {
    socket.on('connect', () => {
      console.error('socket.id2222', socket.id);
      const nsp = io(`/${socket.id}`, {
        path: '/ws',
        transports: ['websocket']
      });
      resolve(nsp);
    });
  });
}
const globalSocket = io.connect('', { path: '/ws', transports: ['websocket'] });
const promise = initNsp(globalSocket);
export const socket = globalSocket;
export const clientNspPromise = promise;

global.socket = socket;
