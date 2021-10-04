import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

type AlertType = {
  typeAlert: number,
  messageAlert: string | null,
};

type Props = {
  alert: AlertType,
  show: (a: any) => void,
};

const AlertComponent: React.FC<Props> = (props) => {
  const handleClose = () => props.show({typeAlert: props.alert.typeAlert, messageAlert: ''});

  return (
    <div>
      <Snackbar
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={props.alert.messageAlert ? true : false}>
        <Alert
          onClose={handleClose}
          severity={props.alert.typeAlert === 200 ? 'success' : 'error'}>
          {props.alert.messageAlert}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default AlertComponent