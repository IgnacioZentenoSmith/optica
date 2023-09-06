import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/me', name: 'me', component: () => import('../components/commons/me.vue') },

  { path: '/pacientes/:crear_editar/:prefill_uuid?', name: 'CrearEditarPaciente', component: () => import('../components/Pacientes/CrearEditarPaciente.vue') },
  { path: '/pacientes/', name: 'ListaPacientes', component: () => import('../components/Pacientes/ListaPacientes.vue') },

  { path: '/recetas/:crear_editar/:prefill_uuid?/:prefill_paciente_uuid?', name: 'CrearEditarReceta', component: () => import('../components/Recetas/CrearEditarReceta.vue') },
  { path: '/recetas/', name: 'ListaRecetas', component: () => import('../components/Recetas/ListaRecetas.vue') },

  { path: '/cristales/:crear_editar/:prefill_uuid?/', name: 'CrearEditarCristal', component: () => import('../components/Cristales/CrearEditarCristal.vue') },
  { path: '/cristales/', name: 'ListaCristales', component: () => import('../components/Cristales/ListaCristales.vue') },
  { path: '/rangos-cristal/:prefill_uuid/', name: 'RangosCristal', component: () => import('../components/Cristales/RangosCristal.vue') },

  { path: '/armazones/:crear_editar/:prefill_uuid?', name: 'CrearEditarArmazon', component: () => import('../components/Armazones/CrearEditarArmazon.vue') },
  { path: '/armazones/', name: 'ListaArmazones', component: () => import('../components/Armazones/ListaArmazones.vue') },

  { path: '/ordentrabajo/', name: 'CrearOrdenTrabajo', component: () => import('../components/OrdenTrabajo/CrearOrdenTrabajo.vue') },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
