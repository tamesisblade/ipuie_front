<template>
<div align="center" class="pt-6">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0">
        <vx-card title="Registro del Estudiante">
            <div slot="no-body" class="full-page-bg-color-black">

                <div class="vx-col sm:w-full md:w-full">
                    <div class="p-8 login-tabs-container">
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Cédula</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" icon-pack="feather" icon="icon-code" icon-no-border v-model="estudiante.cedula" />
                                <span class="text-danger text-sm">{{ errors.cedula }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Nombres</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border v-model="estudiante.nombres" />
                                <span class="text-danger text-sm">{{ errors.nombres }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Apellidos</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border v-model="estudiante.apellidos" />
                                <span class="text-danger text-sm">{{ errors.apellidos }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Correo</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border v-model="estudiante.email" />
                                <span class="text-danger text-sm">{{ errors.email }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Teléfono</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="estudiante.telefono" />
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Ciudad</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <v-select :options="ciudades" :reduce="ciudades => ciudades" label="label" v-model="estudiante.ciudad"></v-select>
                                <span class="text-danger text-sm">{{ errors.ciudad }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Contraseña</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border v-model="estudiante.password" />
                                <span class="text-danger text-sm">{{ errors.password }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-2/3 w-full ml-auto">
                                <vs-button class="mr-3 mb-2" @click="guardar(estudiante)">Guardar</vs-button>
                                <vs-button color="danger" type="border" class="mb-2" to="/">Salir</vs-button>
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
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    data() {
        return {
            email: "",
            password: "",
            checkbox_remember_me: false,
            errors: {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                password: '',
                ciudad: '',
            },

            estudiante: {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                password: '',
                ciudad: '',
            },

            ciudades: [
              {id: 'Quito', label: 'Quito'},
              {id: 'Guayaquil', label: 'Guayaquil'},
              {id: 'Cuenca', label: 'Cuenca'},
              {id: 'Ambato', label: 'Ambato'},
              {id: 'Loja', label: 'Loja'},
              {id: 'Ibarra', label: 'Ibarra'},
              {id: 'Manta', label: 'Manta'},
              {id: 'Puyo', label: 'Puyo'},
              {id: 'Machala', label: 'Machala'},
              {id: 'Esmeraldas', label: 'Esmeraldas'},
              {id: 'Tena', label: 'Tena'},
            ]
        }
    },
    mounted() {

    },
    methods: {
        guardar(item) {
            let me = this
            let formData = new FormData();
            me.errors = {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                password: '',
                ciudad: '',
            }
            formData.append('cedula', item.cedula)
            formData.append('nombres', item.nombres)
            formData.append('apellidos', item.apellidos)
            formData.append('email', item.email)
            formData.append('name_usuario', item.email)
            formData.append('password', item.password)
            formData.append('ciudad', item.ciudad.id)
            formData.append('id_group', 2)

            axios.post("http://127.0.0.1:8000/api/register", formData)
                .then(function (response) {
                    localStorage.tk = response.data.token
                    localStorage.setItem('usuario', JSON.stringify(response.data.datos));
                    me.$router.push('/');
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        try {
                            me.errors.cedula = error.response.data.errors.cedula[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.nombres = error.response.data.errors.nombres[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.apellidos = error.response.data.errors.apellidos[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.email = error.response.data.errors.email[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.ciudad = error.response.data.errors.ciudad[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.password = error.response.data.errors.password[0]
                        } catch (error) {

                        }
                    }
                })
        },
    }
}
</script>
