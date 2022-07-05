<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
<div class="h-screen flex w-full vx-row no-gutter items-center justify-center" id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
        <vx-card>
            <div slot="no-body" class="full-page-bg-color-black">

                <div class="vx-row  justify-center items-center">

                    <div class="vx-col sm:w-full md:w-full lg:w-1/2">
                        <div class="p-8 login-tabs-container">

                            <div class="vx-card__title mb-4">
                                <img src="https://server.ipuiecotocollao.com/images/logo_ipuie.png" alt="login" class="img-responsive mx-auto">
                            </div>

                            <div>
                                <vs-input icon-pack="feather" icon="icon icon-mail" icon-after placeholder="Correo" vs-placeholder="Correo" v-model="email" class="w-full mt-8" />
                                <span class="text-danger text-sm">{{ errors.message }}</span>
                                <div v-if="respuesta !== ''">
                                    <br>
                                    <vs-alert title="Restaurar" active="true" color="success">
                                        {{respuesta}}
                                    </vs-alert>
                                    <br>
                                </div>
                                <vs-button class="mt-6 w-full" @click="postLogin()">Enviar</vs-button>
                                <vs-button class="mt-6 w-full" color="warning" to="/">Regresar</vs-button>
                            </div>

                        </div>
                    </div>
                    <div class="vx-col hidden lg:block lg:w-1/2">
                        <img src="@/assets/images/register.jpg" alt="login" class="mx-auto">
                    </div>
                </div>
            </div>
        </vx-card>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    data() {
        return {
            email: "",
            password: "",
            checkbox_remember_me: false,
            errors: [],
            respuesta: '',
        }
    },
    mounted() {

    },
    methods: {
        postLogin() {
            let me = this;
            let formData = new FormData();
            formData.append('email', me.email);
            axios.post('https://server.ipuiecotocollao.com/api/restaurar', formData)
                .then(function (response) {
                    me.respuesta = response.data
                    // localStorage.tk = response.data.tk;
                    // localStorage.setItem('usuario', JSON.stringify(response.data.datos));
                    // me.$router.push('/');
                })
                .catch(function (error) {
                    if (error.response.status == 401) {
                        me.errors = error.response.data;
                        //console.log(me.errors.message);
                    }
                })
        }
    },
}
</script>

<style lang="scss">
#page-login {
    .social-login-buttons {
        .bg-facebook {
            background-color: #1551b1
        }

        .bg-twitter {
            background-color: #00aaff
        }

        .bg-google {
            background-color: #4285F4
        }

        .bg-github {
            background-color: #333
        }
    }
}
</style>
