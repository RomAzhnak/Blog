import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, getPosts, changeLike } from "../api/userApi";
import Avatar from '@material-ui/core/Avatar';
import { Button, Checkbox, FormControlLabel, Grid, ListItem, Paper, Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { Link } from 'react-router-dom';

type Value = {
  id: number,
  post: string,
  likes: number,
  userId: number,
  createdAt: string,
  updatedAt: string
}

type Props = {

};

const Users: React.FC<Props> = (props) => {
  const { id }: any = useParams();
  const [urlAvatar, setUrlAvatar] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userLikes, setUserLikes] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>();
  const classes = useStyles();

  useEffect(() => {
    // let ignore = false;
    async function fetchUserData() {
      try {
        const response = await getUser(id);
        setUrlAvatar(response.data.urlAvatar);
        setUserName(response.data.userName);
        setEmail(response.data.email);
        // if (!ignore) { 
        //   const response = await getUser(id);
        //   setUserData(response.data);
        // }
      } catch (err) {
        console.log(`Failed request ${err}`)
      }
    }
    fetchUserData();
    // return () => { ignore = true; }
  }, [id]);

  useEffect(() => {
    getPosts(id)
      .then((response) => {
        setPosts(response.data.posts);
        setUserLikes(response.data.userLikes);
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }, [id]);

  const handleGetStatusLike = (post: Value) => {
    return userLikes.indexOf(post.id) !== -1
  }

  const handlePostLike = (post: Value) => {
    changeLike({ idPost: post.id, idAuthor: id })
      .then((response) => {
        const temp = posts?.map((value: Value) => {
          if (value.id !== post.id) return value
          return ({ ...value, likes: response.data.numberLikes })
        });
        const index = userLikes.indexOf(post.id);
        if (index > -1) {
          userLikes.splice(index, 1);
        } else {
          userLikes.push(post.id)
        }
        setPosts(temp);
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }

  return (
    <Container component="main" maxWidth="sm" >
      <Grid container spacing={8} justifyContent='center' >
        <Grid item>
          <Avatar src={urlAvatar} className={classes.large} />
        </Grid>
        <Grid item>
          <Typography>User Name:{` ${userName}`}</Typography>
          <Typography>Email:{` ${email}`}</Typography>
              <Grid className={classes.button}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Main page
                  </Button>
                </Link>
              </Grid>
              { posts?.length ? <></> : <h2> No posts </h2> }
        </Grid>
      </Grid>

      <ul >
        {posts &&
          posts.map((post: Value, index: number) => (
            <ListItem
              className={classes.list}
              // divider
              key={index}>
              <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item xs>
                    <Typography>{post.post}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              <FormControlLabel
                onChange={() => { handlePostLike(post) }}
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
      maxWidth: 500,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
    },
    button: {
    marginTop: 10,
    },
  }),
);

export default Users;






  // useEffect(() => {
  //   getUser(id)
  //     .then((response) => {
  //       if (response.data) {
  //         setUrlAvatar(response.data.urlAvatar);
  //         setUserName(response.data.userName);
  //         setEmail(response.data.email);
  //         // urlAvatar = response.data.urlAvatar;
  //         console.log(response.data);
  //         setUser(response.data);
  //         console.log(user);
  //       }
  //     })
  //     .catch((err) =>
  //       console.log(`Failed request ${err}`)
  //     );
  // }, []);