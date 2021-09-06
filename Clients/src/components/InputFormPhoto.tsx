import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import pict from '../img/i4.jpg';
import { useAppDispatch } from '../app/hooks';
import { clearUser, fetchEdit, User, UserState } from "../redux/userSlice";
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      // height: '100vh',
      margin: 'auto',
    },
    '& > *': {
      margin: theme.spacing(1),
    },
    input: {
      display: "none",
    },
    image: {
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
      margin: theme.spacing(3),
      width: theme.spacing(10),
    },
    large: {

      width: theme.spacing(35),
      height: theme.spacing(35),
      margin: 'auto',
    }
  }));

export default function SignInSide() {
  const stateUser = useSelector(({user}: any) => user.userFields);

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState({
    userName: stateUser.userName,
    email: stateUser.email,
    password: ''
  }); 
  
  const [image, _setImage] = useState(pict);
  // const inputFileRef = createRef(null);

  const cleanup = () => {
    URL.revokeObjectURL(image);
    // inputFileRef.current.value = null;
  };

  const setImage = (newImage: any) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleOnChange = (event: any) => {
    const newImage = event.target?.files?.[0];
    console.log(stateUser);
    if (newImage) {
      setImage(URL.createObjectURL(newImage));
    }
  };

  // const handleChangePicture = (event: any) => {
  //   const image = URL.createObjectURL(event.target.files[0]);
  //   setPicture(image);
  //   console.log(event.target.files[0]);
  // }

  const onChange = (event: { target: { name: string; value: string; }; }) => {
    setUser(user => ({ ...user, [event.target.name]: event.target.value }))
  }

  const onSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const fetchUser = {
      userName: user.userName,
      email: user.email,
      password: user.password,
      // urlAvatar: image
    }
    if (user.email) {
      dispatch(fetchEdit( fetchUser ));
      setUser(
        {
          userName: '',
          email: '',
          password: ''
        }
      );
    };
  };

  const onClickDelete = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // dispatch(fetchDelete( user.email ));
    dispatch(clearUser());
    setUser(
      {
        userName: '',
        email: '',
        password: ''
      }
    );
  }

  return (
    <Grid container component="main" className={classes.root} xs={8}>
      {/* <Grid item xs={6} sm={6} 
       className={classes.image} > */}

        <input accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file" 
          onChange={handleOnChange}
          // ref={inputFileRef}
        />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" component="span">
            <Avatar src={image} className={classes.large} />
          </IconButton>
        </label>

        {/* <Avatar alt="Photo" src={pict} className={classes.large} /> */}
      {/* </Grid> */}
      <Grid item xs={6} sm={6} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
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
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center">
              <Grid  xs={4}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onClickDelete}
                >
                  Delete
                </Button>
              </Grid>
              <Grid xs={4}>
                <Button
                  type="submit"
                  // size='medium'
                  // fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  // onClick={onClickEdit}
                >
                  Edit
                </Button>
              </Grid>
            </Grid>
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