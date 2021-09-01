import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
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
