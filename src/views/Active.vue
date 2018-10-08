
<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row>
            <v-flex xs12 md12 >
                <v-card class="elevation-12">
                    <v-card-text>
                        <h1 class="secondary--text"><v-icon class="secondary--text"  large="">how_to_reg</v-icon> Cuenta Activada</h1>
                        <p class="body-2 pt-3"> Tu cuenta ha sido activada exitosamente, ya puedes entrar a tu cuenta ahora <router-link :to="{name:'login'}">Login</router-link></p>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
