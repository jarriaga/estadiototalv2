<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row>
            <v-flex xs12 md6 offset-md3>
                <v-card class="elevation-12">
                    <v-card-text>
                        <v-toolbar-title ><h1>Ingresa tu nuevo password</h1></v-toolbar-title> 
                        <v-form ref="form" v-model="formValid" lazy-validation>
                            <v-text-field v-model="userData.password" :rules="passwordRules" label="Password" required
                                          :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                          :type="show1 ? 'text' : 'password'"
                                          @click:append="show1 = !show1"
                                          ></v-text-field>
                            <v-text-field v-model="userData.password2" :rules="passwordRules" label="Repetir password" required
                                          :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                          :type="show1 ? 'text' : 'password'"
                                          @click:append="show1 = !show1"
                                          ></v-text-field>
                            <v-btn :disabled="!formValid" @click="sendData"  color="success" class="white--text">
                                actualizar password
                            </v-btn>
                        </v-form>
                        <v-alert v-show="success" type="success">
                            Se ha reestablecido su contraseña
                        </v-alert>
                        <v-alert v-show="nomatch" type="error">
                            Las contraseñas no coinciden
                        </v-alert>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapActions } from 'vuex'
            export default {
                name: 'ForgotPassword',
                data() {
                    return {
                        show1: false,
                        success: false,
                        nomatch: false,
                        formValid: true,
                        passwordRules: [
                            v => !!v || 'Password es requerido',
                            v => (v && v.length >= 6) || 'Password debe tener mínimo 6 caracteres'
                        ],
                        userData: {
                            token: this.$route.params.token,
                            password: '',
                            password2: ''
                        }
                    };
                },
                methods: {
                    ...mapActions([
                            'recoverPassword'
                    ]),
                    sendData: function () {
                        this.error=this.success=this.nomatch= false;
                        if (this.$refs.form.validate() && this.userData.password === this.userData.password2) {
                            this.nomatch = false;
                            var vm = this;
                            this.recoverPassword(this.userData)
                                    .then(function (data) {
                                        console.log('process');
                                        vm.success = true;
                                        vm.error = false;
                                        vm.$refs.form.reset();
                                    })
                                    .catch(function (error) {
                                        vm.error = true;
                                        vm.success = false;
                                        console.log(error);
                                    });                                
                        } else {
                            this.nomatch = true;
                        }
                    }
                }
            }
</script>

<style scoped="">
    .linkOutside a {
        color: #fff;
    }
</style>
