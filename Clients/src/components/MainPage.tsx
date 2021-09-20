import React, { useState } from 'react';
import { createTheme, IconButton, InputAdornment, makeStyles, TextField, ThemeProvider } from '@material-ui/core';
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import Header from './Header';
import FeaturedPost from './FeaturedPost';
import Footer from './Footer';
import Pagination from '@material-ui/lab/Pagination';
import { Container, CssBaseline, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { getUserPostList } from '../api/userApi';

const theme = createTheme();

type Props = {

};

const MainPage: React.FC<Props> = (props) => {

  const classes = useStyles();
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const postsOnPage = 5;

  useEffect(() => {
    getUserPostList()
      .then((response) => {
        setFeaturedPosts(response.data);
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }, [])

  const handleChange = (event: object, page: number) => {
    setPage(page);
  };

  const handleClick = () => {
    return
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.container}>
        <Header title="Blog" />
        <Grid >
          <TextField
            label="Search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClick}>
                    <SearchSharpIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid className={classes.main} style={{ maxHeight: '65vh', overflow: 'auto' }}>
          {/* <Grid spacing={1} direction='column' alignItems='center' > */}
          {featuredPosts
            ? featuredPosts.slice((page - 1) * postsOnPage, page * postsOnPage).map((post) => (
              <FeaturedPost key={post.title} post={post} />
            )) : <h1>Empty...</h1>
          }
          {/* </Grid> */}
        </Grid>
        <Grid className={classes.pagination}>
          <Pagination
            count={Math.ceil(featuredPosts.length / postsOnPage)}
            color="primary"
            onChange={handleChange}
          />
        </Grid>
        <Footer
          title="Footer"
          description="Something here to give the footer a purpose!"
        />
      </Container>
    </ThemeProvider>
  );
}

export default MainPage;

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    // margin: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  main: {
    // flexGrow: 1,
    alignSelf: 'center',
    marginTop: theme.spacing(2),
  },
  pagination: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));
