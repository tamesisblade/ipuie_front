<template>
<div>
    <vs-card>
         <vs-table max-items="10" search pagination :data="listaTareas">
            <template slot="thead">
            <vs-th sort-key="descripcion">Tarea</vs-th>
                <vs-th sort-key="descripcion">Descripción</vs-th>
                <vs-th sort-key="fecha_inicio">Fecha Entrega</vs-th>

                <vs-th sort-key="fecha_final">Observación</vs-th>
                <vs-th sort-key="fecha_final">Nota</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].nombre">

                      <a :href="$server_url_file+'tareas/'+data[indextr].archivo" target="_blank">
                            {{data[indextr].tarea}}
                      </a>

                    </vs-td>
                    <vs-td :data="data[indextr].observaciones">
                        {{data[indextr].observaciones}}
                    </vs-td>
                    <vs-td :data="data[indextr].fecha_entrega">
                        {{data[indextr].fecha_entrega}}
                    </vs-td>

                    <vs-td :data="data[indextr].comentario">
                        {{data[indextr].comentario}}
                    </vs-td>
                    <vs-td :data="data[indextr].nota">
                        <b class="text-lg">{{data[indextr].nota}} </b> &nbsp;&nbsp;
                        <vs-button v-if="data[indextr].nota>0 && data[indextr].nota<=7" size="small" color="danger" class="text-lg px-2 py-1">Insuficiente..</vs-button>
                        <vs-button v-if="data[indextr].nota>7 && data[indextr].nota<=8" size="small" color="warning" class="text-lg px-2 py-1">Puedes hacerlo mejor</vs-button>
                        <vs-button v-if="data[indextr].nota>8 && data[indextr].nota<=9" size="small" color="primary" class="text-lg px-2 py-1">Muy bien</vs-button>
                        <vs-button v-if="data[indextr].nota>9" size="small" color="success" class="text-lg px-2 py-1">Excelente</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vs-card>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Datepicker from 'vuejs-datepicker';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        Datepicker,
        flatPickr
    },
    data() {
        return {
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            datei: null,
            datef: null,
            activePrompt: false,
            activePrompt2: false,
            listaTareas: [],
            listaContenido: [],
            usuario: [],
            tarea: {},
            id_seccion: ''
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.id_seccion = localStorage.getItem('id_seccion')
    },
    mounted() {
        this.getTareas();
    },
    methods: {
        getTareas(id) {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            // me.$http.get(this.$server_url+'tareaEstudianteRealizada?idcurso='+ me.idcurso + "&idusuario=" + me.usuario[0].idusuario)
            var url = this.$server_url+'tareaEstudianteRealizada?id_seccion=' + me.id_seccion + "&idusuario=" + me.usuario[0].idusuario;
            axios.get(url)
            .then(function (response) {
                    var respuesta = response.data;
                    me.listaTareas = response.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });

        },
    },
}
</script>
