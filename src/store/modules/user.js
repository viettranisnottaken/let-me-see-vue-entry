import RepositoryFactory from '@/repositories/factory.js';

export const user = {
  state: {
    users: [],
    params: {
      per: 10,
      page: 1,
    },
    genders: {
      0: 'Male',
      1: 'Female',
      2: 'Other',
    },
    totalPages: 0,
    schools: [],
  },
  getters: {
    gendersForForms: state => {
      let gendersForForms = [];
      Object.keys(state.genders).forEach(key => {
        gendersForForms.push({ text: state.genders[key], value: key });
      });

      return gendersForForms;
    },

    schoolsForForms: state => {
      return state.schools.map(school => {
        return { text: school.name, value: school.id };
      });
    },
  },
  mutations: {
    storeUsers(state, data) {
      state.users = data;
    },
    storeParams(state, params) {
      state.params = Object.assign(state.params, params);
    },
    storeTotalPages(state, data) {
      state.totalPages = data;
    },
    storeSchools(state, data) {
      state.schools = data;
    },
    addCreatedUserToStore(state, data) {
      state.users.push(data);
    },
    updateUser(state, data) {
      let userIndex = state.users.findIndex(user => user.id == data.id);

      state.users.splice(userIndex, 1, data);
    },
    deleteUser(state, data) {
      let userIndex = state.users.findIndex(user => user.id == data.id);

      state.users.splice(userIndex, 1);
    },
    resetSearchParams(state) {
      state.params = Object.assign(
        {},
        { page: state.params.page, per: state.params.per }
      );

      console.log(state.params);
    },
  },
  actions: {
    async fetchAllUsers({ commit }, params) {
      try {
        const data = await RepositoryFactory.index('user', params);
        commit('storeUsers', data.data.users);
        commit('storeTotalPages', data.data.total_pages);
        commit('storeSchools', data.data.schools);
      } catch (error) {
        console.log(error);
      }
    },

    async createUser({ commit }, params) {
      try {
        const data = await RepositoryFactory.create('user', params);
        commit('addCreatedUserToStore', data.data);
      } catch (error) {
        console.log(error);
      }
    },

    async updateUser({ commit }, params) {
      try {
        const data = await RepositoryFactory.update('user', params);
        commit('updateUser', data.data);
      } catch (error) {
        console.log(error);
      }
    },

    async deleteUser({ commit }, params) {
      try {
        const data = await RepositoryFactory.destroy('user', params);
        commit('deleteUser', data.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
