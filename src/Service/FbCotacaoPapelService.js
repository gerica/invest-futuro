import firebase from '../Utils/FirebaseUtils';

class FbCotacaoPapelService {
  constructor() {
    this.ref = firebase.firestore().collection('cotacaoPapel');
  }

  async save(payload) {
    try {
      const docUser = await this.ref.add(payload);
      const getUser = await docUser.get();
      return { ...getUser.data() };
    } catch (error) {
      throw error;
    }
  }

  async delete(payload) {
    try {
      await this.ref.doc(payload.idDoc).delete();
    } catch (error) {
      throw error;
    }
  }

  async update({
    user: {
      userCustom: { idDoc }
    },
    dados
  }) {
    try {
      await this.ref.doc(idDoc).update(dados);
    } catch (error) {
      throw error;
    }
  }

  async getByTradingDay(payload) {
    try {
      const fbUserPapel = await this.ref
        .where('symbol', '==', payload.symbol)
        .where('latest_trading_day', '==', payload.latest_trading_day)
        .get();
      const result = [];
      fbUserPapel.forEach(doc => {
        result.push({ idDoc: doc.id, ...doc.data() });
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async load({ id }) {
    try {
      const doc = await this.ref.doc(id).get();
      // var query = citiesRef.where("state", "==", "CA");
      if (doc.exists) {
        return { idDoc: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async fetchAll() {
    const result = [];
    await this.ref.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        result.push({ id: doc.id, ...doc.data() });
      });
    });
    return result;
  }
}

export default new FbCotacaoPapelService();
