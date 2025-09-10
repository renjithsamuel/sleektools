import { Color as SeverityColor } from '@material-ui/lab';

export class SnackbarMessage {
  public readonly message: string;
  public readonly severity: SeverityColor;

  constructor(message: string, severity: SeverityColor) {
    this.message = message;
    this.severity = severity;
  }
}
