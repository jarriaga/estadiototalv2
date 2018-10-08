export default {
    getUser: state => {
      return state.user;
    },
    isAuth: state => {
      return (state.auth && state.user.email) ? true : false;
    },
    getProgressUpload: state => {
      return state.progressUpload;
    },
    getEndpoint: state => {
      return state.endpoint;
    },
    getWritterArticles: state => {
      return state.writter.articles;
    },
  } //End getters