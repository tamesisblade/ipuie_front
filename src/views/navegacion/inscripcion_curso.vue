<template>
<div align="center" class="pt-6">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0">
        <vx-card title="Solicitud de inscripción" subtitle="Una vez que envies tu solicitud de inscripción, el administrador deberá aprobarla antes de que puedas acceder al curso.">
            <div slot="no-body" class="full-page-bg-color-black">

                <div class="vx-col sm:w-full md:w-full">
                    <div class="px-8 py-5 login-tabs-container">

                        <div class="vx-row mb-3" align="left">
                          <div class="vx-col sm:w-1/2 w-full mb-6">
                            <span>Forma de pago</span>
                            <v-select class="w-full mr-3" :options="formas_pago" :reduce="formas_pago => formas_pago" label="label" v-model="forma_pago"></v-select>
                          </div>
                          <!-- <div class="vx-col sm:w-1/3 w-full mb-6">
                            <span>Valor</span>
                            <vs-input class="w-full" v-model="valor" />
                          </div> -->
                          <div class="vx-col sm:w-1/2 w-full mb-6">
                            <span>Comprobante</span>
                            <input type="file" name="file1" id="file1" class="w-full inputfile">
                          </div>
                          <div class="vx-col w-full mb-6">
                            <vs-textarea label="Solicitud" class="w-full" v-model="solicitud" />
                          </div>
                        </div>

                        <div class="vx-row">
                            <vs-button class="m-1" @click="guardar()">Enviar</vs-button>
                            <vs-button color="dark" type="border" class="m-1" @click="$router.go(-1)">Volver</vs-button>
                        </div>
                    </div>
                </div>
            </div>
        </vx-card>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            solicitud: '',
            usuario: [],
            id_curso: '',
            formas_pago: [
              {id: 'EF', label: 'Efectivo'},
              {id: 'TJ', label: 'Tarjeta'},
              {id: 'DEP', label: 'Depósito'},
              {id: 'TR', label: 'Transferencia'},
              {id: 'CH', label: 'Cheque'},
            ],
            forma_pago: {},
            valor: 0,
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.id_curso = localStorage.getItem('id_curso_inscripcion');
        if (localStorage.tk == null) {
            this.$router.push('/login');
        }
    },
    methods: {
        guardar(item) {
            let me = this

            let fileImgPreg = document.getElementById("file1").files[0];

            me.$vs.loading()
            let formData = new FormData();
            formData.append('id_curso', me.id_curso)
            formData.append('id_estudiante', me.usuario[0].idusuario)
            formData.append('solicitud', me.solicitud)
            formData.append('comprobante', fileImgPreg)
            formData.append('forma_pago', me.forma_pago.label)
            formData.append('valor', me.valor)
            formData.append('estado', 2)
            axios.post("https://server.ipuiecotocollao.com/api/inscripcion_curso", formData)
            .then(function (response) {
              if( response.data == '0' ){
                me.$vs.notify({
                    color: 'warning',
                    title: 'Usted ya ha enviado una solicitud de inscripción, por favor espere a que el administrador lo apruebe.',
                })
              }else{
                me.$vs.notify({
                    color: 'success',
                    title: 'Solicitud enviada exitosamente, por favor espera la aprobación.',
                })
              }

                me.$vs.loading.close()
                me.$router.go(-1);
            })
            .catch(function (error) {
              me.$vs.loading.close()
            })

        },
    }
}
</script>

<style>
.uploading-image {
    display: flex;
}

.inputfile{
    border: 1px solid rgb(190, 190, 190);
    width: 100%;
    border-radius: 5px;
    padding: 5px;
    height: 37px;
}
</style>
