<template>
    <div style="background-color: #1C2833; color: #F1C40F;" id="footer_ipuie">

      <formfooter/>
      <footer class="the-footer flex-wrap justify-between">
          <p>
            <span>COPYRIGHT &copy;</span>
            <span>{{ new Date().getFullYear() }} </span>
            <a href="https://1.envato.market/vuexy_admin" target="_blank" rel="nofollow"></a>
            <span class="hidden sm:inline-block"></span>
          </p>
          <span class="md:flex hidden items-center">
              <!-- <vx-tooltip text="Ing. Alejandro Llano" position="top" >
                <span>Desarrolado: 0987852142</span>
              </vx-tooltip>
              <feather-icon icon="PhoneIcon" svgClasses="stroke-current text-primary w-6 h-6" class="ml-2" /> -->
          </span>
      </footer>

    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

import formfooter from '../../views/home/formfooter.vue'

Vue.use(axios)

export default {
    data() {
        return {

        }
    },
    components: {
        formfooter
    },
    mounted() {
    },
    methods: {

    }
}
</script>
