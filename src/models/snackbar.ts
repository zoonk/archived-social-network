/**
 * Properties required for displaying a snackbar.
 * @property `type` - can be an `error`, `progress` or `success`
 * @property `msg` - message to be displayed in the snackbar.
 * @property `log` - send a log of this action to our logging service.
 */
export interface SnackbarAction {
  type: 'error' | 'progress' | 'success';
  msg: string;
  log?: {
    code?: string | number;
    description: string;
    opts?: any;
  };
}
