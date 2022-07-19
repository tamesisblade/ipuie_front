<template>
<vx-card>

    <vs-popup fullscreen title="Sección" :active.sync="popupSeccion">
        <div class="py-8 pt-3">


            <div style="font-size: 12px; color: gray;" class="mb-1">Recurso de la sección</div>
            <input type="file" name="file2" id="file2" class="inputfile mb-6">

            <vs-input label="Titulo de la sección" v-model="seccion.titulo" class="w-full mb-6" />
            <froala id="edit" :tag="'textarea'" :config="config" v-model="seccion.contenido"></froala>

            <vs-button type="gradient" color="primary" style="float: right;"  @click="guardarCurso(0)">Guardar sección</vs-button>
        </div>
    </vs-popup>

    <form-wizard color="rgba(var(--vs-primary), 1)" :title="null" :subtitle="null" finishButtonText="Finalizar"  @on-complete="guardarCurso(1)">

      <tab-content title="Paso 1" class="mb-5" :before-change="validar_paso1">
          <!-- tab 1 content -->
          <div class="vx-row">
              <div class="vx-col md:w-1/2 w-full mt-5">
                  <vs-input label="Titulo" v-model="curso.titulo" class="w-full" />
              </div>
              <div class="vx-col md:w-1/2 w-full mt-5">
                  <vs-input label="Descripción"  v-model="curso.subtitulo" class="w-full" />
              </div>
              <div class="vx-col md:w-1/2 w-full mt-5">
                  <vs-input label="Capacitador"  v-model="curso.capacitador" disabled="true" class="w-full" />
              </div>
              <div class="vx-col md:w-1/4 w-full mt-5">
                    <vs-input label="Duración (horas)" type="number" v-model="curso.cant_horas" class="w-full" />
                  <!-- <vs-select v-model="city" class="w-full select-large" label="City">
                      <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in cityOptions" class="w-full" />
                  </vs-select> -->
              </div>
              <div class="vx-col md:w-1/4 w-full mt-5">
                  <vs-input label="Precio" type="number" v-model="curso.precio" class="w-full" />
              </div>
              <div class="vx-col md:w-1/4 w-full mt-5">
                  <vs-input label="% Descuento" type="number" v-model="curso.descuento" class="w-full" />
              </div>
              <div class="vx-col md:w-1/2 w-full mt-5">
                  <div style="font-size: 12px; color: gray;" class="mb-1">Imagen de portada</div>
                  <input type="file" name="file1" id="file1" class="inputfile">
              </div>
              <div class="vx-col md:w-1/4 w-full mt-5 pt-8" align="center">
                    <vs-switch color="dark" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="curso.certificado">
                        <span slot="on">Se entrega certificado</span>
                        <span slot="off">No se entrega certificado</span>
                    </vs-switch>
              </div>
          </div>
      </tab-content>

      <!-- tab 2 content -->
      <tab-content title="Paso 2" class="mb-5" :before-change="validar_paso2">
          <div class="vx-row mb-4">
              <vs-textarea label="Lo que aprenderá el estudiante" placeholder="Ejemplo: crear variables, modificar cadenas, etc..." v-model="curso.aprender" />
          </div>
          <div class="vx-row mb-4">
              <vs-textarea label="Requisitos" v-model="curso.requisitos" />
          </div>
          <div class="vx-row mb-4">
              <vs-textarea label="Descripción" v-model="curso.descripcion" />
          </div>
      </tab-content>

      <!-- tab 3 content -->
      <tab-content title="Paso 3" class="mb-5">
            <vs-table search max-items="10" pagination :data="secciones">
                <template slot="header">
                    <vs-button type="gradient" color="primary" @click="seccion={}; seccion.contenido=''; popupSeccion=true">Agregar sección</vs-button>
                </template>
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th>Título</vs-th>
                    <vs-th style="width: 100px;">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{indextr+1}}
                        </vs-td>
                        <vs-td>
                            {{tr.titulo}}
                        </vs-td>
                        <vs-td>
                            <div class="flex">
                                <vx-tooltip text="Editar sección">
                                    <vs-button radius type="line" size="large" icon-pack="feather" icon="icon-edit" class="m-1" color="primary" @click="recurso_old = tr.recurso; seccion = tr; popupSeccion=true"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Eliminar sección">
                                    <vs-button radius type="line" size="large" icon-pack="feather" icon="icon-trash" class="m-1" color="danger" @click="seccion = tr; openConfirmSeccion()"></vs-button>
                                </vx-tooltip>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>


      </tab-content>

  </form-wizard>
</vx-card>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Vue from 'vue'
import axios from 'axios'
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import Prism from 'vue-prism-component'
import VueFroala from 'vue-froala-wysiwyg';

Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        FormWizard,
        TabContent,
        Prism,
        VueFroala
    },
    data() {
        return {
            usuario: [],
            curso: { titulo: '', subtitulo: '', capacitador: '', cant_horas: '', precio: '', descuento: '', duracion_descuento: '', certificado: '', requisitos: '', descripcion: '', contenido: '<br><br><br><br><br><br><br><br><br>', aprender: ''},
            secciones: [],
            seccion: {},
            popupSeccion: false,
            id_curso: '',
            img_old: '',
            recurso_old: '',

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

        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }else{
          this.curso.capacitador = this.usuario[0].nombres +' '+ this.usuario[0].apellidos

        }
    },
    mounted() {
        this.id_curso = this.$route.params.id_curso
        if( this.id_curso != 0 ){
         this.getCurso()
        }
    },
    methods: {
        getCurso(){
            let me = this

            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/cursos/'+me.id_curso)
            .then(function (response) {
                me.secciones = response.data.items.secciones
                me.curso = response.data.items.curso[0]
                me.img_old = response.data.items.curso[0].img_portada
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })

        },
        validar_paso1(){
          let fileImgPreg = document.getElementById("file1").files[0]

          if( this.curso.titulo == "" || this.curso.subtitulo == "" || this.curso.cant_horas == "" ){
              this.$vs.notify({
              text:'Complete todos los campos antes de continuar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})

              return new Promise((resolve, reject) => {
                reject("correct all values");
              })

          }else{
            if( this.id_curso == 0){
                if( !fileImgPreg ){
                  this.$vs.notify({
                  text:'seleccione una imagen.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
                  return new Promise((resolve, reject) => {
                    reject("correct all values");
                  })
                }else{
                  return new Promise((resolve, reject) => {
                    resolve(true)
                  })
                }
            }else{
              return new Promise((resolve, reject) => {
                resolve(true)
              })
            }
          }
        },
        validar_paso2(){

          if( this.curso.aprender == '' || this.curso.requisitos == '' || this.curso.descripcion == '' ){
              this.$vs.notify({
              text:'Complete todos los campos antes de continuar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})

              return new Promise((resolve, reject) => {
                reject("correct all values");
              })
          }else{
            return new Promise((resolve, reject) => {
              resolve(true)
            })
          }

        },
        guardarCurso(finaliza){
            let me = this
            me.$vs.loading()
            let fileImgPreg
            fileImgPreg = document.getElementById("file1").files[0];

            let formData = new FormData();
            formData.append('titulo', me.curso.titulo);
            formData.append('subtitulo', me.curso.subtitulo);
            formData.append('capacitador', me.usuario[0].idusuario);
            formData.append('cant_horas', me.curso.cant_horas);
            formData.append('precio', me.curso.precio);
            formData.append('descuento', me.curso.descuento);
            formData.append('certificado', me.curso.certificado);
            formData.append('requisitos', me.curso.requisitos);
            formData.append('descripcion', me.curso.descripcion);
            formData.append('aprender', me.curso.aprender);
            formData.append('img_portada', fileImgPreg);
            formData.append('idusuario', me.usuario[0].idusuario);
            formData.append('img_old', me.img_old);

            formData.append('id_curso', me.id_curso);

            axios.post('http://127.0.0.1:8000/api/cursos', formData)
            .then(function (response) {
                me.id_curso = response.data.id_curso
                me.$vs.loading.close()
                if( finaliza == 1 ){
                  me.$router.go(-1)
                }else{
                  me.agregarSeccion()
                  me.$vs.notify({
                  text:'Curso guardado correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
                }
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        agregarSeccion(){
            let me = this

            if( me.seccion.id_seccion === undefined ){ me.seccion.id_seccion = 0 }


            let fileImgPreg2 = document.getElementById("file2").files[0];

            if( !fileImgPreg2 || me.seccion.titulo == '' || me.seccion.contenido == '' ){
              me.$vs.notify({
              text:'Todos los campos son obligatorios para poder crear una sección', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
              return;
            }

            let formData = new FormData();
            formData.append('titulo', me.seccion.titulo);
            formData.append('contenido', me.seccion.contenido);
            formData.append('id_seccion', me.seccion.id_seccion);
            formData.append('id_curso', me.id_curso);
            formData.append('recurso', fileImgPreg2);
            formData.append('recurso_old', me.recurso_old);

            axios.post('http://127.0.0.1:8000/api/guardar_seccion', formData)
            .then(function (response) {
                me.popupSeccion=false;
                me.getCurso()
                me.popupSeccion = false
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Sección guardada correctamente', color:'success', iconPack: 'feather', icon:'icon-check'})
            })
            .catch(function (error) { me.$vs.loading.close() })

        },
        openConfirmSeccion() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar esta sección?',
                accept: this.acceptAlertSeccion
            })
        },
        acceptAlertSeccion() {
            let me = this

            axios.get('http://127.0.0.1:8000/api/elimiar_seccion/' + me.seccion.id_seccion)
            .then(function (res) {
                me.$vs.notify({
                    color: 'danger',
                    title: 'Sección eliminada',
                    text: 'Esta sección ya no estará disponible para ningún usuario'
                })
                me.getCurso()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}

.inputfile{
    border: 1px solid rgb(190, 190, 190);
    width: 100%;
    border-radius: 5px;
    padding: 5px;
    height: 37px;
}
</style>
