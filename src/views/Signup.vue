<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-card class="elevation-12">
                    <v-toolbar dark color="blue-grey">
                        <v-toolbar-title>Registrate</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                            <v-text-field v-model="name" :rules="nameRules" :counter="10" label="Usuario" required></v-text-field>
                            <v-text-field v-model="password" :rules="emailRules" label="Password" required></v-text-field>
                            <v-btn :disabled="!valid" @click="createUser">
                                submit
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>

            </v-flex>

        </v-layout>
    </v-container>

</template>


<script>
    import {
        TheMask
    } from 'vue-the-mask'

    export default {
        name: 'register',
        components: {
            TheMask
        },
        data() {
            return {
                emailInUse: 0,
                confirmationError: 0,
                displayNameError: 0,
                displayUsernameError: 0,
                newUser: {},
                submit: 0,
                usernameTokens: {
                    F: {
                        pattern: /[0-9a-zA-Z-_]/,
                        transform: v => v.toLocaleLowerCase()
                    }
                }
            }
        },

        methods: {
            createUser: function () {
                let vm = this;
                vm.submit = 1;
                this.confirmationError = this.emailInUse = 0;
                this.$store.dispatch('registerUser', this.newUser)
                    .then(function () {
                        vm.$router.push({
                            name: 'confirmation'
                        });
                    }).catch(function (error) {
                        console.log('aja error');
                        vm.submit = 0;
                        vm.$store.commit('showError', {
                            visible:true,
                            type: 'error',
                            text: error.message,
                        });
                        vm.confirmationError = error.confirmationError;
                        vm.displayNameError = error.displayNameError;
                        vm.emailInUse = error.emailInUse;
                        vm.displayUsernameError = error.displayUsernameError;
                    });
            }
        },

    }
</script>

<style scoped="">
    .linkOutside a {
        color: #fff;
    }
</style>