import { takeLatest, all, call, put } from 'redux-saga/effects';
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

function* fetchCotacaoPorPapel(papel) {
  const url = `${GLOBAL_QUOTE}&symbol=${papel}&apikey=${KEY}`;
  // const url =
  //   'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo';
  // eslint-disable-next-line no-undef
  const ReadableStream = yield call(fetch, url);
  const response = yield ReadableStream.json();
  return response;
}

function* fetchDadosPapel(papel) {
  const dadosPapel = yield fetchCotacaoPorPapel(papel);
  if (
    !dadosPapel ||
    !dadosPapel['Global Quote'] ||
    !dadosPapel['Global Quote']['01. symbol']
  ) {
    throw new Error(`Não existe nenhum papel com o nome informado: ${papel}`);
  }
  return dadosPapel;
}

function* saveCotacaoPapel(payload) {
  const obj = parceAlphavantageObj(payload);
  const tradingDay = yield call(
    [FbPapelService, FbPapelService.getByTradingDay],
    obj
  );
  if (!tradingDay || tradingDay.length === 0) {
    yield call([FbPapelService, FbPapelService.save], obj);
  }
}

/**
 * Recuperar pet por usuário
 * @param {user} param0
 */
function* fetchCotacaoRequest({ papel }) {
  try {
    const response = yield* fetchCotacaoPorPapel(papel);

    yield put(BolsaAcoesActions.fetchCotacaoSuccess(response));
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

    const dadosPapel = yield* fetchDadosPapel(dados.papel);
    yield* saveCotacaoPapel(dadosPapel);

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

export function* watchFetchCotacaoRequest() {
  yield takeLatest(BolsaAcoesTypes.FETCH_COTACAO_REQUEST, fetchCotacaoRequest);
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
  yield all([watchFetchCotacaoRequest()]);
  yield all([watchSavePapelRequest()]);
  yield all([watchfetchPapeisPorUserRequest()]);
  yield all([watchDeletePapelRequest()]);
}
