import React, { useState } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useAppDispatch } from '../app/hooks';
import { fetchAdd } from "../redux/userSlice";
import IconButton from '@material-ui/core/IconButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { User } from '../redux/userSlice'
// import pict from '../img/i4.jpg';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

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
  input: {
    display: "none",
  },
    large: {

      width: theme.spacing(25),
      height: theme.spacing(25),
      margin: 'auto',
    }
}));

type Props = {
};

const SignUp: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [image, _setImage] = useState('');


  const cleanup = () => {
    URL.revokeObjectURL(image);
  };

  const setImage = (newImage: any) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleOnChange = (event: any) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImage(URL.createObjectURL(newImage));
    }
  };

  const [user, setUser] = useState({
    userName: '',
    email: '',
    password: ''
  });

  // const onChange = (event: { target: { name: string; value: string; }; }) => {
  //   setUser(user => ({ ...user, [event.target.name]: event.target.value }))
  // }

  const onSubmitForm = (user: User) => {
    // event.preventDefault();
    const fetchUser = {
      userName: user.userName,
      email: user.email,
      password: user.password,
      urlAvatar: image
    }
    if (user.email) {
      dispatch(fetchAdd( fetchUser ));
      setUser(
        {
          userName: '',
          email: '',
          password: ''
        }
      );
    };
  };

  const validationSchema = yup.object({
    userName: yup
      .string()
      .required('UserName is required'),
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
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmitForm(values);
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
      <input accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file" 
          onChange={handleOnChange}
        />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" component="span">
            <Avatar src={image} className={classes.large} />
          </IconButton>
        </label>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form}
          // onSubmit={onSubmitForm}
          onSubmit={formik.handleSubmit}
          noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="userName"
                name="userName"
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="First Name"
                autoFocus
                // value={user.userName}
                // onChange={onChange}
                value={formik.values.userName}
                onChange={formik.handleChange}
                error={formik.touched.userName && Boolean(formik.errors.userName)}
                helperText={formik.touched.userName && formik.errors.userName}
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
                // value={user.email}
                // onChange={onChange}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                // value={user.password}
                // onChange={onChange}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
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

export default SignUp;
