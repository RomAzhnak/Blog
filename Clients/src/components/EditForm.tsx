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
import { useHistory, Link } from 'react-router-dom';
import { getUserList } from '../api/userApi';
import ListItem from '@material-ui/core/ListItem';


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

type Props = {

};

const EditForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const [imageInfos, setAvatar] = useState<any[]>([]);
  const [image, _setImage] = useState(stateUser.urlAvatar);
  const [fileName, setFileName] = useState<File | undefined>();

  useEffect(() => {
    getUserList(stateUser.email)
      .then((response) => {
        setAvatar(response.data);
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }, [stateUser])

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

  // const handleChangePicture = (event: any) => {
  //   const image = URL.createObjectURL(event.target.files[0]);
  //   setPicture(image);
  //   console.log(event.target.files[0]);
  // }

  // const onChange = (event: { target: { name: string; value: string; }; }) => {
  //   setUser(user => ({ ...user, [event.target.name]: event.target.value }))
  // }

  const onSubmitForm = (user: User) => {

    let formData = new FormData();
    if (fileName) {
      formData.append("file", fileName);
    }
    //   for ( let key in user) {
    //     formData.append(key, user[key]);
    // }
    formData.append("userName", user.userName);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("id", String(stateUser.id));
    formData.append("urlAvatar", image);
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
      userName: formik.values.userName,
      email: formik.values.email,
      password: formik.values.password,
      urlAvatar: '',
      role: 2,
      id: 0
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
      userName: stateUser.userName,
      email: stateUser.email,
      password: '',
      role: stateUser.role,
      urlAvatar: image,
      id: 0
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmitForm(values);
    },
  });


  return (
    <Grid container className={classes.mainpage} spacing={2} justifyContent='center'>
      <Grid component="main" className={classes.root} xs={6} md={5}>
        {/* <Grid item xs={6} sm={6} 
        className={classes.image} > */}

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

        <Grid item xs={7} component={Paper} elevation={6}>
          <div className={classes.paper}>
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
                <Grid >
                  <Button
                    type="submit"
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
              <Grid >

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                // className={classes.submit}
                >
                  <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                    Main page
                  </Link>
                </Button>

              </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid item xs={2} component={Paper} elevation={6} className={classes.list} style={{ maxHeight: '100%', overflow: 'auto' }}>
        <Grid >
          <Typography variant="h6" className="list-header">
            List of Users
          </Typography>
          <ul className={classes.ul}>
            {imageInfos &&
              imageInfos.map((image: any, index) => (
                <ListItem
                  divider
                  key={index}>
                  {/* <Link to={`/users/${image.id}`} > */}
                  <Link to={`/users/:${image.id}`} className={classes.list}>
                    <Avatar src={image.urlAvatar} alt={image.userName} className={classes.middle} />
                    {image.userName}
                  </Link>
                </ListItem>
              ))}
          </ul>
        </Grid>
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
      margin: theme.spacing(8, 4),
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
      width: theme.spacing(35),
      height: theme.spacing(35),
      marginTop: 10,
    },
    middle: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      marginRight: 5,
    }
  }));

export default EditForm;
