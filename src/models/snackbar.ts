export type SnackbarAction = 'error' | 'progress' | 'success' | 'dismiss';

export type Handler = (event?: string) => void;
export type WildcardHandler = (type: SnackbarAction, event?: string) => void;

export interface Emitter {
  on(action: SnackbarAction, handler: Handler): void;
  on(action: '*', handler: WildcardHandler): void;

  off(action: SnackbarAction, handler: Handler): void;
  off(action: '*', handler: WildcardHandler): void;

  emit(action: SnackbarAction, msg?: string): void;
}
