import { Container } from '@material-ui/core';
import  AuthButton  from './AuthButton';

export function ProtectedPage() {
  return (
    <Container>
      <AuthButton />
      <h3>Protected</h3>
    </Container>
  )
}
