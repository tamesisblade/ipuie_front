<template>
<div>

    <div v-if="usuario[0]" class="the-navbar__user-meta flex items-center">

        <div class="text-right leading-tight hidden sm:block" v-if="usuario[0]">
            <p class="font-semibold">{{ usuario[0].nombres }}</p>
            <small v-if="usuario[0].id_group == 1" >Administrador</small>
            <small v-if="usuario[0].id_group == 4" >Estudiante</small>
            <small v-if="usuario[0].id_group == 5" >PostVenta</small>
            <small v-if="usuario[0].id_group == 6" >Docente</small>
        </div>

        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

            <div class="con-img ml-3">
                <img v-if="usuario[0].foto_user == 'default.png' " key="onlineImg" :src="activeUserInfo.photoURL" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
                <img v-else key="onlineImg" :src="'http://127.0.0.1:8000/images/'+usuario[0].foto_user" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
            </div>

            <vs-dropdown-menu class="vx-navbar-dropdown">
                <ul style="min-width: 9rem">

                    <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="perfil">
                        <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
                        <span class="ml-2">Perfil</span>
                    </li>

                    <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="logout">
                        <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
                        <span class="ml-2">Salir</span>
                    </li>
                </ul>
            </vs-dropdown-menu>
        </vs-dropdown>
    </div>
    <div v-else class="the-navbar__user-meta flex items-center">

        <div class="text-right leading-tight hidden sm:block">
            <p class="font-semibold">Invitado</p>
            <!-- <small>Invitado</small> -->
        </div>

        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
            <div class="con-img ml-3">
                <img key="onlineImg" :src="'http://127.0.0.1:8000/images/perfil_usuario.png'" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
            </div>

            <vs-dropdown-menu class="vx-navbar-dropdown">
                <ul style="min-width: 9rem">
                    <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/login')">
                        <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
                        <span class="ml-2">Iniciar sesión</span>
                    </li>
                </ul>
            </vs-dropdown-menu>
        </vs-dropdown>
    </div>


</div>
</template>

<script>
export default {
    data() {
        return {
            usuario: []
        }
    },
    computed: {
        activeUserInfo() {
            return this.$store.state.AppActiveUser
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        //console.log(this.usuario);
    },
    methods: {
        logout() {
            localStorage.removeItem('tk');
            localStorage.removeItem('usuario');
            this.$router.push('/login');
            location.reload()
        },
        perfil() {
            this.$router.push('/perfil');
        }
    }
}
</script>
