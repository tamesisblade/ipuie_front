<template>
<div>
    <vx-card class="mb-6">

        <vs-input label="Titulo de la noticia" v-model="noticia.titulo" class="w-full mb-6" />
        <vs-input label="Descripción de la noticia" v-model="noticia.subtitulo" class="w-full mb-6" />

        <div style="font-size: 12px; color: gray;" class="mb-1">Imagen de portada</div>
        <input type="file" name="file_notic" id="file_notic" class="inputfile mb-6">

        <span style="color: #1CD7CC; ">Subir contenido multimedia como imágenes mediante URL para mejorar la experiencia de usuario.</span>
        <froala id="edit" :tag="'textarea'" :config="config" v-model="noticia.contenido"></froala>

        <div align="right">
            <vs-button type="border" color="dark" class="m-2" @click="$router.go(-1)">regresar</vs-button>
            <vs-button type="gradient" color="primary" class="m-2" @click="popupSeccion=false; guardarNoticia()">Guardar noticia</vs-button>
        </div>

    </vx-card>
</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Vue from 'vue'
import axios from 'axios'
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import Prism from 'vue-prism-component'

import VueFroala from 'vue-froala-wysiwyg';

Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        FormWizard,
        TabContent,
        Prism,
        VueFroala
    },
    data() {
        return {
            usuario: [],
            noticia: { titulo: '', subtitulo: '', contenido: '<br><br><br><br><br>', img_portada: ''},
            noticias: [],
            popupSeccion: false,
            id_noticia: '',
            img_old: '',
            config: {
              imageUploadRemoteUrls: false,
              events: {
                initialized: function () {
                  console.log('initialized')
                },
                "image.beforeUpload": function(files) {
                  var editor = this;
                    if (files.length) {
                      // Create a File Reader.
                      var reader = new FileReader();
                      // Set the reader to insert images when they are loaded.
                      reader.onload = function(e) {
                        var result = e.target.result;
                        editor.image.insert(result, null, null, editor.image.get());
                      };
                      // Read image as base64.
                      reader.readAsDataURL(files[0]);
                    }
                    editor.popups.hideAll();
                    // Stop default upload chain.
                    return false;
                }

              }
            },
            model: 'Edit Your Content Here!'
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.id_noticia = this.$route.params.id_noticia
        if( this.id_noticia != 0 ){
         this.getNoticia()
        }
    },
    methods: {
        getNoticia(){
            let me = this

            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/noticias/'+me.id_noticia)
            .then(function (response) {
                me.comentario = response.data.items.comentario
                me.noticia = response.data.items.noticia[0]
                me.img_old = response.data.items.noticia[0].img_portada
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })

        },
        guardarNoticia(){
            let me = this
            me.$vs.loading()
            let fileImgPreg
            fileImgPreg = document.getElementById("file_notic").files[0];

            let formData = new FormData();
            formData.append('titulo', me.noticia.titulo);
            formData.append('subtitulo', me.noticia.subtitulo);
            formData.append('contenido', me.noticia.contenido);
            formData.append('img_portada', fileImgPreg);
            formData.append('idusuario', me.usuario[0].idusuario);
            formData.append('img_old', me.img_old);

            formData.append('id_noticia', me.id_noticia);

            axios.post('http://127.0.0.1:8000/api/noticias', formData)
            .then(function (response) {
                me.id_noticia = response.data.id_noticia
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Noticia guardada correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
                me.$router.go(-1)
            })
            .catch(function (error) {
              me.$vs.loading.close()
               me.$vs.notify({
                text:'Contenido de la noticia demasiado grande. RECOMENDACIÓN: Suba imagenes como URL', color:'danger', iconPack: 'feather', icon:'icon-alert-triangle'})
            })
        },


    },
}
</script>

<style>
.uploading-image {
    display: flex;
}

.inputfile{
    border: 1px solid rgb(190, 190, 190);
    width: 100%;
    border-radius: 5px;
    padding: 5px;
    height: 37px;
}
</style>
