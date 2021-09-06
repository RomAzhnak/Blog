import React, { createRef, useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import pict from '../img/i4.jpg';
import { useAppDispatch } from '../app/hooks';
import { fetchAdd } from "../redux/userSlice";
// import CssBaseline from '@material-ui/core/CssBaseline';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Box from '@material-ui/core/Box';
// import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      margin: 'auto',
    },
    input: {
      display: "none",
    },
    image: {
      // backgroundImage: 'url(https://source.unsplash.com/random)',
      // backgroundRepeat: 'no-repeat',
      // backgroundColor:
      //   theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      // backgroundSize: 'cover',
      // backgroundPosition: 'center',
      display: 'flex',
      alignSelf: 'center',
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    large: {

      width: theme.spacing(35),
      height: theme.spacing(35),
      margin: 'auto',
    }
  }));

export default function SignInSide() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [myData, setData] = useState();
  const [user, setUser] = useState({
    userName: '',
    email: '',
    password: ''
  }); 

  

  const onChange = (event: { target: { name: string; value: string; }; }) => {
    setUser(user => ({ ...user, [event.target.name]: event.target.value }))
  }

  const onSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (user.email) {
      dispatch(fetchAdd(user));
      setUser(
        {
          userName: '',
          email: '',
          password: ''
        }
      );
    };
  };

  return (
    <Grid container component="main" className={classes.root} xs={8}>
      <Grid item xs={6} sm={4} md={7} className={classes.image} >

        <input accept=".jpg, .jpeg, .png"
          className={classes.input}
          id="icon-button-file"
          type="file" 

        />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <Avatar src={pict} className={classes.large} />
          </IconButton>
        </label>

        {/* <Avatar alt="Photo" src={pict} className={classes.large} /> */}
      </Grid>
      <Grid item xs={6} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit
          </Typography>

          <form className={classes.form} onSubmit={onSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="userName"
                  name="userName"
                  variant="outlined"
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  autoFocus
                  value={user.userName}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={user.email}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={user.password}
                  onChange={onChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Edit
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link to="/" >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </form>
        </div>
      </Grid>
    </Grid>
  );
}