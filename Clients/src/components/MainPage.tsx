import React, { useState, useEffect } from 'react';
import { getUserPostList } from '../api/userApi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { postFilter, User } from "../redux/userSlice";

import {
  createTheme,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  ThemeProvider,
  Container,
  CssBaseline,
  Grid
} from '@material-ui/core';
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import Pagination from '@material-ui/lab/Pagination';

import Header from './Header';
import FeaturedPost from './FeaturedPost';
import AlertComponent from "./AlertComponent";

const theme = createTheme();

type Post = {
    createdAt: string,
    post: string,
    title: string,
    id: number,
    userId: number,
    User: User,
}

type Props = {

};

const MainPage: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const stateFilter = useAppSelector(({ user }) => user.filter);
  const classes = useStyles();
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const postsOnPage = 5;
  const [countPosts, setCountPosts] = useState<number>(0);
  const [valueFilter, setValueFilter] = useState<string>(stateFilter);
  const [alert, setAlert] = useState<
  { typeAlert: number, messageAlert: string }
>({ typeAlert: 200, messageAlert: '' });

  useEffect(() => {
    getUserPostList(page, stateFilter)
      .then((response) => {
        setFeaturedPosts(response.data.posts);
        setCountPosts(response.data.countPosts);
      })
      .catch((err) => {
        setAlert({typeAlert: 400, messageAlert: err.message});
      })
  }, [page, stateFilter])

  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
    getUserPostList(page, stateFilter)
      .then((response) => {
        setFeaturedPosts(response.data.posts);
        setCountPosts(response.data.countPosts);
      })
      .catch((err) => {
        setAlert({typeAlert: 400, messageAlert: err.message});
      })
  };

  const handleClickFilter = () => {
    dispatch(postFilter(valueFilter));
    getUserPostList(page, valueFilter)
      .then((response) => {
        setFeaturedPosts(response.data.posts);
        setCountPosts(response.data.countPosts);
      })
      .catch((err) => {
        setAlert({typeAlert: 400, messageAlert: err.message});
      })
  }

  const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueFilter(event.target.value);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.container}>
        <Header title="Blog" />
        <AlertComponent show={setAlert} alert={alert} />
        <Grid >
          <TextField
            label="Search"
            value={valueFilter}
            onChange={handleChangeFilter}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickFilter}>
                    <SearchSharpIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid className={classes.main} style={{ maxHeight: '65vh', overflow: 'auto' }}>
          {featuredPosts
            ? featuredPosts
              .map((post) => (
                <FeaturedPost key={post.id} post={post} />
              )) : <h1>Empty...</h1>
          }
        </Grid>
        <Grid className={classes.pagination}>
          <Pagination
            count={Math.ceil(countPosts / postsOnPage)}
            color="primary"
            onChange={handleChange}
          />
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default MainPage;

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    alignSelf: 'center',
    marginTop: theme.spacing(2),
  },
  pagination: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));
