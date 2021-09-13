import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, getPosts } from "../api/userApi";
import { User } from "../redux/userSlice";
import Avatar from '@material-ui/core/Avatar';
import { Checkbox, FormControlLabel, Grid, ListItem, Paper, Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Favorite, FavoriteBorder } from "@material-ui/icons";

type Props = {

};

const Users: React.FC<Props> = (props) => {
  const { id }: any = useParams();
  const [urlAvatar, setUrlAvatar] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [user, setUser] = useState<User>();
  const [userLikes, setUserLikes] = useState<any[]>([]);
  const classes = useStyles();
  const [posts, setPosts] = useState<any[]>([]);
  let userLikeArr = [];
  useEffect(() => {
    getUser(id)
      .then((response) => {
        if (response.data) {
          setUrlAvatar(response.data.urlAvatar);
          setUserName(response.data.userName);
          setEmail(response.data.email);
          // urlAvatar = response.data.urlAvatar;
          console.log(response.data);
          setUser(response.data);
          console.log(user);
        }
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      ); 
    getPosts(id)
      .then((response) => {
        const resp = response;
        userLikeArr = response.data.userLikes;
        setPosts(resp.data.posts);
        setUserLikes(resp.data.userLikes);
        console.log(userLikeArr);
        // console.log(userLikes);
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }, [])

  return (
    <Container component="main" maxWidth="sm">
      <Grid container spacing={5}>
        <Grid item>
          <Avatar src={urlAvatar} className={classes.large} />
        </Grid>
        <Grid item>
          <Typography>User Name:{` ${userName}`}</Typography>
          <Typography>Email:{` ${email}`}</Typography>
        </Grid>
      </Grid>

      <ul >
        {posts &&
          posts.map((post: any, index: number) => (
            <ListItem
              className={classes.list}
              divider
              key={index}>
              <Paper className={classes.paper}>
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item xs>
                    <Typography>{post.post}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              <FormControlLabel
                
                control={<Checkbox icon={<FavoriteBorder />}  checkedIcon={<Favorite />} name="checkedH" />}
                label={post.likes + " " + post.createdAt.slice(0,10)}
              />
            </ListItem>
          ))}
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
      maxWidth: 400,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
    },
  }),
);

export default Users;