import { Box, Container, Link, Typography } from '@material-ui/core';
// import { createTheme, makeStyles} from '@material-ui/core';
// const theme = createTheme();

function Copyright() {
  return (
    <Typography variant="body2" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface FooterProps {
  description: string;
  title: string;
}

export default function Footer(props: FooterProps) {
  const { description, title } = props;

  return (
    <Box component="footer"  >
      <Container maxWidth="lg" 
      >
        <Typography
          variant="subtitle1"
          align="center"
          component="p"
        >
          {description}
        </Typography>
        <Copyright />
      </Container>
    </Box>
  );
}
