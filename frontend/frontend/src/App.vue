<template>
  <div id="app">
    <navbar/>
    <!-- <sidebar/> -->
    <!-- CONTENEDOR PRINCIPAL -->
    <div id="content-wrap">

      <b-container fluid>
        <b-row class="mt-2">
          <!-- MENU DE LA IZQUIERDA -->
          <!-- <b-col cols="3" md="2"> -->
            <b-col cols="auto">
            <div class="accordion" role="tablist">
              <b-button block v-b-toggle.accordion-1 variant="secondary">General</b-button>
              <b-collapse id="accordion-1" accordion="my-accordion">
                <b-list-group>
                  <b-list-group-item :to="{name:'home'}">Home</b-list-group-item>
                  <b-list-group-item :to="{name:'about'}">About</b-list-group-item>
                  <b-list-group-item :to="{name:'me'}">Me</b-list-group-item>
                </b-list-group>
              </b-collapse>

              <b-button block v-b-toggle.accordion-2 variant="secondary" class="mt-2">Pacientes</b-button>
              <b-collapse id="accordion-2" accordion="my-accordion">
                <b-list-group>
                  <b-list-group-item :to="{name:'ListaPacientes'}">Lista</b-list-group-item>
                  <b-list-group-item :to="{name:'CrearEditarPaciente', params:{crear_editar:'crear'}}">Crear</b-list-group-item>
                </b-list-group>
              </b-collapse>

              <b-button block v-b-toggle.accordion-3 variant="secondary" class="mt-2">Recetas</b-button>
              <b-collapse id="accordion-3" accordion="my-accordion">
                <b-list-group>
                  <b-list-group-item :to="{name:'ListaRecetas'}">Lista</b-list-group-item>
                  <b-list-group-item :to="{name:'CrearEditarReceta', params:{crear_editar:'crear'}}">Crear</b-list-group-item>
                </b-list-group>
              </b-collapse>

              <b-button block v-b-toggle.accordion-4 variant="secondary" class="mt-2">Cristales</b-button>
              <b-collapse id="accordion-4" accordion="my-accordion">
                <b-list-group>
                  <b-list-group-item :to="{name:'ListaCristales'}">Lista</b-list-group-item>
                  <b-list-group-item :to="{name:'CrearEditarCristal', params:{crear_editar:'crear'}}">Crear</b-list-group-item>
                </b-list-group>
              </b-collapse>

              <b-button block v-b-toggle.accordion-5 variant="secondary" class="mt-2">Armazones</b-button>
              <b-collapse id="accordion-5" accordion="my-accordion">
                <b-list-group>
                  <b-list-group-item :to="{name:'ListaArmazones'}">Lista</b-list-group-item>
                  <b-list-group-item :to="{name:'CrearEditarArmazon', params:{crear_editar:'crear'}}">Crear</b-list-group-item>
                </b-list-group>
              </b-collapse>

              <b-button block v-b-toggle.accordion-6 variant="secondary" class="mt-2">Orden Trabajo</b-button>
              <b-collapse id="accordion-6" accordion="my-accordion">
                <b-list-group>
                  <b-list-group-item :to="{name:'CrearOrdenTrabajo'}">Nueva</b-list-group-item>
                  <!-- <b-list-group-item :to="{name:'CrearEditarArmazon', params:{crear_editar:'crear'}}">Crear</b-list-group-item> -->
                </b-list-group>
              </b-collapse>
            </div>
          </b-col>
          <!-- CONTENIDO PRINCIPAL -->
          <b-col style="word-wrap: break-word">
            <router-view/>
          </b-col>
          <!-- MENU DE LA DERECHA -->
          <!-- <b-col cols="auto">
            <b-nav vertical small>
              <b-nav-item active>Active</b-nav-item>
              <b-nav-item>Link</b-nav-item>
              <b-nav-item>Another Link</b-nav-item>
              <b-nav-item disabled>Disabled</b-nav-item>
            </b-nav>  
          </b-col> -->
        </b-row>
      </b-container>
    </div>
    
    <!-- FOOTER -->
    <footer id="footer">
      <b-container>
        <span class="text-muted"> Montauk SpA | Optica Nostra ® | {{ new Date().getFullYear() }}</span>
      </b-container>
    </footer>

  </div>
</template>

<script>
import navbar from "./components/commons/navbar"
// import sidebar from "./components/commons/sidebar"

export default {
  components: {
    navbar,
    // sidebar
  },
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  position: relative; /* new */
  min-height: 100vh; /* new */
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

#content-wrap {
  padding-bottom: 2.5rem;    /* Footer height */
}

#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;            /* Footer height */
}
</style>
