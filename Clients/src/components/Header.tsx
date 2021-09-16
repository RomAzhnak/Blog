import { Button, createStyles, IconButton, makeStyles, Toolbar, Typography, Theme } from '@material-ui/core';
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import * as React from 'react';
import { Link } from 'react-router-dom';


interface HeaderProps {
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
}

const Header = (props: HeaderProps) => {
  const { sections, title } = props;
  const classes = useStyles();

  return (
    <React.Fragment >
      <Toolbar  > {/* sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
        {/* <Button size="small">Subscribe</Button> */}
        <Typography
          // component="h2"
          variant="h5"
          color="inherit"
          // align="center"
          noWrap
          className={classes.root}
        // sx={{ flex: 1 }}
        >
          {/* {title} */}
        </Typography>
        <IconButton>
          <SearchSharpIcon />
        </IconButton>
        <Link to="/register" style={{ textDecoration: 'none', marginRight: 5 }} >
          <Button variant="contained" size="small" color="primary">
            Sign up
          </Button>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none' }}>        
          <Button variant="contained" size="small" color="primary">
            Sign in 
          </Button>
         </Link>   
              
      </Toolbar>
      {/* <Toolbar
        component="nav"
        variant="dense"
        // sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            className={classes.menuButton} 
            // sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar> */}
    </React.Fragment>
  );
}

export default Header;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,

    },
    menuButton: {
      // marginRight: theme.spacing(2),
      // justifyContent: 'space-between',
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }),
);