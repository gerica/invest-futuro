import { takeLatest, all, call, put } from 'redux-saga/effects';
import moment from 'moment';

import BolsaAcoesActions, { BolsaAcoesTypes } from './actions';
// import FbListaDoacaoService from '../../Service/FbListaDoacaoService';
import { MSG_001 } from '../../Utils/constants';
import { GLOBAL_QUOTE, KEY } from '../../Utils/alphavantage';
import FbUsuarioPapelService from '../../Service/FbUsuarioPapelService';
import FbPapelService from '../../Service/FbCotacaoPapelService';

function parceAlphavantageObj(payload) {
  const quote = payload['Global Quote'];
  const obj = {
    symbol: quote['01. symbol'],
    open: quote['02. open'],
    high: quote['03. high'],
    low: quote['04. low'],
    price: quote['05. price'],
    volume: quote['06. volume'],
    latest_trading_day: quote['07. latest trading day'],
    previous_close: quote['08. previous close'],
    change: quote['09. change'],
    change_percent: quote['10. change percent']
  };
  return obj;
}

function* fetchDadosPapel(papel) {
  const url = `${GLOBAL_QUOTE}&symbol=${papel}&apikey=${KEY}`;
  // const url =
  //   'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo';
  // eslint-disable-next-line no-undef
  const ReadableStream = yield call(fetch, url);
  const dadosPapel = yield ReadableStream.json();
  if (
    !dadosPapel ||
    !dadosPapel['Global Quote'] ||
    !dadosPapel['Global Quote']['01. symbol']
  ) {
    throw new Error(`Não existe nenhum papel com o nome informado: ${papel}`);
  }
  return dadosPapel;
}

function* gerenciarCotacaoPapel(payload) {
  try {
    const tradingDay = yield call(
      [FbPapelService, FbPapelService.getByTradingDay],
      payload
    );
    if (!tradingDay || tradingDay.length === 0) {
      const objNaoFormatado = yield* fetchDadosPapel(payload.symbol);
      const objPapel = parceAlphavantageObj(objNaoFormatado);
      yield call([FbPapelService, FbPapelService.save], objPapel);
      return objPapel;
    }
    return tradingDay;
  } catch (err) {
    console.log({ err });
    throw new Error(err);
  }
}

/**
 * Recuperar pet por usuário
 * @param {user} param0
 */
function* fetchListaPapeisCotacaoDiaRequest({ payload }) {
  try {
    // const response = yield* fetchCotacaoPorPapel(papel);
    // console.log(payload);
    const values = yield call(
      [FbUsuarioPapelService, FbUsuarioPapelService.getByIdUser],
      payload
    );
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < values.length; index++) {
      const v = values[index];

      const temp = yield* gerenciarCotacaoPapel({
        symbol: v.papel,
        latest_trading_day: moment(new Date()).format('YYYY-MM-DD')
      });

      result.push({ cotacao: { ...temp }, ...v });
    }
    yield put(BolsaAcoesActions.fetchListaPapeisCotacaoDiaSuccess(result));
  } catch (err) {
    yield put(BolsaAcoesActions.failure(err));
  }
}

/**
 * Recuperar  por usuário
 * @param {user} param0
 */
function* fetchPapeisPorUserRequest({ user }) {
  try {
    const values = yield call(
      [FbUsuarioPapelService, FbUsuarioPapelService.getByIdUser],
      user
    );
    yield put(BolsaAcoesActions.fetchPapeisPorUserSuccess(values));
  } catch (err) {
    yield put(BolsaAcoesActions.failure(err));
  }
}

/**
 * Salvar papel do usuário
 */
function* savePapelRequest({ payload }) {
  try {
    // console.log(payload);
    const dados = { ...payload };
    if (!payload.papel.toUpperCase().endsWith('.SA')) {
      dados.papel = `${payload.papel.toUpperCase()}.SA`;
    } else {
      dados.papel = payload.papel.toUpperCase();
    }

    // const dadosPapel = yield* fetchDadosPapel(dados.papel);
    yield* gerenciarCotacaoPapel({
      symbol: dados.papel,
      latest_trading_day: moment(payload.dataOperacao).format('YYYY-MM-DD')
    });

    yield call([FbUsuarioPapelService, FbUsuarioPapelService.save], dados);
    yield put(
      BolsaAcoesActions.fetchPapeisPorUserRequest({ uid: payload.user })
    );
    yield put(BolsaAcoesActions.success(MSG_001));
  } catch (err) {
    yield put(BolsaAcoesActions.failure(err));
  }
}

/**
 * Apagar Papel
 */
function* deletePapelRequest({ payload }) {
  try {
    yield call([FbUsuarioPapelService, FbUsuarioPapelService.delete], payload);

    yield put(
      BolsaAcoesActions.fetchPapeisPorUserRequest({ uid: payload.user })
    );
    yield put(BolsaAcoesActions.success(MSG_001));
  } catch (err) {
    yield put(BolsaAcoesActions.failure(err));
  }
}

export function* watchFetchListaPapeisCotacaoDiaRequest() {
  yield takeLatest(
    BolsaAcoesTypes.FETCH_LISTA_PAPEIS_COTACAO_DIA_REQUEST,
    fetchListaPapeisCotacaoDiaRequest
  );
}

export function* watchSavePapelRequest() {
  yield takeLatest(BolsaAcoesTypes.SAVE_PAPEL_REQUEST, savePapelRequest);
}

export function* watchDeletePapelRequest() {
  yield takeLatest(BolsaAcoesTypes.DELETE_PAPEL_REQUEST, deletePapelRequest);
}

export function* watchfetchPapeisPorUserRequest() {
  yield takeLatest(
    BolsaAcoesTypes.FETCH_PAPEIS_POR_USER_REQUEST,
    fetchPapeisPorUserRequest
  );
}

export default function* petSaga() {
  yield all([watchFetchListaPapeisCotacaoDiaRequest()]);
  yield all([watchSavePapelRequest()]);
  yield all([watchfetchPapeisPorUserRequest()]);
  yield all([watchDeletePapelRequest()]);
}
