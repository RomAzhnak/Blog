import { Container } from '@material-ui/core';
import  LogOutButton  from './1LogOutButton';
import  EditUserButton  from './1EditUserButton';

export function ProtectedPage() {
  return (
    <Container>
      <LogOutButton />
      <EditUserButton />
      <h3>Protected</h3>
    </Container>
  )
}
