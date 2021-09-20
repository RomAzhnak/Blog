import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearUser, fetchDel, fetchEdit, User } from "../redux/userSlice";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { getUserList } from '../api/userApi';
import ListItem from '@material-ui/core/ListItem';
import Header from './Header';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { CssBaseline } from '@material-ui/core';
import AdminEditForm from './AdminEditForm';

type Props = {

};

const EditForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const [userInfos, setUserInfos] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<boolean>(false);
  const [userItem, setUserItem] = useState<any>();

  useEffect(() => {
    getUserList(stateUser.id)
      .then((response) => {
        setUserInfos(response.data);
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }, [stateUser])

  
  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Header title="Blog" />
      <Grid container
        style={{ marginTop: 25 }}
        // className={classes.mainpage}
        // spacing={10} 
        justifyContent='center'
      >
        <Grid item
          xs={10}
          component={Paper}
          elevation={6}
          style={{ overflow: 'auto' }}
        >
          <Grid item
            className={classes.list}>
            {/* <Grid>
              <Typography variant="h6" className="list-header">
                List of Users
              </Typography>
            </Grid> */}
            <Grid container >
              <ul className={classes.ul} >
                {userInfos &&
                  userInfos.map((userValue: any, index) => (
                    <ListItem
                      key={index}>
                      <Link onClick={ ()=>{ setUserItem(userValue); setEditUser(true); console.log(userValue) }}>
                      {/* <Link to={`/admineditform/:${userValue}`}
                        className={classes.listUl}> */}
                        <Avatar src={userValue.urlAvatar} alt={userValue.userName}
                          className={classes.middle} 
                          
                          />
                        {userValue.userName}
                      </Link>
                    </ListItem>
                  ))}
              </ul>
            </Grid>
          </Grid>
        </Grid>
      </Grid >
      {editUser ? <AdminEditForm user={userItem}/> : <></>}
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
      padding: 5,
      display: "flex",
      // justifyContent: 'space-around',
    },
    listUl: {
      display: 'flex',
      flexDirection: 'row',
      padding: 1,
      alignItems: 'center',

      marginTop: 20,
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      // padding: 15, 
      alignItems: 'center',

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
