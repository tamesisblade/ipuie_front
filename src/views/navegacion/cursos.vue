<template>
<vx-card align="center" class="px-3">


    <vs-tabs alignment="fixed">
      <vs-tab label="Todos los cursos" @click="getCursos" class="pt-5">

        <div v-if="usuario[0]">
          <div v-if="usuario[0].id_group == 1" class="vx-row">
              <div class="vx-col sm:w-1/5 w-full mb-6" style="min-width: 250px;">
              <vx-card align="center" card-background="linear-gradient(120deg, #F3BF0D, #FCD88F, #FCC48F)" class="py-12">
                  <h5 class="mb-1">Crear un curso</h5>
                  <br><br>
                  <vs-button color="dark" radius style="width: 60px !important; height: 60px !important;" type="border" icon-pack="feather" icon="icon-plus" @click="$router.push('/creacion_curso/0')"></vs-button>
              </vx-card>
              </div>

              <div class="vx-col sm:w-1/5 w-full mb-6" style="min-width: 250px;" :key="index" v-for="(item, index) in cursos">
                <vx-card align="justify">
                  <div slot="no-body" style="margin: 0% !important;">
                      <img style="height: 200px;" :src="$server_images+'cursos/' + item.img_portada" alt="content-img" class="responsive card-img-top" >
                  </div>
                  <h5 class="mb-1"> {{item.titulo}} </h5>
                  <div class="text-grey mb-3" style="font-size: 12px;"> {{item.subtitulo}} </div>
                  <div align="center">
                      <vs-button style="font-size: 12px; padding: 5px; display: inline-block; width: 45%;" class="m-1" size="small" type="line" color="primary" @click="irCurso(item)">Ver curso</vs-button>

                      <vs-button style="font-size: 12px; padding: 5px; display: inline-block; width: 45%;" class="m-1" size="small" type="line" color="#b9b9b9" @click="irInscripcion(item)">Inscribirse</vs-button>
                  </div>
                  <vs-button v-if="usuario[0].idusuario == item.capacitador" class="mt-3 w-full" size="small" style="font-size: 12px;" type="border" color="dark" @click="$router.push('/creacion_curso/'+item.id_curso)">Editar curso</vs-button>
                  <vs-button v-if="usuario[0].idusuario == item.capacitador || usuario[0].id_group == 1" class="mt-3 w-full" size="small" style="font-size: 12px;" type="border" color="danger" @click="id_curso = item.id_curso; openConfirmCurso();">Inhabilitar curso</vs-button>

                </vx-card>
              </div>

          </div>

          <div v-else class="vx-row">
              <div class="vx-col sm:w-1/5 w-full mb-6" style="min-width: 250px;" :key="index" v-for="(item, index) in cursos">
              <vx-card align="justify">
                  <div slot="no-body" style="margin: 0% !important;">
                      <img style="height: 200px;" :src="$server_images+'cursos/' + item.img_portada" alt="content-img" class="responsive card-img-top">
                  </div>
                  <h5 class="mb-1"> {{item.titulo}} </h5>
                  <div class="text-grey mb-3" style="font-size: 12px;"> {{item.subtitulo}} </div>
                  <div align="center">
                      <vs-button style="font-size: 12px; padding: 5px; display: inline-block; width: 45%;" class="m-1" size="small" type="line" color="primary" @click="$router.push('/detalle_curso/'+item.id_curso)">Ver curso</vs-button>
                      <vs-button style="font-size: 12px; padding: 5px; display: inline-block; width: 45%;" class="m-1" size="small" type="line" color="#b9b9b9" @click="irInscripcion(item)">Inscribirse</vs-button>
                  </div>

              </vx-card>
              </div>
          </div>
      </div>

      <div v-else class="vx-row" style="width: 80%; min-width: 350px;">
          <div class="vx-col sm:w-1/5 w-full mb-6" style="min-width: 250px;" :key="index" v-for="(item, index) in cursos">
          <vx-card align="justify">
              <div slot="no-body" style="margin: 0% !important;">
                  <img style="height: 200px;" :src="$server_images+'cursos/' + item.img_portada" alt="content-img" class="responsive card-img-top">
              </div>
              <h5 class="mb-1"> {{item.titulo}} </h5>
              <div class="text-grey mb-3" style="font-size: 12px;"> {{item.subtitulo}} </div>
              <div align="center">
                  <vs-button style="font-size: 12px; padding: 5px; display: inline-block; width: 45%;" class="m-1" size="small" type="line" color="primary" @click="$router.push('/detalle_curso/'+item.id_curso)">Ver curso</vs-button>
                  <vs-button style="font-size: 12px; padding: 5px; display: inline-block; width: 45%;" class="m-1" size="small" type="line" color="#b9b9b9" @click="irInscripcion(item)">Inscribirse</vs-button>
              </div>

          </vx-card>
          </div>
      </div>

      </vs-tab>

      <vs-tab label="Mis cursos" @click="getMisCursos" v-if="usuario[0]" class="pt-5">

        <div align="left">
        <vs-list>

          <vs-list-item :key="index" v-for="(item, index) in mis_cursos" :title="item.titulo" :subtitle="item.subtitulo">
            <template slot="avatar">
              <img style="width: 50px;" :src="$server_images+'cursos/'+item.img_portada" alt="content-img" class="mr-8" >
            </template>
            <vs-button style="font-size: 12px; padding: 5px; display: inline-block;" size="small" type="filled" color="primary" @click="$router.push('/detalle_curso/'+item.id_curso)">Ver curso</vs-button>
<!--
            <vs-button style="font-size: 14px; padding: 5px; display: inline-block; width: 40px;" radius class="m-1" size="small" type="border" color="dark">30%</vs-button> -->

          </vs-list-item>

        </vs-list>
        </div>

      </vs-tab>
    </vs-tabs>


</vx-card>

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
            cursos: [],
            mis_cursos: [],
            popUpEliminar: false,
            id_curso: '',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.getCursos()
    },
    methods: {
        irInscripcion(item){
            localStorage.id_curso_inscripcion = item.id_curso
            this.$router.push('/inscripcion_curso')
        },
        irCurso(item){
            localStorage.id_curso_inscripcion = item.id_curso
            this.$router.push('/detalle_curso/'+item.id_curso)
        },
        getCursos(){
            let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/cursos')
            .then(function (res) {
                me.cursos = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        getMisCursos(){
            let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/mis_cursos/'+me.usuario[0].idusuario)
            .then(function (res) {
                me.mis_cursos = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        openConfirmCurso() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar este curso?',
                accept: this.acceptAlertCurso
            })
        },
        acceptAlertCurso() {
            let me = this

            axios.get('https://server.ipuiecotocollao.com/api/elimiar_curso/' + me.id_curso)
            .then(function (res) {
                me.$vs.notify({
                    color: 'danger',
                    title: 'Curso eliminado',
                    text: 'Este curso ya no estará disponible para ningún usuario'
                })
                me.getCursos()
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
</style>
