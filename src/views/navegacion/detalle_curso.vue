<template>
<div class="px-1">

    <div class="vx-row mb-base">

      <div class="vx-col w-full lg:w-3/4">
        <vx-card v-if="curso" class="mb-6 px-5" card-background="black" content-color="#fff">
            <div style="font-size: 22px;" class="mb-2"><b> {{curso.titulo}} </b></div>
            <div class="mb-2">
                {{curso.subtitulo}}
            </div>
            <div class="mb-2">
                Creado por: {{curso.nombres}} {{curso.apellidos}}
            </div>
            <div class="mb-2">
                Fecha de creación: {{curso.created_at}}
            </div>
        </vx-card>

        <vx-card class="mb-3">
        <vs-collapse>
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
        </vs-collapse>

        <div class="w-full text-xl" style="padding-left: 3%;"> Contenido del curso </div>
        <vs-collapse>
        <vs-collapse-item :key="index" v-for="(item, index) in secciones">
            <div slot="header">
              <b>{{item.titulo}}</b> &nbsp;&nbsp;
              <div class="float-right btn_seccion" v-if="usuario[0]">
                <vs-button v-if="curso_habilitado!=0 || usuario[0].id_group == 1" type="line" size="small" color="success" @click="irTareas(item)">Ver Tareas</vs-button>
                <vs-button v-if="curso_habilitado!=0 || usuario[0].id_group == 1" type="line" size="small" color="dark" @click="irEvaluaciones(item)">Ver Evaluaciones</vs-button>
              </div>
            </div>
            <div v-if="curso_habilitado==1" class="mb-4">
                <div class="w-full mb-4 btn_tareas_eval" v-if="usuario[0]" style="display: none;">
                    <vs-button class="w-full mb-5 p-0" color="success" type="flat">Para una mejor experiencia visualice el contenido de forma horizontal.</vs-button>
                  <vs-button v-if="curso_habilitado!=0 || usuario[0].id_group == 1" type="line" size="small" color="success" @click="irTareas(item)">Ver Tareas</vs-button>
                  <vs-button v-if="curso_habilitado!=0 || usuario[0].id_group == 1" type="line" size="small" color="dark" @click="irEvaluaciones(item)">Ver Evaluaciones</vs-button>
                </div>

                <a class=" flex items-center" :href="$server_url_file+'recursos/secciones/'+item.recurso" target="_blank">Clic aqui para descargar el recurso de esta sección. <vs-avatar color="primary" icon-pack="feather" icon="icon-download" /></a>
            </div>
            <div v-if="curso_habilitado==1" v-html="item.contenido" class="detalle_scrollmenu"></div>
        </vs-collapse-item>
        </vs-collapse>

        </vx-card>
      </div>


      <div class="vx-col w-full lg:w-1/4 card_progress">
        <vx-card>

            <vs-button class="mb-6 w-full" v-if="curso_habilitado != 0" color="#9ecc38" gradient-color-secondary="#3EC9D6" type="gradient">Progreso del curso</vs-button>

            <div slot="no-body" style="margin: 0% !important;" v-if="curso_habilitado==0">
                <img :src="this.$server_images+'cursos/'+curso.img_portada" alt="content-img" class="responsive card-img-top" style="max-height: 250px;">
            </div>

            <div v-if="curso_habilitado==0">
              <h1 class="mb-3"><b>${{curso.precio}}</b></h1>
              <p class="text-grey mb-2" style="font-size: 12px;">{{curso.descuento}}% de descuento</p>
              <p style="font-size: 12px; color: red;" class="mb-10">Oferta por tiempo limitado</p>
              <vs-button class="mb-6 w-full" type="filled" color="primary" @click="irInscripcion()">Inscribirse</vs-button>
            </div>

            <div class="mb-base w-full" v-if="curso_habilitado==0">
                <b>Este curso incluye:</b> <br>
                Vídeos bajo demanda <br>
                {{secciones.length}} secciones <br>
                Recursos descargables <br>
                Acceso de por vida <br>
                Acceso en dispositivos móviles y TV <br>
                Certificado de finalización <br>
            </div>
            <div class="mb-base w-full" v-else align="center">
                <!-- <div :key="index_p" v-for="(item_p, index_p) in progreso_curso" class="mb-6">
                  <vs-divider color="primary">{{item_p.seccion.titulo}}</vs-divider>
                  <div align="justify">
                    Evaluaciones completadas: <b>{{item_p.cant_evaluaciones_est}} de {{item_p.cant_evaluaciones_seccion}}</b> <br>

                    Tareas completadas: <b>{{item_p.cant_tareas_est}} de {{item_p.cant_tareas_seccion}}</b> <br>
                  </div>
                </div> -->

                <div align="justify" class="w-full mb-base">
                    Evaluaciones completadas: <b class="float-right">{{est_eval}} de {{tot_eval}}</b> <br>

                    Tareas completadas: <b class="float-right">{{est_tareas}} de {{tot_tareas}}</b> <br>
                </div>


                {{porcentaje_progreso}}%
                <div class="w-full mb-base" align="justify">
                  <vs-progress v-if="porcentaje_progreso<=25" :height="12" :percent="porcentaje_progreso" color="danger"></vs-progress>
                  <vs-progress v-if="porcentaje_progreso>25 && porcentaje_progreso<=50" :height="12" :percent="porcentaje_progreso" color="warning"></vs-progress>
                  <vs-progress v-if="porcentaje_progreso>50 && porcentaje_progreso<=75" :height="12" :percent="porcentaje_progreso" color="primary"></vs-progress>
                  <vs-progress v-if="porcentaje_progreso>75" :height="12" :percent="porcentaje_progreso" color="success"></vs-progress>
                </div>

                <div class="w-full flex flex-wrap justify-center gap-5">
                  <vx-tooltip v-if="usuario[0].id_group == 1 || usuario[0].idusuario == curso.capacitador" color="primary" text="Descargar reporte de evaluaciones">
                    <vs-button @click="get_reporte_eval()" class="p-0" size="large" radius color="primary" type="border" icon-pack="feather" icon="icon-list"></vs-button>
                  </vx-tooltip>

                  <vx-tooltip v-if="usuario[0].id_group == 1 || usuario[0].idusuario == curso.capacitador" color="dark" text="Descargar reporte de tareas">
                    <vs-button @click="get_reporte_tareas()" class="p-0" size="large" radius color="dark" type="border" icon-pack="feather" icon="icon-activity"></vs-button>
                  </vx-tooltip>

                  <!-- <vx-tooltip v-if="porcentaje_progreso == 100" color="success" text="Descargar certificado"> -->
                  <vx-tooltip v-if="porcentaje_progreso >= -70" color="success" text="Descargar certificado">
                    <vs-button @click="descargar_certificado" class="p-0" size="large" radius color="success" type="border" icon-pack="feather" icon="icon-award"></vs-button>
                  </vx-tooltip>
                  <vx-tooltip v-else color="warning" text="Podrá descargar el certificado cuando complete más del 70%">
                    <vs-button class="p-0" size="large" radius color="warning" type="border" icon-pack="feather" icon="icon-award"></vs-button>
                  </vx-tooltip>

                  <vue-html2pdf 
                    :show-layout="false"
                    :float-layout="true"
                    :enable-download="true"
                    :preview-modal="false"
                    :paginate-elements-by-height="1000"
                    filename="certificado_curso"
                    :pdf-quality="2"
                    :manual-pagination="false"
                    pdf-format="a4"
                    :pdf-margin="0"
                    pdf-orientation="landscape"
                    pdf-content-width="1150px"
                    ref="html2Pdf"
                  >
                    <section slot="pdf-content">
                      <ContentToPrint />
                    </section>
                  </vue-html2pdf>

                </div>

            </div>

            <div class="mb-base w-full" align="center">
                <vs-button type="line" color="dark" @click="$router.go(-1)">← Volver&nbsp;&nbsp;&nbsp;</vs-button>
            </div>

        </vx-card>
      </div>


    </div>



</div>
</template>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
import $ from "jquery";
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import VueHtml2pdf from "vue-html2pdf";
import ContentToPrint from "./contenido_certificado";

Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview,
        VueHtml2pdf,
        ContentToPrint,
    },
    data() {
        return {
            usuario: [],
            id_curso: '',
            secciones: [],
            curso: {},
            curso_habilitado: 0,
            progreso_curso: [],
            porcentaje_progreso: 0,
            tot_eval:0, est_eval:0, tot_tareas:0, est_tareas:0,
            calificaciones_estudiantes: []
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = [{idusuario: 0, id_group: 3}]
        }
    },
    mounted() {
        this.id_curso = this.$route.params.id_curso
        localStorage.setItem('id_curso',this.id_curso)
        this.getCurso()
        this.validaCursoEstudiante()
        this.progreso_curso_usuario()
    },
    methods: {
        getCurso(){
            let me = this
            me.$vs.loading()
            axios.get(this.$server_url+'cursos/'+me.id_curso)
            .then(function (response) {
                me.secciones = response.data.items.secciones
                me.curso = response.data.items.curso[0]

                setInterval(function () {
                  $('p[data-f-id="pbf"]').css('display', 'none');
                }, 3000);

                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        validaCursoEstudiante(){
            let me = this

            if( me.usuario.length > 0 ){
              axios.get(this.$server_url+'curso_estudiante/'+me.id_curso+'/'+me.usuario[0].idusuario)
              .then(function (response) {
                  me.curso_habilitado = response.data
              })
            }

        },
        progreso_curso_usuario(){
            let me = this

            if( me.usuario.length > 0 ){
              axios.get(this.$server_url+'progreso_curso_usuario/'+me.usuario[0].idusuario+'/'+me.id_curso)
              .then(function (res) {
                  me.progreso_curso = res.data.response

                  $.each(me.progreso_curso,function(key, value){
                    me.tot_eval += value.cant_evaluaciones_seccion
                    me.est_eval += value.cant_evaluaciones_est

                    me.tot_tareas += value.cant_tareas_seccion
                    me.est_tareas += value.cant_tareas_est
                  })

                  me.porcentaje_progreso = res.data.porcentaje_progreso.toFixed(2)
              })
            }

        },
        irInscripcion(){
            localStorage.tipo_registro = 'inscripcion'
            localStorage.id_curso_inscripcion = this.id_curso
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
            localStorage.tituloSeccion = item.titulo
            if(me.usuario[0].id_group == 2){
                me.$router.push('/estudiante/evaluaciones')
            }else{
                me.$router.push('/evaluaciones')
            }
        },
        get_reporte_eval() {
            let me = this
            axios.get(this.$server_url+'reporte_curso_evaluaciones/'+me.id_curso)
            .then(function (res) {
                me.calificaciones_estudiantes = res.data
                me.exportExcel('Evaluación')
            })
        },
        get_reporte_tareas() {
            let me = this
            axios.get(this.$server_url+'reporte_curso_tareas/'+me.id_curso)
            .then(function (res) {
                me.calificaciones_estudiantes = res.data
                me.exportExcel('Tarea')
            })
        },
        exportExcel (tipo) {
          let me = this
            let headerTitle = ['Nombres', 'Apellidos', 'Cédula', 'Email'];
            let headerVal = ['nombres', 'apellidos', 'cedula', 'email'];

            for( let i=0; i < me.calificaciones_estudiantes.cantidad; i++){
                headerTitle.push(tipo+ " " + (i+1))
                headerVal.push(i)
            }
            let titulo_excel = 'Reporte de evaluaciones curso ' + me.curso.titulo
            if( tipo == 'Tarea' ){
              titulo_excel = 'Reporte de tareas curso ' + me.curso.titulo
            }
            import('@/vendor/Export2Excel').then(excel => {
                const list = me.calificaciones_estudiantes.data
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: titulo_excel,
                    bookType: 'xlsx'
                })
            })
        },
        formatJson(filterVal, jsonData) {
            try {
              return jsonData.map(v => filterVal.map(j => {
                  return v[j]
              }))
            } catch (error) {
                console.log({error})
            }
        },
        descargar_certificado(){
          let me = this
          localStorage.setItem('curso_certificado', me.curso.titulo)
          localStorage.setItem('cant_horas', me.curso.cant_horas)
          setTimeout(function(){
              me.$refs.html2Pdf.generatePdf();
          }, 500);
        }
    },
}
</script>

<style>
#footer_ipuie{
  display: none;
}
.uploading-image {
    display: flex;
}

@media only screen and (max-width: 775px) {
  .btn_seccion {
    display: none !important;
  }
  .btn_tareas_eval {
    display: block !important;
  }

  .detalle_scrollmenu {
    overflow: auto !important;
    white-space: nowrap !important;
  }
}

@media (min-width: 990px) {
  .card_progress{
    position: fixed !important;
    right: 0 !important;
  }
}

</style>
