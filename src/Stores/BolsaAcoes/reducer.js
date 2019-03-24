import { createReducer } from 'reduxsauce';
import { BolsaAcoesTypes } from './actions';

const INITIAL_STATE = {
  loading: false,
  error: null,
  message: null,
  listaPapeisCotacaoDia: null,
  listaPapeis: null
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
) => ({ ...state, loading: false, listaPapeisCotacaoDia, error: null });

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
  [BolsaAcoesTypes.FETCH_LISTA_PAPEIS_COTACAO_DIA_SUCCESS]: fetchListaPapeisCotacaoDiaSuccess
});

export default localReducer;
