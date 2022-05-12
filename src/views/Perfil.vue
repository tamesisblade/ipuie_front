<template>
<vx-card title="Mi Perfil">

    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="estudiante.nombres" />
            <span class="text-danger text-sm">{{ errors.nombres }}</span>
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="estudiante.apellidos" />
            <span class="text-danger text-sm">{{ errors.apellidos }}</span>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Cédula" v-model="estudiante.cedula" />
            <span class="text-danger text-sm">{{ errors.cedula }}</span>
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <div style="font-size: 12px; color: gray">Ciudad: </div>
            <v-select :options="ciudades" :reduce="ciudades => ciudades" label="label" v-model="estudiante.ciudad"></v-select>
            <span class="text-danger text-sm">{{ errors.ciudad }}</span>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="estudiante.email" />
            <span class="text-danger text-sm">{{ errors.email }}</span>
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="estudiante.telefono" />
        </div>
    </div>

    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">

        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-button @click="guardar" class="w-full mr-3 mb-2" color="success">Guardar</vs-button>
        </div>
    </div>

</vx-card>
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
            errors: { cedula: '', nombres: '', apellidos: '', email: '', password: '', ciudad: '', verificar: '',  },
            estudiante: { cedula: '', nombres: '', apellidos: '', email: '', password: '', ciudad: '', verificar: '',  },

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
            ],
            passwordc: '',
            error: '',
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
        this.estudiante = {
            cedula: this.usuario[0].cedula,
            nombres: this.usuario[0].nombres,
            apellidos: this.usuario[0].apellidos,
            email: this.usuario[0].email,
            password: this.usuario[0].password,
            ciudad: this.usuario[0].ciudad,
            telefono: this.usuario[0].telefono,
        }
    },
    methods: {
        guardar() {
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
            formData.append('idusuario', me.usuario[0].idusuario)
            formData.append('cedula', me.estudiante.cedula)
            formData.append('nombres', me.estudiante.nombres)
            formData.append('apellidos', me.estudiante.apellidos)
            formData.append('email', me.estudiante.email)
            formData.append('telefono', me.estudiante.telefono)
            formData.append('name_usuario', me.estudiante.email)
            formData.append('ciudad', me.estudiante.ciudad.id)
            formData.append('id_group', me.usuario[0].id_group)

            axios.post("http://localhost:8000/api/editarUsuario", formData)
                .then(function (response) {
                    localStorage.removeItem('tk');
                    localStorage.removeItem('usuario');
                    me.$router.push('/login');
                })
                .catch(function (error) {
                  console.log(error)
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
