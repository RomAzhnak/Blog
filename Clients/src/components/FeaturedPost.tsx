import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../redux/userSlice';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


interface FeaturedPostProps {
  post: {
    createdAt: string;
    post: string;
    title: string;
    id: number;
    userId: number;
    User: User;
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
        className={classes.card}
        action={
          <Link to={`/users/:${post.userId}`} >
            <Avatar aria-label="recipe" className={classes.avatar} src={post.User.urlAvatar}>
            </Avatar>
          </Link>
        }
        titleTypographyProps={{ variant: 'h6' }}
        title={post.title}
        subheader={post.createdAt.slice(0, 10)}
      />
      <CardActions disableSpacing style={{ paddingTop: 0 }} > 
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
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
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    marginTop: 5,
  },
  card: {
    paddingBottom: 0 
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
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));
