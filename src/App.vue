<template>
  <div id="app">
    <AppNavbar />
    <main class="container">
      <h1 class="my-4">Users List</h1>
      <AppUsers />
    </main>
  </div>
</template>

<script>
import AppNavbar from './components/navbar/navbarComponent';
import AppUsers from './components//users/usersComponent';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppUsers,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>
