<template>
  <div class="vx-row">

    <!-- HORIZONTAL LAYOUT -->
    <div class="vx-col md:w-1/2 w-full mb-base">
      <vx-card title="Eventos" code-toggler>

        <vx-input-group>
          <vs-input class="w-full" v-model="nombre_evento" />
          <template slot="append">
              <div class="append-text btn-addon">
              <vs-button @click="crearEvento()">Guardar</vs-button>
              </div>
          </template>
        </vx-input-group>

        <vs-divider>Listado eventos</vs-divider>

        <div class="w-full">
            <vs-table search :data="eventos">
            <template slot="thead">
            <vs-th>Nombre</vs-th>
            <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{ data }">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{ data[indextr].nombre_evento }}
                </vs-td>
                <vs-td>
                  <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="id_evento=data[indextr].id_evento; openConfirmEliminar();" color="danger" type="flat"></vs-button>
                </vs-td>
            </vs-tr>
            </template>
            </vs-table>
        </div>

      </vx-card>
    </div>

    <!-- HORIZONTAL LAYOUT WITH ICON-->
    <div class="vx-col md:w-1/2 w-full mb-base">
      <vx-card title="Aeronaves" code-toggler>
        <vx-input-group>
          <vs-input class="w-full" v-model="nombre_aeronave" />
          <template slot="append">
              <div class="append-text btn-addon">
              <vs-button @click="crearAeronave()">Guardar</vs-button>
              </div>
          </template>
        </vx-input-group>

        <vs-divider>Listado aeronaves</vs-divider>

        <div class="w-full">
            <vs-table search :data="aeronaves">
            <template slot="thead">
            <vs-th>Nombre</vs-th>
            <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{ data }">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{ data[indextr].nombre_aeronave }}
                </vs-td>
                <vs-td>
                  <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="id_aeronave=data[indextr].id_aeronave; openConfirmEliminarAero();" color="danger" type="flat"></vs-button>
                </vs-td>
            </vs-tr>
            </template>
            </vs-table>
        </div>
      </vx-card>
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
      id_evento: '',
      nombre_evento: '',
      descripcion_evento: '',
      nombre_aeronave: '',
      id_aeronave: '',
      descripcion_aeronave: '',
      eventos: [],
      aeronaves: [],
    }
  },
    created() {
    },
    mounted() {
      this.getEventos()
      this.getAeronaves()
    },
    methods: {
        getEventos(){
            let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/eventos')
            .then(function (res) {
                me.eventos = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) {})
        },
        getAeronaves(){
            let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/aeronaves')
            .then(function (res) {
                me.aeronaves = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) {})
        },
        crearEvento(){
            let me = this
            if( me.nombre_evento==='' ){
              me.$vs.notify({
                text:'Ingrese un envento antes de guardar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
              return
            }
            let formData = new FormData()
            formData.append('nombre_evento', me.nombre_evento);
            me.$vs.loading()
            axios.post('https://server.ipuiecotocollao.com/api/eventos', formData)
            .then(function (res) {
                me.$vs.loading.close()
                me.nombre_evento=''
                me.$vs.notify({
                text:'Evento guardado correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
                me.getEventos()
            })
            .catch(function (error) {})
        },
        openConfirmEliminar(){
          this.$vs.dialog({
            type: 'confirm',
            color: 'danger',
            title: `Confirmar`,
            text: '¿Está seguro de eliminar este evento?',
            accept: this.eliminarEvento
          })
        },
        eliminarEvento(){
          let me = this
            axios.delete('https://server.ipuiecotocollao.com/api/eventos/'+ me.id_evento)
            .then(function (res) {
                me.getEventos()
            })
            .catch(function (error) {})
        },
        openConfirmEliminarAero(){
          this.$vs.dialog({
            type: 'confirm',
            color: 'danger',
            title: `Confirmar`,
            text: '¿Está seguro de eliminar esta aeronave?',
            accept: this.eliminarAeronave
          })
        },
        eliminarAeronave(){
          let me = this
            axios.delete('https://server.ipuiecotocollao.com/api/aeronaves/'+ me.id_aeronave)
            .then(function (res) {
                me.getAeronaves()
            })
            .catch(function (error) {})
        },
        crearAeronave(){
            let me = this
            if( me.nombre_aeronave==='' ){
              me.$vs.notify({
                text:'Ingrese una aeronave antes de guardar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
              return
            }
            let formData = new FormData()
            formData.append('nombre_aeronave', me.nombre_aeronave);
            me.$vs.loading()
            axios.post('https://server.ipuiecotocollao.com/api/aeronaves', formData)
            .then(function (res) {
                me.$vs.loading.close()
                me.nombre_aeronave=''
                me.$vs.notify({
                text:'Aeronave guardada correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
                me.getAeronaves()
            })
            .catch(function (error) {})
        },
    }
}

</script>
