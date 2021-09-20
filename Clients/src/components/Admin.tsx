import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getUserList } from '../api/userApi';
import ListItem from '@material-ui/core/ListItem';
import Header from './Header';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { CssBaseline } from '@material-ui/core';
import AdminEditForm from './AdminEditForm';
import { userEditAdmin } from "../redux/userSlice";

type Props = {

};

const EditForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const stateUsersForAdmin = useAppSelector(( user ) => user);
  const [userInfos, setUserInfos] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<boolean>(false);
  const [userProp, setUserProp] = useState<any>();

  useEffect(() => {
    getUserList(stateUser.id)
      .then((response) => {
        setUserInfos(response.data);
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }, [stateUsersForAdmin]);
  
  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Header title="Blog" />
      <Grid container
        style={{ marginTop: 25 }} 
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
            <Grid container >
              <ul className={classes.ul} >
                {userInfos &&
                  userInfos.map((userValue: any, index) => (
                    <ListItem
                      key={index}>
                      <Link onClick={ ()=>{ dispatch(userEditAdmin(userValue)); setEditUser(true); }}>
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
      {editUser ? <AdminEditForm /> : <></>}
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
    ul: {
      padding: 5,
      display: "flex",
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
      alignItems: 'center',

      marginTop: 20,
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
