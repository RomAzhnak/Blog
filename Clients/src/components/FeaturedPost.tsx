// import { Avatar, Card, CardActionArea, CardContent, CardHeader, CardMedia, Collapse, Grid, IconButton, Typography } from '@material-ui/core';
// import * as React from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
// import CardMedia from '@material-ui/core/CardMedia';

interface FeaturedPostProps {
  post: {
    createdAt: string;
    post: string;
    image: string;
    imageLabel: string;
    title: string;
    id: number;
    userId: number;
    User: any;
  };
}

export default function FeaturedPost(props: FeaturedPostProps) {
  const { post } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
      // variant="h1" 
      // component="h5"
      className={classes.card}
        action={
          <Link to={`/users/:${post.userId}`} >
          <Avatar aria-label="recipe" className={classes.avatar} src={post.User.urlAvatar}>
          </Avatar>
          </Link>
        }
        titleTypographyProps={{variant:'h6' }}
        title={post.title}
        subheader={post.createdAt.slice(0,10)}
      />
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {post.post}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );

  // return (
  //   <Grid item xs={12} md={8}>
  //     <CardActionArea component="a" href="#">
  //       <Card>   {/* sx={{ display: 'flex' }}> */}
  //         <CardContent>   {/* sx={{ flex: 1 }}> */}
  //           <Typography component="h2" variant="h5">
  //             {post.title}
  //           </Typography>
  //           <Typography variant="subtitle1"> {/*  color="text.secondary"> */}
  //             {post.date}
  //           </Typography>
  //           <Typography variant="subtitle1" paragraph>
  //             {post.description}
  //           </Typography>
  //           <Typography variant="subtitle1" color="primary">
  //             Continue reading...
  //           </Typography>
  //         </CardContent>
  //         {/* <CardMedia
  //           component="img"
  //           sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
  //           image={post.image}
  //           alt={post.imageLabel}
  //         /> */}
  //       </Card> 
  //     </CardActionArea>
  //   </Grid>
  // );
}

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 900,
    width: 600, 
    marginTop: 25,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    // padding: 10 
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    // backgroundColor: red[500],
    width: theme.spacing(8),
    height: theme.spacing(8),
    // marginLeft: theme.spacing(10),
  },
}));
