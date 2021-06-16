import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';

import state from './state';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
  },
  state,
  getters,
  mutations
});

export default store;
