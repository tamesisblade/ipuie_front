<template>
<div class="pt-5 px-3" align="center">
    
    <div v-if="usuario[0]" style="position: absolute; top: 0; right: 0;">
        <vs-button radius color="primary" type="gradient" size="large" icon-pack="feather" icon="icon-plus" v-if="usuario[0].id_group == 1" @click="$router.push('/creacion_documentos_ministeriales/0')"></vs-button>
    </div>

    <div v-if="documentos.length > 0">

      <div :key="index" v-for="(item, index) in documentos" style="background-color: white; border-radius: 10px; min-height: 200px; padding: 20px;">

        <div class="vx-row mb-6 w-full" v-if="index%2==0">
        <div class="vx-col sm:w-1/3 w-full">
            <img :src="'http://127.0.0.1:8000/images/ministeriales/' + item.imagen" style="width: 100%; max-width: 450px; border-radius: 10px;">
        </div>

        <div class="vx-col sm:w-2/3 w-full">
            <b><h3 class="mb-6 text-3xl font-bold"> {{item.titulo}} </h3></b>
            <div class="text-gray text-xl mb-3" v-html="item.descripcion"></div>

            <div class="pl-8 py-5 content_text_documento" style="width: 65%; display: inline-block;" align="justify">
                <div class="w-full flex justify-center">
                    <div v-if="usuario[0]">
                        <vs-button v-if="usuario[0].id_group == 1" class="m-2" size="small" style="font-size: 12px;" type="line" color="dark" @click="$router.push('/creacion_documentos_ministeriales/'+item.id_ministeriales)">Editar documento</vs-button>
                        <vs-button v-if="usuario[0].id_group == 1" class="m-2" size="small" style="font-size: 12px;" type="line" color="danger" @click="id_documento = item.id_ministeriales; img_documento = item.imagen; openConfirmBlog();">Borrar documento</vs-button>
                    </div>
                </div>
            </div>
        </div>
        <vs-divider class="divider_doc" style="display: none;"></vs-divider>
        </div>

        <div class="vx-row mb-6 w-full" v-else>

        <div class="vx-col sm:w-2/3 w-full">
            <b><h3 class="mb-6 text-3xl font-bold"> {{item.titulo}} </h3></b>
            <div class="text-gray text-xl mb-3" v-html="item.descripcion"></div>

            <div class="pl-8 py-5 content_text_documento" style="width: 65%; display: inline-block;" align="justify">
                <div class="w-full flex justify-center">
                    <vs-button class="m-2 float-right" style="font-size: 12px; padding: 5px;" size="small" type="line" color="primary" @click="$router.push('/detalle_documento/'+item.id_documento)">Ver documento completo</vs-button>

                    <div v-if="usuario[0]">
                        <vs-button v-if="usuario[0].id_group == 1" class="m-2" size="small" style="font-size: 12px;" type="line" color="dark" @click="$router.push('/creacion_documentos_ministeriales/'+item.id_ministeriales)">Editar documento</vs-button>
                        <vs-button v-if="usuario[0].id_group == 1" class="m-2" size="small" style="font-size: 12px;" type="line" color="danger" @click="id_documento = item.id_ministeriales; img_documento = item.imagen; openConfirmBlog();">Borrar documento</vs-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-col sm:w-1/3 w-full">
            <img :src="'http://127.0.0.1:8000/images/ministeriales/' + item.imagen" style="width: 100%; max-width: 450px; border-radius: 10px;">
        </div>
        <vs-divider class="divider_doc" style="display: none"></vs-divider>
        </div>

      </div>

    </div>
</div>
</template>

<script>
import StarRating from 'vue-star-rating'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        StarRating
    },
    data() {
        return {
            usuario: [],
            documentos: [],
            popUpEliminar: false,
            id_documento: '',
            img_documento: '',
            categorias: [],
            categoria_selected: {},
            valoracion: 3,
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.getDocumentos()
    },
    methods: {
        getDocumentos(){
            let me = this
            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/documentos_ministeriales')
            .then(function (res) {
                me.documentos = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        openConfirmBlog() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar este documento?',
                accept: this.acceptAlertDocumento
            })
        },
        acceptAlertDocumento() {
            let me = this

            axios.get('http://127.0.0.1:8000/api/eliminarDocumento/' + me.id_documento+'/'+me.img_documento)
            .then(function (res) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'documento eliminado',
                    text: 'Este documento ya no estará disponible para ningún usuario'
                })
                me.getDocumentos()
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
  .content_img_documento{
    width: 100% !important;
  }
  .content_text_documento{
    text-align: center !important;
  }
  .btn_categorias{
    width: 100% !important;
  }
  .divider_doc{
    display: block !important;
  }
}

</style>
