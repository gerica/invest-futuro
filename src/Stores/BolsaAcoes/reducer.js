import { createReducer } from 'reduxsauce';
import { BolsaAcoesTypes } from './actions';

const INITIAL_STATE = {
  loading: false,
  error: null,
  message: null,
  listaPapeisCotacaoDiaOrigin: null,
  listaPapeisCotacaoDia: null,
  listaPapeis: null,
  dtUltimoPregao: null
};

// Geral
export const request = (state = INITIAL_STATE) => ({ ...state, loading: true });
export const success = (state = INITIAL_STATE, { message }) => ({
  ...state,
  loading: false,
  message
});
export const failure = (state = INITIAL_STATE, { error }) => ({
  ...state,
  loading: false,
  error
});

// Reset
export const resetRedux = (state = INITIAL_STATE) => ({
  ...state,
  error: null,
  message: null,
  done: false
});

// FETCH
export const fetchListaPapeisCotacaoDiaSuccess = (
  state = INITIAL_STATE,
  { listaPapeisCotacaoDia }
) => {
  let dtUltimoPregao;
  if (listaPapeisCotacaoDia && listaPapeisCotacaoDia.length > 0) {
    dtUltimoPregao = listaPapeisCotacaoDia[0].cotacao.latest_trading_day;
  }
  return {
    ...state,
    loading: false,
    listaPapeisCotacaoDia,
    listaPapeisCotacaoDiaOrigin: listaPapeisCotacaoDia,
    dtUltimoPregao,
    error: null
  };
};

export const agruparPapeis = (state = INITIAL_STATE) => {
  const { listaPapeisCotacaoDia } = state;
  const result = [];

  if (listaPapeisCotacaoDia && listaPapeisCotacaoDia.length > 0) {
    listaPapeisCotacaoDia.forEach(e => {
      const papel = result.find(r => r.papel === e.papel);
      if (!papel) {
        result.push({
          ...e,
          precos: [e.preco],
          qtdTotal: parseInt(e.quantidade, 10)
        });
      } else {
        papel.precos.push(e.preco);
        papel.qtdTotal += parseInt(e.quantidade, 10);
        // result.push({ ...e, precoMedio: e.preco, qtdTotal: e.quantidade });
      }
    });
  }

  if (result.length > 0) {
    result.forEach(r => {
      const sum = r.precos.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
      // eslint-disable-next-line no-param-reassign
      r.precoMedio = sum / r.precos.length;
    });
  }
  return {
    ...state,
    listaPapeisCotacaoDia: result
  };
};

export const desagruparPapeis = (state = INITIAL_STATE) => {
  const { listaPapeisCotacaoDiaOrigin } = state;
  return {
    ...state,
    listaPapeisCotacaoDia: listaPapeisCotacaoDiaOrigin
  };
};

export const fetchPapeisPorUserSuccess = (
  state = INITIAL_STATE,
  { listaPapeis }
) => ({ ...state, loading: false, listaPapeis, error: null });

const localReducer = createReducer(INITIAL_STATE, {
  // RESET
  [BolsaAcoesTypes.RESET_REDUX]: resetRedux,
  [BolsaAcoesTypes.SUCCESS]: success,
  [BolsaAcoesTypes.FAILURE]: failure,

  // Save
  [BolsaAcoesTypes.SAVE_PAPEL_REQUEST]: request,

  // Delete
  [BolsaAcoesTypes.DELETE_PAPEL_REQUEST]: request,

  // Fetch papeis por user
  [BolsaAcoesTypes.FETCH_PAPEIS_POR_USER_REQUEST]: request,
  [BolsaAcoesTypes.FETCH_PAPEIS_POR_USER_SUCCESS]: fetchPapeisPorUserSuccess,

  // Fetch
  [BolsaAcoesTypes.FETCH_LISTA_PAPEIS_COTACAO_DIA_REQUEST]: request,
  [BolsaAcoesTypes.FETCH_LISTA_PAPEIS_COTACAO_DIA_SUCCESS]: fetchListaPapeisCotacaoDiaSuccess,

  [BolsaAcoesTypes.AGRUPAR_PAPEIS]: agruparPapeis,
  [BolsaAcoesTypes.DESAGRUPAR_PAPEIS]: desagruparPapeis
});

export default localReducer;
