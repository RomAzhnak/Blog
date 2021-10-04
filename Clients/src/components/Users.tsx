import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, getPosts, changeLike, changeSubscribeToUser } from "../api/userApi";
import { useAppSelector } from '../app/hooks';

import Avatar from '@material-ui/core/Avatar';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid, ListItem,
  Paper,
  Typography
} from "@material-ui/core";
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Favorite, FavoriteBorder } from "@material-ui/icons";

import Header from './Header';
import AlertComponent from "./AlertComponent";

type Value = {
  id: number,
  post: string,
  likes: number,
  userId: number,
  createdAt: string,
  title: string,
  postId: number,
  postAuthorId: number,
}

type Id = {
  id: string,
}

type Props = {

};

const Users: React.FC<Props> = (props) => {
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const { id }: Id = useParams();
  const [urlAvatar, setUrlAvatar] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userLikes, setUserLikes] = useState<Set<number>>(new Set());
  const [subscribe, setSubscribe] = useState<boolean>();
  const [posts, setPosts] = useState<Value[]>();
  const classes = useStyles();
  const [alert, setAlert] = useState<
  { typeAlert: number, messageAlert: string }
>({ typeAlert: 200, messageAlert: '' });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getUser(id);
        setUrlAvatar(response.data.urlAvatar);
        setUserName(response.data.userName);
        setEmail(response.data.email);
        setSubscribe(response.data.subscribe);
      } catch (err: any) {
        setAlert({typeAlert: 400, messageAlert: err.message});
      }
    }
    fetchUserData();
  }, [id]);

  useEffect(() => {
    getPosts(id)
      .then((response) => {
        setPosts(response.data.posts);
        setUserLikes(new Set(response.data.userLikes));
      })
      .catch((err) => {
        setAlert({typeAlert: 400, messageAlert: err.message});
      })
  }, [id]);

  const handleGetStatusLike = (post: Value) => {
    return userLikes.has(post.id)
  }

  const handleChangePostLike = (post: Value) => {
    const idLiker = stateUser.id;
    if (idLiker === Number(id.slice(1))) return;
    changeLike({ idPost: post.id, idAuthor: id })
      .then((response) => {
        const temp = posts?.map((value: Value) => {
          if (value.id !== post.id) return value
          return ({ ...value, likes: response.data.countLikes })
        });
        response.data.statusLike ? userLikes.add(post.id) : userLikes.delete(post.id)
        setPosts(temp);
      })
      .catch((err) => {
        setAlert({typeAlert: 400, messageAlert: err.message});
      })
  }

  const handleSubscribe = async () => {
    const idLiker = stateUser.id;
    if (idLiker === Number(id.slice(1))) return;
    try {
      const response = await changeSubscribeToUser(Number(id.slice(1)));
      setSubscribe(response.data.subscribe);
    } catch (err: any) {
      setAlert({typeAlert: 400, messageAlert: err.message});
    }
  }

  return (
    <Container component="main" maxWidth="md" >
      <Header title="Blog" />
      <AlertComponent show={setAlert} alert={alert} />
      <Container component="main" maxWidth="sm" >
        <Grid container spacing={8} justifyContent='center' >
          <Grid item>
            <Avatar src={urlAvatar} className={classes.large} />
          </Grid>
          <Grid item>
            <Typography>User Name:{` ${userName}`}</Typography>
            <Typography>Email:{` ${email}`}</Typography>
            <Grid >
              <Grid className={classes.button}>
              </Grid>
              <Grid className={classes.button}>
                <Button type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSubscribe}
                >
                  {subscribe ? 'Отписаться' : 'Подписаться'}
                </Button>
              </Grid>
            </Grid>
            {posts?.length ? <></> : <h2> No posts </h2>}
          </Grid>
        </Grid>
        <ul >
          {posts &&
            posts.map((post: Value, index: number) => (
              <ListItem
                className={classes.list}
                key={index}>
                <Paper className={classes.paper}>
                  <Grid item xs>
                    <Typography>{post.post}</Typography>
                  </Grid>
                </Paper>
                <FormControlLabel
                  onChange={() => { handleChangePostLike(post) }}
                  checked={handleGetStatusLike(post)}
                  control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} name="checkedH" />}
                  label={post.likes + " " + post.createdAt.slice(0, 10)}
                />
              </ListItem>
            )
            )
          }
        </ul>
      </Container>
    </Container>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: 'flex',
      flexDirection: 'column',
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
    paper: {
      width: 500,
      padding: theme.spacing(1),
    },
    button: {
      marginTop: 10,
    },
  }),
);

export default Users;
