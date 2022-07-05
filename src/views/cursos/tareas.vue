<template>
  <div class="p5">

    <vs-popup title="Tareas" :active.sync="popupTareas">
      <vs-input class="w-full mb-3" label="Descripción tarea" v-model="tarea" />

      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <small class="date-label">Fecha entrega</small>
          <flat-pickr
            :config="configdateTimePicker"
            v-model="fecha_entrega"
            style="width: 80%"
            class="ml-5"
          />
        </vs-col>
      </vs-row>

      <vs-row class="mt-5">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <small class="date-label">Archivo</small>
          <input
            type="file"
            name="file1"
            id="file1"
            style="width: 70%"
            class="inputfile ml-5"
          />
        </vs-col>
      </vs-row>

      <vs-input
        class="w-full mb-base mt-5"
        label="Observaciones"
        v-model="observaciones"
      />

      <vs-button
        v-if="editarActivo == false"
        type="gradient"
        color="primary"
        @click="guardarTarea()"
        >Guardar</vs-button
      >
      <vs-button v-else type="gradient" color="dark" @click="guardarTarea()"
        >Editar</vs-button
      >
    </vs-popup>

    <vx-card :title="'Tareas de la sección: ' + seccion">
      <vs-table search max-items="10" pagination :data="tareas">
        <template slot="header">
          <vs-button class="m-1" type="border" color="dark" @click="$router.go(-1)" >← Volver</vs-button >
          <vs-button class="m-1" type="gradient" color="primary" @click=" id_tarea = 0; archivo_old = 0; editarActivo = false; popupTareas = true; " >Agregar tarea</vs-button >
        </template>
        <template slot="thead">
          <vs-th>Tarea</vs-th>
          <vs-th>Archivo</vs-th>
          <vs-th>Fecha entrega</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{ data }">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              {{ tr.tarea }} <br />
              {{ tr.observaciones }}
            </vs-td>
            <vs-td>
              {{ tr.archivo }}
            </vs-td>
            <vs-td>
              {{ tr.fecha_entrega }}
            </vs-td>
            <vs-td>
              <div class="flex">
                <vx-tooltip color="success" text="Editar tarea">
                  <vs-button
                    @click="
                      editarActivo = true;
                      verTarea(tr);
                    "
                    color="success"
                    radius
                    size="large"
                    type="line"
                    icon-pack="feather"
                    icon="icon-edit"
                  ></vs-button>
                </vx-tooltip>

                <vx-tooltip color="danger" text="Eliminar tarea">
                  <vs-button
                    @click="eliminarTarea(tr.id_tarea)"
                    color="danger"
                    radius
                    size="large"
                    type="line"
                    icon-pack="feather"
                    icon="icon-trash"
                  ></vs-button>
                </vx-tooltip>

                <vs-td :data="tr.idInstitucion">
                  <div class="flex">
                    <vs-button color="primary" @click="calificar(tr)"
                      >Ver tareas</vs-button
                    >
                  </div>
                </vs-td>
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>

    <!--Modal para ver tareas de los estudiantes -->
    <vs-popup
      class="popupActividad"
      fullscreen
      title="Tareas de los estudiantes"
      :active.sync="popupTareaEstudiantes"
    >
      <div>
        <vs-table max-items="10" search pagination :data="tareaAlumnos">
          <template slot="header">
              <vs-button color="warning" size="small" style="font-size: 14px;" @click="exportToExcel">Exportar</vs-button>
          </template>
          <template slot="thead">
            <vs-th sort-key="nombre">Tarea</vs-th>
            <vs-th sort-key="nombre">Estudiante</vs-th>
            <vs-th sort-key="fecha_inicio">Fecha que envia </vs-th>
            <vs-th sort-key="fecha_final">Obsv. Estudiante</vs-th>
            <vs-th sort-key="fecha_final">Nota</vs-th>
            <vs-th sort-key="fecha_final">Comentario</vs-th>
            <vs-th sort-key="fecha_final">Accion</vs-th>
          </template>
          <template slot-scope="{ data }">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="data[indextr].nombre">
                <a
                  :href="$server_url_file + 'tareas/' + data[indextr].url"
                  target="_blank"
                >

                  {{ data[indextr].archivo }}
                </a>
              </vs-td>

              <vs-td :data="data[indextr].estudiante">
                {{ data[indextr].estudiante }} <br>
                CI: {{ data[indextr].cedula }} <br>
                {{ data[indextr].email }}
              </vs-td>

              <vs-td>
                {{ data[indextr].fecha_create }}
              </vs-td>

              <vs-td :data="data[indextr].descripcion">
                {{ data[indextr].descripcion }}
              </vs-td>
              <vs-td :data="data[indextr].nota">
                {{ data[indextr].nota }}
              </vs-td>
              <vs-td :data="data[indextr].comentario">
                {{ data[indextr].comentario }}
              </vs-td>
              <vs-td>
                <div style="display: flex">
                  <vs-button
                    type="border"
                    size="small"
                    icon-pack="feather"
                    icon="icon-edit"
                    class="mr-2"
                    @click="changeCalificacion(tr)"
                    color="success"
                  >
                  </vs-button>
                  <vs-button
                    icon="delete"
                    color="danger"
                    size="small"
                    type="gradient"
                    @click="confirmEliminarCalificacion(tr)"
                  >
                    Devolver tarea
                  </vs-button>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </vs-popup>

    <!--PROMPT para editar la calificacion-->

    <vs-prompt
      title="Editar Calificacion"
      @cancel="closeCalificacion()"
      @accept="editCalificacion()"
      @close="closeCalificacion()"
      :active.sync="editarpromptCalificacion"
    >
      <div class="con-exemple-prompt">
        <vs-input
          type="number"
          class="inputx mb-3 w-full"
          label="Ingrese una calificacion"
          max="3"
          v-model="calificacion.nota"
        />
        <vs-textarea
          class="w-full mb-4 p-2"
          label="Descripción"
          v-model="calificacion.comentario"
        />
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Vue from "vue";
import axios from "axios";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

Vue.use(axios);
export default {
  components: {
    "v-select": vSelect,
    flatPickr,
  },
  data() {
    return {
      id_seccion: "",
      seccion: "",
      tareas: [],
      popupTareas: false,
      fecha_entrega: "",
      configdateTimePicker: {
        enableTime: true,
        dateFormat: "Y-m-d H:i:s",
      },
      tarea: "",
      fecha_entrega: "",
      observaciones: "",
      id_tarea: 0,
      archivo_old: 0,
      popupTareaEstudiantes: false,
      calificacion: {
        comentario: "",
        nota: "",
        url: "",
      },
      idrespuesta: "",
      editarpromptCalificacion: false,
      tareaAlumnos: [],
      editarActivo: false,
      activePrompt: false,
      fileName: 'listado_tareas',
    };
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!this.usuario) {
      this.usuario = [];
    }
  },
  mounted() {
    this.id_seccion = localStorage.getItem("id_seccion");
    this.getTareas();
  },
  methods: {
    calificar(item) {
      let me = this;
      me.$vs.loading();
      let docente = "yes";
      me.$http
        .get(
          me.$server_url +
            "tareaEstudianteRealizada?id_seccion=" +
            item.id_seccion +
            "&docente=" +
            docente +
            "&id_tarea=" +
            item.id_tarea
        )
        .then(function (response) {
          me.tareaAlumnos = response.data;
          me.popupTareaEstudiantes = true;
          me.$vs.loading.close();
        })
        .catch(function (error) {
          me.$vs.loading.close();
        });
    },
    getTareas() {
      let me = this;
      me.$vs.loading();
      axios
        .get(this.$server_url+'tareas?id_seccion=' + me.id_seccion)
        .then(function (res) {
          me.tareas = res.data;
          me.$vs.loading.close();
        })
        .catch(function (error) {
          me.$vs.loading.close();
        });
    },
    verTarea(item) {
      let me = this;
      me.id_tarea = item.id_tarea;
      me.archivo_old = item.archivo;
      me.tarea = item.tarea;
      me.fecha_entrega = item.fecha_entrega;
      me.observaciones = item.observaciones;
      me.popupTareas = true;
    },
    guardarTarea() {
      let me = this;

      let fileImgPreg;
      fileImgPreg = document.getElementById("file1").files[0];



      me.$vs.loading();
      let formData = new FormData();
      formData.append("id_tarea", me.id_tarea);
      formData.append("id_seccion", me.id_seccion);
      formData.append("observaciones", me.observaciones);
      formData.append("fecha_entrega", me.fecha_entrega);
      formData.append("archivo", fileImgPreg);
      if(fileImgPreg == undefined){

      }else{
          formData.append("archivo_old", me.archivo_old);
      }

      formData.append("estado", 1);
      axios
        .post(this.$server_url+'tareas', formData)
        .then(function (response) {
          me.$vs.loading.close();
          me.$vs.notify({
            color: "success",
            title: "Tarea guardada exitosamente.",
          });
          me.id_tarea = 0
          me.popupTareas = false;
          me.getTareas();
        })
        .catch(function (error) {
          me.$vs.loading.close();
        });
    },
    eliminarTarea(id_tarea) {
      let me = this;
      axios
        .get(this.$server_url+'+eliminar_tarea?id_tarea=' + id_tarea)
        .then(function (response) {
          me.$vs.loading.close();
          me.$vs.notify({ color: "success", title: "Tarea eliminada." });
          me.getTareas();
        })
        .catch(function (error) {
          me.$vs.loading.close();
        });
    },

    //METODOS NUEVOS
    changeCalificacion(item) {
      let me = this;
      me.calificacion.nota = item.nota;
      me.calificacion.comentario = item.observacion;
      me.idrespuesta = item.id;
      me.editarpromptCalificacion = true;
      me.popupTareaEstudiantes = false;
    },

    closeCalificacion() {
      let me = this;
      me.popupTareaEstudiantes = true;
      me.$vs.notify({
        color: "danger",
        title: "Closed",
        text: "Has cancelado la asignacion! / o devolucion",
      });
    },

    editCalificacion() {
      let me = this;
      if (me.calificacion.nota == "") {
        me.$vs.notify({
          text: "Campo nota obligatorio",
          color: "primary",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
        return false;
      }

      if (me.calificacion.comentario.length >= 100) {
        me.$vs.notify({
          text: "Maximo 100 caracteres por favor",
          color: "primary",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
        return false;
      }

      let formData = new FormData();
      formData.append("idrespuesta", me.idrespuesta);
      formData.append("observacion", me.calificacion.comentario);
      formData.append("nota", me.calificacion.nota);

      me.$vs.loading({
        color: "#046AE7",
      });
      axios
        .post(this.$server_url+'editarCalificacionTarea', formData)
        // me.$http.post(this.$server_url+'editarCalificacionTarea', formData)

        .then(function (response) {
          me.$vs.loading.close();
          me.$vs.notify({
            text: response.data.message,
            color: "primary",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });

          me.calificar();

          me.limpiar();
        })
        .catch(function (error) {
          me.$vs.loading.close();
        });
    },

    confirmEliminarCalificacion(item) {
      let me = this;
      me.idrespuesta = item.id;

      me.calificacion.url = item.url;


      me.popupTareaEstudiantes = false;
      me.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Estas seguro/a de devolver la tarea",
        cancel: me.closeCalificacion,
        accept: me.ElimininarActividadEstudiante,
      });
    },

    ElimininarActividadEstudiante() {
      let me = this;

      let formData = new FormData();
      formData.append("idrespuesta", me.idrespuesta);
      formData.append("url", me.calificacion.url);

      me.$vs.loading({
        color: "#046AE7",
      });
      me.$http
        .post(this.$server_url + "eliminarTareaEstudiante", formData)

        .then(function (response) {
          me.$vs.loading.close();
          me.$vs.notify({
            text: response.data.message,
            color: "primary",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });

          me.getTareas();
          me.calificar()
          me.limpiar();
        })
        .catch(function (error) {
          me.$vs.loading.close();
        });
    },


    exportToExcel () {
        let headerTitle = ['Estudiante', 'Cedula', 'Email', 'Fecha', 'Observacion', 'Nota', 'Comentario'];
        let headerVal = ['estudiante','cedula','email', 'fecha_create', 'descripcion', 'nota', 'comentario'];


        import('@/vendor/Export2Excel').then(excel => {
            const list = this.tareaAlumnos
            const data = this.formatJson(headerVal, list)
            excel.export_json_to_excel({
                header: headerTitle,
                data,
                filename: this.fileName,
                autoWidth: this.cellAutoWidth,
                bookType: 'xlsx'
            })
            this.clearFields()
        })
    },
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

  },
};
</script>

<style>
.uploading-image {
  display: flex;
}
</style>
