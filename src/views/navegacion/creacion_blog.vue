<template>
<div class="mb-6 sm:px-3">


  <vs-prompt
    title="Crear nueva categoría"
      @accept="guardarCategoria()"
      @close="getCategorias()"
      :active.sync="modal_categorias">
      <div>
        <vs-input label="Nombre de categoría" v-model="nombre_categoria" class="mt-3 w-full mb-6" />
      </div>
    </vs-prompt>

    <vx-card>

        <vs-input label="Titulo del blog" v-model="titulo" class="w-full mb-6" />
        <vs-input label="Descripción del blog" v-model="subtitulo" class="w-full mb-6" />

        <div class="w-full">
          <div style="width: 90%; display: inline-block;" align="left">
            <div class="w-full" style="color: #898989; font-size: 12px;">Categoría</div>
            <v-select class="w-full mb-6" :options="categorias" :reduce="categorias => categorias" label="nombre_categoria" v-model="categoria"></v-select>
          </div>
          <div style="width: 8%; display: inline-block;" align="center">
            <vs-button color="primary" type="border" icon-pack="feather" icon="icon-plus" @click="nombre_categoria=''; modal_categorias=true"></vs-button>
          </div>
        </div>

        <div style="font-size: 12px; color: gray;" class="mb-1">Imagen de portada</div>
        <input type="file" name="file_notic" id="file_notic" class="inputfile mb-6">

        <froala id="edit" :tag="'textarea'" :config="config" v-model="contenido"></froala>

        <div align="right">
            <vs-button type="border" color="dark" class="m-2" @click="$router.go(-1)">regresar</vs-button>
            <vs-button type="gradient" color="primary" class="m-2" @click="popupSeccion=false; guardarBlog()">Guardar blog</vs-button>
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
            categorias: [],
            titulo: '', subtitulo: '', categoria: {}, contenido: '<br><br><br><br><br>', img_portada: '',
            blogs: [],
            popupSeccion: false,
            id_blog: '',
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
            model: 'Edit Your Content Here!',
            nombre_categoria: '',
            modal_categorias: false,
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.getCategorias()
        this.id_blog = this.$route.params.id_blog
        if( this.id_blog != 0 ){
         this.getBlog()
        }
    },
    methods: {
        getCategorias(){
            let me = this

            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/get_categorias')
            .then(function (response) {
                me.categorias = response.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })

        },
        getBlog(){
            let me = this

            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/blogs/'+me.id_blog)
            .then(function (response) {
                me.comentario = response.data.items.comentario
                me.blog = response.data.items.blog[0]
                me.categoria = {'id_categoria': response.data.items.blog[0].id_categoria, 'nombre_categoria': response.data.items.blog[0].nombre_categoria}
                me.img_old = response.data.items.blog[0].img_portada
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })

        },
        guardarBlog(){
            let me = this
            me.$vs.loading()
            let fileImgPreg
            fileImgPreg = document.getElementById("file_notic").files[0];

            let formData = new FormData();
            formData.append('titulo', me.titulo);
            formData.append('subtitulo', me.subtitulo);
            formData.append('contenido', me.contenido);
            formData.append('img_portada', fileImgPreg);
            formData.append('id_categoria', me.categoria.id_categoria);
            formData.append('idusuario', me.usuario[0].idusuario);
            formData.append('img_old', me.img_old);

            formData.append('id_blog', me.id_blog);

            axios.post('http://127.0.0.1:8000/api/blogs', formData)
            .then(function (response) {
                me.id_blog = response.data.id_blog
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Blog guardada correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
                me.$router.go(-1)
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        guardarCategoria(){
            let me = this
            me.$vs.loading()

            let formData = new FormData();
            formData.append('nombre_categoria', me.nombre_categoria);
            formData.append('id_usuario', me.usuario[0].idusuario);

            axios.post('http://127.0.0.1:8000/api/guardar_categoria', formData)
            .then(function (response) {
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Categoría guardada correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
                me.getCategorias()
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
