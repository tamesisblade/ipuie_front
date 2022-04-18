<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
<div align="center" class="pt-3">
    <div style="width: 40%; min-width: 300px;">
        <vx-card>
            <div slot="no-body" class="full-page-bg-color-black">

                <div class="vx-row  justify-center items-center">

                    <div class="vx-col sm:w-full">
                        <div class="p-8 login-tabs-container">

                            <div class="vx-card__title mb-4">
                                <img :src="$server_images+'logo_ipuie.png'" alt="login" class="img-responsive mx-auto" style="width: 150px;">
                            </div>

                            <div>
                                <vs-input icon-pack="feather" icon="icon icon-user" icon-after placeholder="Usuario" vs-placeholder="Usuario" v-model="email" class="w-full mt-8" />
                                <span class="text-danger text-sm">{{ errors.message }}</span>
                                <vs-input icon-pack="feather" v-on:keyup.enter="postLogin()" type="password" icon="icon icon-lock" icon-after placeholder="Contraseña" vs-placeholder="Contraseña" v-model="password" class="w-full mt-6" />

                                <div class="flex flex-wrap justify-between my-5">
                                    <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Recordarme</vs-checkbox>
                                    <!--<router-link to="/restaurar">Olvide mi contraseña?</router-link>-->
                                </div>
                                <vs-button class="w-full" @click="postLogin()">Iniciar sesión</vs-button>
                                <vs-button type="flat" color="dark" to="/registro" class="w-full mt-6">¿No tienes una cuenta? <b>Regístrate ahora.</b></vs-button>

                            </div>

                        </div>
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
            errors: []
        }
    },
    mounted() {
        /* if (localStorage.tk != null) {
            this.$router.push('/');
            //console.log(localStorage.tk);
        } else {} */
    },
    methods: {
        postLogin() {
            let me = this;
            let formData = new FormData();
            formData.append('name_usuario', me.email);
            formData.append('password', me.password);
            axios.post(this.$server_url+'login', formData)
                .then(function (response) {
                    localStorage.tk = response.data.token;
                    localStorage.setItem('usuario', JSON.stringify(response.data.datos));
                    // me.$router.push('/cursos');
                    window.location.href = "/cursos";
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
