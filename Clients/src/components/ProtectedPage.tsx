import { Container } from '@material-ui/core';
import  AuthButton  from './AuthButton';
import  EditUserButton  from './EditUserButton';

export function ProtectedPage() {
  return (
    <Container>
      <AuthButton />
      <EditUserButton />
      <h3>Protected</h3>
    </Container>
  )
}
