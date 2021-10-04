import React, { useEffect, useState } from 'react';
import { userEditAdmin } from "../redux/userSlice";
import { useAppDispatch, useAppSelector } from '../app/hooks';

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';
import { CssBaseline } from '@material-ui/core';
import Link from '@material-ui/core/Link';

import { getUserListAdmin } from '../api/userApi';

import Header from './Header';
import AdminEditForm from './AdminEditForm';
import AlertComponent from "./AlertComponent";

type UserValue = {
  email: string,
  userName: string,
  urlAvatar: string,
  roleId: number,
  id: number,
  password: string,
}

type Props = {

};

const EditForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const stateUsersForAdmin = useAppSelector((store) => store.user);
  const [userInfos, setUserInfos] = useState<UserValue[]>([]);
  const [editUser, setEditUser] = useState<boolean>(false);
  const [alert, setAlert] = useState<
    { typeAlert: number, messageAlert: string }
  >
    ({ typeAlert: 200, messageAlert: '' });

  useEffect(() => {
    getUserListAdmin(stateUser.id)
      .then((response) => {
        setUserInfos(response.data);
      })
      .catch((err) => {
        setAlert({ typeAlert: 400, messageAlert: err.message });
      })
  }, [stateUsersForAdmin]);

  const handleOnClick = (userValue: UserValue) => {
    dispatch(userEditAdmin(userValue));
    setEditUser(true);
  }

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Header title="Blog" />
      <AlertComponent show={setAlert} alert={alert} />
      <Grid container
        style={{ marginTop: 25 }}
        justifyContent='center'
      >
        <Grid item
          component={Paper}
          elevation={6}
          style={{ overflow: 'auto' }}
        >
          <Grid item
            className={classes.list}>
            <Grid container >
              <ul className={classes.ul} >
                {userInfos &&
                  userInfos.map((userValue: UserValue, index) => (
                    <ListItem
                      key={index}>
                      <Link onClick={() => handleOnClick(userValue)} className={classes.list}>
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
      {editUser && <AdminEditForm showAlert={setAlert} />}
    </Container>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ul: {
      padding: 5,
      display: "flex",
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    middle: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    }
  }));

export default EditForm;
