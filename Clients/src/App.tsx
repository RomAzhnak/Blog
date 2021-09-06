import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrivateRoute from './components/PrivateRoute';
import { ProtectedPage } from './components/ProtectedPage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import InputFormPhoto from './components/InputFormPhoto';

function App() {

  return (
    <Router>
          <Switch>
            <Route path="/" exact={true} >
              <SignUp />
            </Route>
            <Route path="/register">
              <SignUp />
            </Route>
            <Route path="/login">
              <SignIn/>
            </Route>
            <Route path="/edituser">
              <InputFormPhoto/>
            </Route>            
            <PrivateRoute path="/protected">
              <ProtectedPage />
            </PrivateRoute>
          </Switch>
    </Router>
  );
}

export default App;
