import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrivateRoute from './components/PrivateRoute';
import { ProtectedPage } from './components/ProtectedPage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import EditForm from './components/EditForm';
import { useEffect, useState } from 'react';
import { useAppDispatch } from './app/hooks';
import { fetchGet } from './api/userApi';
import { addUser, fetchLogin } from './redux/userSlice';

function App() {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return setInitialized(true);
    }     

    fetchGet()
      .then((res) => {
        dispatch(addUser(res.data));
      })
      .catch(e => {
        console.log('Login by token error', e.message)
      })
      .finally(()=> {
        setInitialized(true);
      })
  },[]);
  return (
    <>
      {initialized
        ? <Router>
          <Switch>
            <Route path="/" exact={true} >
              <SignUp />
            </Route>
            <Route path="/register">
              <SignUp />
            </Route>
            <Route path="/login">
              <SignIn />
            </Route>
            <PrivateRoute path="/edituser">
              <EditForm />
            </PrivateRoute>
            <PrivateRoute path="/protected">
              <ProtectedPage />
            </PrivateRoute>
          </Switch>
        </Router>
        : <p>Loading...</p>
      }
    </>
  );
}

export default App;
