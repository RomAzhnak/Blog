import { Container } from '@material-ui/core';
import  LogOutButton  from './LogOutButton';
import  EditUserButton  from './EditUserButton';

export function ProtectedPage() {
  return (
    <Container>
      <LogOutButton />
      <EditUserButton />
      <h3>Protected</h3>
    </Container>
  )
}
