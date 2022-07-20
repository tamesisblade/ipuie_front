<template>
<div align="center" class="pt-5 px-5">

    <vs-popup title="Inscritos en este evento" :active.sync="popupVerInscritos">
        <vs-table max-items="10" search pagination :data="inscritos">
          <template slot="header">
              <vs-button color="warning" size="small" style="font-size: 14px;" @click="exportToExcel">Exportar</vs-button>
          </template>
          <template slot="thead">
            <vs-th sort-key="identificacion">Identificacion</vs-th>
            <vs-th sort-key="nombres">Nombres</vs-th>
            <vs-th sort-key="apellidos">Apellidos</vs-th>
            <vs-th sort-key="email">Email</vs-th>
            <vs-th sort-key="telefono">Teléfono</vs-th>
            <vs-th sort-key="genero">Género</vs-th>
          </template>
          <template slot-scope="{ data }">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td> {{ data[indextr].identificacion }} </vs-td>
              <vs-td> {{ data[indextr].nombres }} </vs-td>
              <vs-td> {{ data[indextr].apellidos }} </vs-td>
              <vs-td> {{ data[indextr].email }} </vs-td>
              <vs-td> {{ data[indextr].telefono }} </vs-td>
              <vs-td> {{ data[indextr].genero }} </vs-td>
            </vs-tr>
          </template>
        </vs-table>
    </vs-popup>

    <vs-popup title="Inscripción" :active.sync="popupInscripcion">
    <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-code" label="Identificación" icon-no-border v-model="identificacion" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-code" label="Nombres" icon-no-border v-model="nombres" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-code" label="Apellidos" icon-no-border v-model="apellidos" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-code" label="Email" icon-no-border v-model="email" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-code" label="Teléfono" icon-no-border v-model="telefono" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
            <div class="text-sm text-gray mt-1">Género</div>
            <v-select :options="['Masculino','Femenino']" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="genero" />
        </div>
        <div class="vx-col mt-6 w-full" align="center">
            <vs-button class="w-full" @click="inscripcion()">Guardar</vs-button>
        </div>
    </div>
    </vs-popup>


    <div class="vx-row">
        <div class="vx-col sm:w-1/5 w-full mb-6" style="min-width: 250px;" :key="index" v-for="(item, index) in eventos">
        <vx-card align="justify">
            <div slot="no-body" style="margin: 0% !important;">
                <img style="height: 200px;" :src="$server_images+'eventos/' + item.img_portada" alt="content-img" class="responsive card-img-top">
            </div>
            <h5 class="mb-1"> {{item.title}} </h5>
            <div class="text-grey mb-3" style="font-size: 12px;"> {{item.subtitle}} </div>
            <div align="center">

                <vs-button style="font-size: 12px; padding: 5px; display: inline-block; width: 45%;" class="m-1" size="small" type="line" color="primary" @click="irEvento(item.link)">Ver evento</vs-button>
                
                <vs-button style="font-size: 12px; padding: 5px; display: inline-block; width: 45%;" class="m-1" size="small" type="line" color="#b9b9b9" @click="identificacion=''; nombres=''; apellidos=''; email=''; telefono=''; genero=''; id_evento = item.id; popupInscripcion = true;">Inscribirse</vs-button>

                <div v-if="usuario[0]">
                    <vs-button v-if="usuario[0].id_group == 1" style="font-size: 12px; padding: 5px; display: inline-block; width: 100%;" class="mt-3" size="small" type="filled" color="dark" @click="verInscritos(item.id)">Ver inscritos</vs-button>
                </div>

            </div>

        </vx-card>
        </div>
    </div>


</div>

</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview
    },
    data() {
        return {
            usuario: [],
            eventos: [],
            inscritos: [],
            popUpEliminar: false,
            id_evento: '',
            popupInscripcion: false,
            popupVerInscritos: false,
            identificacion: '',
            nombres: '',
            apellidos: '',
            email: '',
            telefono: '',
            genero: '',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if( !this.usuario ){
          this.usuario = []
        }
    },
    mounted() {
        this.getEventos()
    },
    methods: {
        irEvento(item){
            localStorage.id_evento_inscripcion = item.id_evento
            this.$router.push('/detalle_evento/'+item.id_evento)
        },
        getEventos(){
            let me = this
            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/eventos')
            .then(function (res) {
                me.eventos = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        openConfirmEvento() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar este evento?',
                accept: this.acceptAlertEvento
            })
        },
        acceptAlertEvento() {
            let me = this

            axios.get('http://127.0.0.1:8000/api/elimiar_evento/' + me.id_evento)
            .then(function (res) {
                me.$vs.notify({
                    color: 'danger',
                    title: 'Evento eliminado',
                    text: 'Este evento ya no estará disponible para ningún usuario'
                })
                me.getEventos()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        inscripcion() {
            let me = this
            if( me.identificacion == '' || me.nombres == '' || me.apellidos == '' || me.email == '' || me.telefono == '' || me.genero == '' ){
                me.$vs.notify({
                    color: 'warning',
                    title: 'Campos obligatorios',
                    text: 'Complete todos los campos para poder inscribirse.'
                })
                return
            }

            let formData = new FormData();
            formData.append('id_evento', me.id_evento);
            formData.append('identificacion', me.identificacion);
            formData.append('nombres', me.nombres);
            formData.append('apellidos', me.apellidos);
            formData.append('email', me.email);
            formData.append('telefono', me.telefono);
            formData.append('genero', me.genero);
            axios.post('http://127.0.0.1:8000/api/inscripcion_evento', formData)
            .then(function (res) {
                me.popupInscripcion = false
                me.$vs.notify({
                    color: 'success',
                    title: 'Éxito',
                    text: 'Inscripción exitosa'
                })
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        irEvento(link){
            window.open(link, '_blank');
        },
        verInscritos(id_evento){
            let me = this
            me.$vs.loading()
            axios.get('http://127.0.0.1:8000/api/ver_inscritos/' + id_evento)
            .then(function (res) {
                me.$vs.loading.close()
                me.inscritos = res.data
                me.popupVerInscritos = true
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        exportToExcel () {
            let headerTitle = ['identificacion', 'nombres', 'apellidos', 'email', 'telefono', 'genero'];
            let headerVal = ['identificacion', 'nombres', 'apellidos', 'email', 'telefono', 'genero'];

            import('@/vendor/Export2Excel').then(excel => {
                const list = this.inscritos
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: 'inscritos',
                    autoWidth: true,
                    bookType: 'xlsx'
                })
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },


        
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}
</style>
