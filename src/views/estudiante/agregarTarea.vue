<template>
<div class="px-5 vx-col w-full mt-4">
    <vx-card title="Agregar Tarea">
      <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button> <br><br>

        Seleccione el archivo de su tarea:
        <input type="file" name="archivo_tarea" id="archivo_tarea" class="w-full inputfile">
        <span class="text-gray">(Si requiere subir varios archivos puede subir un comprimido zip o rar)</span>


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
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
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

    },
    methods: {

        guardar() {
            let me = this

            var fileImgPreg = [];
            fileImgPreg = document.getElementById("archivo_tarea").files[0];

            if(!fileImgPreg){
              me.$vs.notify({
                  color: 'warning',
                  title: 'Seleccione un archivo antes de enviar su tarea.',
              })
              return
            }

            me.$vs.loading()
            let formData = new FormData();
            formData.append('archivo', fileImgPreg);
            formData.append('idusuario', me.usuario[0].idusuario);
            formData.append('descripcion', me.descripcion);
            formData.append('idtarea', localStorage.getItem('idtarea'));

            axios.post(this.$server_url+'guardar_tarea', formData)
            .then(function (response) {
                me.$vs.loading.close()
                me.$router.push('/tareas/estudiante');
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },

    },
}
</script>

<style>
.inputfile{
    border: 1px solid rgb(190, 190, 190);
    width: 100%;
    border-radius: 5px;
    padding: 5px;
    height: 37px;
}
</style>
