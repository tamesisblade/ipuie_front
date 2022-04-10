<template>

<div class="w-full parallax" :style="'color: '+parallax.color_texto+'; background-image: url(http://localhost:8000/images/carrousel/'+parallax.imagen+');'">
  <div class="w-full vx-row p-12">
    <div class="vx-col w-full lg:w-3/4 sm:w-1/2 mb-base px-8">
        <div style="font-size: 30px; color: white;" class="mb-base">
          <!-- Vive una <b style="font-size: 50px; color: blue;">experiencia</b> divina. -->
          <b>{{parallax.titulo}}</b>
        </div>

        <div style="font-size: 22px; color: white;" class="mb-base">
            {{parallax.descripcion}}
        </div>
    </div>


    <div class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base">
        <div class="swiper-inner">
        <!-- swiper -->
            <swiper :options="swiperOption" :dir="$vs.rtl ? 'rtl' : 'ltr'" :key="$vs.rtl">
                <swiper-slide :key="index" v-for="(item, index) in lados_cubo">
                  <img class="responsive" :src="'http://localhost:8000/images/carrousel/'+item.imagen" alt="banner">
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
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
            parallax: {},
            lados_cubo: [],
            swiperOption: {
                effect: 'cube',
                grabCursor: true,
                cubeEffect: {
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94
                },
                pagination: {
                    el: '.swiper-pagination'
                }
            },
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    mounted() {
      this.getParallax()
      this.getLadosCubo()
    },
    methods: {
      getParallax(){
        let me = this
        me.$vs.loading()
        axios.get('http://localhost:8000/api/get_parallax')
        .then(function (response) {
            me.parallax = response.data[0]
            me.$vs.loading.close()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      getLadosCubo(){
        let me = this

        me.$vs.loading()
        axios.get('http://localhost:8000/api/get_lados_cubo')
        .then(function (response) {
            me.lados_cubo = response.data
            me.$vs.loading.close()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
    }
}
</script>


<style>
.parallax {
  min-height: 500px;
  width: 100%;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

<style scoped>
.swiper-inner {
    position: relative;
    overflow: hidden;
    height: 330px;
    padding: 15px;
}

.swiper-container {
    width: 300px !important;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -150px;
    margin-top: -150px;
}

.swiper-slide {
    background-position: center;
    background-size: cover;
}
</style>
