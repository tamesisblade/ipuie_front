<template>
<div class="mb-6 sm:px-3">

    <vx-card>

        <vs-input label="Titulo del documento" v-model="titulo" class="w-full mb-6" />

        <froala id="edit" :tag="'textarea'" :config="config" v-model="descripcion"></froala>

        <div style="font-size: 12px; color: gray;" class="mb-1">Imagen de portada</div>
        <input type="file" name="file_doc" id="file_doc" class="inputfile mb-6">

        <div align="right">
            <vs-button type="border" color="dark" class="m-2" @click="$router.go(-1)">Regresar</vs-button>
            <vs-button type="gradient" color="primary" class="m-2" @click="popupSeccion=false; guardarDocumento()">Guardar documento</vs-button>
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
            titulo: '', descripcion: '', img_portada: '',
            documentos_ministeriales: [],
            popupSeccion: false,
            id_documento: 0,
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
        this.id_documento = this.$route.params.id_documento
        if( this.id_documento != 0 ){
         this.getDocumento()
        }
    },
    methods: {
        getDocumento(){
            let me = this

            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/documentos_ministeriales/'+me.id_documento)
            .then(function (response) {
                me.titulo = response.data[0].titulo
                me.descripcion = response.data[0].descripcion
                me.img_old = response.data[0].imagen
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })

        },
        guardarDocumento(){
            let me = this
            me.$vs.loading()
            let fileImgPreg
            fileImgPreg = document.getElementById("file_doc").files[0];

            let formData = new FormData();
            formData.append('id_ministeriales', me.id_documento);
            formData.append('titulo', me.titulo);
            formData.append('descripcion', me.descripcion);
            formData.append('img_portada', fileImgPreg);
            formData.append('id_usuario', me.usuario[0].idusuario);
            formData.append('img_old', me.img_old);

            axios.post('https://server.ipuiecotocollao.com/api/documentos_ministeriales', formData)
            .then(function (response) {
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Documento ministerial guardado correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
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
