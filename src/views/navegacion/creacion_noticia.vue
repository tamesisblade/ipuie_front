<template>
<div class="px-12">
    <vx-card>

        <vs-input label="Titulo de la sección" v-model="noticia.titulo" class="w-full mb-6" />
        <vs-input label="Titulo de la sección" v-model="noticia.subtitulo" class="w-full mb-6" />

        <div style="font-size: 12px; color: gray;" class="mb-1">Imagen de portada</div>
        <input type="file" name="file1" id="file1" class="inputfile mb-6">

        <quill-editor v-model="noticia.contenido" class="mb-6"></quill-editor>

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

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import Prism from 'vue-prism-component'

Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        FormWizard,
        TabContent,
        quillEditor,
        Prism
    },
    data() {
        return {
            usuario: [],
            noticia: { titulo: '', subtitulo: '', contenido: '<br><br><br><br><br><br><br><br><br>', img_portada: ''},
            noticias: [],
            popupSeccion: false,
            id_noticia: '',
            img_old: '',
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
            axios.get('http://localhost:8000/api/noticias/'+me.id_noticia)
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
            fileImgPreg = document.getElementById("file1").files[0];

            let formData = new FormData();
            formData.append('titulo', me.noticia.titulo);
            formData.append('subtitulo', me.noticia.subtitulo);
            formData.append('contenido', me.noticia.contenido);
            formData.append('img_portada', fileImgPreg);
            formData.append('idusuario', me.usuario[0].idusuario);
            formData.append('img_old', me.img_old);

            formData.append('id_noticia', me.id_noticia);

            axios.post('http://localhost:8000/api/noticias', formData)
            .then(function (response) {
                me.id_noticia = response.data.id_noticia
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Noticia guardada correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
                me.$router.go(-1)
            })
            .catch(function (error) { me.$vs.loading.close() })
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
