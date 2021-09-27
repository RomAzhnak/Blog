import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';


type Props = {
  typeAlert: number,
  messageAlert: string | null,
  show: any,
};

const AlertComponent: React.FC<Props> = (props) => {
  const handleClose = () => props.show('');

  return (
    <div>
      <Snackbar
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={props.messageAlert ? true : false}>
        <Alert
          onClose={handleClose}
          severity={props.typeAlert === 200 ? 'success' : 'error'}>
          {props.messageAlert}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default AlertComponent