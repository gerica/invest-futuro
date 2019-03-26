import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { IntlProvider, addLocaleData } from 'react-intl';
import pt from 'react-intl/locale-data/pt';

import MiniDrawer from './Components/Drawer/MiniDrawer';
import PerfilPage from './Containers/Perfil';
import CarteiraPage from './Containers/Carteira';
import HomePage from './Containers/Home';
import configureStore from './Stores';
import MyTheme from './muiTheme';
import LoginPage from './Containers/Login';
import {
  ROUTER_PERFIL,
  ROUTER_LOGIN,
  ROUTER_HOME,
  ROUTER_DEFAULT,
  ROUTER_LOGIN_PARAMS,
  ROUTER_CARTEIRA
} from './Utils/constants';

addLocaleData([...pt]);

const { store, persistor } = configureStore();
function App() {
  return (
    <Provider store={store}>
      <IntlProvider locale="pt">
        <PersistGate loading={null} persistor={persistor}>
          <MuiThemeProvider theme={MyTheme}>
            <Router>
              <MiniDrawer>
                {/* <Header /> */}
                <Switch>
                  <Route path={ROUTER_CARTEIRA} component={CarteiraPage} />
                  <Route path={ROUTER_PERFIL} component={PerfilPage} />
                  <Route exact path={ROUTER_LOGIN} component={LoginPage} />
                  <Route path={ROUTER_LOGIN_PARAMS} component={LoginPage} />
                  <Route path={ROUTER_HOME} component={HomePage} />
                  <Route exact path={ROUTER_DEFAULT} component={HomePage} />
                  {/* <Route path="/ccc" component={PerfilPage} /> */}
                </Switch>
              </MiniDrawer>
            </Router>
          </MuiThemeProvider>
        </PersistGate>
      </IntlProvider>
    </Provider>
  );
}

export default App;
