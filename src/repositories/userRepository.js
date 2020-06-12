import Repository from './repository';

const resource = 'users';

export default {
  index(request) {
    return Repository.get(`/api/v1/${resource}`, { params: { ...request } });
  },

  new() {
    return Repository.get(`/api/v1/${resource}/new`);
  },

  create(request) {
    return Repository.post(`/api/v1/${resource}`, request);
  },

  edit(request) {
    return Repository.get(`/api/v1/${resource}/edit`, request);
  },

  update(request) {
    return Repository.put(`/api/v1/${resource}`, request);
  },

  destroy(request) {
    return Repository.delete(`/api/v1/${resource}`, request);
  },
};
