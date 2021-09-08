import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// import pict from '../img/i4.jpg';
import { useAppDispatch } from '../app/hooks';
import { addUser, clearUser, fetchEdit, User, UserState } from "../redux/userSlice";
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
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

  interface State {
    user: UserState };

export default function EditForm() {
  const stateUser = useSelector(({user}: State) => user.userFields);

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState({
    userName: stateUser.userName,
    email: stateUser.email,
    password: ''
  }); 
  let history = useHistory();
  
  const [image, _setImage] = useState(stateUser.urlAvatar);
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
    if (newImage) {
      setImage(URL.createObjectURL(newImage));
    }
  };

  // const handleChangePicture = (event: any) => {
  //   const image = URL.createObjectURL(event.target.files[0]);
  //   setPicture(image);
  //   console.log(event.target.files[0]);
  // }

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
      dispatch(fetchEdit( fetchUser ))
      .unwrap()
      .then( () => {
        dispatch(addUser(fetchUser))
      })
      // setUser(
      //   {
      //     userName: '',
      //     email: '',
      //     password: ''
      //   }
      // );
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
    history.push("/");
  }

  const validationSchema = yup.object({
    userName: yup
      .string()
      .required('Username is required')
      .min(3, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')      
      .min(6, 'Password should be of minimum 6 characters length'),
    //   confirmPassword: Yup.string()
    //   .required('Confirm Password is required')
    //   .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    // acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required')
  });

  const formik = useFormik({
    initialValues: {
      userName: stateUser.userName,
      email: stateUser.email,
      password: stateUser.password,
      urlAvatar: image,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmitForm(values);
    },
  });

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

          <form className={classes.form} onSubmit={formik.handleSubmit} noValidate>
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
          </form>
        </div>
      </Grid>
    </Grid>
  );
}