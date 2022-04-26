<template>
<div align="center">

    <div class="w-full" style="width: 80%; min-width: 350px;" v-html="contenido"></div>

    <div v-if="usuario">
      <div align="center" v-if="usuario[0].id_group == 1">
          <div>Contenido</div>
          <froala id="edit" :tag="'textarea'" :config="config" v-model="contenido"></froala>

          <vs-textarea class="w-full mb-3" label="Código del mapa" v-model="cod_mapa" />
          <vs-button type="gradient" color="primary" class="mb-6" @click="popupSeccion=false; save_get_acerca()">Guardar</vs-button>
      </div>
    </div>


    <div style="width: 100%" v-html="cod_mapa"></div>

</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Vue from 'vue'
import axios from 'axios'
import VueFroala from 'vue-froala-wysiwyg';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        VueFroala
    },
    data() {
        return {
          usuario: [],
            contenido: '',
            cod_mapa: '',
            id: 1, //acerca de default,
            config: {
              events: {
                initialized: function () {
                  console.log('initialized')
                }
              }
            },
        }
    },
    created() {


    },
    mounted() {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.getAcerca()
    },
    methods: {
        getAcerca(){
            let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/get_acerca')
            .then(function (res) {
                me.contenido = res.data[0].contenido
                me.cod_mapa = res.data[0].cod_mapa
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        save_get_acerca(){
            let me = this
            me.$vs.loading()

            let formData = new FormData();
            formData.append('id', me.id);
            formData.append('contenido', me.contenido);
            formData.append('cod_mapa', me.cod_mapa);
            axios.post('https://server.ipuiecotocollao.com/api/save_get_acerca', formData)
            .then(function (res) {
              me.getAcerca()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
    },
}
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
