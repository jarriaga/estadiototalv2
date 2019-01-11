<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row>
            <v-flex xs12 md6 offset-md3>
                <v-card class="elevation-12">
                    <v-card-text>
                        <h1 class="secondary--text" >Recuperar contraseña</h1>                        
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
                                Enviar
                            </v-btn>
                        </v-form>
                        <v-alert :value="success" type="success">
                            Se ha reestablecido su contraseña
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
                        show1:false,
                        success:false,
                        formValid: true,
                        passwordRules: [
                            v => !!v || 'Password es requerido',
                            v => (v && v.length >= 6) || 'Password debe tener mínimo 6 caracteres'
                        ],
                        userData: {token:this.$route.params.token},
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
                            'recoverPassword'
                    ]),
                    sendData: function () {
                        if (this.$refs.form.validate()) {
                            this.recoverPassword(this.userData)
                                    .then(function () {
                                        this.success = true;
                                        this.error = false;
                                    })
                                    .catch(function (error) {
                                        this.error = true;
                                        this.success = false;
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