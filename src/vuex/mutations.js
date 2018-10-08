export default  {
    logout(state, payload) {
      state.user = payload;
      state.auth = "";
      state.writter.articles = [];
    },
    login(state, payload) {
      state.user = payload;
    },
    authLogin(state, auth) {
      state.auth = auth;
    },
    updateProfile(state, payload) {
      state.user = payload;
    },
    setProgressUpload(state, payload) {
      state.progressUpload = payload;
    },
    loadWritterArticles(state, payload) {
      state.writter.articles = payload;
    },
    showError(state,payload){
      state.alert = payload;
    }
  } //End mutations


