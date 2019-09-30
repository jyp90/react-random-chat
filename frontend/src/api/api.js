import axios from 'axios';

const SERVER_URL = 'http://localhost:8080/';

const createUserApi = (user) => {
  return axios({
    method: 'post',
    url: `${SERVER_URL}join`,
    data: {
      user
    }
  });
};

export {
  createUserApi
};
