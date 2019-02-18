import axios from 'axios'
        import store from './../store'

        var endpoint = "http://localhost:3000";
//var endpoint = "http://api.textoclick.com:3000";
axios.defaults.baseURL = endpoint;

export const endpoint = endpoint;

export const actions = {
    //*********** Load writter articles
    loadWritterArticles( {
    commit
    }) {
        return new Promise((resolve, reject) => {
            axios.post('/writter/articles/', {}, {
                headers: {
                    'x-access-token': store.state.auth
                }
            })
                    .then(response => {
                        commit('loadWritterArticles', response.data.articles);
                        resolve();
                    })
                    .catch(error => {
                        reject(error.response.data.error);
                    });
        });
    },
    login( {
    commit
    }, payload) {
        return new Promise((resolve, reject) => {
            axios.post('/login', payload)
                    .then((response) => {
                        commit('authLogin', response.data.token);
                        commit('login', response.data.user);
                        resolve();
                    })
                    .catch((error) => {
                        if (error.response.data.error == 'invalid-password' ||
                                error.response.data.error == 'user-not-found')
                            reject('El usuario/password es incorrecto');
                        else
                            reject('Ocurrio un error, intente nuevamente');
                    });
        });
    }, // ************ Login End
    logout( {
    commit
    }) {
        return new Promise((resolve, reject) => {
            commit('logout', {});
            resolve();
        });
    },
    tournamentList( {
    commit,
            payload
    }) {
        let vm = this;
        return new Promise((resolve, reject) => {
            axios.post('/tournament/list', payload, {
                headers: {
                    'x-access-token': store.state.auth
                }
            })
                    .then(response => {
                        resolve(response.data);
                    });
        });
    },
    updateProfile( {
    commit
    }, payload) {
        let vm = this;
        return new Promise((resolve, reject) => {
            axios.post('/user/profile/edit', payload, {
                headers: {
                    'x-access-token': store.state.auth
                }
            })
                    .then(response => {
                        commit('updateProfile', payload)
                        resolve();
                    }).catch(error => {
                reject();
            });
        }); //End Promise
    }, //End Method updateProfile
    uploadProfilePhoto( {
    commit
    }, payload) {
        let vm = this;
        return new Promise((resolve, reject) => {
            axios.post('/user/profile/photo', payload, {
                headers: {
                    'x-access-token': store.state.auth
                }
            })
                    .then(response => {
                        commit('updateProfile', response.data.user);
                        resolve(response.data.file);
                    }).catch(error => {
                reject('La imagen no pudo actualizarse');
            });
        });
    },
    updatePassword( {
    commit
    }, payload) {
        return new Promise((resolve, reject) => {
            //validation for password
            if (!payload.password || payload.password.length < 6) {
                return reject('Ingresa el password que contenga al menos 6 caracteres');
            }
            if (payload.confirmPassword != payload.password) {
                return reject('El password no coincide por favor confirma tu password correctamente');
            }
            //update password on backend
            axios.post('/user/password/update', {
                password: payload.password
            }, {
                headers: {
                    'x-access-token': store.state.auth
                }
            })
                    .then(response => {
                        resolve();
                    })
                    .catch(error => {
                        reject('El password no pudo ser actualizado, intenta nuevamente');
                    });
        }); //End Promise
    }, //End method updatePassword
    registerUser( {
    commit
    }, payload) {
        return new Promise((resolve, reject) => {
            let error = {};
            if (Object.keys(payload).length === 0) {
                error.confirmationError = error.emailInUse = error.displayNameError = error.displayUsernameError = 1;
                error.message = 'Por favor completa los datos del formulario para crear tu cuenta';
                return reject(error);
            }
            if (!payload.password || payload.password.length < 6) {
                error.message = 'Ingresa el password que contenga al menos 6 caracteres';
                error.confirmationError = 1;
                return reject(error);
            }
            if (!payload.username) {
                error.message = 'Ingresa un Username';
                error.displayUsernameError = 1;
                return reject(error);
            }
            // if (payload.confirmpassword != payload.password) {
            //   error.message = 'El password no coincide por favor confirma tu password correctamente';
            //   error.confirmationError = 1;
            //   return reject(error)
            // }
            let vm = this;
            //function to create the user in backend
            let createUser = function (payload) {
                axios.post('/user/signup', payload).then(function (response) {
                    resolve();
                }).catch(function (error) {
                    if (error.response.data.error == 'user-exists') {
                        reject({
                            message: 'El email ya esta registrado'
                        });
                    }
                    if (error.response.data.error == 'username-exists') {
                        reject({
                            message: 'El usuario ya esta registrado',
                            displayUsernameError: 1
                        });
                    }
                    reject({
                        message: error.response.data.error
                    });
                });
            }
            //create new user in backend
            axios.get('http://ip-api.com/json').then(function (response) {
                let geo = response.data;
                payload.country = geo.country;
                payload.city = geo.city;
                payload.state = geo.regionName;
                createUser(payload);
            }).catch(function (error) {
                createUser(payload);
            });
        });
    }, //End registerUser    
    saveArticle( {
    commit
    }, payload) {
        let vm = this;
        return new Promise((resolve, reject) => {
            axios.post('/article/upload/', payload, {
                headers: {
                    'x-access-token': store.state.auth
                }
            })
                    .then(response => {
                        resolve();
                    })
                    .catch(error => {
                        reject(error.response.data.error);
                    });
        });
    }, //End saveArticle
    getArticleInfo( {
    commit
    }, payload) {
        let vm = this;
        return new Promise((resolve, reject) => {
            axios.get(`/article/${payload.id}`, payload)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error.response.data.error);
                    });
        });
    },
    forgotPassword( {
    commit
    }, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/forgot-password/`,payload)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error.response.data.error);
            })
        });
    }, //End forgotPassword
    recoverPassword( {
    commit
    }, payload) {
        return new Promise((resolve, reject) => {
            console.log(payload);
        });
    }, //End recoverPassword
} //End Actions