import { Button, createStyles, makeStyles, Toolbar, Typography, Theme, Avatar, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearUser } from '../redux/userSlice';
import { useHistory } from "react-router-dom";
import { Fragment } from 'react';


interface HeaderProps {
  title: string;
}

const Header = (props: HeaderProps) => {
  let history = useHistory();
  const dispatch = useAppDispatch();
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const { title } = props;
  const classes = useStyles();

  return (
    <Fragment >
      <Toolbar  >
        <Grid >
          <Button
            size="small"
            variant="contained"
            color="primary"
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              Main page
            </Link>
          </Button>
        </Grid>
        <Typography

          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.title}
        >
          {title}
        </Typography>
        {(stateUser.id === 0) ?
          <>
            <Link to="/register" style={{ textDecoration: 'none', marginRight: 5, marginLeft: 25 }} >
              <Button variant="contained" size="small" color="primary">
                Sign up
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="contained" size="small" color="primary">
                Sign in
              </Button>
            </Link>
          </>
          : <>
            <Link to={'/edituser'} >
              <Avatar aria-label="recipe" src={stateUser.urlAvatar}>
              </Avatar>
            </Link>
            <Button variant="contained"
              size="small"
              color="primary"
              style={{ textDecoration: 'none', marginRight: 15, marginLeft: 25 }}
              onClick={() => {
                localStorage.removeItem('token');
                dispatch(clearUser());
                history.push("/");
              }}
            >
              Logout
            </Button>
          </>
        }
        {(stateUser.roleId === 1) ?
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="small" color="primary">
              Admin
            </Button>
          </Link>
          : <></>
        }
      </Toolbar>
    </Fragment>
  );
}

export default Header;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }),
);