import React, { useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useAppDispatch } from '../app/hooks';
import { fetchLogin } from "../redux/userSlice";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { User } from '../redux/userSlice'
import AlertComponent from "./AlertComponent";

type Props = {

};

const SignIn: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [typeMessage, setTypeMesssage] = useState<number>(200);
  const [textMessage, setTextMessage] = useState<string>('');

  let history = useHistory();

  const onSubmitForm = (user: User) => {
    if (user.email) {
      dispatch(fetchLogin(user))
        .unwrap()
        .then(res => {
          // setTypeMesssage(200);
          // setTextMessage('SUCCESS');
          history.push("/");
        })
        .catch(err => {
          setTypeMesssage(400);
          setTextMessage(err.message);
          console.log(err)
        })
    };
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password should be of minimum 6 characters length')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      roleId: 2,
      urlAvatar: '',
      id: 0
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmitForm(values);
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AlertComponent show={setTextMessage} typeAlert={typeMessage} messageAlert={textMessage} />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form}
          onSubmit={formik.handleSubmit}
          noValidate>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid >
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Main page
              </Button>
            </Link>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default SignIn;
