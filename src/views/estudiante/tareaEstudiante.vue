<template>
<div class="px-5">

<vs-popup title="Tareas" :active.sync="popupTareas">
  <vs-input class="w-full mb-3" label="Descripción tarea" v-model="tarea" />

  <vs-row>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
        <small class="date-label">Fecha entrega</small>
        <flat-pickr :config="configdateTimePicker" v-model="fecha_entrega" style="width: 80%;" class="ml-5" />
    </vs-col>
</vs-row>

  <vs-row class="mt-5">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
        <small class="date-label">Archivo</small>
        <input type="file" name="file1" id="file1" style="width: 70%;" class="inputfile ml-5">
    </vs-col>
</vs-row>




  <vs-input class="w-full mb-base mt-5" label="Observaciones" v-model="observaciones" />

  <vs-button type="gradient" color="primary" @click="guardarTarea()">Guardar</vs-button>

</vs-popup>

<!-- <vx-card :title="'Tareas de la sección: ' + seccion">
  <vs-table search max-items="10" pagination :data="tareas">
      <template slot="header">
          <vs-button type="gradient" color="primary" @click="id_tarea=0; archivo_old=0; editarActivo=false; popupTareas=true;">Agregar tarea</vs-button>
      </template>
      <template slot="thead">
          <vs-th>Tarea</vs-th>
          <vs-th>Archivo</vs-th>
          <vs-th>Fecha entrega</vs-th>
          <vs-th>Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                  {{tr.tarea}} <br>
                  {{tr.observaciones}}
              </vs-td>
              <vs-td>
                  {{tr.archivo}}
              </vs-td>
              <vs-td>
                  {{tr.fecha_entrega}}
              </vs-td>
              <vs-td>
                  <div class="flex">
                      <vx-tooltip color="success" text="Editar tarea">
                        <vs-button @click="verTarea(tr)" color="success" radius size="large" type="line" icon-pack="feather" icon="icon-check"></vs-button>
                      </vx-tooltip>

                      <vx-tooltip color="danger" text="Eliminar tarea">
                        <vs-button @click="eliminarTarea(tr.id_tarea)" color="danger" radius size="large" type="line" icon-pack="feather" icon="icon-trash"></vs-button>
                      </vx-tooltip>
                  </div>
              </vs-td>
          </vs-tr>
      </template>
    </vs-table>
</vx-card> -->

     <vs-card>
            <vs-button color="primary" type="border" class="m-1" @click="volver_detalle_curso()"><b>← Volver</b></vs-button>
            <vs-button color="dark" type="border" class="m-1" @click="actualizar()"><b>Actualizar</b></vs-button>

            <vs-collapse>
                <vs-collapse-item>
                <div slot="header">
                    Tareas Pendientes
                </div>

                <div>
                    <v-pendiente></v-pendiente>
                </div>

                </vs-collapse-item>

                <vs-collapse-item>
                <div slot="header">
                    Tareas Realizadas
                </div>

                <div>
                    <v-realizadas></v-realizadas>
                </div>
                </vs-collapse-item>

            </vs-collapse>
     </vs-card>
</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Vue from 'vue'
import axios from 'axios'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import pendiente from './tareasp'
import realizadas from './tareasr'

Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        flatPickr,
          'v-pendiente':pendiente,
        'v-realizadas':realizadas,
    },
    data() {
        return {
            id_seccion: '',
            seccion: '',
            tareas: [],
            popupTareas: false,
            fecha_entrega: '',
            configdateTimePicker: {
              enableTime: true,
              dateFormat: 'Y-m-d H:i:s'
            },
            tarea: '',
            fecha_entrega: '',
            observaciones: '',
            id_tarea: 0,
            archivo_old: 0,
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.id_seccion = localStorage.getItem('id_seccion')
        this.getTareas()
    },
    methods: {
        getTareas(){
            let me = this
            me.$vs.loading()
            axios.get(this.$server_url+'tareas?id_seccion='+me.id_seccion)
            .then(function (res) {
                me.tareas = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        verTarea(item){
          let me = this
          me.id_tarea = item.id_tarea
          me.archivo_old = item.archivo
          me.tarea = item.tarea
          me.fecha_entrega = item.fecha_entrega
          me.observaciones = item.observaciones
          me.popupTareas = true
        },
        guardarTarea(){
          let me = this

          let fileImgPreg
          fileImgPreg = document.getElementById("file1").files[0];

          me.$vs.loading()
          let formData = new FormData();
          formData.append('id_tarea', me.id_tarea)
          formData.append('id_seccion', me.id_seccion)
          formData.append('observaciones', me.observaciones)
          formData.append('fecha_entrega', me.fecha_entrega)
          formData.append('archivo', fileImgPreg)
          formData.append('archivo_old', me.archivo_old)
          formData.append('estado', 1)
          axios.post(this.$server_url+'tareas', formData)
          .then(function (response) {
            me.$vs.loading.close()
            me.$vs.notify({
                color: 'success',
                title: 'Tarea guardada exitosamente.',
            })
            me.popupTareas = false
            me.getTareas()
          })
          .catch(function (error) { me.$vs.loading.close() })

        },
        eliminarTarea(id_tarea){
          let me = this
          axios.get(this.$server_url+'eliminar_tarea/'+id_tarea)
          .then(function (response) {
            me.$vs.loading.close()
            me.$vs.notify({ color: 'success', title: 'Tarea eliminada.', })
            me.getTareas()
          })
          .catch(function (error) { me.$vs.loading.close() })
        },
        actualizar(){
          location.reload()
        },
        volver_detalle_curso(){
          this.$router.push('/detalle_curso/' + localStorage.id_curso)
        }
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}
</style>
