<template>
<div class="pt-5 px-3" align="center">

    <div v-if="usuario[0]" align="center" class="mb-2">
        <v-select style="width:50%; display: inline-block;" class="btn_categorias m-1" :options="categorias" :reduce="categorias => categorias" label="nombre_categoria" v-model="categoria_selected" @input="filtro_categoria()"></v-select>

        <vs-button style="width:15% display: inline-block;" class="btn_categorias m-1" v-if="usuario[0].id_group == 1" type="gradient" color="primary" @click="$router.push('/creacion_blog/0')">Crear un blog</vs-button>

        <vs-button style="width:15% display: inline-block;" class="btn_categorias m-1" v-if="usuario[0].id_group == 1" type="gradient" color="danger" @click="eliminar_categoria()">Eliminar categoria</vs-button>
    </div>

    <div v-if="blogs.length > 0">
      <div class="vx-row mb-6" :key="index" v-for="(item, index) in blogs" style="background-color: white; border-radius: 10px; min-height: 200px;">

        <div class="content_img_blog" align="center" slot="no-body" style="width: 20%; min-width: 200px; display: inline-block;">
            <img :src="'https://server.ipuiecotocollao.com/images/blogs/' + item.img_portada" style="height: 200px; width: 200px; border-radius: 100%;">
        </div>

        <div class="pl-8 py-5 content_text_blog" style="width: 65%; display: inline-block;" align="justify">
            <h3 class="mb-1"> {{item.titulo}} </h3>

            <star-rating :rtl="$vs.rtl" :inline="true" :star-size="20" :read-only="true" :show-rating="false" :rating="item.valoracion"></star-rating>

            <br>
            <div class="text-grey mb-3" style="font-size: 12px;"> {{item.subtitulo}} </div>

            <div class="w-full flex justify-center">
                <vs-button class="m-2 float-right" style="font-size: 12px; padding: 5px;" size="small" type="line" color="primary" @click="$router.push('/detalle_blog/'+item.id_blog)">Ver blog completo</vs-button>

                <div v-if="usuario[0]">
                    <vs-button v-if="usuario[0].id_group == 1" class="m-2" size="small" style="font-size: 12px;" type="line" color="dark" @click="$router.push('/creacion_blog/'+item.id_blog)">Editar blog</vs-button>
                    <vs-button v-if="usuario[0].id_group == 1" class="m-2" size="small" style="font-size: 12px;" type="line" color="danger" @click="id_blog = item.id_blog; img_blog = item.img_portada; openConfirmBlog();">Borrar blog</vs-button>
                </div>
            </div>
        </div>

      </div>
    </div>
    <div v-else class="pt-12">
      <h3>No existen blogs para la categoría seleccionada.</h3>
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
            blogs: [],
            popUpEliminar: false,
            id_blog: '',
            img_blog: '',
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
        /* console.log(this.usuario) */
    },
    mounted() {
        this.getCategorias()
        this.getBlogs()
    },
    methods: {
        getCategorias(){
            let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/get_categorias')
            .then(function (response) {
                me.categorias = response.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        filtro_categoria(){
          let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/get_blogs_categoria/'+me.categoria_selected.id_categoria)
            .then(function (response) {
                me.blogs = response.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        irInscripcion(){
            localStorage.tipo_registro = 'inscripcion'
            this.$router.push('/inscripcion_blog')
        },
        getBlogs(){
            let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/blogs')
            .then(function (res) {
                me.blogs = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        openConfirmBlog() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar este blog?',
                accept: this.acceptAlertBlog
            })
        },
        acceptAlertBlog() {
            let me = this

            axios.get('https://server.ipuiecotocollao.com/api/elimiar_blog/' + me.id_blog+'/'+me.img_blog)
            .then(function (res) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'blog eliminado',
                    text: 'Este blog ya no estará disponible para ningún usuario'
                })
                me.getBlogs()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        eliminar_categoria() {
            this.$vs.dialog({
              type: 'confirm',
              color: 'danger',
              title: `Confirmar`,
              text: 'Está seguro de eliminar la categoria: ' + this.categoria_selected.nombre_categoria +'. Ya no estará disponible para ningún blog.',
              accept: this.cofirm_eliminar_categoria
            })
        },
        cofirm_eliminar_categoria() {
            let me = this

            axios.get('https://server.ipuiecotocollao.com/api/eliminar_categoria/' + me.categoria_selected.id_categoria)
            .then(function (res) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Categoria eliminada',
                    text: 'Esta categoría ya no estará disponible para ningún blog'
                })
                location.reload()
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
  .content_img_blog{
    width: 100% !important;
  }
  .content_text_blog{
    text-align: center !important;
  }
  .btn_categorias{
    width: 100% !important;
  }
}

</style>
