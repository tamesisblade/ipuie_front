<template>
<div class="pt-5 px-3">
    <vx-card align="center" style="position: relative;">
        <vs-button style="position: absolute; left: 0; top: 0;" class="p-2" type="border" color="dark" @click="$router.go(-1)">Regresar</vs-button>

        <div style="font-size: 35px;" class="w-full mb-2"><b>{{blog.titulo}}</b></div>

        <div class="w-full">
          <div style="font-size: 20px;" class="mb-base">{{blog.subtitulo}}</div>

          <div class="detalle_scrollmenu w-full" v-html="blog.contenido"></div>
        </div>


        <vs-divider>Déjanos saber tu valoración de este blog</vs-divider>

        <div class="w-full flex justify-center">
          <star-rating :rtl="$vs.rtl" v-model="valoracion" @rating-selected="guardar_valoracion" :glow="10" :border-width="4" border-color="#d8d8d8" :rounded-corners="true" :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"></star-rating>
        </div>
    </vx-card>
</div>
</template>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
import StarRating from 'vue-star-rating'
import $ from "jquery";
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    components: {
      StarRating
    },
    data() {
        return {
            usuario: [],
            blog: {titulo:'', subtitulo:'', contenido:'', id_blog:''},
            id_blog: '',
            valoracion: 0,
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.id_blog = this.$route.params.id_blog

        this.getBlog()
    },
    methods: {
        getBlog(){
            let me = this
            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/blogs/'+me.id_blog)
            .then(function (res) {
                me.blog = res.data.items.blog[0]

                setInterval(function () {
                  $('p[data-f-id="pbf"]').css('display', 'none');
                }, 3000);

                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        guardar_valoracion(){
          let me = this
            me.$vs.loading()
            let usuario = 0
            if( me.usuario[0] ){
              usuario = me.usuario[0].idusuario
            }
            axios.get('http://127.0.0.1:8000/api/guardar_valoracion_blog/'+me.id_blog+'/'+usuario+'/'+me.valoracion)
            .then(function (res) {
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Valoración guardada correctamente.', color:'success', iconPack: 'feather', icon:'icon-check'})
            })
            .catch(function (error) { me.$vs.loading.close() })
        }
    },
}
</script>


<style>
@media only screen and (max-width: 775px) {
  .detalle_scrollmenu {
    overflow: auto;
    white-space: nowrap;
  }
  img{
    max-width: 600px !important;
  }
}
@media only screen and (max-width: 500px) {
  img{
    max-width: 350px !important;
  }
}
</style>
