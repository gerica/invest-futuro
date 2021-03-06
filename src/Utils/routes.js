import { Home, AccountCircle, AccountBalanceWallet } from '@material-ui/icons';
import HomePage from '../Containers/Home';
import ProfilPage from '../Containers/Perfil';
import LoginPage from '../Containers/Login';
import CarteiraPage from '../Containers/Carteira';
import {
  ROUTER_HOME,
  ROUTER_PERFIL,
  ROUTER_LOGIN,
  ROUTER_CARTEIRA
} from './constants';

const Routes = [
  {
    order: 1,
    path: ROUTER_HOME,
    sidebarName: 'Home',
    navbarName: 'Home',
    icon: Home,
    component: HomePage,
    selected: false
  },
  {
    order: 2,
    path: ROUTER_CARTEIRA,
    sidebarName: 'Cateira',
    navbarName: 'Carteira',
    icon: AccountBalanceWallet,
    component: CarteiraPage,
    selected: false
  },
  {
    order: 3,
    path: ROUTER_PERFIL,
    sidebarName: 'Perfil',
    navbarName: 'Perfil',
    icon: AccountCircle,
    component: ProfilPage,
    selected: false
  },
  {
    order: 99,
    path: ROUTER_LOGIN,
    sidebarName: 'Login',
    navbarName: 'Login',
    icon: AccountCircle,
    component: LoginPage,
    selected: false
  }
];

export default Routes;
