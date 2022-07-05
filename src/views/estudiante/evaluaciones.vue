<template>

<div>

<vx-card>
    <vs-button color="primary" type="border" class="m-1" @click="volver()"><b>← Volver</b></vs-button>

    <vs-tabs alignment="fixed">
      <vs-tab label="Evaluaciones Pendientes" @click="verEvalPend()">
        <div v-if="evaluaciones.length===0" class="mt-6">No tiene evaluaciones pendientes</div>
        <div class="vx-row mb-6 mt-4">
            <vs-list :key="index" v-for="(item, index) in evaluaciones">
                <vs-list-header color="#3BA0FF" v-bind:title="'Evaluación '+(index + 1)"></vs-list-header>

                <vs-list-item>
                    <template slot="avatar">
                        Disponible: desde {{item.fecha_inicio}} hasta {{item.fecha_fin}}<br>
                        Duración: {{item.duracion}} minutos<br>
                        Puntos: {{item.puntos}}<br>
                        Observaciones: {{item.descripcion}}

                    </template>
                    <vs-button @click="openConfirm(item);" color="success" class="m-1">Resolver</vs-button>
                </vs-list-item>
            </vs-list>

        </div>
      </vs-tab>


        <vs-tab label="Evaluaciones Completadas" @click="verEvalComplet()">
            <div v-if="evaluaciones.length===0" class="mt-6">No tiene evaluaciones resueltas</div>
            <div v-else align="right"><b>Click en la calificación para ver la evaluación resuelta.</b></div>
            <vs-list :key="index" v-for="(item, index) in evaluaciones" class="mt-6">
                <vs-list-header color="#3BA0FF" v-bind:title="'Evaluación '+(index + 1)"></vs-list-header>

                <vs-list-item>
                    <template slot="avatar">
                        Disponible: desde {{item.fecha_inicio}} hasta {{item.fecha_fin}}<br>
                        Puntos: {{item.puntos}}<br>
                        Observaciones: {{item.descripcion}}
                    </template>

                    <vs-button  @click="irRevision(item)" v-if="item.calificacion<=7" size="small" color="danger" class="text-lg mb-2 px-2 py-1">{{item.calificacion}}/10 - Insuficiente</vs-button>
                    <vs-button  @click="irRevision(item)" v-if="item.calificacion>7 && item.calificacion<=8" size="small" color="warning" class="text-lg mb-2 px-2 py-1">{{item.calificacion}}/10 - Puedes hacerlo mejor</vs-button>
                    <vs-button  @click="irRevision(item)" v-if="item.calificacion>8 && item.calificacion<=9" size="small" color="primary" class="text-lg mb-2 px-2 py-1">{{item.calificacion}}/10 - Muy bien</vs-button>
                    <vs-button  @click="irRevision(item)" v-if="item.calificacion>9" size="small" color="success" class="text-lg mb-2 px-2 py-1">{{item.calificacion}}/10 - Excelente</vs-button>

                    <div class="text-sm" v-if="item.created_at == item.updated_at">
                      Preguntas abiertas aun no se califican. De ser el caso.
                    </div>
                    <div class="text-sm" v-else> Calificación final </div>

                </vs-list-item>
            </vs-list>
        </vs-tab>
    </vs-tabs>

</vx-card>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import VueRouter from 'vue-router'
export default {
    data() {
        return {
            evaluaciones: [],
            evaluacion: {
                nombre: '',
                descripcion: '',
                fecha_inicio: '',
                fecha_fin: '',
                estado: '',
                puntos: '',
            },
            editarActivo: false,
            usuario: [],
            estudiante: null,
            nombre_estudiante: null,
            apellido_estudiante: null,
            activeConfirm: false,
            grupo_estudiante: '',
            urlOrigen: '',
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.estudiante = this.usuario.idusuario
        this.nombre_estudiante = this.usuario.nombres
        this.apellido_estudiante = this.usuario.apellidos

        var urlBack = window.location.href
        var urlV = urlBack.split('/')
        this.urlOrigen = urlV[0]+'/'+urlV[1]+'/'+urlV[2]+'/responderEvaluacion'

        this.verEvalPend();
    },
    methods: {
        openConfirm(item) {
            this.grupo_estudiante = item.grupo;
            var date = moment();
            var fecha_actual = date.format('YYYY-MM-DD HH:mm:ss');
            if (fecha_actual < item.fecha_fin && fecha_actual > item.fecha_inicio) {
                this.evaluacion.id = item.id;
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `Confirmar`,
                    text: 'Resolver esta evaluación ahora',
                    accept: this.irEvaluacion
                })
            } else {
                this.$vs.notify({
                text:'Esta evaluación aún no está disponible.',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-circle'})
            }
        },
        irEvaluacion() {
            localStorage.setItem('id_evalRevisar', this.evaluacion.id);
            localStorage.setItem('grupo_estudiante', this.grupo_estudiante);
            //this.$router.push('/responderEvaluacion')
            window.location.href = this.urlOrigen+'/'+this.evaluacion.id;
        },
        verEvalPend(){
            this.evaluaciones = [];
            this.$vs.loading()
            let formData = new FormData();
                formData.append('codigo', localStorage.id_curso);
                formData.append('seccion_id', localStorage.id_seccion);
                formData.append('estudiante', this.usuario[0].idusuario);

            this.$http.post(this.$server_url+'evaluacionesEstudianteCurso', formData).then(res => {
                this.evaluaciones = res.data;
                this.$vs.loading.close()
            })
        },
        verEvalComplet(){
            this.evaluaciones = [];
            this.$vs.loading()
            let formData = new FormData();
                formData.append('codigo', localStorage.id_curso);
                formData.append('seccion_id', localStorage.id_seccion);
                formData.append('estudiante', this.usuario[0].idusuario);

            this.$http.post(this.$server_url+'evalCompleEstCurso', formData).then(res => {
                this.evaluaciones = res.data;
                this.$vs.loading.close()
            })
        },

        irRevision(item){
            localStorage.setItem('id_evalRevisar', item.id);
            localStorage.setItem('grupo_estudiante', item.grupo);
            this.$router.push('/revisarevaluacion')
        },
        volver(){
          this.$router.push('/detalle_curso/'+localStorage.id_curso)
        }
    },
}
</script>
