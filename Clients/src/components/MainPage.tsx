import React, { useState } from 'react';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import Header from './Header';
import FeaturedPost from './FeaturedPost';
import Footer from './Footer';
import Pagination from '@material-ui/lab/Pagination';
import { Container, CssBaseline, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { getUserPostList } from '../api/userApi';

// import MainFeaturedPost from './MainFeaturedPost';
// import Main from './Main';
// import Sidebar from './Sidebar';

const theme = createTheme();

type Props = {

};

const MainPage: React.FC<Props> = (props) => {

  const classes = useStyles();
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const handleChange = (event: object, page: number) => {
    setPage(page);
  };

  useEffect(() => {
    getUserPostList()
      .then((response) => {
        setFeaturedPosts(response.data);
        console.log(featuredPosts);
      })
      .catch((err) =>
        console.log(`Failed request ${err}`)
      )
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.container}>
        <Header title="Blog" />
        <Grid className={classes.main} >
          {/* <Grid> */}
          <Grid container spacing={1} direction='column' alignItems='center' >
          {/* <Grid style={{ maxHeight: '70vh', overflow: 'auto' }}> */}
            {featuredPosts
              ? featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              )) : <h1>Empty...</h1>
            }
          {/* </Grid> */}
          </Grid>
          <Grid className={classes.pagination}>
            <Pagination 
            count={Math.ceil(featuredPosts.length/3)} 
            color="primary" 
            onChange={handleChange}
            />
          </Grid>
          {/* </Grid>  */}

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
    flexGrow: 1,
  },
  pagination: {
    marginTop: theme.spacing(8),
    display: 'flex',
    justifyContent: 'center',
  },
}));
