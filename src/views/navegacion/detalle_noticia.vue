<template>
<div class="pt-5 lg:p-5">
    <vx-card align="center" style="position: relative;">
        <vs-button style="position: absolute; left: 0; top: 0;" class="p-2" type="border" color="dark" @click="$router.go(-1)">Regresar</vs-button>

        <div style="font-size: 35px;" class="w-full mb-2"><b>{{noticia.titulo}}</b></div>

        <div style="font-size: 20px;" class="w-full mb-base">{{noticia.subtitulo}}</div>

        <div class="w-full detalle_scrollmenu" align="center" style="text-center" v-html="noticia.contenido"></div>

    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    components: {

    },
    data() {
        return {
            usuario: [],
            noticia: {titulo:'', subtitulo:'', contenido:'', id_noticia:''},
            id_noticia: '',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.id_noticia = this.$route.params.id_noticia

        this.getNoticia()
    },
    methods: {
        getNoticia(){
            let me = this
            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/noticias/'+me.id_noticia)
            .then(function (res) {
                me.noticia = res.data.items.noticia[0]
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
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
