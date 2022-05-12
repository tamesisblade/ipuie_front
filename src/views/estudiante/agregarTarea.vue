<template>
<div class="px-5 vx-col w-full mt-4">
    <vx-card title="Agregar Tarea">
      <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button>
        <input id="nombreArchivo" hidden  />
        <input id="extensionArchivo" hidden />
        <input id="codigoArchivo" hidden />

        <vue-dropzone class="vx-card" ref="dropzone" id="drop1"  @vdropzone-complete="guardarFile" :options="dropzoneOptions"></vue-dropzone>


        <vs-textarea class="mt-8" label="Descripción" v-model="descripcion" />
        <div class="vx-row">
            <div class="vx-col sm:w-2/3 w-full ml-auto">
                <vs-button color="success" type="border" @click="guardar()" class="m-2">Enviar</vs-button>
                <vs-button color="danger" type="border" class="m-2" to="/estudiante/curso/digital">Cancelar</vs-button>
            </div>
        </div>
    </vx-card>
</div>
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
            asignaturas: [],
            listaContenido: [],
            file: [],
            usuario: [],
            idasignatura: '',
            descripcion: '',

            dropzoneOptions: {
                url: this.$server_url+'dragArchivo',
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> Click o arrastra un archivo aquí.",
                chunking: true,
                uploadMultiple:false,
                addRemoveLinks:false,
                thumbnailWidth: 150,
                maxFilesize: 10.5,
                addRemoveLinks: false,
                init: function() {
                    this.on("success", function(file, responseText) {





                        console.log("hola",responseText)

                    });
                },
                headers: {
                    "My-Awesome-Header": "header value"
                }
            },
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        console.log(this.usuario);
    },
     mounted() {
        // this.getContenido();
    },
    methods: {
        // guardarFile(file){
        //     let me = this;
        //     me.file = file;
        // },


         async guardarFile(file) {
            let me = this
            me.file = file;
            console.log(me.file)
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('idusuario', me.usuario[0].idusuario);
            axios.post(this.$server_url+'archivo', formData)
            // axios.post('http://localhost:8000/api/archivo', formData)
                .then(function (response) {
                    // me.getContenido();

                        let pasarNombreArchivo = document.getElementById("nombreArchivo");
                        pasarNombreArchivo.value = response.data.nombreArchivo;

                        let pasarExtensionArchivo = document.getElementById("extensionArchivo");
                        pasarExtensionArchivo.value = response.data.extensionArchivo;

                        let pasarcodigoArchivo = document.getElementById("codigoArchivo");
                        pasarcodigoArchivo.value = response.data.codigoArchivo;


                    me.file = '';
                    // me.$refs.dropzone.removeAllFiles();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        me.errors = error.response.data.errors;
                        me.$vs.loading.close()
                    }
                })
        },

        async guardar() {
            let me = this
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();

            let archivosEnviarNombre = document.getElementById("nombreArchivo").value;
            let archivosEnviarExtension = document.getElementById("extensionArchivo").value;
            let archivosEnviarCodigo = document.getElementById("codigoArchivo").value;
            formData.append('archivo', archivosEnviarNombre);
            formData.append('extension', archivosEnviarExtension);
            formData.append('codigo', archivosEnviarCodigo);
            if(localStorage.getItem("realizar") == "actividad"){
            formData.append('actividad', "yes");
            }

            formData.append('idusuario', me.usuario[0].idusuario);
            formData.append('descripcion', me.descripcion);
            formData.append('idtarea', localStorage.getItem('idtarea'));


            axios.post(this.$server_url+'respuesta', formData)

                .then(function (response) {
                    // me.getContenido();
                    me.file = '';
                    me.$refs.dropzone.removeAllFiles();
                    me.$vs.loading.close()
                    me.$router.push('/tareas/estudiante');
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        me.errors = error.response.data.errors;
                        me.$vs.loading.close()
                    }
                })
        },



            async getContenido() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            me.$http.get(this.$server_url+'archivo?idusuario=', + me.usuario[0].idusuario)
            // var url = "http://localhost:8000/api/archivo?idusuario=" + me.usuario[0].idusuario;
            // axios.get(url)
            .then(function (response) {
                    var respuesta = response.data;
                    me.listaContenido = response.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });
        },
    },
}
</script>
