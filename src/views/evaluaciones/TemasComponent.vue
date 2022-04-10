<template>
    <div>

        <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Tema" :active.sync="popupAddTema">
                <vs-input class="inputx mb-3 w-full" label="Nombre Tema" v-model="tema.nombre"/>
                Asignatura: 
                <v-select class="mb-3" v-model="tema.asignatura" :options="asignaturas" :value="asignaturaSelected" :dir="$vs.rtl ? 'rtl' : 'ltr'" @input="getUnidadesAsignatura()" />
                
                Unidad:
                <v-select class="mb-3" v-model="tema.unidad" :options="unidades_asignatura" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <vs-input class="inputx mb-6 w-full" label="Destreza/indicador (opcional)" v-model="tema.clasificacion"/>

                <vs-button color="success" class="w-full mb-3" type="gradient" @click="agregar()">Guardar</vs-button>
            </vs-popup>
        </div>
        <!----FIN MODAL AGREGAR-->



        <!-- Modal Editar Temas-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Tema" :active.sync="popupEditTema">

                <vs-input class="inputx mb-3 w-full" label="Nombre Tema" v-model="tema.nombre"/>

                Asignatura:
                <v-select class="mb-3" v-model="tema.asignatura" :options="asignaturas" :dir="$vs.rtl ? 'rtl' : 'ltr'" @input="getUnidadesAsignatura()" />

                Unidad: 
                <v-select class="mb-3" v-model="tema.unidad" :options="unidades_asignatura" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <vs-input class="inputx mb-6 w-full" label="Clasificación (opcional)" v-model="tema.clasificacion"/>

                <vs-button color="success" class="w-full mb-3" type="gradient" @click="editarTema(tema)">Editar</vs-button>
            </vs-popup>
        </div>
        <!----FIN MODAL EDITAR---->


        <!--LISTADO DE TEMA-->
        <div align="center">
            
            <vs-table v-model="temaSelected" pagination max-items="25" search :data="temas">
                
                <template slot="header">
                    <vs-button @click="limpiar(); popupAddTema=true" color="dark" size="small" style="font-size: 14px;" type="filled" class="mr-4">Crear tema</vs-button>

                    <vs-button @click="$router.push('/bancopreguntas')" color="primary" size="small" style="font-size: 14px;" type="filled">Crear preguntas</vs-button>
                </template>

                <template slot="thead">
                    <vs-th sort-key="clasificacion">Destreza</vs-th>
                    <vs-th sort-key="pregunta">Tema</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>

                <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                    <vs-td :data="data[indextr].clasificacion">
                        {{ data[indextr].clasificacion }}
                    </vs-td>

                    <vs-td :data="data[indextr].nombre_tema">
                        {{ 'Tema: ' + data[indextr].label }}<br><!--label=nombre_tema-->
                        {{ 'Asignatura: ' + data[indextr].nombreasignatura }}<br>
                        {{ 'Unidad: ' + data[indextr].unidad }}<br>
                    </vs-td>

                    <vs-td :data="data[indextr].id">
                        <vs-button @click="editarFormulario(data[indextr]); popupEditTema=true" color="success" type="gradient" style="font-size: 12px; padding: 7px 7px 7px 7px; width: 80px; display: inline-block;" size="small" v-if="usuario.idusuario===data[indextr].idusuario || usuario.id_group===1 || usuario.id_group===5">editar</vs-button>

                        <vs-button @click="id_tema=data[indextr].id; itemTemas=data[indextr]; openConfirm();" color="danger" type="gradient" style="font-size: 12px; padding: 7px 7px 7px 7px; width: 80px; display: inline-block;" size="small" v-if="usuario.idusuario===data[indextr].idusuario || usuario.id_group===1 || usuario.id_group===5">eliminar</vs-button>
                    </vs-td>

                </vs-tr>
                </template>
            </vs-table>

        </div>
    </div>

</template>

<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import moment from 'moment'
    export default {
        data(){
            return {
                temas: [],
                tema: {nombre: '', asignatura: '', unidad: '', clasificacion: ''},
                temaBuscar: null,
                asignaturas: [],
                asignatura: {id: '', label: ''},
                editarActivo: false,
                temaSelected: [],
                asignaturaSelected: {id: '', label: ''},
                popupAddTema: false,
                popupEditTema: false,
                usuario: [],
                docente: null,
                unidades: [
                    {
                    id: "1", label: "Unidad 1", }, { id: "2", label: "Unidad 2", }, { id: "3", label: "Unidad 3", }, { id: "4", label: "Unidad 4", }, { id: "5", label: "Unidad 5", }, { id: "6", label: "Unidad 6", }, { id: "7", label: "Unidad 7", }, { id: "8", label: "Unidad 8", }, { id: "9", label: "Unidad 9", }, { id: "10", label: "Unidad 10",
                    },
                ],
                unidades_asignatura: [],
                id_tema: '',
                itemTemas: [],
            }
        },
        components: {
            'v-select': vSelect,
            flatPickr
        },
        async created(){
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
            this.docente = this.usuario.idusuario
            this.verTemas();
        },
        methods: {
            onResize() {
            if (window.innerWidth < 769)
                this.isMobile = true;
            else
                this.isMobile = false;
            },
            limpiar(){
                this.tema.nombre = '';
                // this.tema.asignatura = '';
                this.tema.unidad = '';
            },
            verTemas(){
                let me = this
                if( localStorage.idasignatura ){
                    this.tema.asignatura = {id: localStorage.idasignatura, label: localStorage.nombreasignatura}
                }

                me.$vs.loading()
                switch (this.usuario.id_group) {
                    case 1 || 5:
                        this.$http.get(this.$server_url+'tema').then(res => {
                            this.temas = res.data;
                        }).then(res => {
                            this.$vs.loading.close()
                        }),
                        this.$http.get(this.$server_url+'asignaturasDoc/0').then(res => {
                            this.asignaturas = res.data;
                        })
                        break;
                    default:
                        this.$http.get(this.$server_url+'tema/'+this.usuario.idusuario).then(res => {
                            this.temas = res.data;
                        }).then(res => {
                            this.$vs.loading.close()
                        }),
                        this.$http.get(this.$server_url+'asignaturasCreaDoc/'+this.usuario.idusuario).then(res => {
                            this.asignaturas = res.data;
                        })
                        break;
                }
                
            },
            agregar(){//datos que se obtienen de los inputs
                if(this.tema.nombre.trim() === '' || this.tema.unidad === ''){
                    this.$vs.notify({
                        text:'Debe completar todos los campos antes de guardar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }
                
                let id_unidad = this.tema.unidad.id
                if( this.tema.unidad.id === null ){
                    id_unidad = ''
                }
                
                let num_unidad = this.tema.unidad.unidad
                if( this.tema.unidad.unidad === undefined || this.tema.unidad.unidad === null ){
                    // es una unidad no registrada para un tema sin asignatura
                    id_unidad = ''
                    num_unidad = this.tema.unidad.id
                }

                let formData = new FormData();
                    formData.append('nombre', this.tema.nombre);
                    formData.append('asignatura', this.tema.asignatura.id);
                    formData.append('unidad', num_unidad);
                    formData.append('id_unidad', id_unidad);
                    formData.append('clasificacion', this.tema.clasificacion);
                    formData.append('idusuario', this.docente);
                    formData.append('estado', 1);
                this.$vs.loading()
                this.$http.post(this.$server_url+'tema', formData)
                .then(res => {
                    
                    this.verTemas()
                    this.popupAddTema = false
                    this.$vs.loading.close()
                    this.$vs.notify({
                    text:'Tema guardado exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
            },
            openConfirm() {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Confirmar`,
                    text: '¿Está seguro de eliminar este tema y todas las preguntas que contenga?',
                    accept: this.eliminarTema
                })
            },
            getUnidadesAsignatura(){
                let me = this;
                me.unidades_asignatura = []
                this.$http.get(this.$server_url+'unidades_asignatura/' + me.tema.asignatura.id)
                .then(res => {
                    if( res.data.length > 0 ){
                        me.unidades_asignatura = res.data
                    }else{
                        me.unidades_asignatura = me.unidades
                    }
                    
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            eliminarTema(){
                let me = this;
                let formData = new FormData();
                    formData.append('id_tema', me.id_tema);
                    formData.append('idusuario', me.usuario.idusuario);
                this.$http.post(this.$server_url+'eliminar_tema', formData).then(() => {
                    me.removeItemFromArr(me.temas, me.itemTemas)
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            removeItemFromArr (arr, item) {
                const i = arr.indexOf(item)
                arr.splice(i, 1)
            },
            editarFormulario(item){
                this.asignaturaSelected = {id: item.id_asignatura, label: item.nombreasignatura};
                this.tema.nombre = item.label;//nombre_tema=label
                this.tema.asignatura = {id: item.id_asignatura, label: item.nombreasignatura};
                this.tema.unidad = {id: item.id_unidad, label: 'Unidad '+item.unidad, unidad: item.unidad};
                this.tema.id = item.id;
                this.tema.clasificacion = item.clasificacion;
                this.editarActivo = true;//activa el form editar
                this.getUnidadesAsignatura();
            },
            editarTema(item){
                let id_unidad = this.tema.unidad.id
                if( this.tema.unidad.id === null ){
                    id_unidad = ''
                }
                
                let num_unidad = this.tema.unidad.unidad
                if( this.tema.unidad.unidad === undefined || this.tema.unidad.unidad === null ){// es una unidad no registrada para un tema sin asignatura
                    id_unidad = ''
                    num_unidad = this.tema.unidad.id
                }

                let formData = new FormData();
                    formData.append('id', item.id);
                    formData.append('nombre', this.tema.nombre);
                    formData.append('asignatura', this.tema.asignatura.id);
                    formData.append('unidad', num_unidad);
                    formData.append('id_unidad', id_unidad);
                    formData.append('clasificacion', this.tema.clasificacion);
                    formData.append('idusuario', this.docente);
                    formData.append('estado', 1);
                
                this.$vs.loading()
                    
                this.$http.post(this.$server_url+`tema`, formData).then(res => {
                    const index = this.temas.findIndex(
                        temaBuscar => temaBuscar.id === res.data.id)
                    this.tema[index] = res.data;

                    this.verTemas()
                    this.editarActivo = false;
                    this.popupEditTema = false
                    this.$vs.loading.close()
                    this.$vs.notify({
                    text:'Tema editado exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    
                });
            },
        },
    }
</script>