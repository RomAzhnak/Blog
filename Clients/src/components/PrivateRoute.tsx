import {
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface PrivateRouteProps extends RouteProps {
  children?: any;
}
const PrivateRoute = (props: PrivateRouteProps) => {
  const {children, ...rest } = props;
  const stateUser = useSelector((state: RootState) => state.user.userFields);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        stateUser.email ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
