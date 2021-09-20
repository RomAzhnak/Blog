import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearUser, fetchDel, fetchEdit, User } from "../redux/userSlice";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory, Link, useParams } from 'react-router-dom';
import { getUserList } from '../api/userApi';
import ListItem from '@material-ui/core/ListItem';
import { getUser } from "../api/userApi";
import Header from './Header';
import { Container } from '@material-ui/core';


const validationSchema = yup.object({
  userName: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 6 characters')
    .max(20, 'Username must not exceed 20 characters'),
  role: yup
  .number()
  .required('Role is required'),
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

type Props = {
user: any,
};


const init: User = {
  userName: '',
  email: '',
  urlAvatar: '',
  role: 2,
  id: 0,
  password: '',
}

const EditForm: React.FC<Props> = (props) => {
  // const {userValue}: any = useParams(); 
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const [userInfos, setUserInfos] = useState<any>(init);
  const [imageInfos, setAvatar] = useState<any[]>([]);
  const [image, setImage] = useState<string>(props.user.urlAvatar);
  const [fileName, setFileName] = useState<File | undefined>();
  let response: any; 

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target?.files?.[0];
    if (newImage) {
      setImage(URL.createObjectURL(newImage));
      setFileName(newImage);
    }
  };

  const onSubmitForm = (user: User) => {

    let formData = new FormData();
    if (fileName) {
      formData.append("file", fileName);
    }
    formData.append("userName", user.userName);
    formData.append("email", user.email);
    // formData.append("password", user.password);
    formData.append("id", String(stateUser.id));
    formData.append("urlAvatar", image);
    formData.append("role", String(user.role));
    if (user.email) {
      dispatch(fetchEdit(formData))
        .unwrap()
        .catch((err) => {
          console.log(`Failed request ${err}`);
        })
    };
  };

  const onClickDelete = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const fetchUser = {
      userName: userInfos.userName,
      email: userInfos.email,
      password: userInfos.password, //formik.values.password,
      urlAvatar: userInfos.urlAvatar,
      role: userInfos.role,
      id: userInfos.id,
    }
    dispatch(fetchDel(fetchUser))
      .unwrap()
      .then(() => {
        localStorage.removeItem('token');
        history.push("/");
      })
  }
 
  const onClickLogOut = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // dispatch(fetchDelete( user.email ));
    dispatch(clearUser());
    localStorage.removeItem('token');
    history.push("/");
  }
 
  const formik = useFormik({
    initialValues: {
      userName: props.user.userName,
      email: props.user.email, 
      password: '',
      role: 0, //initUser.role,
      urlAvatar: 'initUser.urlAvatar',
      id: 0 // initUser.id
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmitForm(values);
    },
  });


  return (
    <Container maxWidth="lg">
    {/* <Header title="Blog" /> */}
    <Grid container className={classes.mainpage} spacing={2} justifyContent='center'>
      <Grid component="main" className={classes.root} >
        <input accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={(e) => handleOnChange(e)}
        />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" component="span">
            <Avatar src={image} className={classes.large} />
          </IconButton>
        </label>

        <Grid item xs={7} component={Paper} elevation={6} className={classes.paper}>
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
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    error={formik.touched.userName && Boolean(formik.errors.userName)}
                    helperText={formik.touched.userName && formik.errors.userName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    // disabled
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    variant="outlined"
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
                </Grid> */}
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center">
                <Grid >
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
                <Grid >
                  <Button
                    type="submit"
                    // size='medium'
                    // fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Save
                  </Button>
                </Grid>
                {/* <Grid >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={onClickLogOut}
                  >
                    LogOut
                  </Button>
                </Grid> */}
              </Grid>
            </form>
              <Grid >
                <Button
                  fullWidth
                  // type="submit"
                  variant="contained"
                  color="primary"
                // className={classes.submit}
                >
                  <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    Main page
                  </Link>
                </Button>
              </Grid>
          {/* </Grid> */}
        </Grid>
      </Grid>
    </Grid>
    </Container>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      // height: '100vh',
      // margin: 'auto',
      // marginRight: 100,
    },
    '& > *': {
      margin: theme.spacing(1),
    },
    input: {
      display: "none",
    },
    ul: {
      padding: 0
    },
    list: {
      // alignItems: 'center',
      display: 'flex',
      padding: 1,
      // justifyContent: 'flex-start',
      justifyContent: 'center',
      marginTop: 20,
    },
    mainpage: {
      // display: 'flex',
      // alignSelf: 'center',
      // margin: 'auto', 
      // flex: 1,
    },
    paper: {
      margin: theme.spacing(2, 3, 0, 3),
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // justifyContent: 'center', 
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    submit: {
      margin: theme.spacing(2),
      width: theme.spacing(8),
    },
    large: {
      width: theme.spacing(25),
      height: theme.spacing(25),
      marginTop: 10,
    },
    middle: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      marginRight: 5,
    }
  }));

export default EditForm;
