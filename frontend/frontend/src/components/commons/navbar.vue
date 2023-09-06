<template>
    <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top" sticky>
        <!-- LOGO -->
        <b-navbar-brand>
          <router-link to="/">
            <img src="@/assets/optica N ostra 2.png" height="30" alt="">
          </router-link>
        </b-navbar-brand>

        <!-- BTON PARA CUANDO LA PANTALLA ES MUY PEQUENA -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <!-- MENU -->
        <b-collapse id="nav-collapse" is-nav>
            <!-- ALINEADOS A LA IZQUIERDA -->
            <b-navbar-nav>
                <b-nav-item href="#">Link</b-nav-item>
                <b-nav-item href="#" disabled>Disabled</b-nav-item>
            </b-navbar-nav>

            <!-- ALINEADOS A LA DERECHA -->
            <b-navbar-nav class="ml-auto">
                <!-- <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                    <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                </b-nav-form> -->

                <!-- <b-nav-item-dropdown text="Lang" right>
                    <b-dropdown-item href="#">EN</b-dropdown-item>
                    <b-dropdown-item href="#">ES</b-dropdown-item>
                    <b-dropdown-item href="#">RU</b-dropdown-item>
                    <b-dropdown-item href="#">FA</b-dropdown-item>
                </b-nav-item-dropdown> -->

                <b-nav-item-dropdown right v-if="Boolean($store.state.login)">
                    <template #button-content>
                        <b>{{$store.state.username}}</b>
                    </template>
                    <b-dropdown-item href="#">Perfil</b-dropdown-item>
                    <b-dropdown-item @click="logout()" href="/">Logout</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item v-else @click="show_modal_login=!show_modal_login">Login</b-nav-item>

            </b-navbar-nav>
        </b-collapse>

        <!-- MODAL PARA LOGIN -->
        <b-modal title="Login" size="sm" v-model="show_modal_login">
            <!-- HEADER -->
            <template #modal-header><h3>Login</h3></template>
            <!-- BODY -->
            <template #default>
                <b-container fluid>
                    <b-row align-v="center" align-h="center"><h5>Usuario</h5></b-row>
                    <b-row><b-form-input v-model="login_data.username" placeholder="usuario"></b-form-input></b-row><br>
                    <b-row align-v="center" align-h="center"><h5>Contraseña</h5></b-row>
                    <b-row>
                        <b-input-group>
                            <b-form-input :type="show_password ? 'text' : 'password'" v-model="login_data.password" placeholder="contraseña"></b-form-input>
                            <b-input-group-append>
                                <b-button variant="outline-secondary" @click="show_password=!show_password">
                                    <b-icon-eye-slash-fill v-if="Boolean(show_password)"/>
                                    <b-icon-eye-fill v-else/>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-row><br>
                </b-container>
            </template>
            <!-- FOOTER -->
            <template #modal-footer>
                <b-button variant="primary" @click="login">Login</b-button>
                <b-button variant="secondary" @click="show_modal_login=false">Cancel</b-button>
            </template>
        </b-modal>

        <!-- MODAL "VENCERA LA VIGENCIA DEL LOGIN" -->
        <b-modal title="Login" size="sm" v-model="show_modal_expiracion_login" no-close-on-esc no-close-on-backdrop>
            <!-- HEADER -->
            <template #modal-header><h3>Login está por Expirar</h3></template>
            <!-- BODY -->
            <template #default>
                <b-container fluid>
                    <h2>login esta por vencer. continuas ahi?</h2>
                </b-container>
            </template>
            <!-- FOOTER -->
            <template #modal-footer>
                <b-button variant="primary" @click="refreshAccess()">Si</b-button>
                <b-button variant="secondary" @click="logout()">No</b-button>
            </template>
        </b-modal>

        <!-- <b-button variant="secondary" @click="logout()">Logout</b-button> -->
        <!-- <b-button variant="secondary" @click="refreshAccess()">New Access</b-button> -->


        <!-- <b-button variant="secondary">Access tiene {{access_life}} segundos de vida</b-button>
        <b-button variant="secondary">Refresh tiene {{refresh_life}} segundos de vida</b-button> -->


        <!-- <b-button variant="secondary">{{ this.$store.state.login }}</b-button> -->

    </b-navbar>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      login_data: {
        username: '',
        password: ''
      },
      show_password: false,
      show_modal_login: false,
      show_modal_expiracion_login: false,
      access_life: 0,
      refresh_life: 0,
      interval: null,
    }
  },
  methods: {
    startInterval(){
      this.updateClock()
      this.interval = setInterval(() => this.updateClock(), 60*1000)  // cada N*1000 donde N = segundos
    },
    stopInterval(){
      clearInterval(this.interval)
      this.access_life = 0
      this.refresh_life = 0
    },
    updateClock(){
      // console.log('actualizo reloj')
      if (this.$store.state.login) {
        let now = Math.floor(Date.now() / 1000)

        let seconds_to_refresh = 600 // 10*60 = 10 minutos // cantidad de segundos que estará abierto el modal_expiracion_login
        let access_lifetime = 3600 // 60*60 = 1 hora // cantidad de segundos de vigencia el access. configurado en settings.py
        let refresh_lifetime = 43200// 12*60*60 = 12 horas // cantidad de segundos de vigencia el refresh. configurado en settings.py
        
        this.access_life = Math.max(access_lifetime - (now - this.$store.state.access_gen), 0) // 30 es lo que dura vigente access
        this.refresh_life = Math.max(refresh_lifetime - (now - this.$store.state.refresh_gen), 0) // 60 es lo que dura vigente refresh

        if(this.access_life == 0 && this.refresh_life == 0){
          // si ambos estan vencidos, logout
          this.logout()
        } else if ( this.access_life > 0  && this.access_life <= seconds_to_refresh ) {
          // si acces le queda "poca" vida
          if ( this.refresh_life >= seconds_to_refresh ) {
            // refresh tiene "suficiente" vida para alcanzar a refrescar el access mientras se muestra el modal
            this.show_modal_expiracion_login = true
          } else {
            // refresh NO tiene "suficiente" vida para alcanzar a refrescar el access mientras se muestra el modal
            this.show_modal_expiracion_login = false
            this.logout()
            this.show_modal_login = true
          }
          
        } else if ( this.access_life == 0 && this.refresh_life > 0) {
          // si access ya venció, fue porque no lo refrescaron con el modal.
          // se hace logout aunque queda vida de refresh porque el usuario ya no esta presente
          this.logout()
        }
      }
    },
    login(){
      axios.post('/api/v1/auth/login/', {
        "username": this.login_data.username,
        "password": this.login_data.password
      })
      .then((response) => {
        let now = Math.floor(Date.now() / 1000)

        this.$store.state.login = true
        this.$store.state.username = this.login_data.username
        this.$store.state.refresh = response.data.refresh
        this.$store.state.refresh_gen = now
        this.$store.state.access = response.data.access
        this.$store.state.access_gen = now

        localStorage.setItem('refresh', this.$store.state.refresh)
        localStorage.setItem('refresh_gen', this.$store.state.refresh_gen)
        localStorage.setItem('access', this.$store.state.access)
        localStorage.setItem('access_gen', this.$store.state.access_gen)

        this.startInterval()

        this.login_data.username = ''
        this.login_data.password = ''
        this.show_modal_login = false
        this.show_modal_expiracion_login = false
      })
      .catch((error) => {
        this.logout()
        console.log(error)
      })
      .finally(() => {
      });
    },
    logout(){
      this.$store.state.login = false
      this.$store.state.username = ''
      this.$store.state.refresh = ''
      this.$store.state.refresh_gen = 0
      this.$store.state.access = ''
      this.$store.state.access_gen = 0

      localStorage.removeItem('refresh')
      localStorage.removeItem('refresh_gen')
      localStorage.removeItem('access')
      localStorage.removeItem('access_gen')

      this.login_data.username = ''
      this.login_data.password = ''
      this.show_modal_login = false
      this.show_modal_expiracion_login = false

      this.stopInterval()

      this.$router.push({name:'home'}).catch(err => {}) // sin el catch, tira error cuando redirige hacia la misma pagina
    },
    refreshAccess(){
      axios.post('/api/v1/auth/login/refresh/', {
        'refresh': this.$store.state.refresh
      })
      .then((response1) => {
        // console.log('<< se obtuvo una respuesta al intentar actualizar el access')
        if(response1.data.access){ // si el refresh me responde un access, entonces aun es valido
          let now = Math.floor(Date.now() / 1000)
          // console.log('<< la respuesta contiene un nuevo access con el cual intentare obtener los datos del usuario')
          axios.get('/api/v1/auth/me/', {
            'headers': { 'Authorization': 'Bearer '+response1.data.access }
          })
          .then((response2) => {
            // console.log('<< se obtuvo una respuesta al pedir los datos del usuario')
            if(response2.data.username){ // si el nuevo access me responde un usuario, entonces puedo loggearlo
              // console.log('<< la respuesta tiene un username, por lo que puedo loggearlo')

              this.$store.state.username = response2.data.username
              this.$store.state.access = response1.data.access
              this.$store.state.access_gen = now

              localStorage.setItem('access', this.$store.state.access)
              localStorage.setItem('access_gen', this.$store.state.access_gen)
              
              this.stopInterval()
              this.startInterval()
              
              this.login_data.username = ''
              this.login_data.password = ''
              this.show_modal_login = false
              this.show_modal_expiracion_login = false
            }
          })
          .catch((error2) => {
            console.log(error2)
            // console.log('<< se obtuvo UN ERROR al pedir los datos del usuario')
            this.logout()
          })
          .finally(() => {
          });
        } else { // si el de access NO me responde un usuario, entonces esta vencido.
          this.logout()
        }
      })
      .catch((error1) => {
        console.log(error1)
        // console.log('<< se obtuvo un ERROR al intentar actualizar el access')
        this.logout()
      })
      .finally(() => {
      })
    },
    checkLocalStorage(){
      // console.log('<<<<<< SE VA A REVISAR STORAGE PARA ACTUALIZAR LOGIN')
      if(localStorage.getItem('access') && localStorage.getItem('access_gen')
          && localStorage.getItem('refresh') && localStorage.getItem('refresh_gen')){ // si estan los dos token, puedo pasar a validarlos
        // console.log('<<<< los dos token estan en localstorage')
        // console.log('<< se intentara usar el de access para obtener los datos del usuario')
        axios.get('/api/v1/auth/me/', {
          'headers': { 'Authorization': 'Bearer '+localStorage.getItem('access') }
        })
        .then((response1) => {
          // console.log('<< se obtuvo una respuesta al usar el access para obtener los datos del usuario ')
          if(response1.data.username){ // si el de access me responde un usuario, entonces aun es valido y puede seguir loggeado
            // console.log('<< la respuesta entregada por el access contiene un usuario valido ')

            this.$store.state.login = true
            this.$store.state.username = response1.data.username
            this.$store.state.refresh = localStorage.getItem('refresh')
            this.$store.state.refresh_gen = localStorage.getItem('refresh_gen')
            this.$store.state.access = localStorage.getItem('access')
            this.$store.state.access_gen = localStorage.getItem('access_gen')
            this.updateClock()
      
          } else { // si el de access NO me responde un usuario
            // console.log('<< la respuesta entregada por el access NO contiene un usuario valido ')
            // console.log('######## deberia intentar con el refresh si se actualiza el access ')
            this.logout()
          }
        })
        .catch((error1) => {
          // console.log('<< se obtuvo UN ERROR al usar el access para obtener los datos del usuario ')
          // console.log('<< como el access entrega error. se intentará actualizarlo con el refresh')
          console.log(error1)
          this.refreshAccess()
        })
        .finally(() => {
        })
      } else { // si solo hay un token, hubo intervencion de terceros. logout y obliga a empezar de nuevo.
        // console.log('<<<< falta algun token en localstorage')
        this.logout()
      }
    }
  },
  mounted() {
    this.checkLocalStorage()
    this.login_data.username='mario'
    this.login_data.password='Evaluna123$'
  }
}
</script>