<template>
<vx-card title="Mi Perfil">
    <div class="text-center">
        <vs-avatar size="120px" :src="'http://localhost:8000/perfil/'+usuario[0].foto_user" />
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            Foto de Perfil
            <vs-input type="file" class="w-full" icon-pack="feather" icon="icon-user" icon-no-border @change="obtenerImagen" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Cédula" v-model="usuario[0].cedula" />
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="usuario[0].nombres" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="usuario[0].apellidos" />
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="usuario[0].email" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="usuario[0].telefono" />
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="password" @input="verificar" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border label="Contraseña" v-model="password" />
            <span class="text-danger text-sm">{{ error }}</span>
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="password" @input="verificar" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border label="Verificar Contraseña" v-model="passwordc" />
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Ciudad</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="ciudad" @input="getInstitucion()" :reduce="ciudad => ciudad.idciudad" label="nombre" v-model="idciudad"></v-select>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Institución</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="instituciones" :reduce="instituciones => instituciones.idInstitucion" label="nombreInstitucion" v-model="usuario[0].institucion_idInstitucion"></v-select>
        </div>
    </div>
    <div class="vx-row text-center">
        <vs-button :disabled="btn" @click="guardar" class="w-full mr-3 mb-2" color="success">Guardar</vs-button>
    </div>
</vx-card>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview
    },
    data() {
        return {
            file: [],
            usuario: [],
            error: '',
            password: '',
            passwordc: '',
            btn: true,
            ciudad: [],
            instituciones: [],
            idregion: '',
            idciudad: ''
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        this.getCiudadSelect();
        this.getInstituciones();
    },
    methods: {
        verificar() {
            var n = this.password.localeCompare(this.passwordc);
            if (n == 0) {
                this.btn = false;
                this.error = ""
            } else {
                this.btn = true;
                this.error = "Contraseñas no coinciden"
            }
        },
        async guardar() {
            let me = this
            me.btn = false;
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('archivo', me.file);
            formData.append('idusuario', this.usuario[0].idusuario);
            formData.append('cedula', this.usuario[0].cedula);
            formData.append('nombres', this.usuario[0].nombres);
            formData.append('apellidos', this.usuario[0].apellidos);
            formData.append('email', this.usuario[0].email);
            formData.append('telefono', this.usuario[0].telefono);
            formData.append('password', this.password);
            formData.append('institucion_idInstitucion', this.usuario[0].institucion_idInstitucion);
            axios.post('http://localhost:8000/api/perfil', formData)
                .then(function (response) {
                    me.file = '';
                    me.$vs.loading.close(),
                        localStorage.setItem('usuario', JSON.stringify(response.data));
                    location.reload();
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        obtenerImagen(e) {
            let file = e.target.files[0];
            this.file = file;
        },
        getInstituciones() {
            let me = this;
            axios.get('http://localhost:8000/api/selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        getInstitucion() {
            let me = this;
            me.usuario[0].institucion_idInstitucion = ''
            axios.get('http://localhost:8000/api/selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        async getCiudadSelect() {
            let me = this;
            axios.get("http://localhost:8000/api/ciudad").then(function (response) {
                me.ciudad = response.data
            });
        },
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}
</style>
