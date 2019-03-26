/* eslint-disable prefer-destructuring */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from '@material-ui/core';
// import classnames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import red from '@material-ui/core/colors/red';
import { withStyles } from '@material-ui/core/styles';
// import moment from 'moment';

import BolsaAcoesActions from '../../Stores/BolsaAcoes/actions';
import CustomizedProgress from '../../Components/Progress/CustomizedProgress';
import * as selectorsSession from '../../Stores/Session/selector';
import * as selectorsBolsaAcoes from '../../Stores/BolsaAcoes/selector';
// import { ViewCards } from './styles';
import CustomizedSnackbars from '../../Components/Snackbars/CustomizedSnackbars';
import TitlePage from '../../Components/AppBar/TitlePage';
import Routes from '../../Utils/routes';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  card: {
    // maxWidth: 400,
    width: 200,
    height: 260,
    margin: 5
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex',
    justifyContent: 'center'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    // backgroundColor: red[500]
  }
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

class HomePage extends Component {
  componentWillMount() {
    const { onFetchPapeisPorUserCotacaoRequest, reset, user } = this.props;
    if (user) {
      onFetchPapeisPorUserCotacaoRequest(user);
      reset();
    }
  }

  getRacaDescricao(raca) {
    if (raca) {
      return raca.length > 100 ? `${raca.substr(0, 10)}...` : raca;
    }
    return '';
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleWhatsApp = contato => {
    if (contato) {
      const text = 'Gostaria de adotar seu pet.';
      const link = `https://api.whatsapp.com/send?phone=55${contato}&text=${text}`;
      window.open(link, '_blank');
    }
  };

  renderCards() {
    const { classes, listaPapeisCotacaoDia } = this.props;
    const GlobalQuote = listaPapeisCotacaoDia['Global Quote'];
    //     01. symbol: "MSFT"
    // 02. open: "119.5000"
    // 03. high: "119.5890"
    // 04. low: "117.0400"
    // 05. price: "117.0500"
    // 06. volume: "33624528"
    // 07. latest trading day: "2019-03-22"
    // 08. previous close: "120.2200"
    // 09. change: "-3.1700"
    // 10. change percent: "-2.6368%"

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardHeader title={`Papel: ${GlobalQuote['01. symbol']}`} />

          <CardContent>
            <Typography component="div">
              Abertura: {GlobalQuote['02. open']}
            </Typography>
            <Typography component="div">
              Máximo: {GlobalQuote['03. high']}
            </Typography>
            <Typography component="div">
              Mínimo: {GlobalQuote['04. low']}
            </Typography>
            <Typography component="div">
              Volume: {GlobalQuote['06. volume']}
            </Typography>
            <Typography component="div">
              Dia: {GlobalQuote['07. latest trading day']}
            </Typography>
            <Typography component="div">
              Fechamento: {GlobalQuote['08. previous close']}
            </Typography>
            <Typography component="div">
              Variação: {GlobalQuote['09. change']}
            </Typography>
            <Typography component="div">
              Variação(%): {GlobalQuote['10. change percent']}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  renderTablePapeis() {
    const { classes, listaPapeisCotacaoDia } = this.props;
    if (!listaPapeisCotacaoDia || listaPapeisCotacaoDia.length === 0) {
      return null;
    }

    return (
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Papel</CustomTableCell>
              <CustomTableCell align="right">Custódia</CustomTableCell>
              <CustomTableCell align="right">Preço</CustomTableCell>
              {/* <CustomTableCell align="right">Data Compra</CustomTableCell>
              <CustomTableCell align="right">Data Cotacao</CustomTableCell> */}
              <CustomTableCell align="right">Valor Fechamento</CustomTableCell>
              <CustomTableCell align="right">Variação</CustomTableCell>
              <CustomTableCell align="right">Investimento</CustomTableCell>
              <CustomTableCell align="right">Valor de Mercado</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listaPapeisCotacaoDia.map((row, index) => (
              <TableRow
                className={classes.row}
                key={index}
                onClick={() => this.handleOpenDesc(row)}
              >
                <CustomTableCell component="th" scope="row">
                  {row.papel.toLocaleString('pt-BR')}
                </CustomTableCell>
                <CustomTableCell align="right">
                  {row.quantidade}
                </CustomTableCell>
                <CustomTableCell align="right">{row.preco}</CustomTableCell>
                {/* <CustomTableCell align="right">
                  {moment(row.dtaOperacao).format('DD/MM/YYYY')}
                </CustomTableCell>
                <CustomTableCell align="right">
                  {moment(row.cotacao.latest_trading_day).format('DD/MM/YYYY')}
                </CustomTableCell> */}
                <CustomTableCell align="right">
                  {row.cotacao.previous_close}
                </CustomTableCell>
                <CustomTableCell align="right">
                  {row.cotacao.change} / {row.cotacao.change_percent}
                </CustomTableCell>
                <CustomTableCell align="right">
                  {row.quantidade * row.preco}
                </CustomTableCell>
                <CustomTableCell align="right">
                  {(row.quantidade * row.cotacao.previous_close).toLocaleString(
                    'pt-BR'
                  )}
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  render() {
    const { loading, error } = this.props;
    const routerHome = Routes.find(r => r.order === 1);

    return (
      <Fragment>
        <TitlePage routerMain={routerHome} />
        {error ? (
          <CustomizedSnackbars message={error.message} variant="error" />
        ) : null}
        {loading ? <CustomizedProgress /> : null}
        {this.renderTablePapeis()}
        {/* <ViewCards>{this.renderCards()}</ViewCards> */}
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  onFetchPapeisPorUserCotacaoRequest: PropTypes.func,
  loading: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  listaPapeisCotacaoDia: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

HomePage.defaultProps = {
  onFetchPapeisPorUserCotacaoRequest: null,
  loading: null,
  listaPapeisCotacaoDia: null,
  error: null
};

const mapStateToProps = createStructuredSelector({
  // form: selectors.selectorForm(),
  listaPapeisCotacaoDia: selectorsBolsaAcoes.selectorListaPapeisCotacaoDia(),
  loading: selectorsBolsaAcoes.selectorLoading(),
  error: selectorsBolsaAcoes.selectorError(),
  user: selectorsSession.selectorSessionUser()
});

const mapDispatchToProps = dispatch => ({
  fetchCotacaoRequest: papel =>
    dispatch(BolsaAcoesActions.fetchCotacaoRequest(papel)),
  onFetchPapeisPorUserCotacaoRequest: payload =>
    dispatch(BolsaAcoesActions.fetchListaPapeisCotacaoDiaRequest(payload)),
  reset: () => dispatch(BolsaAcoesActions.resetRedux())
});

const HomePageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

export default withStyles(styles)(HomePageRedux);
