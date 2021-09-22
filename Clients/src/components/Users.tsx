import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUser, getPosts, changeLike, changeSubscribeToUser } from "../api/userApi";
import Avatar from '@material-ui/core/Avatar';
import { Button, Checkbox, FormControlLabel, Grid, ListItem, Paper, Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { useAppSelector } from '../app/hooks';
import Header from './Header';

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

type Props = {

};

const Users: React.FC<Props> = (props) => {
  const stateUser = useAppSelector(({ user }) => user.userFields);
  const { id }: any = useParams();
  const [urlAvatar, setUrlAvatar] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userLikes, setUserLikes] = useState<any>(new Set());
  const [subscribe, setSubscribe] = useState<boolean>();
  const [posts, setPosts] = useState<any[]>();
  const classes = useStyles();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getUser(id);
        setUrlAvatar(response.data.urlAvatar);
        setUserName(response.data.userName);
        setEmail(response.data.email);
        setSubscribe(response.data.subscribe);
      } catch (err) {
        console.log(`Failed request ${err}`)
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
      .catch((err) =>
        console.log(`Failed request! ${err}`)
      )
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
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }

  const handleSubscribe = async () => {
    try {
      const response = await changeSubscribeToUser(id.slice(1));
      setSubscribe(response.data.subscribe);
    } catch (err) {
      console.log(`Failed request ${err}`)
    }
  }

  return (
    <Container component="main" maxWidth="md" >
      <Header title="Blog" />
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
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button type="submit" variant="contained" color="primary" >
                    Main page
                  </Button>
                </Link>
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
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
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
