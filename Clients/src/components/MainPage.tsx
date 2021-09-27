import React, { useState } from 'react';
import { createTheme, IconButton, InputAdornment, makeStyles, TextField, ThemeProvider } from '@material-ui/core';
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import Header from './Header';
import FeaturedPost from './FeaturedPost';
import Pagination from '@material-ui/lab/Pagination';
import { Container, CssBaseline, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { getUserPostList } from '../api/userApi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { postFilter } from "../redux/userSlice";
import AlertComponent from "./AlertComponent";

const theme = createTheme();

type Props = {

};

const MainPage: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const stateFilter = useAppSelector(({ user }) => user.filter);
  const classes = useStyles();
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const postsOnPage = 5;
  const [countPosts, setCountPosts] = useState<number>(0);
  const [valueFilter, setValueFilter] = useState<string>(stateFilter);
  const [typeMessage, setTypeMesssage] = useState<number>(200);
  const [textMessage, setTextMessage] = useState<string>('');

  useEffect(() => {
    getUserPostList(page, stateFilter)
      .then((response) => {
        setFeaturedPosts(response.data.posts);
        setCountPosts(response.data.countPosts);
      })
      .catch((err) => {
        setTypeMesssage(400);
        setTextMessage(err.message);
        console.log(`Failed request PostList ${err}`)
      }
      )
  }, [])

  const handleChange = (event: object, page: number) => {
    setPage(page);
    getUserPostList(page, stateFilter)
      .then((response) => {
        setFeaturedPosts(response.data.posts);
        setCountPosts(response.data.countPosts);
      })
      .catch((err) => {
        setTypeMesssage(400);
        setTextMessage(err.message);
        console.log(`Failed request pagination ${err}`)
      }
      )
  };

  const handleClickFilter = () => {
    dispatch(postFilter(valueFilter));
    getUserPostList(page, valueFilter)
      .then((response) => {
        setFeaturedPosts(response.data.posts);
        setCountPosts(response.data.countPosts);
      })
      .catch((err) => {
        setTypeMesssage(400);
        setTextMessage(err.message);
        console.log(`Failed request pagination ${err}`)
      }
      )
  }

  const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueFilter(event.target.value);
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.container}>
        <Header title="Blog" />
        <AlertComponent show={setTextMessage} typeAlert={typeMessage} messageAlert={textMessage} />
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
  footer: {
    flex: 'auto',
  }
}));
