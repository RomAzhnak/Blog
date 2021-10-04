import React, { FormEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearUser, fetchDel, fetchEdit, User } from "../redux/userSlice";
import { Link } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { Container } from '@material-ui/core';

import { useFormik } from 'formik';
import * as yup from 'yup';


import { getUserList, fetchAddPost } from '../api/userApi';
import Header from './Header';
import AlertComponent from "./AlertComponent";


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

type UserList = {
  id: number,
  urlAvatar: string,
  userName: string,
};

type Props = {

};

const EditForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const [imageInfos, setImageInfos] = useState<UserList[]>([]);
  const [image, _setImage] = useState(stateUser.urlAvatar);
  const [fileName, setFileName] = useState<File | undefined>();
  const [postTitle, setTitlePost] = useState<string>('');
  const [postText, setTextPost] = useState<string>('');
  const [alert, setAlert] = useState<
  { typeAlert: number, messageAlert: string }
>
  ({ typeAlert: 200, messageAlert: '' });

  useEffect(() => {
    getUserList(stateUser.id)
      .then((response) => {
        setImageInfos(response.data);
      })
      .catch((err) => {       
        setAlert({typeAlert: 400, messageAlert: err.message});
      })
  }, [stateUser.id])

  const setImage = (newImage: React.SetStateAction<string>) => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    _setImage(newImage);
  };

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
    formData.append("password", user.password);
    formData.append("id", String(stateUser.id));
    formData.append("urlAvatar", image);
    formData.append("roleId", String(user.roleId));
    if (user.email) {
      dispatch(fetchEdit(formData))
        .unwrap()
        .then(() => {
          setAlert({typeAlert: 200, messageAlert: 'SUCCESS. User edited'});
        })
        .catch((err) => {
          setAlert({typeAlert: 400, messageAlert: err.message});
        })
    };
  };

  const onClickDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const fetchUser = {
      userName: formik.values.userName,
      email: formik.values.email,
      password: formik.values.password,
      urlAvatar: '',
      roleId: 2,
      id: stateUser.id,
    }
    dispatch(fetchDel(fetchUser))
      .unwrap()
      .then(() => {
        localStorage.removeItem('token');
      })
      .catch((err) => {
        setAlert({typeAlert: 400, messageAlert: err.message});
      });
  }

  const onClickLogOut = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    dispatch(clearUser());
    localStorage.removeItem('token');
  }

  const handleSubmitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetchAddPost(postTitle, postText);
      setTitlePost('');
      setTextPost('');
      setAlert({typeAlert: 200, messageAlert: 'SUCCESS. Add post'});
    } catch (err: any) {
      setAlert({typeAlert: 400, messageAlert: err.message});
    }
  }

  const handleChangeTitle = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTitlePost(event.target.value);
  }

  const handleChangePost = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTextPost(event.target.value);
  }

  const formik = useFormik({
    initialValues: {
      userName: stateUser.userName,
      email: stateUser.email,
      password: '',
      roleId: stateUser.roleId,
      urlAvatar: image,
      id: 0
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmitForm(values);
    },
  });


  return (
    <Grid container spacing={2} justifyContent='center' >
      <Container maxWidth="lg">
        <Header title="Blog" />
        <AlertComponent show={setAlert} alert={alert} />
      </Container>
      <Grid>
      <Grid component="main" className={classes.root} >
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
        <Grid item xs={3} component={Paper} elevation={6} className={classes.paper} >
          <Typography component="h1" variant="h5">
            Edit
          </Typography>
          <form className={classes.form} name="postForm" onSubmit={formik.handleSubmit} noValidate>
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
                  disabled
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

              <Grid >
                <Button
                  size='small'
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Save
                </Button>
              </Grid>
              <Grid >
                <Button
                  size='small'
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
                  size='small'
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onClickLogOut}
                >
                  LogOut
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={5} component={Paper} elevation={6} className={classes.paper}>
          <Typography component="h1" variant="h5">
            New post
          </Typography>
          <form className={classes.form} onSubmit={handleSubmitPost} >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="userName"
                  name="userName"
                  variant="outlined"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                  value={postTitle}
                  onChange={handleChangeTitle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={5}
                  variant="outlined"
                  required
                  fullWidth
                  id="post"
                  label="Post"
                  name="post"
                  value={postText}
                  onChange={handleChangePost}
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center">
              <Button
                size='small'
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Publish
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
      <Grid container
        style={{ marginTop: 25 }}
        justifyContent='center'
      >
      <Grid item component={Paper} elevation={6} style={{ overflow: 'auto', padding: 15 }}  >
        <Grid item className={classes.list} >
          <Typography variant="h6" className="list-header">
            List of Subscriptions
          </Typography>
          <ul className={classes.ul}>
            {imageInfos &&
              imageInfos.map((image: UserList, index) => (
                <ListItem
                style={{padding: 8}}
                  // divider
                  key={index}>
                  <Link to={`/users/:${image.id}`} className={classes.list}>
                    <Avatar src={image.urlAvatar} alt={image.userName} className={classes.middle} />
                    {image.userName}
                  </Link>
                </ListItem>
              ))}
          </ul>
        </Grid>
      </Grid>
      </Grid >
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
    '& > *': {
      margin: theme.spacing(1),
    },
    input: {
      display: "none",
    },
    ul: {
      display: 'flex',
      padding: 5,
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    paper: {
      margin: theme.spacing(2, 3, 0, 3),
      padding: theme.spacing(1, 3, 1, 3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    submit: {
      margin: theme.spacing(1),
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
    }
  }));

export default EditForm;