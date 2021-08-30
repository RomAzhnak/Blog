import React, { useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useAppDispatch } from '../app/hooks';
import { addUser } from "../redux/todoSlice";
import { userSignUp } from "../api/userApi";
// import { useDispatch } from "react-redux";
// import { withRouter } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  //   const redirectToLogin = () => {
  //     props.updateTitle('Login')
  //     props.history.push('/login'); 
  // }


  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const onChange = (event: { target: { name: string | number; value: any; }; }) => {
    setUser(user => ({ ...user, [event.target.name]: event.target.value }))
  }

  const onSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (user.email) {
      dispatch(addUser( user ));
    };
    userSignUp(user);
    setUser(
      {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
    );
  };
  const dispatch = useAppDispatch();

  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");	

  // const onSubmit = (event: { preventDefault: () => void; }) => {
  //   event.preventDefault();
  //   if (email) {
  //     dispatch(addUser({
  //       firstName,
  //       lastName,
  //       email,
  //       password
  //     }));
  //   };
  //   userSignUp({firstName, lastName, email, password});
  //   setFirstName('');
  //   setLastName('');
  //   setEmail('');
  //   setPassword('');
  // };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="firstName"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={user.firstName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lastName"
                value={user.lastName}
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

// export default withRouter(SignUp);