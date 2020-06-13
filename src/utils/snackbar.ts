import mitt from 'mitt';
import { Emitter } from '@zoonk/models';

const emitter = mitt();

export const SnackbarEmitter: Emitter = {
  off: emitter.off,
  on: emitter.on,
  emit: emitter.emit,
};
