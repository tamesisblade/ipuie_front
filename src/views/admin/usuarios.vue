<template>
<vx-card>

    <!----MODAL EDITAR-------->
    <vs-popup title="Usuario" :active.sync="popupEditarUsuario">
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Cédula</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-code" icon-no-border v-model="usuario.cedula" />
            <span class="text-danger text-sm">{{ errors.cedula }}</span>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Nombres</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border v-model="usuario.nombres" />
            <span class="text-danger text-sm">{{ errors.nombres }}</span>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Apellidos</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border v-model="usuario.apellidos" />
            <span class="text-danger text-sm">{{ errors.apellidos }}</span>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Correo</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border v-model="usuario.email" />
            <span class="text-danger text-sm">{{ errors.email }}</span>
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Teléfono</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="usuario.telefono" />
        </div>
    </div>
    <div class="vx-row mb-6" v-if="editarActivo===false">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Contraseña</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border v-model="usuario.password" />
            <span class="text-danger text-sm">{{ errors.password }}</span>
        </div>
    </div>
    <div class="vx-row">
        <div class="vx-col sm:w-2/3 w-full ml-auto">
            <vs-button class="mr-3 mb-2" @click="guardar(usuario)" v-if="editarActivo===false">Crear</vs-button>
            <vs-button class="mr-3 mb-2" @click="editarConfirm(usuario)" v-else>Editar</vs-button>
            <vs-button color="danger" type="border" class="mb-2" @click="usuario={}; popupEditarUsuario=false">Salir</vs-button>
        </div>
    </div>
    </vs-popup>
    <!----FIN MODAL USUARIOS-------->



    <vs-tabs alignment="fixed">
      <vs-tab label="Administración de usuarios">
        <vs-table search max-items="10" pagination :data="usuarios">
            <template slot="header">
                <vs-button type="gradient" color="primary" @click="editarActivo=false; popupEditarUsuario=true; usuario={}">Crear Usuario</vs-button>
            </template>
            <template slot="thead">
                <vs-th>Cedula</vs-th>
                <vs-th>Nombres</vs-th>
                <vs-th>Apellidos</vs-th>
                <vs-th>Usuario</vs-th>
                <vs-th>Perfil</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{tr.cedula}}
                    </vs-td>
                    <vs-td>
                        {{tr.nombres}}
                    </vs-td>
                    <vs-td>
                        {{tr.apellidos}}
                    </vs-td>
                    <vs-td>
                        {{tr.name_usuario}}
                    </vs-td>
                    <vs-td>
                        <div v-if="tr.id_group==1">Administrador</div>
                        <div v-if="tr.id_group==2">Usuario</div>
                        <div v-if="tr.id_group==3">Invitado</div>
                    </vs-td>
                    <vs-td :data="tr.idInstitucion">
                        <div class="flex">
                            <vs-button radius type="flat" size="large" icon-pack="feather" icon="icon-edit" class="mr-2" color="success" @click="editarUsuario(tr)" v-if="tr.id_group!=1"></vs-button>
                            <vs-button radius type="flat" size="large" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="idusuarioSelec=tr.idusuario; openConfirmEliminar(tr)" v-if="tr.id_group!=1"></vs-button>
                            <div class="p-4" v-else>No editable</div>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
      </vs-tab>

      <vs-tab label="Solicitudes">
        <vs-table search max-items="10" pagination :data="solicitudes">
            <template slot="thead">
                <vs-th>Cedula</vs-th>
                <vs-th>Nombres</vs-th>
                <vs-th>Curso</vs-th>
                <vs-th>Solicitud</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{tr.cedula}}
                    </vs-td>
                    <vs-td>
                        {{tr.nombres}} {{tr.apellidos}} <br>
                        {{tr.email}} <br>
                        {{tr.telefono}}
                    </vs-td>
                    <vs-td>
                        {{tr.titulo}} <br>
                        {{tr.descripcion}} <br>
                        <b>${{tr.precio}} USD</b>
                    </vs-td>
                    <vs-td>
                        {{tr.solicitud}} <br>
                        Forma pago: {{tr.forma_pago}} <br>
                        <a :href="'http://localhost:8000/images/comprobantes/'+tr.comprobante" target="_blank">
                          <img :src="'http://localhost:8000/images/comprobantes/'+tr.comprobante" style="width: 120px; border-radius: 10px;" >
                        </a>
                    </vs-td>
                    <vs-td>
                        <div v-if="tr.estado_inscripcion==1">Acceso permitido</div>
                        <div v-else>Pendiente</div>
                    </vs-td>
                    <vs-td :data="tr.idInstitucion">
                        <div class="flex">
                            <vx-tooltip color="success" text="Aprobar solicitud">
                              <vs-button @click="procesarSolicitud(tr, 1)" color="success" radius size="large" type="line" icon-pack="feather" icon="icon-check"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip color="warning" text="Revocar solicitud">
                              <vs-button @click="procesarSolicitud(tr, 2)" color="warning" radius size="large" type="line" icon-pack="feather" icon="icon-alert-triangle"></vs-button>
                            </vx-tooltip>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
      </vs-tab>
    </vs-tabs>

</vx-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    data() {
        return {
            usuarios: [],
            popupEditarUsuario: false,
            email: "",
            password: "",
            errors: {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                password: '',
            },

            usuario: {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                password: '',
            },

            editarActivo: false,
            idusuarioSelec: '',
            solicitudes: [],
        }
    },
    mounted() {
        this.getUsuarios();
        this.solicitudes_usuarios();
    },
    methods: {
        async getUsuarios() {
            let me = this;
            axios.get('http://localhost:8000/api/usuarios')
            .then(function (response) {
                me.usuarios = response.data;
            })
            .catch(function (error) {})
        },
        async solicitudes_usuarios() {
            let me = this;
            axios.get('http://localhost:8000/api/solicitudes_usuarios')
            .then(function (response) {
                me.solicitudes = response.data;
            })
            .catch(function (error) {})
        },
        guardar(item) {
            let me = this
            let formData = new FormData();
            me.errors = {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                password: '',
            }
            formData.append('cedula', item.cedula)
            formData.append('nombres', item.nombres)
            formData.append('apellidos', item.apellidos)
            formData.append('email', item.email)
            formData.append('name_usuario', item.email)
            formData.append('password', item.password)
            axios.post("http://localhost:8000/api/crearUsuario", formData)
                .then(function (response) {
                    me.popupEditarUsuario=false
                    me.usuarios.push(response.data)
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        try {
                            me.errors.cedula = error.response.data.errors.cedula[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.nombres = error.response.data.errors.nombres[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.apellidos = error.response.data.errors.apellidos[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.email = error.response.data.errors.email[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.password = error.response.data.errors.password[0]
                        } catch (error) {

                        }
                    }
                })
        },
        editarUsuario(item){
            let me = this
            me.editarActivo = true
            me.popupEditarUsuario = true
            me.usuario = item
        },
        editarConfirm(item){
            let me = this
            let formData = new FormData();
            me.errors = {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
            }
            formData.append('idusuario', item.idusuario)
            formData.append('cedula', item.cedula)
            formData.append('nombres', item.nombres)
            formData.append('apellidos', item.apellidos)
            formData.append('email', item.email)
            formData.append('name_usuario', item.email)
            axios.post("http://localhost:8000/api/editarUsuario", formData)
                .then(function (response) {
                    me.popupEditarUsuario=false
                    me.getUsuarios()
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        try {
                            me.errors.cedula = error.response.data.errors.cedula[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.nombres = error.response.data.errors.nombres[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.apellidos = error.response.data.errors.apellidos[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.email = error.response.data.errors.email[0]
                        } catch (error) {

                        }
                    }
                })
        },
        openConfirmEliminar(){
          this.$vs.dialog({
            type: 'confirm',
            color: 'danger',
            title: `Confirmar`,
            text: '¿Está seguro de eliminar este usuario?',
            accept: this.eliminarUsuario
          })
        },
        eliminarUsuario(){
            let me = this
            axios.get("http://localhost:8000/api/eliminarUsuario/"+me.idusuarioSelec)
                .then(function (response) {
                    me.getUsuarios()
                })
                .catch(function (error) {
                })
        },
        procesarSolicitud(item, estado){
          let me = this
            let formData = new FormData();
            formData.append('id_estudiante', item.id_estudiante)
            formData.append('id_curso', item.id_curso)
            formData.append('estado', estado)
            axios.post("http://localhost:8000/api/procesar_solicitud", formData)
            .then(function (response) {
                me.solicitudes_usuarios()
                me.$vs.notify({
                    color: 'success',
                    title: 'Solicitud procesada correctamente',
                })
            })
        },
    },
}
</script>
