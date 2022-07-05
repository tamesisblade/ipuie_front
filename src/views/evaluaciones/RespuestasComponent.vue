<template>
  <div class="vx-row" style="padding: 20px; font-size: 19px">
    <div class="vx-col sm:w-3/4 w-full">
      <div v-if="evaluaciones[0] === undefined">No existe evaluación</div>
      <vx-card
        v-else
        v-bind:title="evaluaciones[0].nombreasignatura"
        title-color="primary"
      >
        {{ usuario[0].nombres }} {{ usuario[0].apellidos }} - {{ usuario[0].cedula
        }}<br />
        {{
          "Inicia: " +
          evaluaciones[0].fecha_inicio +
          " - Finaliza: " +
          evaluaciones[0].fecha_fin
        }}
        <div class="vx-row">
          <div
            v-if="
              evaluaciones[0].descripcion === '' ||
              evaluaciones[0].descripcion === null ||
              evaluaciones[0].descripcion === 'null'
            "
          ></div>
          <div v-else class="vx-col w-full" align="justify">
            {{ evaluaciones[0].descripcion }}
          </div>
        </div>
      </vx-card>

      <!-------INICIO SECCION RESPONDER---------->
      <vx-card class="mt-5 mb-6">
        <div align="center" v-if="volverActivo === true">
          Esta evaluación ya fue completada.<br /><br />
          <vs-button color="success" type="gradient" @click="volver()"
            >Volver</vs-button
          >
        </div>
        <div v-if="verbtniniciar === true" align="center">
          <div v-if="preguntas.items === undefined">
            No existen preguntas para esta evaluación.
          </div>
          <vs-button
            v-else
            type="gradient"
            size="large"
            style="padding: 0px; border-radius: 100%; width: 80px; height: 80px"
            @click="
              iniciar(0);
              iniciarActivo = true;
              verbtniniciar = false;
            "
            >Iniciar</vs-button
          >
        </div>

        <div class="text-center">
          <div
            cols="12"
            v-for="(item, index) in preguntas.items"
            :key="index"
            v-bind:id="'contenPreg' + (index + 1)"
            style="display: none"
            class="mb-4"
          >
            <div class="mb-5" style="font-size: 19px" align="center">
              <div align="left">
                <b
                  >{{ index + 1 }}
                  <span class="pregAbierta">{{ item.descripcion }}</span></b
                >
              </div>

              <div align="left" style="font-size: 17px; color: gray">
                {{ item.indicaciones }}
              </div>
            </div>

            <div
              v-bind:id="'contenOpciones' + (index + 1)"
              align="left"
              style="font-size: 19px"
              class="mb-5"
            ></div>
          </div>

          <vs-pagination
            color="success"
            v-if="iniciarActivo === true"
            :total="preguntas.items.length"
            v-model="currentx"
            @input="verPreguntaSelec(currentx - 1)"
          ></vs-pagination>
        </div>
      </vx-card>
    </div>

    <!--<div class="vx-col sm:w-1/4 w-full" style="position: fixed; top: 20px; right: 10px; z-index: 1;">-->
    <div class="vx-col sm:w-1/4 w-full">
      <vx-card>
        <div align="center">
          <!-- <img src="https://plataforma.prolipadigital.com.ec/img/prolipa.a3e6ff1b.png" style="max-width: 225px;" class="mb-10"> -->

          Tiempo para resolver esta evaluación:
          <div
            v-if="iniciarActivo === false && evaluaciones[0]"
            class="reloj mt-3"
            style="font-size: 35px; color: #2974fe"
          >
            {{ evaluaciones[0].duracion }} minutos
          </div>
          <div
            class="reloj mb-6 mt-4"
            style="font-size: 40px; color: #2974fe"
          ></div>
          <div v-if="iniciarActivo === true" class="mb-2">
            <vs-button
              color="dark"
              type="gradient"
              class="mb-6"
              @click="openConfirm"
              >Finalizar evaluación</vs-button
            ><br />

            <vs-button
              v-if="usuario.id_group != 1"
              color="success"
              type="border"
              class="mt-6"
              @click="$router.push('/estudiante/evaluaciones')"
              ><b>← Volver</b></vs-button
            >

            <vs-button
              v-else
              color="success"
              type="border"
              class="mt-6 m-1"
              @click="$router.push('/evaluaciones')"
              ><b>← Volver</b></vs-button
            >

            <vs-divider class="mt-4"> Preguntas </vs-divider>

            <div class="btn-group">
              <button
                v-for="(item, index) in preguntas.items"
                :key="index"
                @click="
                  currentx = index + 1;
                  verPreguntaSelec(index);
                "
                class="botonPaginacion"
                v-bind:id="'botonRespuesta' + index"
                style="
                  background-color: white;
                  border-radius: 5px;
                  border: 1px solid #046ae7;
                  margin: 2px;
                  color: #046ae7;
                  font-size: 19px;
                  cursor: pointer;
                "
              >
                {{ index + 1 }}
              </button>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
import moment from "moment";
import $ from "jquery";
import VueRouter from "vue-router";
var respondidas = [];
var x = null;
export default {
  data() {
    return {
      preguntas: [],
      pregunta: {
        descripcion: "",
        id_tema: "",
        respuesta: "",
        opcion1: "",
        opcion2: "",
        opcion3: "",
        img_pregunta: "",
        img_respuesta: "",
        img_opcion1: "",
        img_opcion2: "",
        img_opcion3: "",
      },
      evaluaciones: [],
      evaluacion: {
        nombre: "",
        asignatura: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "",
        duracion: "",
        nombre_evaluacion: "",
      },
      usuario: [],
      estudiante: null,
      nombre_estudiante: null,
      apellido_estudiante: null,
      opcionesSelec: [],
      urlOrigen: "",
      iniciarActivo: false,
      currentx: 1,
      volverActivo: false,
      verbtniniciar: true,
      calificacion: 0,
      id_evalRevisar: "",
      grupo_estudiante: "",
      preguntas_escritas: [],
      tipo_preguntas_escritas: [],
      respuestasAcum: [],
      contadorIntentosgrupo: 0,
      vectorLink: [],
      popupInformacion: false,
    };
  },
  components: {
    "v-select": vSelect,
    flatPickr,
  },
  created() {
    this.$vs.loading();
    this.vectorLink = this.$route.params.id.split("-");
    this.id_evalRevisar = this.vectorLink[0]; //localStorage.getItem("id_evalRevisar");
    this.grupo_estudiante = localStorage.getItem("grupo_estudiante");
    var url = location.pathname.split("/");
    var urlBack = window.location.href;
    var urlV = urlBack.split("/");
    this.urlOrigen =
      urlV[0] + "/" + urlV[1] + "/" + urlV[2] + "/estudiante/evaluaciones";
    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    if (this.usuario) {
      this.estudiante = this.usuario[0].idusuario;
      this.nombre_estudiante = this.usuario[0].nombres;
      this.apellido_estudiante = this.usuario[0].apellidos;
      localStorage.evaluacionxLink = "";
    } else {
      localStorage.evaluacionxLink = this.$route.params.id;
      //alert('Antes de rendir esta evaluación debes iniciar sesion. Si aún no te has registrado puedes hacerlo en este momento.')
      window.location.href = urlV[0] + "/" + urlV[1] + "/" + urlV[2];
    }

    this.$http
      .get(this.$server_url + "evaluacionEstudiante/" + this.id_evalRevisar)
      .then((res) => {
        if (res.data.length > 0) {
          this.evaluaciones = res.data;
          localStorage.setItem('puntos',this.evaluaciones[0].puntos)
          this.validarTiempo();
          this.preguntasEvaluacionGrupo();
        } else {
          alert("No existen preguntas para esta evaluación");
          window.location.href = this.urlOrigen;
        }
      });
  },
  methods: {
    getEvaluacion(item) {
      let formData = new FormData();
      formData.append("estudiante", this.estudiante);
      formData.append("evaluacion", item);

      this.$http
        .post(this.$server_url + `verifRespEvaluacion`, formData)
        .then((res) => {
          this.$vs.loading.close();
          if (res.data.length > 0) {
            this.volverActivo = true;
            this.verbtniniciar = false;
          } else {
            this.verbtniniciar = true;
          }
        });
    },
    validarTiempo() {
      if (
        this.evaluaciones[0].fecha_actual < this.evaluaciones[0].fecha_inicio
      ) {
        this.volver();
      }
      if (this.evaluaciones[0].fecha_actual > this.evaluaciones[0].fecha_fin) {
        this.volver();
      }

      let dia_actual = this.evaluaciones[0].fecha_actual.split("-");
      let dia_actual1 = dia_actual[2].split(" ");
      let dia_actual_1 = dia_actual1[0];

      let dia_fin = this.evaluaciones[0].fecha_fin.split("-");
      let dia_fin1 = dia_fin[2].split(" ");
      let dia_fin_1 = dia_fin1[0];

      if (dia_actual_1 === dia_fin_1) {
        let tiempo_fin1 = this.evaluaciones[0].fecha_fin.split(" ");
        let tiempo_fin2 = tiempo_fin1[1].split(":");

        let tiempo_actual1 = this.evaluaciones[0].fecha_actual.split(" ");
        let tiempo_actual2 = tiempo_actual1[1].split(":");

        let tiempo =
          (parseInt(
            tiempo_fin2[0] + "" + tiempo_fin2[1] + "" + tiempo_fin2[2]
          ) -
            parseInt(
              tiempo_actual2[0] +
                "" +
                tiempo_actual2[1] +
                "" +
                tiempo_actual2[2]
            )) *
            600 -
          10000; //600 compensar tiempo

        if (tiempo < 0) {
          alert("Esta evaluación ha finalizado.");
          this.volver();
        } else {
          setInterval(() => {
            alert("Esta evaluación ha finalizado.");
            this.calificarValidado();
          }, tiempo);
        }
      }
    },
    iniciar() {
      this.f_tiempo(this.evaluaciones[0].duracion);
      for (var j = 1; j <= this.preguntas.items.length; j++) {
        document.getElementById("contenPreg" + j).style.display = "none";
      }
      this.verbtniniciar = false;
      ///muestra la primera pregunta
      document.getElementById("contenPreg1").style.display = "block";

      function marcarBoton(index) {
        $("#botonRespuesta" + index).addClass("marcarBotonResp");
      }

      ///mostrar preguntas metodo 2
      var cantOpciones;
      for (var i = 0; i < this.preguntas.items.length; i++) {
        cantOpciones = this.preguntas.items[i].opciones.length;
        if (cantOpciones === 0) {
          cantOpciones = 1;
        }

        for (var j = 0; j < cantOpciones; j++) {
          switch (parseInt(this.preguntas.items[i].id_tipo_pregunta)) {
            case 1:
              try {
                if (this.preguntas.items[i].opciones[j].opcion) {
                  $("#contenOpciones" + (i + 1)).append(
                    `
                      <input type="checkbox" onclick="document.getElementById('botonRespuesta` +
                      i +
                      `').style.background='#046AE7'; document.getElementById('botonRespuesta` +
                      i +
                      `').style.color='white'" id="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}" class="${this.preguntas.items[i].id} estiloInput" name="${this.preguntas.items[i].id}" value="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}">
                                    <label for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}"> ${this.preguntas.items[i].opciones[j].opcion}</label><br>
                                `
                  );
                }

              } catch (error) {}
              break;
            case 3:
              try {
                if( this.preguntas.items[i].opciones[j].opcion ){
                  $("#contenOpciones" + (i + 1)).append(
                    `
                                  <input type="radio" onclick="document.getElementById('botonRespuesta` +
                      i +
                      `').style.background='#046AE7'; document.getElementById('botonRespuesta` +
                      i +
                      `').style.color='white'" id="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}" class="${this.preguntas.items[i].id} estiloInput" name="${this.preguntas.items[i].id}" value="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}">
                                  <label for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}"> ${this.preguntas.items[i].opciones[j].opcion}</label><br>
                              `
                  );
                }
              } catch (error) {}
              break;
            case 5:
              try {
                $("#contenOpciones" + (i + 1)).append(
                  `
                                <input type="radio" onclick="document.getElementById('botonRespuesta` +
                    i +
                    `').style.background='#046AE7'; document.getElementById('botonRespuesta` +
                    i +
                    `').style.color='white'" id="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}" class="${this.preguntas.items[i].id} estiloInput" name="${this.preguntas.items[i].id}" value="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}">
                                <label for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}"> ${this.preguntas.items[i].opciones[j].opcion}</label><br>
                            `
                );

              } catch (error) {}
              break;
            case 2:
              try {
                $("#contenOpciones" + (i + 1)).append(
                  `
                                    <textarea oninput="document.getElementById('botonRespuesta` +
                    i +
                    `').style.background='#046AE7'; document.getElementById('botonRespuesta` +
                    i +
                    `').style.color='white'" id="${this.preguntas.items[i].id}" class="inputRespuesta" rows="5" placeholder="Escribe tu respuesta..."></textarea>
                                `
                );
              } catch (error) {}
              break;
            case 6:
              try {
                $("#contenOpciones" + (i + 1)).append(
                  `
                                    <textarea oninput="document.getElementById('botonRespuesta` +
                    i +
                    `').style.background='#046AE7'; document.getElementById('botonRespuesta` +
                    i +
                    `').style.color='white'" id="${this.preguntas.items[i].id}" class="inputRespuesta" rows="5" placeholder="Escribe tu respuesta..."></textarea>
                                `
                );
              } catch (error) {}
              break;
            default:
              break;
          }
        }
      }
    },
    verPreguntaSelec(index) {
      for (var j = 1; j <= this.preguntas.items.length; j++) {
        document.getElementById("contenPreg" + j).style.display = "none";
      }
      document.getElementById("contenPreg" + (index + 1)).style.display =
        "block";
    },
    openConfirm() {
      this.$vs.dialog({
        type: "confirm",
        color: "primary",
        title: `Confirmar`,
        text: "¿Está seguro de finalizar la evaluación?",
        accept: this.calificarValidado,
      });
    },
    calificarValidado() {
      localStorage.setItem('cantidadPreguntas',this.preguntas.items.length)
      console.log('rr',this.preguntas.items)
      console.log('ff', this.respuestasAcum)

      var pregsRecorrer = this.preguntas.items;
      var opcionesSeleccionadas = [];
      var opcionesSeleccionadasV = [];
      var califPregFinal = 0;
      for (var j = 0; j < pregsRecorrer.length; j++) {
        var index = this.respuestasAcum
          .map(function (e) {
            return e.id_pregunta;
          })
          .indexOf(pregsRecorrer[j].id);

        if (
          pregsRecorrer[j].id_tipo_pregunta === 1 ||
          pregsRecorrer[j].id_tipo_pregunta === 3 ||
          pregsRecorrer[j].id_tipo_pregunta === 5
        )
        {
          if (
            pregsRecorrer[j].id_tipo_pregunta === 3 ||
            pregsRecorrer[j].id_tipo_pregunta === 5
             )
          {
              opcionesSeleccionadas = $(
                  "input:radio[name=" + pregsRecorrer[j].id + "]:checked"
                ).val();
          } else {
              $("." + pregsRecorrer[j].id + ":checked").each(function () {
                opcionesSeleccionadas += $(this).val() + ",";
              });
          }
              try {
                var tamselecV = 0;
                opcionesSeleccionadasV = opcionesSeleccionadas.split(",");
                if (opcionesSeleccionadasV === undefined) {
                  opcionesSeleccionadasV = "";
                  tamselecV = 1;
                } else {
                  tamselecV = opcionesSeleccionadasV.length - 1;
                  if (opcionesSeleccionadasV.length - 1 <= 0) {
                    tamselecV = 1;
                  }
                }

                var opcionRespuesta =
                  this.respuestasAcum[index].id_opcion_pregunta.split(",");

                var califPreg = 0;
                for (var i = 0; i < tamselecV; i++) {
                  for (var k = 0; k < opcionRespuesta.length; k++) {
                    if (opcionesSeleccionadasV[i] === opcionRespuesta[k]) {
                      //alert(opcionesSeleccionadasV[i] +'==='+ opcionRespuesta[k]);
                      califPreg++;
                    }
                  }
                }

                if (tamselecV > opcionRespuesta.length) {
                  califPreg = califPreg - (tamselecV - opcionRespuesta.length);
                }
                califPregFinal = (
                  (califPreg * this.respuestasAcum[index].puntaje_pregunta) /
                  opcionRespuesta.length
                ).toFixed(2);

              } catch (error) {}
        } else {
          //calificar preguntas tipo 2 o 6
          try {
            opcionesSeleccionadasV = $("#" + pregsRecorrer[j].id)
              .val()
              .toLowerCase()
              .replace(/,|\.|\(|\)|!|\?|¿|\$|/g, "")
              .split(" ");

            var opcionRespuesta = this.respuestasAcum[index].opcion.split(",");
            var califPreg = 0;
            for (var i = 0; i < opcionesSeleccionadasV.length; i++) {
              for (var k = 0; k < opcionRespuesta.length; k++) {
                if (
                  opcionesSeleccionadasV[i] ===
                  opcionRespuesta[k].toLowerCase().replace(/ /gi, "")
                ) {
                  //alert('**BIEN: '+( opcionesSeleccionadasV[i] +'==='+ (opcionRespuesta[k].toLowerCase()).replace(/ /g, '') ));
                  califPreg++;
                  break;
                }
              }
            }

            let cant_coincidencias = parseInt(
              this.respuestasAcum[index].cant_coincidencias
            );
            if (cant_coincidencias <= 0) {
              cant_coincidencias = 1;
            }
            let califPregEscr = (
              (califPreg * this.respuestasAcum[index].puntaje_pregunta) /
              parseInt(cant_coincidencias)
            ).toFixed(2);

            if (califPregEscr > this.respuestasAcum[index].puntaje_pregunta) {
              califPregEscr = this.respuestasAcum[index].puntaje_pregunta;
            }

            califPregFinal = califPregEscr;

            //alert(califPregFinal+'----califPreg ab: ' + califPregEscr+'----puntaje_pregunta: '+this.respuestasAcum[index].puntaje_pregunta);
          } catch (error) {}
        }

        this.guardarRespuesta(
          this.id_evalRevisar,
          pregsRecorrer[j].id,
          this.usuario[0].idusuario,
          opcionesSeleccionadasV,
          califPregFinal
        );

        this.calificacion += parseFloat(califPregFinal);

        califPreg = 0;
        califPregFinal = 0;
        opcionesSeleccionadas = [];
        opcionesSeleccionadasV = [];
      }

      this.enviarEvaluacion();
    },

    guardarRespuesta(evaluacion, pregunta, estudiante, respuestas, puntaje) {
      let formData = new FormData();
      formData.append("evaluacion", evaluacion);
      formData.append("pregunta", pregunta);
      formData.append("estudiante", this.usuario[0].idusuario);
      formData.append("respuesta", respuestas);
      formData.append("puntaje", puntaje);
      formData.append('puntos',localStorage.puntos)
      formData.append('cantidadPreguntas',localStorage.cantidadPreguntas)
      this.$http
        .post(this.$server_url + "guardarRespuesta", formData)
        .then((res) => {})
        .catch(function (error) {});
    },
    enviarEvaluacion() {
      let me = this;
      var urlBack = window.location.href;
      var urlV = urlBack.split("/");
      me.$vs.loading();
      let formData = new FormData();

      let calif_valid = 0;
      if(me.calificacion > 0 ){
        calif_valid = me.calificacion.toFixed(2)
      }
      formData.append("estudiante", me.estudiante);
      formData.append("evaluacion", me.id_evalRevisar);
      formData.append("calificacion", calif_valid);
      formData.append("grupo", me.grupo_estudiante);
      formData.append('puntos',localStorage.puntos)
      formData.append('cantidadPreguntas',localStorage.cantidadPreguntas)

      this.$http
        .post(this.$server_url + "respEvaluacion", formData)
        .then((res) => {
          me.$vs.loading.close();
          localStorage.setItem("previsualizar_eval", 0);
          window.location.href =
            urlV[0] + "/" + urlV[1] + "/" + urlV[2] + "/revisarevaluacion";
        })
        .catch(function (error) {
          window.location.href = me.urlOrigen;
        });
    },
    volver() {
      window.location.href = this.urlOrigen;
    },
    f_tiempo(numero) {
      let me = this;
      var n = numero * 60;
      x = setInterval(function () {
        n--;
        var now = n * 1000;
        var distance = n + now;
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        $(".reloj").html(hours + " : " + minutes + " : " + seconds + "");
        if (distance < 60000) {
          $(".reloj").css("color", "#FB2452");
        }
        if (distance < 0) {
          $(".reloj").html("Fin del tiempo");
          me.calificarValidado();
        }
      }, 1000);
    },
    preguntasEvaluacionGrupo() {
      var grupoRand =
        Math.floor(
          Math.random() *
            (parseInt(this.evaluaciones[0].grupos_evaluacion) + 1 - 1)
        ) + 1;
      localStorage.setItem("grupo_estudiante", grupoRand);
      this.grupo_estudiante = grupoRand;
      this.verRespuestasGrupo();
      let formData = new FormData();
      formData.append("grupo", this.grupo_estudiante);
      formData.append("evaluacion", this.id_evalRevisar);
      this.$http
        .post(this.$server_url + `pregEvaluacionGrupo`, formData)
        .then((res) => {
          if (res.data.length === 0) {
            this.contadorIntentosgrupo++;
            if (this.contadorIntentosgrupo < 2) {
              grupoRand =
                Math.floor(
                  Math.random() *
                    (parseInt(this.evaluaciones[0].grupos_evaluacion) + 1 - 1)
                ) + 1;
              localStorage.setItem("grupo_estudiante", grupoRand);
              this.grupo_estudiante = grupoRand;
              this.preguntasEvaluacionGrupo();
              this.verRespuestasGrupo();
            } else {
              alert("No existen preguntas para esta evaluación.");
              window.location.href = this.urlOrigen;
            }
          } else {
            this.preguntas = res.data;
            for (var i = 0; i < this.preguntas.items.length; i++) {
              if (
                this.preguntas.items[i].id_tipo_pregunta === 2 ||
                this.preguntas.items[i].id_tipo_pregunta === 6
              ) {
                this.preguntas_escritas.push(
                  this.preguntas.items[i].descripcion
                );
                this.tipo_preguntas_escritas.push(
                  this.preguntas.items[i].id_tipo_pregunta
                );
              }
            }

            this.getEvaluacion(this.id_evalRevisar);
          }
        });
    },
    verRespuestasGrupo() {
      let formData = new FormData();
      formData.append("grupo", "1");
      formData.append("evaluacion", this.id_evalRevisar);

      this.$http
        .post(this.$server_url + "getRespuestasAcum", formData)
        .then((res) => {
          this.respuestasAcum = res.data;
        });
    },
  },
};
</script>

<style>
.inputRespuesta {
  height: 80px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #d5d5d5;
  font-size: 18px;
  padding: 5px 10px 5px 10px;
  resize: vertical;
}

.marcarBotonResp {
  background-color: #046ae7 !important;
  color: white !important;
}

.botonPaginacion:hover {
  background-color: #c8dffa !important;
  color: #046ae7 !important;
}

.estiloInput {
  margin-bottom: 15px;
  -ms-transform: scale(1.5); /* IE 9 */
  -webkit-transform: scale(1.5); /* Chrome, Safari, Opera */
  transform: scale(1.5);
  margin-right: 10px;
}

.altura {
  max-height: 350px;
}
</style>
