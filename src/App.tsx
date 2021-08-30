import SignUp from './components/signUp';
import SignIn from './components/signIn';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
          <Switch>
            <Route path="/" exact={true}>
              <SignUp/>
            </Route>
            <Route path="/register">
              <SignUp/>
            </Route>
            <Route path="/login">
              <SignIn/>
            </Route>
          </Switch>
    </Router>
  );
}

export default App;
