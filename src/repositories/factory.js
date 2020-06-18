import UserRepository from './userRepository';

const repositories = {
  user: UserRepository,
};

export default {
  index: (name, request) => repositories[name].index(request),
  new: name => repositories[name].new(),
  create: (name, request) => repositories[name].create(request),
  edit: (name, request) => repositories[name].edit(request),
  update: (name, request) => repositories[name].update(request),
  destroy: (name, request) => repositories[name].destroy(request),
};
