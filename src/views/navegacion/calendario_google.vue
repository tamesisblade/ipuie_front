<template>
  <div align="center" class="px-2">

    <div v-if="usuario">
      <div align="center" v-if="usuario[0].id_group == 1">
        <vs-divider>Calendario</vs-divider>
        <vs-textarea
          class="w-full mb-3"
          label="Código del calendario"
          v-model="cod_calendario"
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

    <div style="width: 100%" v-html="cod_calendario"></div>

  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Vue from "vue";
import axios from "axios";

Vue.use(axios);
export default {
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      usuario: [],
      contenido: "",
      cod_calendario: "",
      id: 2, //calendario google de default,
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
        .get("http://127.0.0.1:8000/api/get_acerca/2")
        .then(function (res) {
          me.cod_calendario = res.data[0].cod_mapa;
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
      formData.append("contenido", 'codigo calendario google');
      formData.append("cod_mapa", me.cod_calendario);
      axios
        .post(
          "http://127.0.0.1:8000/api/save_get_acerca",
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
