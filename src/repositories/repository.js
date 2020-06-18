import axios from 'axios';

const baseURL = 'https://sheltered-temple-61929.herokuapp.com/';

export default axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
