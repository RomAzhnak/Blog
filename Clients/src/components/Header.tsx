import { Button, createStyles, IconButton, makeStyles, Toolbar, Typography, Theme, TextField, InputAdornment, Avatar } from '@material-ui/core';
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearUser } from '../redux/userSlice';
import { useHistory } from "react-router-dom";


interface HeaderProps {
  title: string;
}

const Header = (props: HeaderProps) => {
  let history = useHistory();
  const dispatch = useAppDispatch();
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const { title } = props;
  const classes = useStyles();
  const handleClick = () => {
    return
  }

  return (
    <React.Fragment >
      <Toolbar  > {/* sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
        {/* <Button size="small">Subscribe</Button> */}
        <TextField
          label="Search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClick}>
                  <SearchSharpIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Typography
          // component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.title}
        // sx={{ flex: 1 }}
        >
          BLog
          {/* {title} */}
        </Typography>

        {(stateUser.id == 0) ?
          <>
            <Link to="/register" style={{ textDecoration: 'none', marginRight: 5, marginLeft: 55 }} >
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
            <Link to={'/edituser'} >  {/* `/users/:${stateUser.userId}` */}
              <Avatar aria-label="recipe" className={classes.avatar} src={stateUser.urlAvatar}>
              </Avatar>
            </Link>
            <Button variant="contained"
              size="small"
              color="primary"
              style={{ textDecoration: 'none', marginRight: 15, marginLeft: 35 }}
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
      </Toolbar>
      {/* <Toolbar
        component="nav"
        variant="dense"
        // sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            className={classes.menuButton} 
            // sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar> */}
    </React.Fragment>
  );
}

export default Header;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // title: {
    //   flexGrow: 1,

    // },
    menuButton: {
      // marginRight: theme.spacing(2),
      // justifyContent: 'space-between',
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    avatar: {
      marginLeft: 55,
    }
  }),
);