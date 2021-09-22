import MainPage from './components/MainPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Admin from './components/Admin';
import AdminEditForm from './components/AdminEditForm';
import PrivateRoute from './components/PrivateRoute';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import EditForm from './components/EditForm';
import { useEffect, useState } from 'react';
import { useAppDispatch } from './app/hooks';
import { fetchGet } from './api/userApi';
import { addUser } from './redux/userSlice';
import Users from './components/Users';

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
              <MainPage />
            </Route>
            <Route path="/register">
              <SignUp />
            </Route>
            <Route path="/login">
              <SignIn />
            </Route>
            <PrivateRoute path="/users/:id">
              <Users />
            </PrivateRoute>
            <PrivateRoute path="/edituser">
              <EditForm />
            </PrivateRoute>
            <PrivateRoute path="/admin">
              <Admin />
            </PrivateRoute>
            {/* <PrivateRoute path="/admineditform/:userValue">
              <AdminEditForm />
            </PrivateRoute> */}
          </Switch>
        </Router>
        : <p>Loading...</p>
      }
    </>
  );
}

export default App;
