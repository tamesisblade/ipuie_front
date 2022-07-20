<template>
<div>
    <div>
        <swiper :options="swiperOption" :dir="$vs.rtl ? 'rtl' : 'ltr'" :key="$vs.rtl">
            <swiper-slide :key="index" v-for="(item, index) in carruseles">
                <img class="responsive_carrousel" :src="'http://127.0.0.1:8000/images/carrousel/'+item.imagen">

                <div :style="'position: relative; top: -450px; margin-bottom: -350px;'" class="px-12">
                    <div class="mb-base" :style="'width: 100%; min-width: 350px; font-size: 35px; color: '+item.color_texto+';'"> {{item.titulo}} </div>
                    <br>
                    <div :style="'width: 60%; min-width: 250px; padding: 10px 20px 10px 20px; border-radius: 5px; background-color: '+item.color+'; font-size: 28px; color: white;'" class="mb-base"> {{item.texto}} </div>

                    <div class="texto_3" :style="'width: 80%; min-width: 350px; font-size: 28px; color: '+item.color_texto+';'" align="justify">{{item.descripcion}}</div>
                </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
    </div>


</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'
import VxTimeline from '@/components/timeline/VxTimeline'
import vSelect from 'vue-select'

import 'swiper/dist/css/swiper.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    data() {
        return {
            usuario: [],
            carruseles: [],
            swiperOption: {
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            },
        }
    },
    components: {
        VueApexCharts,
        StatisticsCardLine,
        ChangeTimeDurationDropdown,
        VxTimeline,
        'v-select': vSelect,
        swiper,
        swiperSlide
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.getCarruseles()
    },
    methods: {
        getCarruseles(){
          let me = this

          me.$vs.loading()
          axios.get('http://127.0.0.1:8000/api/carruseles')
          .then(function (response) {
              me.carruseles = response.data
              me.$vs.loading.close()
          })
          .catch(function (error) { me.$vs.loading.close() })

        },
    }
}
</script>

<style>
  .responsive_carrousel{
      width: 100%;
      min-width: 450px;
      height: 550px;
  }

  @media only screen and (max-width: 775px) {
    .texto_3{
      display: none !important;
    }
  }
</style>
