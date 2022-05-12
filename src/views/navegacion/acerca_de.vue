<template>
  <div align="center" class="px-5">
    <div
      class="w-full py-8 px-5"
      style="background-color: white; width: 80%; min-width: 350px"
      v-html="contenido"
    ></div>

    <div v-if="usuario">
      <div align="center" v-if="usuario[0].id_group == 1">
        <br><br><br>
        <vs-divider>Contenido</vs-divider>
        <span>Recomendación: para subir imagenes utilice la opción de url.</span>
        <!-- <froala id="edit" :tag="'textarea'" :config="config" v-model="contenido"></froala> -->

        <!-- <quill-editor :config="config_quill" v-model="contenido"></quill-editor> -->
        <quill-editor v-model="contenido"></quill-editor>


        <vs-divider>Mapa</vs-divider>
        <vs-textarea
          class="w-full mb-3"
          label="Código del mapa"
          v-model="cod_mapa"
        />
        <vs-button
          type="gradient"
          color="primary"
          class="mb-6"
          @click="
            popupSeccion = false;
            save_get_acerca();
          "
          >Guardar</vs-button
        >
      </div>
    </div>

    <div style="width: 100%" v-html="cod_mapa"></div>

    <!-- <ckeditor :editor="editor" v-model="contenido" :config="editorConfig" ></ckeditor> -->
  </div>
</template>

<script src="/node_modules/quill-image-resize-module/image-resize.min.js"></script>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Vue from "vue";
import axios from "axios";
import VueFroala from "vue-froala-wysiwyg";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

// import Parchment from 'parchment'

// import ImageResize from 'quill-image-resize-module'//Add
// quillEditor.register('modules/imageResize', ImageResize)//Add




Vue.use(axios);
export default {
  components: {
    "v-select": vSelect,
    VueFroala,
    quillEditor,
    // ImageResize
  },
  data() {
    return {
      usuario: [],
      contenido: "",
      cod_mapa: "",
      id: 1, //acerca de default,
      config: {
        events: {
          initialized: function () {
            console.log("initialized");
          },
          // "image.beforeUpload": function(files) {
          // var editor = this;
          //   if (files.length) {
          //     // Create a File Reader.
          //     var reader = new FileReader();
          //     // Set the reader to insert images when they are loaded.
          //     reader.onload = function(e) {
          //       var result = e.target.result;
          //       editor.image.insert(result, null, null, editor.image.get());
          //     };
          //     // Read image as base64.
          //     reader.readAsDataURL(files[0]);
          //   }
          //   editor.popups.hideAll();
          //   // Stop default upload chain.
          //   return false;
          // }
        },
      },



      // config_quill: {
      //   modules: {
      //     // ImageResize: {//Add
      //     //   displayStyles: {//Add
      //     //     backgroundColor:'black',
      //     //     border:'none',
      //     //     color:'white'
      //     //   },
      //     //   modules: ['Resize','DisplaySize','Toolbar']//Add
      //     // },
      //     imageResize: {
      //         // See optional "config" below
      //     },
      //     toolbar: [
      //       ['bold','italic','underline','strike','image'],
      //       ['formula','clean'],
      //       ['blockquote','code-block'],
      //       [{'list':'ordered'}, {'list':'bullet'}],
      //       [{'script':'sub'}, {'script':'super'}],
      //       [{'size': ['small', false,'large','huge']}],
      //       [{'font': fonts }],
      //       [{'header': [1, 2, 3, 4, 5, 6, false]}],
      //       [{'color': [] }, {'background': [] }],
      //       [{'align': [] }],
      //       [{'direction':'rtl'}]
      //     ]
      //   },
      //   placeholder:'Enter content...'
      // },

      editor: ClassicEditor,
      editorData: "<p>Your Post Content</p>",
      editorConfig: {},
    };
  },
  created() {

  },
  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.getAcerca();
  },
  methods: {
    getAcerca() {
      let me = this;
      me.$vs.loading();
      axios
        .get("http://localhost:8000/api/get_acerca")
        .then(function (res) {
          me.contenido = res.data[0].contenido;
          me.cod_mapa = res.data[0].cod_mapa;
          me.$vs.loading.close();
        })
        .catch(function (error) {
          me.$vs.loading.close();
        });
    },
    save_get_acerca() {
      let me = this;
      me.$vs.loading();

      let formData = new FormData();
      formData.append("id", me.id);
      formData.append("contenido", me.contenido);
      formData.append("cod_mapa", me.cod_mapa);
      axios
        .post(
          "http://localhost:8000/api/save_get_acerca",
          formData
        )
        .then(function (res) {
          me.getAcerca();
        })
        .catch(function (error) {
          me.$vs.loading.close();
        });
    },
  },
};
</script>

<style>
.parallax {
  min-height: 200px;
  width: 100%;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
