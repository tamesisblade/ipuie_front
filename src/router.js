/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [

        {
            // =============================================================================
            // MAIN LAYOUT ROUTES
            // =============================================================================
            path: '',
            component: () =>
                import('./layouts/main/Main.vue'),
            children: [
                {
                    path: '/login',
                    name: 'page-login',
                    component: () =>
                        import('./views/pages/Login.vue')
                },
                {
                    path: '/pages/error-404',
                    name: 'page-error-404',
                    component: () =>
                        import('./views/pages/Error404.vue')
                },
                {
                    path: '/restaurar',
                    name: 'recuperacion',
                    component: () =>
                        import('./views/pages/recuperacion.vue')
                },
                {
                    path: '/',
                    name: 'home',
                    component: () =>
                        import('./views/Home.vue')
                },
                {
                    path: '/registro',
                    name: 'page-registro',
                    component: () =>
                        import('./views/pages/registro.vue')
                },
                {
                    path: '/perfil',
                    name: 'perfil',
                    component: () =>
                        import('./views/Perfil.vue')
                },
                {
                    path: '/cambio_password',
                    name: 'home',
                    component: () =>
                        import('./views/pages/cambioPassword.vue')
                },
                // =============================================================================
                // Admin
                // =============================================================================
                {
                    path: '/usuarios',
                    name: 'usuarios',
                    component: () =>
                        import('./views/admin/usuarios.vue'),
                },
                {
                    path: '/cursos',
                    name: 'cursos',
                    component: () =>
                        import('./views/navegacion/cursos.vue')
                },
                {
                    path: '/detalle_curso/:id_curso',
                    name: 'detalle_curso',
                    component: () =>
                        import('./views/navegacion/detalle_curso.vue')
                },
                {
                    path: '/creacion_curso/:id_curso',
                    name: 'creacion_curso',
                    component: () =>
                        import('./views/navegacion/creacion_curso.vue')
                },
                {
                    path: '/inscripcion_curso',
                    name: 'inscripcion_curso',
                    component: () =>
                        import('./views/navegacion/inscripcion_curso.vue')
                },

                // PERSONALIZACION DE WEB
                {
                    path: '/editar_home',
                    name: 'editar_home',
                    component: () =>
                        import('./views/layout/editar_home.vue')
                },



                //NOTICIAS

                {
                    path: '/noticias',
                    name: 'noticias',
                    component: () =>
                        import('./views/navegacion/noticias.vue')
                },
                {
                    path: '/detalle_noticia/:id_noticia',
                    name: 'detalle_noticia',
                    component: () =>
                        import('./views/navegacion/detalle_noticia.vue')
                },
                {
                    path: '/creacion_noticia/:id_noticia',
                    name: 'creacion_noticia',
                    component: () =>
                        import('./views/navegacion/creacion_noticia.vue')
                },

                //CALENDARIO
                {
                  path: '/calendario',
                  name: 'calendario',
                  component: () =>
                      import('./views/admin/calendario.vue')
                },
                {
                  path: '/acerca_de',
                  name: 'acerca_de',
                  component: () =>
                      import('./views/navegacion/acerca_de.vue')
                },


                //CURSOS
                {
                  path: '/tareas',
                  name: 'tareas',
                  component: () =>
                      import('./views/cursos/tareas.vue')
                },
                {
                    path: '/tareas/estudiante',
                    name: 'tareas-estudiante',
                    component: () =>
                        import('./views/estudiante/tareaEstudiante.vue')
                },
                {
                    path: '/estudiante/tarea/add',
                    name: 'EstudianteTarea',
                    component: () =>
                      import('@/views/estudiante/agregarTarea.vue')
                  },
                {
                  path: '/acerca_de',
                  name: 'acerca_de',
                  component: () =>
                      import('./views/navegacion/acerca_de.vue')
                },

                //evaluaciones
                {
                    path: '/evaluaciones',
                    name: 'evaluaciones',
                    component: () =>
                        import ('./views/evaluaciones/EvaluacionesComponent.vue'),
                },

                {
                    path: '/revisarevaluacion',
                    name: 'revisarevaluacion',
                    component: () =>
                        import ('./views/evaluaciones/revisarEvaluacion.vue'),
                },
                {
                    path: '/estudiante/evaluaciones',
                    name: 'evaluacionesEstudiante',
                    component: () =>
                        import ('@/views/estudiante/evaluaciones.vue')
                },
                {
                    path: '/responderEvaluacion/:id',
                    name: 'responderEvaluacion',
                    component: () =>
                        import ('./views/evaluaciones/RespuestasComponent.vue'),
                },


            ],
        },

        // =============================================================================
        // FULL PAGE LAYOUTS
        // =============================================================================

        {
            path: '',
            component: () =>
                import('./layouts/main/Main.vue'),
            children: [

            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/pages/error-404'
        }
    ],
})

router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

export default router
