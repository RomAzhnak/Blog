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
          <Grid container spacing={1} direction='column' alignItems='center'>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid className={classes.pagination}>
            <Pagination count={10} color="primary" />
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
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flexGrow: 1,
  },
  pagination: {
    marginTop: theme.spacing(8),
    display: 'flex',
    justifyContent: 'center',
  },
  // avatar: {
  //   margin: theme.spacing(1),
  //   backgroundColor: theme.palette.secondary.main,
  // },
  // form: {
  //   width: '100%', // Fix IE 11 issue.
  //   marginTop: theme.spacing(3),
  // },
  // submit: {
  //   margin: theme.spacing(3, 0, 2),
  // },
  // input: {
  //   display: "none",
  // },
  // large: {
  //   width: theme.spacing(25),
  //   height: theme.spacing(25),
  //   margin: 'auto',
  // }
}));
