<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row>
            <v-flex xs12 md6 offset-md3>
                <v-card class="elevation-12">
                    <v-card-text>
                        <h1 class="secondary--text" >Registrate Ahora</h1>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field v-model="newUser.email" :rules="emailRules" label="E-mail" required></v-text-field>
                            <v-text-field v-model="newUser.username" :rules="nameRules" :counter="10" label="Usuario" required></v-text-field>
                            <v-text-field v-model="newUser.password" :rules="passwordRules" label="Password" required
                            :append-icon="show1 ? 'visibility_off' : 'visibility'"
                            :type="show1 ? 'text' : 'password'"
                             @click:append="show1 = !show1"
                            ></v-text-field>
                            <v-btn :disabled="!valid" @click="createUser"  color="primary" class="white--text">
                                Enviar
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        name: 'Signup',
        data() {
            return {
                show1:false,
                valid:true,
                emailRules: [
                    v => !!v || 'E-mail es requerido',
                    v => /.+@.+/.test(v) || 'email no es válido'
                ],
                nameRules: [
                    v => !!v || 'Nombre de usuario es requerido',
                    v => (v && v.length <= 10) || 'Nombre de usuario debe ser menor o igual a 10 caracteres',
                ],
                passwordRules:[
                    v => !!v || 'Password es requerido',
                    v => (v && v.length >= 6) || 'Password debe tener minimo 6 caracteres'
                ],
                newUser: {},
                usernameTokens: {
                    F: {
                        pattern: /[0-9a-zA-Z-_]/,
                        transform: v => v.toLocaleLowerCase()
                    }
                }
            }
        },
        methods: {
            ...mapActions([
                'registerUser'
            ]),
            createUser: function () {
                if (this.$refs.form.validate()) {
                    let vm = this;
                    this.registerUser(this.newUser)
                        .then(function () {
                            vm.$router.push({
                                name: 'confirmation'
                            });
                        }).catch(function (error) {
                            console.log(error);
                            vm.$store.commit('showError', {
                                visible:true,
                                type: 'error',
                                text: error.message,
                            });
                        });
                }
            }
        },
    }
</script>

<style scoped="">
    .linkOutside a {
        color: #fff;
    }
</style>