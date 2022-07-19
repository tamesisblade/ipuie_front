<template>
  <div class="vx-row">

    <!-- HORIZONTAL LAYOUT -->
    <div class="vx-col w-full">
      Nombre Evento:
      <vx-input-group>
      <vs-input class="w-full" v-model="nombre_evento" />

      <template slot="append">
          <div class="append-text btn-addon">
          <vs-button @click="crearEvento()" color="primary">Crear</vs-button>
          </div>
      </template>
      </vx-input-group>
    </div>

  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Vue from 'vue'
import axios from 'axios'
import 'flatpickr/dist/flatpickr.css';
Vue.use(axios)
export default{
  data () {
    return {
      nombre_evento: ''
    }
  },
  methods: {
      crearEvento(){
          let me = this
          let formData = new FormData()
          formData.append('nombre_evento', me.nombre_evento);
          me.$vs.loading()
          axios.post('http://127.0.0.1:8000/api/eventos', formData)
          .then(function (res) {
              me.$vs.loading.close()
              me.nombre_evento=''
              me.$vs.notify({
              text:'Evento creado correctamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
          })
          .catch(function (error) {})
      }
  }
}

</script>
