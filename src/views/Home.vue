<template>
<div class="p-0" :style="'background-image: url('+$server_images+'carrousel/'+img_fondo+'); background-size: cover;'">

    <carrousel class="mb-6" />

    <noticias/>

    <parallax/>

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

import carrousel from '../views/home/carrousel.vue'
import noticias from '../views/home/noticias.vue'
import parallax from '../views/home/parallax.vue'

export default {
    data() {
        return {
            usuario: [],
            img_fondo: '',
        }
    },
    components: {
        VueApexCharts,
        StatisticsCardLine,
        ChangeTimeDurationDropdown,
        VxTimeline,
        'v-select': vSelect,
        carrousel,
        noticias,
        parallax,
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.getFondo()
    },
    methods: {
        getFondo(){
          let me = this
          me.$vs.loading()
          axios.get('http://127.0.0.1:8000/api/get_fondo')
          .then(function (response) {
              me.img_fondo = response.data[0].imagen
              me.$vs.loading.close()
          })
          .catch(function (error) {  console.log(error); me.$vs.loading.close() })
      }
    }
}
</script>

<style>
.vx-navbar-wrapper{
  background-color: #e7e1db !important;
}
</style>
