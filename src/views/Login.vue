<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row>
            <v-flex xs12 md6 offset-md3>
                <v-card class="elevation-12">
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                        <v-toolbar-title ><h1>Entra a tu cuenta</h1></v-toolbar-title>
                            <v-avatar color="light-blue lighten-5" size="160">
                                <img src="https://visualpharm.com/assets/17/Ronaldo-595b40b85ba036ed117da990.svg">
                            </v-avatar>
                            <v-text-field v-model="user.email" :rules="nameRules" label="Usuario o email" required></v-text-field>
                            <v-text-field v-model="user.password" :rules="passwordRules" label="Password" required
                            :append-icon="show1 ? 'visibility_off' : 'visibility'"
                            :type="show1 ? 'text' : 'password'"
                             @click:append="show1 = !show1"
                            ></v-text-field>
                            <v-btn class="primary" :disabled="!valid" @click="loginUser">
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
        name: 'Login',
        data() {
            return {
                show1:false,
                valid:true,
               
                nameRules: [
                    v => !!v || 'Nombre de usuario o email es requerido',
                ],
                passwordRules:[
                    v => !!v || 'Password es requerido',
                    v => (v && v.length >= 6) || 'Password debe tener minimo 6 caracteres'
                ],
                user: {},
            }
        },
        methods: {
            ...mapActions([
                'login'
            ]),
            loginUser: function () {
                if (this.$refs.form.validate()) {
                    let vm = this;
                    vm.login(vm.user)
                        .then(function (response) {
                        }).catch(function (error) {
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