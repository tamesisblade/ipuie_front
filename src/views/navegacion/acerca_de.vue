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

        <froala id="edit" :tag="'textarea'" :config="config" v-model="contenido"></froala>

        <div></div>

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
            save_get_acerca();
          "
          >Guardar</vs-button
        >
      </div>
    </div>

    <div style="width: 100%" v-html="cod_mapa"></div>

  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Vue from "vue";
import axios from "axios";
import VueFroala from "vue-froala-wysiwyg";

Vue.use(axios);
export default {
  components: {
    "v-select": vSelect,
    VueFroala,
  },
  data() {
    return {
      usuario: [],
      contenido: "",
      cod_mapa: "",
      id: 1, //acerca de default,
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
        .get("https://server.ipuiecotocollao.com/api/get_acerca/1")
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
          "https://server.ipuiecotocollao.com/api/save_get_acerca",
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

@media only screen and (max-width: 500px) {
  img{
    max-width: 300px !important;
  }
}

</style>
