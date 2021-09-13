import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../api/userApi";
import { User } from "../redux/userSlice";
import Avatar from '@material-ui/core/Avatar';
import { Grid, Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

type Props = {

};

const Users: React.FC<Props> = (props) => {
  const { id }: any = useParams();
  const [urlAvatar, setUrlAvatar] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [user, setUser] = useState<User>();
  const classes = useStyles();
 
  useEffect( () => {
     getUser(id)
      .then((response) => {
        if (response.data) {
        // setUser(response.data);
        } 
        setUrlAvatar(response.data.urlAvatar);
        setUserName(response.data.userName);
        setEmail(response.data.email);
        // urlAvatar = response.data.urlAvatar;
        setUser(response.data);
      }) 
      .catch((err) =>
        console.log(`Failed request ${err}`)
      ) 
  }, [urlAvatar, ])
 
  return (  
    <Container component="main" maxWidth="sm">
      <Grid container spacing={5}> 
        <Grid item>
          <Avatar src={urlAvatar} className={classes.large}/>
        </Grid>
        <Grid item>
          <Typography>User Name:{` ${userName}`}</Typography>
          <Typography>Email:{` ${email}`}</Typography>
        </Grid>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
  }),
);

export default Users;