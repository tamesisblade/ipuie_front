<template>
<div class="pt-5 px-3" align="center">

    <div v-if="usuario[0]" align="right" class="mb-2">
        <vs-button v-if="usuario[0].id_group == 1" type="gradient" color="primary" @click="$router.push('/creacion_noticia/0')">Crear una noticia</vs-button>
    </div>

    <div class="vx-row mb-6" :key="index" v-for="(item, index) in noticias" style="background-color: white; border-radius: 10px; min-height: 220px;">
        <div align="center" slot="no-body" style="width: 20%; min-width: 200px; display: inline-block;" class="content_img_noticia">
            <img :src="'http://127.0.0.1:8000/images/noticias/' + item.img_portada" style="height: 200px; width: 200px; border-radius: 100%;">
        </div>

        <div class="content_noticia px-8 py-5" style="width: 75%; display: inline-block;" align="justify">
            <h4 class="mb-1"> {{item.titulo}} </h4><br>
            <div class="text-grey mb-3" style="font-size: 12px;"> {{item.subtitulo}} </div>

            <div class="w-full flex justify-center">
              <vs-button class="m-2 float-right" style="font-size: 12px; padding: 5px;" size="small" type="line" color="primary" @click="$router.push('/detalle_noticia/'+item.id_noticia)">Ver noticia completa</vs-button>
              <div v-if="usuario[0]">
                  <vs-button v-if="usuario[0].id_group == 1" class="m-2" size="small" style="font-size: 12px;" type="line" color="dark" @click="$router.push('/creacion_noticia/'+item.id_noticia)">Editar noticia</vs-button>
                  <vs-button v-if="usuario[0].id_group == 1" class="m-2" size="small" style="font-size: 12px;" type="line" color="danger" @click="id_noticia = item.id_noticia; img_noticia = item.img_portada; openConfirmNoticia();">Borrar noticia</vs-button>
              </div>
            </div>

        </div>
    </div>

</div>

</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            usuario: [],
            noticias: [],
            popUpEliminar: false,
            id_noticia: '',
            img_noticia: '',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
        /* console.log(this.usuario) */
    },
    mounted() {
        this.getNoticias()
    },
    methods: {
        irInscripcion(){
            localStorage.tipo_registro = 'inscripcion'
            this.$router.push('/inscripcion_noticia')
        },
        getNoticias(){
            let me = this
            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/noticias')
            .then(function (res) {
                me.noticias = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        openConfirmNoticia() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar este noticia?',
                accept: this.acceptAlertNoticia
            })
        },
        acceptAlertNoticia() {
            let me = this

            axios.get('http://127.0.0.1:8000/api/elimiar_noticia/' + me.id_noticia+'/'+me.img_noticia)
            .then(function (res) {
                me.$vs.notify({
                    color: 'danger',
                    title: 'noticia eliminado',
                    text: 'Este noticia ya no estará disponible para ningún usuario'
                })
                me.getNoticias()
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


@media only screen and (max-width: 775px) {
  .content_img_noticia {
    width: 100% !important;
  }
  .content_noticia {
    width: 100% !important;
  }
}
</style>
