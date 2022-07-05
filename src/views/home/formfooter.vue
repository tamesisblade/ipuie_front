<template>
<div class="vx-row w-full" style="background-color: #212F3D; color: #F1C40F; font-size: 15px;">

    <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base p-12">

        <div class="vx-row">
            <div class="vx-col w-full mb-6">
                {{footer.titulo}}
            </div>

            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-2">
                <span>Dirección: </span>
            </div>
            <div class="vx-col w-full lg:w-2/3 sm:w-1/2 mb-2">
                <span> {{footer.direccion}} </span>
            </div>

            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-2">
                <span>Teléfono: </span>
            </div>
            <div class="vx-col w-full lg:w-2/3 sm:w-1/2 mb-2">
                <span>{{footer.telefono}}</span>
            </div>

            <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-2">
                <span>Redes: </span>
            </div>
            <div class="vx-col w-full lg:w-2/3 sm:w-1/2 mb-2">
                <a class="m-1" style="display: inline-block;" :href="footer.url1"><vs-button color="primary" type="border" icon-pack="feather" icon="icon-facebook"></vs-button></a>

                <a class="m-1" style="display: inline-block;" :href="footer.url2"><vs-button color="primary" type="border" icon-pack="feather" icon="icon-youtube"></vs-button></a>

                <a class="m-1" style="display: inline-block;" :href="footer.url3"><vs-button color="primary" type="border" icon-pack="feather" icon="icon-instagram"></vs-button></a>
            </div>

        </div>

    </div>

    <div class="vx-col w-full lg:w-1/3 sm:w-1/2 mb-base pt-5" align="center">
        <div style="width: 95%;">
          <div style="font-size: 12px;">Tu correo</div>
          <vs-input class="w-full mb-1" v-model="correo" />
          <div style="font-size: 12px;">Tu teléfono</div>
          <vs-input class="w-full mb-1" v-model="telefono" />
          <div style="font-size: 12px;">Mensaje</div>
          <vs-textarea class="w-full mb-2" v-model="mensaje" style="background-color: white;" />
          <vs-button class="w-full" type="border" size="small" icon-pack="feather" icon="icon-send" style="font-size: 12px; padding: 5px;" @click="enviarMail()">Enviar mensaje</vs-button>
        </div>
    </div>

    <div class="vx-col w-full lg:w-1/3 sm:w-full mb-base p-12" align="center">
        <img style="width: 120px;" :src="'https://server.ipuiecotocollao.com/images/carrousel/'+footer.imagen"/>
    </div>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)

export default {
    data() {
        return {
            usuario: [],
            correo: '',
            telefono: '',
            mensaje: '',
            footer: { titulo: '', direccion: '', telefono: '', url1: '', url2: '', url3: '', imagen: ''},
        }
    },
    components: {

    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.getFooter()
    },
    methods: {
      getFooter(){
        let me = this

        me.$vs.loading()
        axios.get('https://server.ipuiecotocollao.com/api/get_footer')
        .then(function (response) {
            me.footer = response.data[0]
            me.$vs.loading.close()
        })
        .catch(function (error) { me.$vs.loading.close() })
      },
      enviarMail(){
        let me = this

        me.$vs.loading()

        let formData = new FormData();
        formData.append('correo', me.correo);
        formData.append('telefono', me.telefono);
        formData.append('mensaje', me.mensaje);

        axios.post('https://server.ipuiecotocollao.com/api/enviar_mail', formData)
        .then(function (res) {
            me.$vs.notify({
                text:'Correo enviado exitosamente, nos pondremos en contacto con usted tan pronto como nos sea posible.', color:'success', iconPack: 'feather', icon:'icon-check'})
            me.$vs.loading.close()
        })
        .catch(function (error) {
          me.$vs.notify({
                text:'No se pudo enviar su correo, porfavor intente nuevamente en unos minutos.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})

          me.$vs.loading.close()
        })

      }
    }
}
</script>
