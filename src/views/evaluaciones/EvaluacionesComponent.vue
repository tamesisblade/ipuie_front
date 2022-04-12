<template>

<div class="py-3 px-5">
    <vs-popup fullscreen title="Crear preguntas" :active.sync="popupCrearPreguntas">
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                  <vs-input label="Escriba la pregunta" class="w-full" placeholder="Pregunta" v-model="datosPreguntas.txtpregunta"/>
            </vs-col>
            <vs-divider color="warning">Escribe las posibles respuestas</vs-divider>

        </vs-row>

        <vs-row>
            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                 <vs-input label="Respuesta 1" style="width: 90%;" placeholder="Respuesta 1" v-model="datosPreguntas.opcion1"/>
            </vs-col>
            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                 <vs-input label="Respuesta 2" style="width: 90%;" placeholder="Respuesta 2" v-model="datosPreguntas.opcion2"/>
            </vs-col>
        </vs-row>

         <vs-row>
            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                 <vs-input label="Respuesta 3" style="width: 90%;"  placeholder="Respuesta 3" v-model="datosPreguntas.opcion3"/>
            </vs-col>
            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                 <vs-input label="Respuesta 4" style="width: 90%;"  placeholder="Respuesta 4" v-model="datosPreguntas.opcion4"/>
            </vs-col>
        </vs-row>
         <vs-divider class="mt-4" color="success">Seleccione la respuesta a la pregunta</vs-divider>

            <div>
                <ul style="display:flex;flex-direction: row;justify-content: center;">
                    <div>
                        <li>
                          <vs-radio v-model="datosPreguntas.respuesta"  vs-name="radios1" vs-value="1">Respuesta 1</vs-radio>
                        </li>
                    </div>
                    <div>
                         <li>
                          <vs-radio v-model="datosPreguntas.respuesta" class="ml-3" vs-name="radios1" vs-value="2">Respuesta 2</vs-radio>
                        </li>
                    </div>
                    <div>
                         <li>
                          <vs-radio v-model="datosPreguntas.respuesta" class="ml-3" vs-name="radios1" vs-value="3">Respuesta 3</vs-radio>
                        </li>
                    </div>
                    <div>
                         <li>
                          <vs-radio v-model="datosPreguntas.respuesta" class="ml-3" vs-name="radios1" vs-value="4">Respuesta 4</vs-radio>
                        </li>
                    </div>

                </ul>
            </div>


        <vs-row class="mt-5">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button type="relief" @click="generarPregunta()">Generar Pregunta</vs-button>
            </vs-col>
        </vs-row>

    </vs-popup>

    <vs-popup title="Evaluación Aleatoria" :active.sync="popupEvalAleatoria">
        <div align="center" style="padding: 5px; border-radius: 5px; background-color: #FFDCD1; color: #D6623A;" class="mb-2">
            Si modificó las unidades, guarde la evaluación antes de continuar.
        </div>

        <div align="center" style="padding: 5px; border-radius: 5px; background-color: #C8E1FF; color: #1360BA;" class="mb-2">
            Las preguntas aleatorias serán obtenidas únicamente del banco de preguntas de Prolipa
        </div>

        <table style="width: 100%;">
            <tr style="background-color: #e5e5e5;">
                <td><b>Tipo de pregunta</b></td>
                <td align="center"><b>Puntaje</b></td>
                <td align="center"><b>Disponibles</b></td>
                <td align="center"><b>Cantidad</b></td>
            </tr>
            <tbody>
                <tr v-for="(itemop, indexch) in tipospreguntas" :key="indexch">
                    <td> {{ itemop.label }} </td>
                    <td align="center"> {{itemop.puntaje}} pts. </td>
                    <td align="center">{{itemop.cantidad}}</td>
                    <td align="center">
                        <vs-input type="number" v-model="cantidadesField[indexch]" @input="contarPuntosIngresados()" class="mb-4" style="width: 80px; text-align: center;" />
                    </td>
                </tr>
                <tr style="background-color: #e5e5e5;">
                    <td colspan="3" style="vertical-align: middle;"><b>Puntaje preguntas actuales:</b></td>
                    <td align="center">
                        <vs-button type="border" color="success">{{puntajeTotalGrupo}}</vs-button>
                    </td>
                </tr>
                <tr style="background-color: #e5e5e5;">
                    <td colspan="3" style="vertical-align: middle;"><b>Puntaje total:</b></td>
                    <td align="center">
                        <vs-button type="border" color="success" v-if="(puntajeIngresado+puntajeTotalGrupo)<=evaluacion.puntos" style="color: green;">{{puntajeIngresado+puntajeTotalGrupo}}</vs-button>
                        <vs-button type="border" color="danger" v-else style="color: red;">{{puntajeIngresado+puntajeTotalGrupo}}</vs-button>
                    </td>
                </tr>
            </tbody>
        </table>

        <vs-button class="w-full mt-3 mb-2" color="success" type="gradient" @click="cargarPreguntasAleatorias()">Generar preguntas</vs-button>
    </vs-popup>


    <vs-prompt
      @cancel="popupEditEval=true; activePromptGrupo=false;"
      @accept="popupEditEval=true; editarEvaluacion()"
      @close="popupEditEval=true; activePromptGrupo=false;"
      :active.sync="activePromptGrupo">
      <div class="con-exemple-prompt">
        <vs-alert color="danger" active="true">
            {{textoConfirmgrup}}
        </vs-alert>
      </div>
    </vs-prompt>



<vx-card>

    <h2 style="color:#7F7E7E" class="mb-4" v-if="evaluaciones[0]!=null">Sección: {{evaluaciones[0].nombre_curso}}</h2>

    <vs-tabs alignment="fixed">
        <vs-tab label="Evaluaciones" @click="getEvalDoc()">

            <!--LISTADO DE EVALUACIONES-->
            <div align="center" class="mt-4">
                <vs-table stripe v-if="evaluaciones!=0" v-model="evalSelected" pagination max-items="25" search :data="evaluaciones">
                    <template slot="header">
                        <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button>
                        <vs-button @click="limpiar(); popupEditEval=true; agregarActivo=true;" color="dark" type="filled"  class="m-1">Crear mi evaluación</vs-button>
                        <!-- <vs-button @click="irPreguntas" size="small" style="font-size: 14px;" color="primary" type="filled" class="mr-1">Crear Pregunta</vs-button> -->
                    </template>

                    <template slot="thead">
                        <vs-th sort-key="nombre_evaluacion">Evaluación</vs-th>
                        <vs-th sort-key="fecha">Fecha</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>

                    <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                        <vs-td :data="data[indextr].tipo_nombre">
                            <b>Asignatura:</b> {{ data[indextr].nombreasignatura }}<br>
                            <b>Puntos:</b> {{ data[indextr].puntos }} &nbsp;&nbsp;-&nbsp;&nbsp;
                            <b>Duración:</b> {{ data[indextr].duracion }} min<br>
                            <b>Tipo:</b> {{ data[indextr].tipo_nombre }}
                        </vs-td>

                        <vs-td>
                            <b>Inicio:</b> {{ data[indextr].fecha_inicio }}<br>
                            <b>Fin:</b> {{ data[indextr].fecha_fin }}<br>
                            <vs-switch disabled color="success" v-model="data[indextr].estado" style="width: 70px;">
                                <span slot="on">Activa</span>
                                <span slot="off">Inactiva</span>
                            </vs-switch>
                        </vs-td>

                        <vs-td :data="data[indextr].id" style="width: 260px;">
                            <vx-tooltip style="display: inline-block;" text="Editar evaluación" position="top" color="success">
                                <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="agregarActivo=false; editarFormulario(data[indextr]); popupEditEval=true; id_evaluacion=data[indextr].id;" color="success" type="line"></vs-button>
                            </vx-tooltip>

                            <vx-tooltip style="display: inline-block;" text="Previsualizar" position="top" color="dark">
                                <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="irRevision(data[indextr], 1);" color="dark" type="line"></vs-button>
                            </vx-tooltip>

                            <vx-tooltip style="display: inline-block;" text="Eliminar evaluación" position="top" color="danger">
                                <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="openConfirmEliminar(data[indextr]);" color="danger" type="line"></vs-button>
                            </vx-tooltip>

                        </vs-td>
                    </vs-tr>
                    </template>
                </vs-table>

                <vs-button v-if="evaluaciones==0" class="mt-6 mb-6" type="line" @click="limpiar(); popupEditEval=true; agregarActivo=true;" color="primary">Crear evaluación</vs-button>

            </div>
        </vs-tab>

        <vs-tab label="Calificaciones" @click="verCalificaciones()">
            <div v-if="respuestas.length===0" class="mt-6">No existen calificaciones para este curso</div>
            <vs-table stripe v-else pagination max-items="25" search :data="respuestas">
                <template slot="header">
                    <vs-button color="warning" size="small" style="font-size: 14px;" @click="activePrompt=true">Exportar</vs-button>
                </template>
                <template slot="thead">
                    <vs-th sort-key="nombres">Estudiante</vs-th>
                    <vs-th v-for="(item, index) in respuestas[0].calificaciones" :key="index">
                        Ev{{index}}
                    </vs-th>

                </template>
                <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr">
                        {{ tr.Estudiante }}
                    </vs-td>

                    <vs-td :key="$indexs" v-for="(item, $indexs) in tr.calificaciones">
                        <span v-if="item">{{item}}</span>
                        <span v-else>0</span>
                    </vs-td>

                </vs-tr>
                </template>
            </vs-table>
        </vs-tab>
    </vs-tabs>


    <!-- Modal Editar Evaluaciones-->
    <div class="demo-alignment">
        <vs-popup fullscreen classContent="popup-example" v-bind:title="'Evaluación - GRUPO '+radios1" :active.sync="popupEditEval">

        <vs-tabs alignment="fixed">
        <vs-tab label="Evaluación">
            <div class="vx-row mt-4 pt-8">


            <div class="vx-col sm:w-1/2 w-full">
                <vs-input type="text" class="inputx w-full mb-4" label="Nombre Evaluacion" v-model="evaluacion.nombre"/>
            </div>

            <div class="vx-col sm:w-1/2 w-full">
                <div style="font-size: 12px;">Fecha inicio: </div>
                <flat-pickr class="mb-4 w-full" :config="configdateTimePicker" v-model="evaluacion.fecha_inicio" placeholder="Fecha inicio" />
            </div>

            <div class="vx-col sm:w-1/2 w-full" align="left">
                <div style="font-size: 12px;">Fecha fin: </div>
                <flat-pickr class="mb-4 w-full" :config="configdateTimePicker" v-model="evaluacion.fecha_fin" placeholder="Fecha fin" />
            </div>

            <div class="vx-col sm:w-1/2 w-full">
                <vs-input type="number" class="inputx w-full mb-4" label="Duración (minutos)" v-model="evaluacion.duracion"/>
            </div>

            <div class="vx-col sm:w-1/2 w-full">
                <vs-input type="number" class="inputx w-full mb-6" label="Puntos" v-model="evaluacion.puntos"/>
            </div>

            <div class="vx-col sm:w-1/2 w-full">
                <vs-textarea class="inputx w-full mb-6" label="Descripción" v-model="evaluacion.descripcion" />
            </div>

            <div class="vx-col sm:w-1/2 w-full mt-4" align="center">
                <vs-switch vs-icon-on="check" color="success" v-model="evaluacion.estado" style="width: 120px;" class="mt-6 mb-4">
                    <span slot="on">Activa</span>
                    <span slot="off">Inactiva</span>
                </vs-switch>
            </div>

            <div class="vx-col sm:w-1/2 w-full mt-4" align="center">
                <vs-button class="mt-2 mb-2 w-full" v-if="agregarActivo===false" color="primary" type="gradient" @click="editarEvaluacion(evaluacion)">Guardar</vs-button>
                <div v-else>
                <vs-button class="mt-2 mb-2 w-full" v-if="guardadoActivo===false" color="success" type="gradient" @click="agregar()">Guardar</vs-button>
              </div>
            </div>


            </div>
        </vs-tab>

        <vs-tab label="Preguntas" @click="verPreguntasxEval(evaluacion.id);">

            <vs-table stripe v-if="preguntasEvaluaciones!=0" v-model="pregSelected" pagination max-items="25" search :data="preguntasEvaluaciones.items">

                <template slot="header">
                    <vs-button @click="irPreguntas" color="primary" type="line" class="ml-3">Crear pregunta</vs-button>
                </template>

                <template slot="thead">
                    <vs-th sort-key="descripcion" style="font-size: 15px; color: #18DE8A;">Preguntas de mi evaluación</vs-th>
                    <vs-th sort-key="nombre_tipo">Detalle</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].descripcion">
                            Tema: {{ data[indextr].nombre_tema}}<br>
                            {{ data[indextr].descripcion }}
                            <img v-if="data[indextr].img_pregunta!='' && data[indextr].img_pregunta!='null' && data[indextr].img_pregunta!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+data[indextr].img_pregunta" class="img-responsive" style="border-radius: 5px;" width="100px">
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
                            {{data[indextr].clasificacion}}<br>
                            <b>Puntaje:</b> {{data[indextr].puntaje_pregunta}}<br>
                            <b>Tipo:</b> {{data[indextr].nombre_tipo}}
                        </vs-td>

                        <vs-td>
                            <vs-button @click="quitarPregunta(data[indextr], data[indextr].id_pre_evas)" color="danger" style="font-size: 13px;" type="filled" size="small">eliminar</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>

            <div align="center" class="mb-5 mt-5" color="#842993" v-if="preguntasEvaluaciones==0">
                <div class="mt-6" v-if="evaluacion.id===undefined || evaluacion.id===''">
                    Debe crear una evaluación antes de cargar preguntas.
                </div>
                <div v-else class="mt-6">
                    <vs-button @click="irPreguntas" color="primary" type="line" class="ml-3">Crear pregunta</vs-button>
                </div>
            </div>
            </vs-tab>


                <!-----------fin lista preguntas por evaluacion------------->
        </vs-tabs>

        </vs-popup>
    </div>
    <!----fin modal editar--->


    <!-- Modal Preguntas-->
    <div class="demo-alignment">
        <vs-popup fullscreen classContent="popup-example" v-bind:title="'Seleccione las preguntas para esta Evaluación - GRUPO '+radios1" :active.sync="popupSelecPreg">
            <b>Asignatura:</b> {{ local_nombreasignatura }}
            <vs-table stripe v-if="preguntas!=0" v-model="pregSelected" pagination max-items="25" search :data="preguntas.items">

                <template slot="header">
                    <vs-button @click="popupSelecPreg=false; popupEditEval=true;" class="mr-2" size="small" style="font-size: 14px;" color="primary" type="filled"> ← Volver</vs-button>

                    <v-select v-model="unidadSelectedFiltrar" class="mr-2" :options="unidadesFiltrar" @input="filtrarPreguntasxUnidad()" style="width: 180px; min-width: 60px;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                    <v-select v-model="tipoSelected" class="mr-2" :options="tipos" @input="filtrarTipos()" style="width: 250px; min-width: 60px;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                    <v-select v-model="bancoSelected" class="mr-2" :options="bancos" @input="filtrarBancos()" style="width: 250px; min-width: 60px;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                </template>

                <template slot="thead">
                <vs-th sort-key="descripcion">Pregunta</vs-th>
                <vs-th sort-key="tipo">Tipo</vs-th>
                <vs-th>Acciones</vs-th>
                </template>

                <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].descripcion">
                    Tema: {{ data[indextr].nombre_tema }} <br>
                    {{ data[indextr].descripcion }}
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
                    {{data[indextr].clasificacion}}<br>
                    <b>Puntaje:</b> {{data[indextr].puntaje_pregunta}}<br>
                    <b>Tipo:</b> {{data[indextr].nombre_tipo}}
                </vs-td>

                <vs-td :data="data[indextr].id">
                    <vs-button @click="cargarPregunta(data[indextr], data[indextr])" size="small" style="font-size: 13px;" color="success" type="filled">Agregar</vs-button>
                </vs-td>

                </vs-tr>
                </template>
            </vs-table>

            <div class="mb-6 mt-5" color="#842993" v-if="preguntas==0">
                <vs-button @click="popupSelecPreg=false; popupEditEval=true;" class="mr-2" size="small" style="font-size: 14px;" color="primary" type="filled"> ← Volver</vs-button>

                <v-select v-model="unidadSelectedFiltrar" class="mr-2" :options="unidadesFiltrar" @input="filtrarPreguntasxUnidad()" style="display: inline-block; width: 180px; min-width: 60px;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <v-select v-model="tipoSelected" class="mb-6" :options="tipos" @input="filtrarTipos()" style="width: 250px; min-width: 60px; display: inline-block;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <v-select v-model="bancoSelected" class="mr-2" :options="bancos" @input="filtrarBancos()" style="display: inline-block; width: 250px; min-width: 60px;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <div class="w-full mt-6" align="center" style="height: 700px;" v-if="unidadSelected===''">Seleccione una unidad</div>

                <div class="w-full mt-6" align="center" style="height: 700px;" v-else>No existen preguntas para esta unidad.</div>

                <div class="w-full mt-6" align="center" style="height: 700px;" v-if="tipoSelected==='' && unidadSelected!=''">Seleccione un tipo</div>

                <div class="w-full mt-6" align="center" style="height: 700px;" v-else>No existen preguntas para el tipo seleccionado</div>
            </div>

        </vs-popup>
    </div>
    <!----fin modal preguntas--->


</vx-card>
</div>
</template>

<script>
import crearPreguntas from './PreguntasComponent.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import VueRouter from 'vue-router'
import $ from 'jquery'
export default {
    data() {
        return {
            datosPreguntas:{
                txtpregunta:'',
                respuesta:'',
                ocpion1:'',
                ocpion2:'',
                ocpion3:'',
                ocpion4:'',
            },



            evaluaciones: [],
            evaluacion: {
                nombre: '',
                asignatura: '',
                descripcion: '',
                fecha_inicio: '',
                fecha_fin: '',
                estado: '',
                puntos: '',
                duracion: '',
            },
            preguntas: [], //preguntas disponibles para cada evaluacion
            pregunta: {
                descripcion: '',
                respuesta: '',
                opcion1: '',
                opcion2: '',
                opcion3: ''
            },
            preguntasEvaluaciones: [], //preguntas cargadas a las evaluaciones
            preguntaEvaluacion: {
                descripcion: '',
                respuesta: '',
                opcion1: '',
                opcion2: '',
                opcion3: ''
            },
            preguntasEvaluacionesResponder: [],
            preguntaEvaluacioneResponder: {
                descripcion: '',
                id_tema: '',
                respuesta: '',
                opcion1: '',
                opcion2: '',
                opcion3: '',
                img_pregunta: '',
                img_respuesta: '',
                img_opcion1: '',
                img_opcion2: '',
                img_opcion3: ''
            },
            asignaturas: [],
            asignatura: {id: '', label: ''},
            asignaturaSelected: {id: '', label: ''},
            editarActivo: false,
            date: new Date().toJSON(),
            datetime: null,

            agregarActivo: false,
            popupEditEval: false,
            popupSelecPreg: false,
            popupResolver: false,
            estado_evaluacion:['inactiva'],
            evalSelected: [],
            pregSelected: [],
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
            nombre_docente: null,
            apellido_docente: null,
            active1: true,
            calificaciones: [],
            calificacionesSelected: [],
            evaluacionestabla: [],
            respuestas: [],
            estudiantes: [],
            alumnos: [],
            urlOrigen: '',
            id_evaluacion: '',
            guardadoActivo: false,
            unidadSelectedFiltrar: '',
            unidSelect: [],
            unidadesFiltrar: [],
            unidadSelected: [],
            unidades: [
                { id: "1", label: "Unidad 1" },
                { id: "2", label: "Unidad 2" },
                { id: "3", label: "Unidad 3" },
                { id: "4", label: "Unidad 4" },
                { id: "5", label: "Unidad 5" },
                { id: "6", label: "Unidad 6" }
            ],
            tipoSelected: '',
            tipos: [
                { id: "1", label: "Opción múltiple", }, { id: "2", label: "Respuesta cerrada", }, { id: "3", label: "Verdadero/Falso", }, { id: "5", label: "Selección simple"}, { id: "6", label: "Respuesta abierta" }
            ],

            tipoevaluacionselect:'',
            grupo_selected:'',
            grupo_opciones:[
                {id:'1',label:'1 grupo'},
                {id:'2',label:'2 grupos'},
                {id:'3',label:'3 grupos'},
                {id:'4',label:'4 grupos'},
                {id:'5',label:'5 grupos'}
            ],
            cant_grupos_select:'',
            radios1: 1,
            grupoEstudianteSelec: '',
            gruposEstudiantes: [
                {id:'1',label:'Grupo 1'},
                {id:'2',label:'Grupo 2'},
                {id:'3',label:'Grupo 3'},
                {id:'4',label:'Grupo 4'},
                {id:'5',label:'Grupo 5'}
            ],

            activePromptGrupo: false,
            textoConfirmgrup: '',
            puntajeTotalGrupo: 0,
            popupEvalAleatoria: false,
            tipospreguntas: [],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            bancoSelected: {id:'3',label:'Ambas'},
            bancos: [
                {id:'1',label:'Preguntas de Prolipa'},
                {id:'2',label:'Solo mis preguntas'},
                {id:'3',label:'Ambas'},
            ],
            cant_gruposSelec: [1],
            cant_preguntast1: 0,
            cant_preguntast2: 0,
            cant_preguntast3: 0,
            cant_preguntast4: 0,
            cant_preguntast5: 0,
            puntajeIngresado: 0,
            tiposPregAl: [1,2,3,5,6],
            puntajetipo: [1,2,0.5,1,2],
            cantidadesField: [0,0,0,0,0],

            indexCantField: 0,
            evalElimin: [],
            activePromptEliminar: false,
            local_idasignatura: '',
            local_nombreasignatura: '',
            popupCrearPreguntas: false,
        }
    },
    components: {
        'v-select': vSelect,
        'crear-preguntas': crearPreguntas,
        flatPickr
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.docente = me.usuario[0].idusuario
        me.nombre_docente = me.usuario.nombres
        me.apellido_docente = me.usuario.apellidos
        var urlBack = window.location.href
        var urlV = urlBack.split('/')
        me.urlOrigen = urlV[0]+'/'+urlV[1]+'/'+urlV[2]

        me.local_idasignatura = localStorage.idasignatura
        me.local_nombreasignatura = localStorage.nombreasignatura
        console.log(me.local_idasignatura+'--'+me.local_nombreasignatura);

        me.getEvalDoc();


    },
    methods: {

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        onResize() {
            if (window.innerWidth < 769)
                this.isMobile = true;
            else
                this.isMobile = false;
        },
        getEvalDoc(){
            let me = this
            me.$vs.loading()
            let formData1 = new FormData();
            let user = JSON.parse(localStorage.getItem("usuario"))
            let getUser = user[0].idusuario
            formData1.append('docente', getUser);
            formData1.append('codigo', localStorage.id_seccion);
            me.$http.post(this.$server_url+'evaluacionesDocente', formData1).then(res => {
                me.evaluaciones = res.data;
                me.$vs.loading.close()
                // console.log(me.evaluaciones)
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        generarPregunta(){
             let me = this
            me.$vs.loading()
            let formData1 = new FormData();
            formData1.append('pregunta', me.datosPreguntas.txtpregunta);
            formData1.append('respuesta', me.datosPreguntas.respuesta);
                formData1.append('opcion1', me.datosPreguntas.opcion1);
                formData1.append('opcion2', me.datosPreguntas.opcion2);
                formData1.append('opcion3', me.datosPreguntas.opcion3);
                formData1.append('opcion4', me.datosPreguntas.opcion4);
            formData1.append('usuario', me.usuario[0].idusuario);
            formData1.append('evaluacion_id', localStorage.id_desde_eval);
            me.$http.post(this.$server_url+'guardarEvaluacion', formData1).then(res => {
                me.evaluaciones = res.data;
                me.$vs.loading.close()
                me.getEvalDoc()
                me.popupCrearPreguntas = false;
                me.popupEditEval = true
                // console.log(me.evaluaciones)
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
            })
        },
        limpiar() {
            this.evaluacion.nombre = '';
            this.evaluacion.duracion = '';
            this.evaluacion.descripcion = '';
            this.evaluacion.fecha_inicio = '';
            this.evaluacion.fecha_fin = '';
            this.evaluacion.estado = '';
            this.evaluacion.puntos = '';
            this.preguntas = [];
            this.preguntasEvaluaciones = [];
            this.evaluacion.id = '';
            this.guardadoActivo = false;
            this.unidadSelected = [];
            this.grupo_selected = '';
            this.radios1 = 1;
        },
        agregar() {
            let me = this;
            if (me.evaluacion.fecha_inicio.trim() === '' || me.evaluacion.fecha_fin.trim() === '' || me.evaluacion.puntos === '' || me.evaluacion.duracion === '' || me.tipoevaluacionselect.id === '' || me.grupo_selected.id === '' || me.unidadSelected.id === '' ){

                me.$vs.notify({
                    text:'Debe completar todos los campos antes de guardar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-alert-triangle'})
                return;
            }

            var idunidades = [];
            for( var i=0; i<this.unidadSelected.length; i++ ){
                idunidades.push(this.unidadSelected[i].id);
            }

            me.$vs.loading()
            let estado;
            if( me.evaluacion.estado == true ){
                estado = 1;
            }else{
                estado = 0;
            }

            let descripVal = me.evaluacion.descripcion;
            if( me.evaluacion.descripcion === '' || me.evaluacion.descripcion === null || me.evaluacion.descripcion === 'null' ){
                descripVal = ' '
            }

            let formData = new FormData();
                formData.append('nombre', me.evaluacion.nombre);
                formData.append('asignatura',  me.local_idasignatura);
                formData.append('descripcion', descripVal);
                formData.append('puntos', me.evaluacion.puntos);
                formData.append('duracion', me.evaluacion.duracion);
                formData.append('fecha_inicio', me.evaluacion.fecha_inicio);
                formData.append('fecha_fin', me.evaluacion.fecha_fin);
                formData.append('estado', estado);
                formData.append('docente', me.docente);
                formData.append('codigo', localStorage.id_seccion);
                formData.append('idtipoeval', me.tipoevaluacionselect.id);
                formData.append('id_grupo_opciones', me.grupo_selected.id);
                formData.append('cant_unidades', idunidades);
            me.$http.post(this.$server_url+'evaluacion', formData)
                .then(res => {
                    me.getEvalDoc();
                    //me.clasifGrupEstEval(me.evaluacion);
                    me.$vs.loading.close()
                    me.unidSelect = idunidades
                    me.agregarActivo = false
                    me.guardadoActivo = true
                    me.editarActivo = true
                    me.evaluacion.id = res.data.id
                    //me.popupEditEval = false
                    me.cant_gruposSelec = []
                    for( var i=1; i<=me.grupo_selected.id; i++ ){
                        me.cant_gruposSelec.push(i)
                    }
                    me.$vs.notify({
                    text:'Evaluación guardada exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error+' agregar');
            })

        },
        openConfirmEliminar(item){
            let me = this;
            me.evalElimin = item
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro de eliminar esta evaluación?',
                accept: this.eliminarEvaluacion
            })
        },
        eliminarEvaluacion() {
            let me = this;
            me.$http.get(this.$server_url+`eliminar_evaluacion/${me.evalElimin.id}`).then(res => {
                me.$vs.notify({
                    text:'Evaluación eliminada.',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-alert-triangle'})
                me.getEvalDoc()
            })
        },
        editarFormulario(item) {
            let me = this;
            me.cantidadesField = [0,0,0,0,0];
            me.radios1 = 1;
            me.asignaturaSelected = {id: item.id_asignatura, label: item.nombreasignatura};
            me.evaluacion.nombre = item.nombre_evaluacion;
            me.evaluacion.descripcion = item.descripcion;
            me.evaluacion.puntos = item.puntos;
            me.evaluacion.fecha_inicio = item.fecha_inicio;
            me.evaluacion.fecha_fin = item.fecha_fin;
            me.evaluacion.duracion = item.duracion;
            me.evaluacion.estado = item.estado;
            me.evaluacion.id = item.id;
            me.tipoevaluacionselect = {id: item.id_tipoeval, label: item.tipo_nombre};
            me.grupo_selected = {id: item.grupos_evaluacion, label: item.grupos_evaluacion + ' grupos'};
            me.cant_gruposSelec = []
            for( var i=1; i<=me.grupo_selected.id; i++ ){
                me.cant_gruposSelec.push(i)
            }
            me.editarActivo = true; //activa el form editar

            me.unidSelect = item.cant_unidades.split(',');
            me.cant_grupos_select = me.grupo_selected.id; //cantidad de grupos o filas de evaluaciones desde la base
            me.unidadSelected=[];
            for(var i=0; i<me.unidSelect.length; i++){
               me.unidadSelected.push({id: me.unidSelect[i], label: 'Unidad '+me.unidSelect[i]});
            }

            me.verPreguntasxEval(item.id);

        },
        openConfirmgrupo(item){
            let me = this;
            this.popupEditEval=false;
            if (me.grupo_selected.id < me.cant_grupos_select) {
               me.textoConfirmgrup = 'Ha seleccionado un grupo menor de evaluaciones, las preguntas asignadas a los grupos restantes, se ocultarán'
            }else{
                me.textoConfirmgrup = 'Ha seleccionado un grupo mayor de evaluaciones, debe asignar preguntas a los nuevos grupos.';
            }
            me.activePromptGrupo = true;
        },
        editarEvaluacion(item) {
            let me = this;
            item = me.evaluacion;
            if (me.evaluacion.fecha_inicio === '' || me.evaluacion.fecha_fin === '' || me.evaluacion.puntos === '' || me.evaluacion.duracion === '') {
                me.$vs.notify({
                    text:'Debe completar todos los campos antes de guardar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-alert-triangle'})
                return;
            }

            me.$vs.loading()
            let estado;
            if( me.evaluacion.estado == true ){
                estado = 1;
            }else{
                estado = 0;
            }

            let descripVal = me.evaluacion.descripcion;
            if( me.evaluacion.descripcion === '' || me.evaluacion.descripcion === null || me.evaluacion.descripcion === 'null' ){
                descripVal = ' '
            }

            let formData = new FormData();
                formData.append('id', item.id);
                formData.append('nombre', me.evaluacion.nombre);

                formData.append('descripcion', descripVal);
                formData.append('puntos', me.evaluacion.puntos);
                formData.append('duracion', me.evaluacion.duracion);
                formData.append('fecha_inicio', me.evaluacion.fecha_inicio);
                formData.append('fecha_fin', me.evaluacion.fecha_fin);
                formData.append('estado', estado);
                formData.append('docente', me.docente);
                formData.append('codigo', localStorage.codigo);

            me.$http.post(this.$server_url+'evaluacion', formData).then(res => {
                const index = me.evaluaciones.findIndex(
                    evaluacionBuscar => evaluacionBuscar.id === res.data.id)
                me.evaluacion[index] = res.data;
                me.getEvalDoc();
                //me.clasifGrupEstEval(item);
                me.editarActivo = false; //desactiva el form editar
                //me.popupEditEval = false
                me.cant_gruposSelec = []

                me.$vs.loading.close()
                me.$vs.notify({
                text:'Evaluación editada exitosamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        verPreguntas(id) {
            let me = this;
            me.preguntas = [];
            me.id_evaluacion = id;
            me.tipoSelected = '';
            me.$vs.loading()
            me.unidadesFiltrar=[];

            for(var i=0; i<me.unidadSelected.length; i++){
               me.unidadesFiltrar.push({id: me.unidadSelected[i].id, label: 'Unidad '+me.unidadSelected[i].id});
            }
            me.unidadSelectedFiltrar = {id: me.unidadSelected[0].id, label: 'Unidad '+me.unidadSelected[0].id}
            me.filtrarPreguntasxUnidad()
        },
        cargarPregunta(item, index) {
            let me = this;
            me.$vs.loading()
            let formData = new FormData();
                formData.append('id_evaluacion', me.evaluacion.id);
                formData.append('id_pregunta', item.id);
                formData.append('grupo', me.radios1);
            me.$http.post(this.$server_url+'pregEvaluacion', formData)
            .then(res => {

                me.verPreguntasxEval(me.evaluacion.id);

                me.$vs.notify({
                text:'Pregunta asignada a esta evaluación',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        quitarPregunta(index, id) {
            let me = this;
            me.$vs.loading()
            me.$http.get(this.$server_url+`quitarPregEvaluacion/${id}`).then(() => {
                me.verPreguntasxEval(index.id_evaluacion);
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        backEndDateFormat: function(date) {
        	return moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        },
        removeItemFromArr (arr, item) {
            const i = arr.indexOf(item)
            arr.splice(i, 1)
        },
        irPreguntas(){
            if(this.id_evaluacion===''){
                this.id_evaluacion = 0
            }

            localStorage.id_desde_eval = this.evaluacion.id
            localStorage.grupo_desde_eval = this.radios1
            localStorage.crea_desde_eval = true

            this.popupSelecPreg = false
            this.popupCrearPreguntas = true
            // window.location.href = this.urlOrigen+'/preguntas/'+this.id_evaluacion;
        },
        verCalificaciones(){
            let me = this;
            me.$vs.loading()
            me.$http.get(this.$server_url+`verCalificacionEval/${localStorage.id_seccion}`).then(response => {
                me.respuestas = []
                var respuesta = response.data;
                me.estudiantes = response.data;

                if (response.data.length != 0) {
                    me.alumnos = response.data.items;
                    me.alumnos.forEach(element => {
                        var cal = new Object();
                        cal.idusuario = element.usuario_idusuario
                        cal.Cedula = element.cedula
                        cal.Estudiante = element.nombres + " " + element.apellidos
                        cal.calificaciones = new Object();
                        for (let index = 0; index < element.total.length; index++) {
                            try {
                                if(element.calificaciones[index].calificacion===null){
                                    element.calificaciones[index].calificacion = 0
                                    cal.calificaciones[index] = element.calificaciones[index].calificacion+'/'+element.calificaciones[index].puntos
                                }else{
                                    cal.calificaciones[index] = element.calificaciones[index].calificacion+'/'+element.calificaciones[index].puntos
                                }
                                eval("cal.Evaluacion" + index + "=" + element.calificaciones[index].calificacion);

                            } catch (error) {
                                element.calificaciones[index].calificacion = 0
                                cal.calificaciones[index] = element.calificaciones[index].calificacion+'/'+element.calificaciones[index].puntos
                                eval("cal.Evaluacion" + index + "=" + 0);
                            }
                        }
                        me.respuestas.push(cal)
                    });
                }
                me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
                  console.log(error);
            })

            me.$http.get(this.$server_url+`verEvalCursoExport/${localStorage.id_seccion}`).then(res => {
                me.evaluacionestabla = res.data;
            })
            .catch(function (error) {
                console.log(error);
            })

        },

        verPreguntasxEval(id_evaluacion){
            let me = this;

            let formData = new FormData();
                formData.append('evaluacion', id_evaluacion);
                formData.append('grupo', me.radios1);

            me.$vs.loading()
            me.$http.post(this.$server_url+`pregEvaluacionGrupo`, formData).then(res => {
                me.preguntasEvaluaciones = res.data;
                if( me.preguntasEvaluaciones.items === undefined ){
                    console.log('no existen preguntas para el grupo seleccionado');
                }else{
                    me.puntajeTotalGrupo = 0;
                    for(var i=0; i<me.preguntasEvaluaciones.items.length; i++){
                        me.puntajeTotalGrupo += me.preguntasEvaluaciones.items[i].puntaje_pregunta;
                    }
                }

                me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error+'verPreguntasxEval');
            })
        },



        irRevision(item, val){
            localStorage.setItem('id_evalRevisar', item.id);
            localStorage.setItem('previsualizar_eval', val);
            //this.$router.push('/revisarevaluacion')

            window.location.href = this.urlOrigen+'/revisarevaluacion';
        },
        contarPuntosIngresados(){
            let me = this
            me.puntajeIngresado = 0;
            var cantField = 0;
            for( var i=0; i<me.cantidadesField.length; i++ ){
                if( Number.isNaN(parseInt(me.cantidadesField[i])) ){
                    cantField = 0;
                }else{
                    cantField = parseInt(me.cantidadesField[i])
                }
                me.puntajeIngresado += (me.puntajetipo[i]*parseInt(cantField))
            }
        },

        copiarLink(item){
            let me = this
            let date = new Date()
            let fecha_actual = moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')

            if( fecha_actual < item.fecha_inicio || fecha_actual > item.fecha_fin ){
                me.$vs.notify({
                text:'Esta evaluación aún no está disponible. Verifique las fechas de inicio y fin.',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
                return
            }

            if( item.estado != 1 ){
                me.$vs.notify({
                text:'Esta evaluación está inactiva',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
                return
            }


            let link = me.urlOrigen+'/responderEvaluacion/'+item.id+'-'+localStorage.codigo+'-'+me.usuario.institucion_idInstitucion
            var aux = document.createElement("input");
            aux.setAttribute("value", link);
            document.body.appendChild(aux);
            aux.select();

            try {
                var status = document.execCommand('copy');
                if(!status){
                    me.$vs.notify({
                    text:'Error al copiar el link',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-alert-triangle'})
                }else{
                    me.$vs.notify({
                    text:'Link copiado',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }

            document.body.removeChild(aux);
        },

    },
}
</script>
