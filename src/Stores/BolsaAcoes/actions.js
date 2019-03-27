import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  // GERAL
  resetRedux: [],
  success: ['message'],
  failure: ['error'],

  fetchListaPapeisCotacaoDiaRequest: ['payload'],
  fetchListaPapeisCotacaoDiaSuccess: ['listaPapeisCotacaoDia'],

  savePapelRequest: ['payload'],

  deletePapelRequest: ['payload'],

  fetchPapeisPorUserRequest: ['user'],
  fetchPapeisPorUserSuccess: ['listaPapeis'],

  agruparPapeis: [],
  desagruparPapeis: []
});

export const BolsaAcoesTypes = Types;
export default Creators;
