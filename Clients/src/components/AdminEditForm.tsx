import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEditAdmin, fetchDelAdmin, userEditAdmin } from "../redux/userSlice";

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, FormControl, MenuItem, Select } from '@material-ui/core';

import { useFormik } from 'formik';
import * as yup from 'yup';


const validationSchema = yup.object({
  userName: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 6 characters')
    .max(20, 'Username must not exceed 20 characters'),
  roleId: yup
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
});

type Props = {
  showAlert: (a: any) => void,
};

type InitUser = {
  userName: string,
  email: string,
  roleId: number,
  id: number,
  password: string,
}

const EditForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const stateUser = useAppSelector(({ user }) => user.userEditAdmin);
  const [fileName, setFileName] = useState<File | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      userName: stateUser.userName,
      email: stateUser.email,
      password: stateUser.password,
      roleId: stateUser.roleId,
      id: stateUser.id,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmitForm(values);
    },
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target?.files?.[0];
    if (newImage) {
      setFileName(newImage);
      dispatch(userEditAdmin({ ...stateUser, urlAvatar: URL.createObjectURL(newImage) }));
    }
  };

  const onSubmitForm = (user: InitUser) => {
    if (stateUser.roleId === 1) {
      props.showAlert({typeAlert: 400, messageAlert: 'Can`t edit admin'})
      return;
    };
    let formData = new FormData();
    if (fileName) {
      formData.append("file", fileName);
      setFileName(undefined);
    }
    formData.append("userName", user.userName);
    formData.append("email", user.email);
    formData.append("id", String(stateUser.id));
    formData.append("roleId", String(user.roleId));
    formData.append("urlAvatar", stateUser.urlAvatar);
    if (user.email) {
      dispatch(fetchEditAdmin(formData))
        .unwrap()
        .then(() => {
        })
        .catch((err) => {
          props.showAlert({typeAlert: 400, messageAlert: err.message})
        })
    };
  };

  const onClickDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (stateUser.roleId === 1) {
      props.showAlert({typeAlert: 400, messageAlert: 'Can`t delete admin'})
      return;
    };
    const fetchUser = {
      userName: stateUser.userName,
      email: stateUser.email,
      password: stateUser.password,
      urlAvatar: stateUser.urlAvatar,
      roleId: stateUser.roleId,
      id: stateUser.id,
    }
    dispatch(fetchDelAdmin(fetchUser))
      .unwrap()
      .then(() => {
      })
      .catch((err) => {
        props.showAlert({typeAlert: 400, messageAlert: err.message})
      })
  }

  return (
    <Container maxWidth="lg">
      <Grid container className={classes.mainpage} spacing={2} justifyContent='center'>
        <Grid component="main" className={classes.root} >
          <Grid item xs={7} component={Paper} elevation={6} className={classes.paper}>
            <Typography component="h1" variant="h5">
              Edit
            </Typography>
            <input accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              onChange={(e) => handleOnChange(e)}
            />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" component="span">
                <Avatar src={stateUser.urlAvatar} className={classes.large} />
              </IconButton>
            </label>
            <form className={classes.form}
              onSubmit={formik.handleSubmit}
              noValidate
            >
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
                    variant="outlined"
                    required
                    disabled
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
                <Grid item>
                <FormControl style={{ minWidth: 125 }}>
                  <Select
                    name="roleId"
                    value={formik.values.roleId}
                    onChange={formik.handleChange}
                    style={{ marginBottom: 10 }}
                  >
                    <MenuItem value="">
                    </MenuItem>
                    <MenuItem value={1}>Administrator</MenuItem>
                    <MenuItem value={2}>User</MenuItem>
                  </Select>
                </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
              >
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
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
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
    },
    '& > *': {
      margin: theme.spacing(1),
    },
    input: {
      display: "none",
    },
    mainpage: {
    },
    paper: {
      margin: theme.spacing(2, 3, 0, 3),
      padding: theme.spacing(2),
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
      margin: theme.spacing(2),
      width: theme.spacing(8),
    },
    large: {
      width: theme.spacing(25),
      height: theme.spacing(25),
      marginTop: 10,
    },
  }));

export default EditForm;
