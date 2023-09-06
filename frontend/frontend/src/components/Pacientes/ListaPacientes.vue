<template><div>
    <b-card header-tag="header" footer-tag="footer">
        <!-- HEADER: TITULO DE LA PAGINA -->
        <template #header>
            <h3>Pacientes</h3>
        </template>

        <!-- CONTENIDO: BUSCARDOR -->
        <b-input-group class="mb-3">
            <b-input-group-prepend>
                <b-button variant="secondary" disabled><b-icon icon="search"/></b-button>
            </b-input-group-prepend>

            <b-form-input type="search" v-model="busqueda" placeholder="Buscar..." v-on:keydown.enter="buscar()"/>

            <!-- <b-input-group-append>
                <b-button variant="secondary" disabled>Buscar</b-button>
            </b-input-group-append> -->
        </b-input-group>

        <!-- CONTENIDO: TABLA -->
        <div v-if="pacientes.length>0">
            <b-table
                :items="pacientes" :fields="campos" :per-page="per_page" :current-page="current_page" :busy.sync="is_busy" head-variant="dark"
                fixed striped hover small
                @row-clicked="myRowClickHandler()"
            >
                <template #cell(accion)="data">
                    <b-button size="sm" variant="primary" :to="{name:'CrearEditarPaciente', params: {crear_editar:'editar', prefill_uuid: data.item.uuid}}">Editar</b-button>
                    <b-button size="sm" variant="primary" :to="{name:'CrearEditarReceta', params: {crear_editar:'crear', prefill_uuid: '_', prefill_paciente_uuid: data.item.uuid}}">Agregar Receta</b-button>
                    <!-- <b-button size="sm" variant="danger" :to="{name:'BorrarPaciente', params: {uuid: data.item.uuid}}"><b-icon icon="trash"></b-icon></b-button> -->
                </template>
            </b-table>
            <b-pagination v-model="current_page" pills :total-rows="total_rows" :per-page="per_page" size="sm" align="center"></b-pagination>
        </div>
        <!-- CONTENIDO: ALERT QUE APARECE SI HAY ERRORES EN EL FORMULARIO -->
        <div class="col text-left" style="font-size:12px;">
            <b-alert :show="dismissCountDown" dismissible variant="warning"
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged"
            >
                <ul><li v-for="error in errores">{{ error }}</li></ul> 
                <b-progress variant="warning" :max="dismissSecs" :value="dismissCountDown" height="10px"></b-progress>
            </b-alert>
        </div>

        <!-- FOOTER -->
        <template #footer>
            <b-container>
                <b-row align-h="between">
                    <b-col cols="auto">
                        Footer1
                    </b-col>
                    <b-col cols="auto">
                        Footer2
                    </b-col>
                </b-row>
            </b-container>
        </template>
    </b-card>
</div></template>

<script>
import { pacienteMixin } from '@/mixins/pacienteMixin'

export default {
    mixins: [pacienteMixin],
    data() {
        return {
            busqueda: '',
        }
    },
    methods: {
        buscar(){
            this.errores = []
            if(this.busqueda.length < 3) {
                this.errores.push('La búsqueda debe tener al menos 3 caracteres')
                this.showAlert()
            } else {
                this.getPacientes(this.busqueda)
            }
        },
    },
    mounted() {
        this.getPacientes('')
    }
}
</script>

<style lang="css" scoped>
</style>