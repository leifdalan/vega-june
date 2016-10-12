import {
  clientNspPromise,
} from '../../socket';
// Setup a buffer for actions that occur before the socket is connected
let buffer = [];

// Set ws to undefined for conditional in the action
let ws;
clientNspPromise.then(nsp => { ws = nsp; });
export default action => {
  if (ws) {
    if (buffer) {
      // Execute buffer in order
      buffer.map(msg => ws.emit('bigBrother', msg));
      // And nullify it.
      buffer = undefined;
    }
    ws.emit('bigBrother', action);
  } else {
    // If websocket doesn't exist, collect in memory.
    buffer.push(action);
  }
};
