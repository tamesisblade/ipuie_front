<template>
<div>
<!------ELEGIR TIPO PREGUNTA--------->
<vs-popup fullscreen classContent="popup-example" title="Crear Preguntas" :active.sync="popupTipoPreg">

<div class="vx-row">
<div class="vx-col sm:w-1/4 w-full mb-4">
    <vx-card v-if="usuario.id_group === 1 || usuario.id_group === 5">
        <div class="btn-group" align="center">
            <vs-button type="flat" v-if="usuario.id_group === 1 || usuario.id_group === 5 || asignaturaSelected.id>619" color="primary" @click="irTemas">Crear {{tema_ambito}}</vs-button>
        </div>
        <vs-divider v-if="editarActivo===false"/>
        
        <div class="btn-group" align="center" v-if="editarActivo===false">
            <vs-button type="flat" class="w-full" @click="pregTipo = 5; limpiar(); pregunta.puntaje_pregunta = 1; ">Selección simple</vs-button>
            <vs-button type="flat" class="w-full" @click="pregTipo = 1; limpiar(); pregunta.puntaje_pregunta = 1; ">Opción múltiple</vs-button>
            <vs-button type="flat" class="w-full" @click="pregTipo = 3; limpiar(); pregunta.puntaje_pregunta = 0.5; ">Verdadero/Falso</vs-button>
            <!--<vs-button type="flat" class="w-full" @click="pregTipo = 4; limpiar()" style="min-width: 150px;">Si/No</vs-button>-->
            <vs-button type="flat" class="w-full" @click="pregTipo = 2; limpiar(); pregunta.puntaje_pregunta = 2; ">Pregunta cerrada</vs-button>
            <vs-button type="flat" class="w-full" @click="pregTipo = 6; limpiar(); pregunta.puntaje_pregunta = 2; ">Pregunta abierta</vs-button>
        </div>
    </vx-card>
    <vx-card v-if="usuario.id_group === 6">                
        <div class="btn-group" align="center" v-if="editarActivo===false">
            <vs-button type="flat" class="w-full" @click="pregTipo = 5; limpiar(); pregunta.puntaje_pregunta = 1; ">Selección simple</vs-button>
            <vs-button type="flat" class="w-full" @click="pregTipo = 1; limpiar(); pregunta.puntaje_pregunta = 1; ">Opción múltiple</vs-button>
            <vs-button type="flat" class="w-full" @click="pregTipo = 3; limpiar(); pregunta.puntaje_pregunta = 0.5; ">Verdadero/Falso</vs-button>
            <!--<vs-button type="flat" class="w-full" @click="pregTipo = 4; limpiar()" style="min-width: 150px;">Si/No</vs-button>-->
            <vs-button type="flat" class="w-full" @click="pregTipo = 2; limpiar(); pregunta.puntaje_pregunta = 2; ">Pregunta cerrada</vs-button>
            <vs-button type="flat" class="w-full" @click="pregTipo = 6; limpiar(); pregunta.puntaje_pregunta = 2; ">Pregunta abierta</vs-button>
        </div>
    </vx-card>
</div>
<!-------FIN BOTONES TIPOS PREGUNTA------------>

    
    
<!-------INICIO MODAL CREAR PREGUNTAS--------->
<div class="vx-col sm:w-3/4 w-full">
<vx-card v-bind:title="titPregTipo" title-color="primary" v-bind:subtitle="txtPregTipo">
    <vs-tabs alignment="fixed">
    <vs-tab label="Pregunta">
        <div class="vx-row mb-5 mt-4">
            <!------------SELEC TEMA PREGUNTA-------------------->
            <div class="vx-col sm:w-1/2 w-full">
                Asignatura
                <v-select class="mb-2" v-model="asignaturaSelected" :options="asignaturas" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                Unidad
                <v-select class="mb-2" v-model="unidadSelected" :options="unidades" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>

            
            <div class="vx-col w-full">
                {{tema_ambito}}
                <vx-input-group class="mb-2">
                    <v-select v-model="pregunta.tema" @input="verpreguntasxtema()" :options="temas" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                    <template slot="append">
                        <div class="append-text btn-addon">
                        <vs-button color="primary" v-if="usuario.id_group === 1 || usuario.id_group === 5 || asignaturaSelected.id>619" @click="$router.push('/temas')">Crear {{tema_ambito}}</vs-button>
                        </div>
                    </template>
                </vx-input-group>
            </div>
            <!------------FIN SELEC TEMA PREGUNTA-------------------->

        </div>

        <div class="vx-row mb-5">
            <div class="vx-col w-full">
                <div style="border: 1px solid #d5d5d5; border-radius: 10px; padding: 5px 5px 5px 5px;" align="center" class="mb-2">
                    <input type="file" name="file1" id="file1" class="inputfile" style="display: none;" v-on:change="mostrarImg(1,1)">
                    <label for="file1" style="margin-bottom: -10px; cursor: pointer; color: gray; width: 100%; font-size: 11px; line-height: 80%;">
                        Click aquí para subir imagen de la pregunta
                    </label>
                    <div v-if="src_imagen_pregunta==='' || src_imagen_pregunta===null || src_imagen_pregunta==='null'"></div>
                    <img id="img1" class="img-responsive mb-2" v-bind:src="src_imagen_pregunta" style="border-radius: 5px;" v-else>
                </div>
                <!--<div align="center">
                    <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small" @click="src_imagen_pregunta = ''"></vs-button>
                </div>-->
            </div>
            <div class="vx-col w-full">
                <vs-textarea class="mb-4" label="Nombre Pregunta" v-model="pregunta.descripcion"  height="80px"/>
            </div>

            <div class="vx-col sm:w-1/2 w-full">
                <vs-input disabled v-if="usuario.institucion_idInstitucion != 66" type="number" class="mb-4 w-full" label="Puntaje" placeholder="Puntaje" v-model="pregunta.puntaje_pregunta"/>
                <vs-input v-else disabled type="number" class="mb-4 w-full" label="Puntaje" placeholder="Puntaje" v-model="pregunta.puntaje_pregunta"/>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2" align="right">
                <div v-if="editarActivo===true">
                    <vs-button class="w-full mt-6" @click="editarPregunta" type="filled">Editar pregunta</vs-button>
                </div>
                
                <div v-else>
                    <vs-button class="w-full mt-6" v-if="guardadoActivo===false" color="success" type="filled" @click="agregar()">Guardar pregunta</vs-button>
                </div>
            </div>
        </div>
        
            
    </vs-tab>


    <!-------INICIO TAB OPCIONES PREG TIPO 1, 5----->
    <vs-tab label="Opciones" v-if="pregTipo===1 || pregTipo===5">
        <div class="vx-col w-full mb-2" style="padding: 10px;">
        <vs-divider position="left" color="success">Crear opciones</vs-divider>

        <div class="vx-row mb-2" id="editar">
            <div class="vx-col w-full mb-1">
                <div style="border: 1px solid #d5d5d5; border-radius: 5px; padding: 5px 5px 5px 5px;" align="center">
                    <input type="file" name="file2" id="file2" class="inputfile" style="display: none;" v-on:change="mostrarImg(2,2)">
                    <label for="file2" style="margin-bottom: -10px; cursor: pointer; color: gray; width: 100%; font-size: 11px;">
                        Click aquí para subir imagen
                    </label>
                    <div v-if="src_imagen_opcion==='' || src_imagen_opcion===null || src_imagen_opcion==='null'"></div>
                    <img id="img2" style="border-radius: 5px;" class="img-responsive mb-2" v-bind:src="src_imagen_opcion" v-else>
                </div>
                <!--<div align="center">
                    <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small" @click="src_imagen_opcion = ''"></vs-button>
                </div>-->

                <vs-textarea class="mt-2" label="Nombre Opción" v-model="opcion.opcion" height="60px"/>
            </div>

            <div class="vx-row w-full" v-if="pregTipo===1 || pregTipo===5">

                <div class="vx-col sm:w-1/2 w-full" align="center">
                    <vs-switch style="width: 100px;" color="success" class="mt-3 mb-5" v-model="opcion.tipo">
                        <span slot="on">Correcta</span>
                        <span slot="off">Incorrecta</span>
                    </vs-switch>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-1" align="center">
                    <vs-button v-if="editarOpcionActiva===false" color="success" type="flat" icon-pack="feather" icon="icon-plus" @click="cargarOpcion()">Agregar</vs-button>

                    <vs-button v-else color="primary" class="w-full" type="flat" icon-pack="feather" icon="icon-edit-1" @click="confirmEditarOpcion(opcion)">Editar</vs-button>
                </div>
            </div>
        </div>
        </div>

        <div class="vx-col w-full">
        <vs-divider position="center" color="primary">Opciones agregadas</vs-divider>

        <div class="vx-row mb-3" :key="indexitem" v-for="(item, indexitem) in opciones">

            <div class="vx-col sm:w-1/5 w-full" align="center">
                <img v-if="item.img_opcion" style="border-radius: 5px;" v-bind:src="$data_url+'archivos/img/img_preguntas/'+item.img_opcion" width="100%">
            </div>
            <div class="vx-col sm:w-4/5 w-full">
                <vs-input class="w-full" v-model="item.opcion"/>

                <div class="vx-row" align="center">
                <div class="vx-col sm:w-1/3 w-full">
                    <vs-switch style="width: 100px;" disabled="true" color="success" class="mt-3 mb-5" v-model="item.tipo">
                        <span slot="on">Correcta</span>
                        <span slot="off">Incorrecta</span>
                    </vs-switch>
                </div>
                <div class="vx-col sm:w-1/3 w-full">
                    <vs-button color="primary" type="line" icon-pack="feather" icon="icon-edit-1" size="small" @click="src_imagen_opcion=''; editarOpcionActiva=true; editarOpcion(item)">Editar</vs-button>
                </div>
                <div class="vx-col sm:w-1/3 w-full">
                    <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small" @click="quitarOpcion(item)">Eliminar</vs-button>
                </div>
                </div>
            </div>
        </div>
        </div>
    </vs-tab>
    <!-------FIN TAB OPCIONES PREG TIPO 1, 5----->


    <!-------INICIO TAB OPCIONES PREG TIPO 3, 4----->
    <vs-tab label="Respuesta" v-if="pregTipo===3 || pregTipo===4">
        <div v-if="pregTipo===3" class="mt-6">
        
        <div v-if="opciones.length > 0">
            <vx-card class="mb-3" :key="indexitem" v-for="(item, indexitem) in opciones">
                <vs-radio v-model="opcion.opcion" v-bind:vs-value="item.opcion">{{item.opcion}}</vs-radio>
            </vx-card>
        </div>
        <div v-else>
            <vx-card class="mb-4 mt-6">
                <vs-radio v-model="opcion.opcion" vs-value="Verdadero">Verdadero</vs-radio>
            </vx-card>

            <vx-card class="mb-4">
                <vs-radio v-model="opcion.opcion" vs-value="Falso">Falso</vs-radio>
            </vx-card>
        </div>
        </div>

        <div v-if="pregTipo===4" class="mt-6">
        <div v-if="opciones.length > 0">
            <vx-card class="mb-3" :key="indexitem" v-for="(item, indexitem) in opciones">
                <vs-radio v-model="opcion.opcion" v-bind:vs-value="item.opcion">{{item.opcion}}</vs-radio>
            </vx-card>
        </div>
        <div v-else>
            <vx-card class="mb-4 mt-6">
                <vs-radio v-model="opcion.opcion" vs-value="Si">Si</vs-radio>
            </vx-card>

            <vx-card class="mb-4">
                <vs-radio v-model="opcion.opcion" vs-value="No">No</vs-radio>
            </vx-card>
        </div>
        </div>

        <div class="vx-col w-full mt-6" align="right">
            <vs-button v-if="editarActivo===true" color="primary" type="filled" icon-pack="feather" icon="icon-edit-1" @click="editarOpcionesDico()">Editar</vs-button>

            <vs-button v-else color="success" type="filled" @click="cargarOpcionesDico()">Guardar</vs-button>
        </div>
    </vs-tab>
    <!-------FIN TAB OPCIONES PREG TIPO 3, 4----->


    <!-------INICIO TAB OPCIONES PREG CERRADA-------->
    <vs-tab label="Palabras Clave" v-if="pregTipo===2">
        <div class="vx-row mt-6">
            <div class="vx-col w-full">
                <vs-alert :active.sync="active1" closable icon-pack="feather" close-icon="icon-x" class="mb-3">
                    Ejemplo: Forma correcta: <span style="color: green;">24, mayo, 1822</span> - Forma Incorrecta: <span style="color: red;">24 de mayo, 1822 </span>
                </vs-alert>

                <div style="color: #1A76FA;" class="mb-4 w-full">Evite usar caracteres especiales como: punto, signos de expresión etc...</div>

                <vs-textarea class="mb-3" label="Palabras clave de la respuesta" placeholder="Escriba las palabras clave de la respuesta separadas por una coma (,)." v-model="palabras_clave"  height="70px"/>
            </div>
        </div>

        <div class="vx-row w-full">
            <div class="vx-col sm:w-1/2 w-full">
                <vs-input type="number" class="mb-2 w-full" label="Cantidad de coincidencias" v-model="pregunta.cant_coincidencias"/>
            </div>
            <div class="vx-col sm:w-1/2 w-full mt-5">
                <vs-button class="w-full" v-if="editarActivo===true" @click="editarPalabrasclave" type="filled">Editar</vs-button>

                <vs-button class="w-full" v-else @click="cargarOpcionAbierta" color="success" type="filled">Guardar</vs-button>
            </div>
        </div>

    </vs-tab>
    <!------FIN TAB OPCION TIPO PREG ABIERTA----->


    <!-------INICIO TAB PREG ABIERTA-------->
    <vs-tab label="Información" v-if="pregTipo===6">
        <div class="mt-6" align="center">
            <h4 class="mt-6">Esta pregunta no puede tener respuestas. Debe ser calificada manualmente por el docente.</h4>
        </div>
    </vs-tab>
    <!------FIN TAB OPCION TIPO PREG ABIERTA----->


</vs-tabs>
</vx-card>
    <!-------FIN MODAL CREAR PREGUNTAS--------->

</div>
</div>
</vs-popup>
<!------FIN ELEGIR TIPO PREGUNTA--------->



<!--LISTADO DE Pregunta-->
<div>
<vx-card v-if="preguntas.items === undefined">
<div class="vx-row w-full mb-4">
    <div class="vx-col sm:w-1/2 w-full">
        Asignatura
        <v-select class="mb-2" v-model="asignaturaSelected" :options="asignaturas" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>
    <div class="vx-col sm:w-1/2 w-full">
        Unidad
        <v-select class="mb-2" v-model="unidadSelected" :options="unidades" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>

    
    <div class="vx-col w-full">
        {{tema_ambito}}
        <vx-input-group class="mb-2">
            <v-select v-model="pregunta.tema" @input="verpreguntasxtema()" :options="temas" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

            <template slot="append">
                <div class="append-text btn-addon">
                <vs-button color="primary" v-if="usuario.id_group === 1 || usuario.id_group === 5 || asignaturaSelected.id>619" @click="$router.push('/temas')">Crear {{tema_ambito}}</vs-button>
                </div>
            </template>
        </vx-input-group>
    </div>

    
    <div class="vx-col sm:w-1/2 w-full">
        Banco
        <v-select v-model="bancoSelected" class="w-full" :options="bancos" @input="verpreguntasxtema()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>

    <div class="vx-col sm:w-1/2 w-full">
        Tipo
        <v-select class="w-full" v-model="tipoSelected" :options="tipos" @input="filtrarTipos()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>
</div>

<!-- <vs-button v-if="usuario.id_group===6" @click="$router.push('/evaluaciones');" size="small" style="font-size: 14px; display: inline-block;" class="mr-2" color="primary" type="filled">← Evaluaciones</vs-button> -->
<vs-button v-if="pregunta.tema.id!=''" @click="active1!=active1; popupTipoPreg=true; id_preguntaActiva=''; editarOpcionActiva=false; editarActivo=false; pregTipo = 1; limpiar();" size="small" style="font-size: 14px; display: inline-block;" color="dark" class="mr-3" type="filled">Crear pregunta</vs-button>

</vx-card>


<vx-card v-else title-color="primary">
<div class="vx-row w-full mb-4">
    <div class="vx-col sm:w-1/2 w-full">
        Asignatura
        <v-select class="mb-2" v-model="asignaturaSelected" :options="asignaturas" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>
    <div class="vx-col sm:w-1/2 w-full">
        Unidad
        <v-select class="mb-2" v-model="unidadSelected" :options="unidades" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>

    
    <div class="vx-col w-full">
        {{tema_ambito}}
        <vx-input-group class="mb-2">
            <v-select v-model="pregunta.tema" @input="verpreguntasxtema()" :options="temas" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

            <template slot="append">
                <div class="append-text btn-addon">
                <vs-button color="primary" v-if="usuario.id_group === 1 || usuario.id_group === 5 || asignaturaSelected.id>619" @click="$router.push('/temas')">Crear {{tema_ambito}}</vs-button>
                </div>
            </template>
        </vx-input-group>
    </div>

    
    <div class="vx-col sm:w-1/2 w-full">
        Banco
        <v-select v-model="bancoSelected" class="w-full" :options="bancos" @input="verpreguntasxtema()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>

    <div class="vx-col sm:w-1/2 w-full">
        Tipo
        <v-select style="width:240px; min-width: 60px;" v-model="tipoSelected" :options="tipos" @input="filtrarTipos()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>
</div>

<vs-table stripe v-model="pregSelected" pagination max-items="25" search :data="preguntas.items">
    <template slot="header">
        <!-- <vs-button v-if="usuario.id_group===6" @click="$router.push('/evaluaciones');" size="small" style="font-size: 14px;" color="primary" class="mr-2" type="filled">←  Evaluaciones</vs-button> -->
        <vs-button v-if="pregunta.tema.id!=''" @click="active1!=active1; popupTipoPreg=true; id_preguntaActiva=''; editarOpcionActiva=false; editarActivo=false; pregTipo=1; limpiar();" size="small" style="font-size: 14px;" color="dark" class="mr-3" type="filled">Crear pregunta</vs-button>
    </template>

    <template slot="thead">
        <vs-th sort-key="pregunta">Pregunta</vs-th>
        <vs-th sort-key="id_tipo_pregunta">Tipo</vs-th>
        <vs-th>Acciones</vs-th>
    </template>

    <template slot-scope="{data}">
    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

        <vs-td :data="data[indextr].descripcion">
            {{ data[indextr].descripcion }}<br>
            <img v-if="data[indextr].img_pregunta!='' && data[indextr].img_pregunta!='null' && data[indextr].img_pregunta!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+data[indextr].img_pregunta" class="img-responsive" width="100px" style="border-radius: 5px;">

            <vs-collapse>
            <vs-collapse-item>
                <div slot="header">
                    Opciones
                </div>
                <div class="mb-5" :key="indexitem" v-for="(item, indexitem) in data[indextr].opciones">
                <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo===1">Respuesta correcta<br></div>
                <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                <div style="width: 100%"> {{ item.opcion }}<br></div>
                <div style="width: 100%" ><img v-if="item.img_opcion!='' && item.img_opcion!='null' && item.img_opcion!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+item.img_opcion" class="img-responsive" style="border-radius: 5px;" width="100px"></div>
                </div>
            </vs-collapse-item>
            </vs-collapse>
        </vs-td>

        <vs-td :data="data[indextr].nombre_tipo">
            {{data[indextr].nombre_tipo}}
        </vs-td>

        <vs-td :data="data[indextr].id" align="center">
            <vs-button v-if="usuario.idusuario === data[indextr].idusuario || usuario.id_group===1 || usuario.id_group===5" @click="src_imagen_opcion=''; src_imagen_pregunta=''; pregunta.puntaje=1; popupTipoPreg=true; editarFormulario(data[indextr]);" size="small" style="padding: 7px; width: 80px; font-size: 12px;" color="primary" type="gradient" class="m-1">editar</vs-button>

            <vs-button v-if="usuario.idusuario === data[indextr].idusuario || usuario.id_group===1 || usuario.id_group===5" @click="datosEliminar = tr; confirmarEliminarPreg()" size="small" style="padding: 7px; width: 80px; font-size: 12px;" color="danger" type="filled" class="m-1">eliminar</vs-button>

            <vs-button v-if="usuario.id_group===6" @click="cargarPreguntaEval(data[indextr])" size="small" style="padding: 7px; width: 150px; font-size: 12px;" color="success" type="filled" class="m-1">cargar a evaluación</vs-button>
        </vs-td>

    </vs-tr>
    </template>
</vs-table>
</vx-card>


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
    import $ from 'jquery'
    var img_preg_old = '', img_opcion_old = '';
        
    export default {
        data(){
            return {
                asignaturas: [],
                asignatura: {id: '', label: ''},
                preguntas: [],
                pregunta: {descripcion: '', tema: {id: '', label: ''}, respuesta: '', opcion1: '', opcion2: '', opcion3: '', img_pregunta: '', img_respuesta: '', img_opcion1: '', img_opcion2: '', img_opcion3: '', puntaje_pregunta: ''},
                temas: [],
                tema: {id: '', label: '', id_asignatura: '', unidad: ''},
                temaSelected: {id: '', label: ''},
                opcion: {id_opcion_pregunta: '', id_pregunta: '', opcion: '', img_opcion: '', tipo: ''},
                opciones: [],
                editarActivo: false,
                popupAddPreg: false,
                popupEditPreg: false,
                popupTipoPreg: false,
                popupAddPregVarOp: false,
                pregSelected: [],
                pregTipo: 1,
                titPregTipo: '',
                txtPregTipo: '',
                active1: true,
                tipo_opcion: '',
                cargarOpcionActivo: false,
                guardadoActivo: false,
                'tableList': [
                    'vs-th: Component',
                    'vs-tr: Component',
                    'vs-td: Component',
                    'thread: Slot',
                    'tbody: Slot',
                    'header: Slot'
                ],
                usuario: [],
                docente: null,

                id_preguntaActiva: '',
                editarOpcionActiva: false,
                src_imagen_pregunta: '',
                src_imagen_opcion: '',
                palabras_clave: '',
                id_opcion_tipo234: '',
                urlOrigen: '',
                url: '',
                id_pregunta_creada: null,
                opcionselecradio: '',
                asignaturaSelected: '',
                unidadSelected: '',
                unidades: [
                    { id: "1", label: "Unidad 1", }, { id: "2", label: "Unidad 2", }, { id: "3", label: "Unidad 3", }, { id: "4", label: "Unidad 4", }, { id: "5", label: "Unidad 5", }, { id: "6", label: "Unidad 6", }, { id: "7", label: "Unidad 7", }, { id: "8", label: "Unidad 8", }
                ],
                tipoSelected: '',
                tipos: [
                    { id: "1", label: "Opción múltiple", }, { id: "2", label: "Respuesta cerrada", }, { id: "3", label: "Verdadero/Falso", }, { id: "5", label: "Selección simple"}, { id: "6", label: "Respuesta abierta" } 
                ],
                datosEliminar: [],
                idPregEliminar: '',
                bancoSelected: {id:'3',label:'Ambas'},
                bancos: [
                    {id:'1',label:'Preguntas de Prolipa'},
                    {id:'2',label:'Solo mis preguntas'},
                    {id:'3',label:'Ambas'},
                ],
                tema_ambito: 'Tema',
            }
        },
        components: {
            'v-select': vSelect,
            flatPickr
        },
        created(){
            let me = this;
            me.$vs.loading()
            me.usuario = JSON.parse(localStorage.getItem('usuario'));
            me.docente = me.usuario.idusuario
            me.url = location.pathname.split('/');
            var urlBack = window.location.href
            var urlV = urlBack.split('/')
            me.urlOrigen = urlV[0]+'/'+urlV[1]+'/'+urlV[2]+'/temas'
            if( me.url[2] === undefined ){
                this.$http.get(this.$server_url+'asignaturasDoc/0').then(res => {
                    me.asignaturas = res.data;
                    me.$vs.loading.close()
                })
            }else{
                this.$http.get(this.$server_url+'asignaturasDoc/'+me.docente).then(res => {
                    me.asignaturas = res.data;
                    me.$vs.loading.close()
                })
            }

            me.asignaturaSelected = { id: localStorage.idasignatura, label: localStorage.nombreasignatura }
        },
        methods: {
            onResize() {
            if (window.innerWidth < 769)
                this.isMobile = true;
            else
                this.isMobile = false;
            },
            limpiar(){
                this.guardadoActivo = false;
                this.opciones = [];
                this.pregunta.descripcion = '';
                this.pregunta.puntaje_pregunta = '';
                //this.pregunta.tema = '';
                this.pregunta.opcion = '';
                this.opcion.opcion = '';
                this.opcion.tipo = '';
                this.src_imagen_pregunta = '';
                this.src_imagen_opcion = '';
                this.editarActivo = false;
                this.palabras_clave = '';
                this.id_preguntaActiva='';
                this.editarOpcionActiva=false;
                this.pregunta.cant_coincidencias='';
                this.pregunta.puntaje_pregunta=1;
                switch (this.pregTipo) {
                    case 1:
                        this.titPregTipo='Crear pregunta de opción múltiple.';
                        this.txtPregTipo='Esta pregunta puede tener una o varias opciones correctas. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
                        break;
                    case 2:
                        this.titPregTipo='Crear pregunta cerrada';
                        this.txtPregTipo='Esta pregunta debe ser respondida de forma escrita. La respuesta correcta debe contener palabras clave para poder comparar con la respuesta del estudiante.'; 
                        break;
                    case 3:
                        this.titPregTipo='Crear pregunta de Verdadero o Falso';
                        this.txtPregTipo='Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
                        break;
                    case 4:
                        this.titPregTipo='Crear pregunta de tipo dicotómica (Si o No)';
                        this.txtPregTipo='Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
                        break;
                    case 5:
                        this.titPregTipo='Crear pregunta de selección simple';
                        this.txtPregTipo='Esta pregunta puede tener solo una opción correcta. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
                        break;
                    default:
                        this.titPregTipo='Crear pregunta abierta';
                        this.txtPregTipo='Esta pregunta no tiene una respuesta. Es una pregunta de opinión que se deberá calificar manualmente.';
                        break;
                }
            },
            agregar(){
                let me = this;
                if( me.pregunta.descripcion.trim() === '' || me.pregunta.tema === '' || me.pregunta.tema === undefined || me.pregunta.tema === null || this.pregunta.puntaje_pregunta === '' || me.pregunta.puntaje_pregunta === undefined){
                    me.$vs.notify({
                        text:'Debe completar todos los campos antes de guardar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }
                
                if( me.pregunta.tema.id ==='' ){
                    me.$vs.notify({
                        text:'Seleccione un '+me.tema_ambito+' antes de guardar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }

                me.$vs.loading()
                let fileImgPreg
                fileImgPreg = document.getElementById("file1").files[0];
                me.pregunta.file1 = fileImgPreg;

                const formData = new FormData();
                formData.append('descripcion', me.pregunta.descripcion);
                formData.append('tema', me.pregunta.tema.id);
                formData.append('img_pregunta', fileImgPreg);
                formData.append('id_tipo_pregunta', me.pregTipo);
                formData.append('puntaje_pregunta', me.pregunta.puntaje_pregunta);
                formData.append('idusuario', me.usuario.idusuario);
                axios.post(this.$data_url+'api/pregunta', formData)
                .then(res => {
                    me.guardadoActivo = true;
                    me.id_preguntaActiva = res.data.id;
                    me.filtrarTipos()
                    me.$vs.notify({
                    text:'Pregunta creada exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
                .catch(function (error) {
                    console.log(error + ': error al crear pregunta');
                })
                

            },
            cargarOpcion(){
                let me = this;
                if( me.id_preguntaActiva === '' ){
                    me.$vs.notify({
                        text:'Debe crear una pregunta antes de cargar las opciones.',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                }else{
                    me.$vs.loading()
                    
                    const formData = new FormData();

                    let fileImgPreg = document.getElementById("file2").files[0];
                    let tipo = 0;
                    if( me.opcion.tipo === true ){
                        tipo = 1;
                    }
                    formData.append('opcion', me.opcion.opcion);
                    formData.append('id_pregunta', me.id_preguntaActiva);
                    formData.append('img_opcion', fileImgPreg);
                    formData.append('tipo', tipo);
                    formData.append('cant_coincidencias', 0);

                    axios.post(this.$data_url+'api/cargarOpcion', formData)
                    .then(res => {
                        me.opciones = res.data;
                        me.opcion.opcion = '';
                        me.opcion.tipo = '';
                        me.src_imagen_opcion = '';
                        document.getElementById("file2").value = '';
                        me.msgExito('cargada'); 
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }
            },
            cargarOpcionAbierta(){
                let me = this;
                if( me.pregunta.cant_coincidencias === '' || me.pregunta.cant_coincidencias === undefined || me.pregunta.cant_coincidencias < 0){
                    me.$vs.notify({
                    text:'Ingrese la cantidad de coincidencias de palabras clave.',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }

                if( me.id_preguntaActiva === '' ){
                    me.$vs.notify({
                        text:'Debe crear una pregunta antes de cargar las opciones.',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                }else{
                    me.$vs.loading()
                    let tipo = 1;
                    let palabrasV = me.palabras_clave.replace(/ /gi, '')
                    const formData = new FormData();
                    formData.append('opcion', palabrasV);
                    formData.append('id_pregunta', me.id_preguntaActiva);
                    formData.append('img_opcion', null);
                    formData.append('tipo', tipo);
                    formData.append('cant_coincidencias', parseInt(me.pregunta.cant_coincidencias));
                    this.$http.post(this.$server_url+'cargarOpcion', formData)
                    .then(res => {
                        me.opciones = res.data;
                        me.opcion.opcion = '';
                        me.opcion.tipo = '';
                        me.src_imagen_opcion = '';
                        me.msgExito('guardada');
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }
            },
            cargarOpcionesDico(){
                let me = this;
                if( me.id_preguntaActiva === '' ){
                    me.$vs.notify({
                        text:'Debe crear una pregunta antes de cargar las opciones.',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                }else{
                    me.$vs.loading()
                    const formData = new FormData();
                    formData.append('opcion', me.opcion.opcion);
                    formData.append('id_pregunta', me.id_preguntaActiva);
                    formData.append('img_opcion', null);
                    formData.append('tipo', 1);
                    formData.append('cant_coincidencias', 0);
                    this.$http.post(this.$server_url+'cargarOpcionDico', formData)
                    .then(res => {
                        me.opcion.opcion = '';
                        me.opcion.tipo = '';
                        me.src_imagen_opcion = '';
                        me.msgExito('guardada');
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }
            },
            confirmEditarOpcion(item){
                let me = this;
                me.editarOpcionActiva= false;
                
                let fileImgOpcion;
                fileImgOpcion = document.getElementById("file2").files[0];
                
                if(fileImgOpcion === undefined ){
                    fileImgOpcion = item.img_opcion;
                }
                
                let tipo = 0;
                if( me.opcion.tipo === true || me.opcion.tipo === 1 ){
                    tipo = 1;
                }
                
                const formData = new FormData();
                formData.append('opcion', me.opcion.opcion);
                formData.append('tipo', tipo);
                formData.append('img_opcion', fileImgOpcion);
                formData.append('img_opcion_old', img_opcion_old);
                formData.append('id_opcion_pregunta', item.id_opcion_pregunta);
                formData.append('id_pregunta', item.id_pregunta);
                formData.append('cant_coincidencias', 0);
                axios.post(this.$data_url+'api/editarOpcion', formData).
                then(res => {
                    me.opciones = res.data;
                    me.editarOpcionActiva = false;
                    me.opcion.opcion = '';
                    me.opcion.tipo = '';
                    me.src_imagen_opcion = '';
                    me.msgExito('cargada');
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            editarOpcion(item){
                let me = this;             
                location.href = '#editar'
                me.opcion.opcion = '';
                document.getElementById("file2").value = '';

                me.opcion.opcion = item.opcion;
                me.opcion.tipo = item.tipo;
                me.opcion.id_opcion_pregunta = item.id_opcion_pregunta;
                me.opcion.id_pregunta = item.id_pregunta;

                img_opcion_old = item.img_opcion;
                me.src_imagen_opcion = this.$data_url+'archivos/img/img_preguntas/'+item.img_opcion;
            },
            editarOpcionesDico(){
                let me = this;
                me.$vs.loading()
                const formData = new FormData();
                    formData.append('opcion', me.opcion.opcion);
                    formData.append('id_pregunta', me.id_preguntaActiva);
                    formData.append('img_opcion', null);
                    formData.append('tipo', 1);
                    formData.append('id_opcion', 1);
                    formData.append('cant_coincidencias', 0);

                this.$http.post(this.$server_url+'cargarOpcionDico', formData)
                .then(res => {
                    me.msgExito('editada');
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            confirmarEliminarPreg(){
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: 'Confirmar',
                    text: '¿Está seguro de eliminar esta pregunta?',
                    accept: this.eliminarPregunta
                })
            },
            eliminarPregunta(){
                let me = this;
                this.$http.get(this.$server_url+`eliminarPregunta/`+me.datosEliminar.id).then(() => {
                    me.filtrarTipos();
                    
                    /*this.$http.get(this.$server_url+'preguntasDocente/'+me.usuario.idusuario).then(res => {
                        me.preguntas = res.data;
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error + ': error al eliminar pregunta');
                    })*/
                })
                .catch(function (error) {
                    alert(error+'NO SE PUEDE ELIMINAR ESTA PREGUNTA, YA QUE SE ESTÁ UTILIZANDO EN UNA EVALUACIÓN.');
                })
            },
            quitarOpcion(item){
                let me = this;
                me.$vs.loading()
                this.$http.get(this.$server_url+'quitarOpcion/'+item.id_opcion_pregunta)
                .then(res => {
                    me.removeItemFromArr(me.opciones, item)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            editarFormulario(item){
                let me = this;
                me.limpiar();
                me.pregTipo = item.id_tipo_pregunta;
                me.id_preguntaActiva = item.id;
                me.temaSelected = {id: item.id_tema, label: item.nombre_tema};
                me.pregunta.descripcion = item.descripcion;
                me.pregunta.tema = {id: item.id_tema, label: item.nombre_tema};
                me.pregunta.id = item.id;
                me.pregunta.img_pregunta = item.img_pregunta;
                me.pregunta.puntaje_pregunta = item.puntaje_pregunta;
                img_preg_old = item.img_pregunta;
                if(item.img_pregunta!=''){
                    me.src_imagen_pregunta = this.$data_url+'archivos/img/img_preguntas/'+item.img_pregunta;
                }                
                
                me.editarActivo = true;
                ///mostrar opciones
                this.$http.get(this.$server_url+'verOpciones/'+ item.id)
                .then(res => {
                    if(res.data.length > 0){
                        me.opciones = res.data;
                        me.palabras_clave = res.data[0].opcion;
                        me.id_opcion_tipo234 = res.data[0].id_opcion_pregunta;
                        me.opcion.opcion = res.data[0].opcion;
                        me.pregunta.cant_coincidencias = res.data[0].cant_coincidencias;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            editarPregunta(){
                let me = this;
                if( me.pregunta.descripcion.trim() === '' || me.pregunta.tema === '' || me.pregunta.tema === undefined || me.pregunta.tema === null || me.pregunta.puntaje_pregunta === '' || me.pregunta.puntaje_pregunta === undefined){
                    me.$vs.notify({
                        text:'Debe completar todos los campos antes de guardar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }

                me.$vs.loading()
                let fileImgPreg;
                fileImgPreg = document.getElementById("file1").files[0];
                if(fileImgPreg === undefined ){
                    fileImgPreg = me.pregunta.img_pregunta;
                }
                
                const formData = new FormData();
                formData.append('descripcion', me.pregunta.descripcion);
                formData.append('tema', me.pregunta.tema.id);
                formData.append('img_pregunta', fileImgPreg);
                formData.append('img_pregunta_old', img_preg_old);
                formData.append('id', me.pregunta.id);
                formData.append('puntaje_pregunta', me.pregunta.puntaje_pregunta);
                formData.append('idusuario', me.usuario.idusuario);
                
                axios.post(this.$data_url+'api/pregunta', formData).then(res => {

                    me.msgExito('editada');
                    
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            mostrarImg(file, img){
                let me = this;
                me.src_imagen_opcion = ' ';
                me.src_imagen_pregunta = ' ';
                var archivo = document.getElementById("file"+file).files[0];
                var reader = new FileReader();
                if (me) {
                    reader.readAsDataURL(archivo );
                    reader.onloadend = function () {
                        //document.getElementById("img"+img).style.display = "block";
                        document.getElementById("img"+img).src = reader.result;
                    }
                }
            },
            removeItemFromArr (arr, item) {
                const i = arr.indexOf(item)
                arr.splice(i, 1)
            },
            editarPalabrasclave(){
                let me = this;
                if( me.pregunta.cant_coincidencias === '' || me.pregunta.cant_coincidencias === undefined || me.pregunta.cant_coincidencias < 0){
                    me.$vs.notify({
                    text:'Ingrese la cantidad de coincidencias de palabras clave.',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
                var cantCoin = parseInt(me.pregunta.cant_coincidencias)
                if( me.id_opcion_tipo234 != '' ){
                    me.$vs.loading()
                    let palabrasV = me.palabras_clave.replace(/ /gi, '')
                    const formData = new FormData();
                    formData.append('opcion', palabrasV);
                    formData.append('tipo', 1);
                    formData.append('img_opcion', '');
                    formData.append('img_opcion_old', '');
                    formData.append('id_opcion_pregunta', me.id_opcion_tipo234);
                    formData.append('id_pregunta', me.pregunta.id);
                    formData.append('cant_coincidencias', cantCoin);

                    this.$http.post(this.$server_url+'editarOpcion', formData).
                    then(res => {
                        me.opciones = res.data;
                        me.editarOpcionActiva = false;
                        me.opcion.opcion = '';
                        me.opcion.tipo = '';
                        me.src_imagen_opcion = '';
                        me.msgExito('editada');
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }else{
                    me.cargarOpcionAbierta()
                }
            },
            msgExito(tipo_msg){
                let me = this;
                var tipobanco;
                if( me.bancoSelected===null || me.bancoSelected==='' ){
                    tipobanco ='todos'
                }else{
                    if( me.bancoSelected.id==='3'){
                        tipobanco = 'todos'
                    }
                    if(me.bancoSelected.id==='1'){
                        tipobanco = 'prolipa'
                    }

                    if(me.bancoSelected.id==='2'){
                        tipobanco = 'docente'
                    }
                }
                me.tipoSelected = '';
                const formData = new FormData();
                    formData.append('id', me.pregunta.tema.id);
                    formData.append('tipobanco', tipobanco);
                    formData.append('usuario', me.usuario.idusuario);

                this.$http.post(this.$server_url+'preguntasxtema', formData).then(res => {
                    me.preguntas = res.data;
                    me.editarActivo = false;
                    if(tipo_msg != 'cargada'){
                        me.popupTipoPreg = false;
                    }
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Pregunta '+ tipo_msg +' exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
                .catch(function (error) {
                    console.log(error);
                })
                
            },
            verpreguntasxtema(){
                let me = this;
                if(me.pregunta.tema.id===undefined || me.pregunta.tema.id===null || me.pregunta.tema.id==='' || me.pregunta.tema===''){
                    return;
                }

                var tipobanco;
                if( me.bancoSelected===null || me.bancoSelected==='' ){
                    tipobanco ='todos'
                }else{
                    if( me.bancoSelected.id==='3'){
                        tipobanco = 'todos'
                    }
                    if(me.bancoSelected.id==='1'){
                        tipobanco = 'prolipa'
                    }

                    if(me.bancoSelected.id==='2'){
                        tipobanco = 'docente'
                    }
                }
                
                me.$vs.loading()
                me.tipoSelected = '';
                const formData = new FormData();
                    formData.append('id', me.pregunta.tema.id);
                    formData.append('tipobanco', tipobanco);
                    formData.append('usuario', me.usuario.idusuario);

                this.$http.post(this.$server_url+'preguntasxtema', formData).then(res => {
                    me.preguntas = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            irTemas(){
                let me = this;
                me.popupTipoPreg = false;
                window.location.href = me.urlOrigen;
            },
            filtrarPreguntas(){
                let me = this;
                me.preguntas.id = ''
                if( me.asignaturaSelected.id === undefined ){
                    me.$vs.notify({
                        text:'Seleccione una asignatura antes de filtrar por Unidades',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }

                if( me.asignaturaSelected.id===113 || me.asignaturaSelected.id===114 || me.asignaturaSelected.id===115 ){
                    me.tema_ambito = 'Ámbito'
                }else{
                    me.tema_ambito = 'Tema'
                }

                if( me.unidadSelected.id === undefined ){
                    return;
                }
                me.temas = []
                me.pregunta.tema.id = ''
                me.$vs.loading()
                const formData = new FormData();
                    formData.append('asignatura', me.asignaturaSelected.id);
                    formData.append('unidad', me.unidadSelected.id);

                this.$http.post(this.$server_url+'temasignunidad', formData).then(res => {
                    me.temas = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })

            },
            filtrarTipos(){
                let me = this;
                if( me.pregunta.tema.id === ''){
                    return;
                }
                
                if( me.tipoSelected===null || me.tipoSelected===undefined || me.tipoSelected==='' || me.tipoSelected==='null'  ){
                    me.verpreguntasxtema()
                }else{

                    var tipobanco;
                    if( me.bancoSelected===null || me.bancoSelected==='' ){
                        tipobanco ='todos'
                    }else{
                        if( me.bancoSelected.id==='3'){
                            tipobanco = 'todos'
                        }
                        if(me.bancoSelected.id==='1'){
                            tipobanco = 'prolipa'
                        }
                        if(me.bancoSelected.id==='2'){
                            tipobanco = 'docente'
                        }
                    }

                    me.$vs.loading()
                    const formData = new FormData();
                        formData.append('tema', me.pregunta.tema.id);
                        formData.append('tipo', me.tipoSelected.id);
                        formData.append('usuario', me.usuario.idusuario);
                        formData.append('tipobanco', tipobanco);

                    this.$http.post(this.$server_url+'preguntastipo', formData).then(res => {
                        me.preguntas = res.data;
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }
                
            },
            cargarPreguntaEval(item) {
                let me = this;
                me.$vs.loading()
                let formData = new FormData();
                    formData.append('id_evaluacion', localStorage.id_desde_eval);
                    formData.append('id_pregunta', item.id);
                    formData.append('grupo', localStorage.grupo_desde_eval);
                me.$http.post(this.$server_url+'pregEvaluacion', formData)
                .then(res => {
                    let msg = 'Pregunta cargada correctamente'
                    if( res.data == 0 ){
                        msg = 'No puede cargar más de una vez la misma pregunta'
                    }
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text: msg,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
            },
        },
    }
</script>