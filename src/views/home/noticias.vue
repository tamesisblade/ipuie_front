<template>
<div class="pt-6">

    <div class="w-full mb-5" align="center">
        <span style="font-size: 27px; color: gray;">Noticias de la </span> <span style="font-size: 40px; color: red;">Iglesia</span>
    </div>

    <div class="vx-row w-full px-12 mb-base">
        <!-- OVERLAY CARD -->
        <div class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base" :key="index" v-for="(item, index) in noticias">
            <vx-card class="overlay-card overflow-hidden" style="cursor: pointer; height: 210px;" @click="$router.push('/detalle_noticia/'+item.id_noticia)">
                <template slot="no-body">
                    <img :src="'https://server.ipuiecotocollao.com/images/noticias/'+item.img_portada" alt="user-profile-cover" class="responsive" style="cursor: pointer; height: 210px;">
                    <div class="card-overlay text-white flex flex-col justify-between">
                        <h4 class="text-white mb-4">{{item.titulo}}</h4>
                        <p>{{item.subtitulo}}</p>
                    </div>
                </template>
            </vx-card>
        </div>
    </div>


</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

import 'swiper/dist/css/swiper.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

Vue.use(axios)

export default {
    data() {
        return {
            usuario: [],
            noticias: [],
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    mounted() {
        this.getNoticias()
    },
    methods: {
        getNoticias(){
            let me = this
            me.$vs.loading()
            axios.get('https://server.ipuiecotocollao.com/api/noticias')
            .then(function (res) {
                me.noticias = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
    }
}
</script>
