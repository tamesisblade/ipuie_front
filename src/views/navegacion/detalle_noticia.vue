<template>
<div class="pt-5 px-12">
    <vx-card align="center">
        <div class="w-full" align="left" style="margin-bottom: -30px;">
            <vs-button type="border" color="dark" @click="$router.go(-1)">Regresar</vs-button>
        </div>

        <div style="width: 80%; min-width: 350px; font-size: 35px;" class="w-full mb-2"><b>{{noticia.titulo}}</b></div>

        <div style="width: 80%; min-width: 350px; font-size: 20px;" class="w-full mb-base">{{noticia.subtitulo}}</div>

        <div style="width: 80%; min-width: 350px;" v-html="noticia.contenido"></div>

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
            axios.get('https://server.ipuiecotocollao.com/api/noticias/'+me.id_noticia)
            .then(function (res) {
                me.noticia = res.data.items.noticia[0]
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
    },
}
</script>
