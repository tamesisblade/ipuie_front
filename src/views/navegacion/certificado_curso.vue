<template>
<div style="height: 800px; background-image: url(https://server.ipuiecotocollao.com/images/certificados/certificado_cursos.jpg)">
  <h1>CERTIFICADO</h1>
  <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  <h1>asdsadsa</h1>
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
            // usuario: []

        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {

    },
    methods: {

    },
}
</script>
