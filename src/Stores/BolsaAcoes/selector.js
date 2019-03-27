import { createSelector } from 'reselect';

const storeBolsaAcoes = state => state.bolsaAcoes;
const storeForm = state => state.form;

const selectorListaPapeisCotacaoDia = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.listaPapeisCotacaoDia
  );
const selectorLoading = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.loading
  );
const selectorError = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.error
  );
const selectorMessage = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.message
  );
const selectorListaPapeis = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.listaPapeis
  );
const selectorDtUltimoPregao = () =>
  createSelector(
    storeBolsaAcoes,
    store => store.dtUltimoPregao
  );

const selectorForm = () =>
  createSelector(
    storeForm,
    form => form
  );

export {
  selectorForm,
  selectorLoading,
  selectorError,
  selectorMessage,
  selectorListaPapeisCotacaoDia,
  selectorListaPapeis,
  selectorDtUltimoPregao
};
