<template>
<div class="px-5">

    <div class="vx-row">

      <div class="vx-col sm:w-3/4 w-full" style="min-width: 200px;">
        <vx-card class="mb-6 px-5" card-background="black" content-color="#fff">
            <div style="font-size: 22px;" class="mb-2"><b> {{curso.titulo}} </b></div>
            <div class="mb-2">
                {{curso.subtitulo}}
            </div>
            <div class="mb-2">
                Creado por: {{curso.capacitador}}
            </div>
            <div class="mb-2">
                Fecha de creación: {{curso.created_at}}
            </div>
        </vx-card>

        <vx-card class="mb-3">
        <vs-collapse >

            <vs-collapse-item>
                <div slot="header"> Detalles del curso </div>
                <div style="border: 1px solid gray;" class="p-5 mb-12">
                    <h3>Lo que aprenderas</h3><br>
                    <span> {{curso.aprender}} </span>
                </div>

                <div class="mb-6">
                    <div class="mb-1" style="font-size: 18px;"><b>Requisitos</b></div>
                    <span> {{curso.requisitos}} </span>
                </div>

                <div class="mb-6">
                    <div class="mb-1" style="font-size: 18px;"><b>Descripcion</b></div>
                    <span> {{curso.descripcion}} </span>
                </div>
            </vs-collapse-item>

            <vs-collapse-item>
                <div slot="header"> Contenido del curso </div>
                <vs-collapse>
                <vs-collapse-item :key="index" v-for="(item, index) in secciones">
                    <div slot="header">
                      <b>{{item.titulo}}</b> &nbsp;&nbsp;
                      <vs-button class="float-right" v-if="curso_habilitado!=0 || usuario[0].id_group == 1" type="line" size="small" color="success" @click="irTareas(item)">Ver Tareas</vs-button>
                      <vs-button class="float-right" v-if="curso_habilitado!=0 || usuario[0].id_group == 1" type="line" size="small" color="dark" @click="irEvaluaciones(item)">Ver Evaluaciones</vs-button>
                    </div>
                    <div v-if="curso_habilitado==1" v-html="item.contenido"></div>
                </vs-collapse-item>
                </vs-collapse>

            </vs-collapse-item>
        </vs-collapse>
        </vx-card>
      </div>


      <div class="vx-col sm:w-1/4 w-full" style="min-width: 200px;">
        <vx-card>
            <div slot="no-body" style="margin: 0% !important;">
                <img :src="this.$server_images+'cursos/'+curso.img_portada" alt="content-img" class="responsive card-img-top">
            </div>

            <div v-if="curso_habilitado==0">
              <h1 class="mb-3"><b>${{curso.precio}}</b></h1>
              <p class="text-grey mb-2" style="font-size: 12px;">{{curso.descuento}}% de descuento</p>
              <p style="font-size: 12px; color: red;" class="mb-10">Oferta por tiempo limitado</p>
              <vs-button class="mb-6 w-full" type="filled" color="primary" @click="irInscripcion()">Inscribirse</vs-button>
            </div>

            <div class="mb-base w-full">
                <b>Este curso incluye:</b> <br>
                Vídeos bajo demanda <br>
                {{secciones.length}} secciones <br>
                Recursos descargables <br>
                Acceso de por vida <br>
                Acceso en dispositivos móviles y TV <br>
                Certificado de finalización <br>
            </div>

            <div class="mb-base w-full" align="center">
                <vs-button type="line" color="dark" @click="$router.go(-1)">← Volver&nbsp;&nbsp;&nbsp;</vs-button>
            </div>

        </vx-card>
      </div>


    </div>



</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview
    },
    data() {
        return {
            usuario: [],
            id_curso: '',
            secciones: [],
            curso: {},
            curso_habilitado: 0,
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.id_curso = this.$route.params.id_curso
        localStorage.setItem('id_curso',this.id_curso)
        this.getCurso()
        this.validaCursoEstudiante()
    },
    methods: {
        getCurso(){
            let me = this
            me.$vs.loading()
            axios.get(this.$server_url+'cursos/'+me.id_curso)
            .then(function (response) {
                me.secciones = response.data.items.secciones
                me.curso = response.data.items.curso[0]
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        validaCursoEstudiante(){
            let me = this

            axios.get(this.$server_url+'curso_estudiante/'+me.id_curso+'/'+me.usuario[0].idusuario)
            .then(function (response) {
                me.curso_habilitado = response.data
            })

        },
        irInscripcion(){
            localStorage.tipo_registro = 'inscripcion'
            this.$router.push('/inscripcion_curso')
        },
        irTareas(item){
          let me = this
          localStorage.id_seccion = item.id_seccion
          if(me.usuario[0].id_group == 2){
                me.$router.push('/tareas/estudiante')
          }else{
               me.$router.push('/tareas')
          }

        },
        irEvaluaciones(item){
             let me = this
            localStorage.id_seccion = item.id_seccion
            if(me.usuario[0].id_group == 2){
                me.$router.push('/estudiante/evaluaciones')
            }else{
                me.$router.push('/evaluaciones')
            }
        }
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}
</style>
