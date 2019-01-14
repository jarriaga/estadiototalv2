<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row>
            <v-flex xs12 md6 offset-md3>
                <v-card class="elevation-12">
                    <v-card-text>
                        <v-toolbar-title><h1>Olvidé mi contraseña</h1></v-toolbar-title>
                        <p class="grey--text text--darken-1 text-sm-left">Ingresa el email con el cual te registraste y recibirás un correo de confirmación para 
                            actualizar tu password
                        </p>
                        <v-form ref="form" v-model="formValid" lazy-validation>
                            <v-text-field v-model="userData.email" :rules="emailRules" label="E-mail" required></v-text-field>
                            <v-btn :disabled="!formValid" @click="sendData"  color="success" class="white--text">
                                Recuperar password
                            </v-btn>
                        </v-form>
                        <v-alert :value="success" type="success">
                            Se ha enviado un mensaje de recuperación a <strong>email@example.com</strong>
                        </v-alert>
                        <v-alert :value="error" type="error">
                            El e-mail <strong>email@example.com</strong> no se encuentra registrado.
                        </v-alert>
                    </v-card-text>
                    <v-card-text v-show="submitEmail">
                        <v-toolbar-title><h1>Recupera tu password</h1></v-toolbar-title>

                        <p class="mt-3">
                            <i class="fa fa-envelope fa-4x text-center"></i>
                        </p>
                        <p class=" text-sm-left my-4">

                            Revisa tu email, te hemos enviado las instrucciones para que puedas
                            asignar un nuevo password a tu cuenta de EstadioTotal
                        </p>
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
                        submitEmail:false,
                        success: false,
                        error: false,
                        formValid: true,
                        emailRules: [
                            v => !!v || 'El e-mail es requerido',
                            v => /.+@.+/.test(v) || 'El e-mail no es válido'
                        ],
                        userData: {},
                        usernameTokens: {
                            F: {
                                pattern: /[0-9a-zA-Z-_]/,
                                transform: v => v.toLocaleLowerCase()
                            }
                        }
                    };
                },
                methods: {
                    ...mapActions([
                            'forgotPassword'
                    ]),
                    sendData: function () {
                        if (this.$refs.form.validate()) {
                            var vm = this;
                            this.forgotPassword(this.userData)
                                    .then(function () {
                                        vm.submitEmail = true;
                                        vm.success = true;
                                        vm.error = false;
                                    })
                                    .catch(function (error) {
                                        vm.error = true;
                                        vm.success = false;
                                        console.log(error);
                            });
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
