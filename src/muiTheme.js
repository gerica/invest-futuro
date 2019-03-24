import { createMuiTheme } from '@material-ui/core/styles';
import { green, teal, red, amber } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: {
    primary: { main: teal[600] },
    success: {
      backgroundColor: green[500],
      color: 'white'
    },
    warning: {
      backgroundColor: amber[500],
      color: 'white'
    },
    danger: {
      backgroundColor: red[500],
      color: 'white'
    }
  },
  typography: { useNextVariants: true }
});
