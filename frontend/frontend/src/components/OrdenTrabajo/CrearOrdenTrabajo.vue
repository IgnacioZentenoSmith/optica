<template><div>
    <b-card header-tag="header" footer-tag="footer" id="printable-content">
        <!-- HEADER: TITULO DE LA PAGINA -->
        <template #header>
            <h3>Orden de Trabajo</h3>
        </template>

        <div v-if="!Boolean(paciente_seleccionado)">
            <!-- CONTENIDO: BUSCARDOR PACIENTES -->
            <b-input-group class="mb-3">
                <b-input-group-prepend>
                    <b-button variant="secondary" disabled><b-icon icon="search"/> PACIENTE</b-button>
                </b-input-group-prepend>

                <b-form-input type="search" v-model="busqueda_paciente" placeholder="Buscar Paciente..." v-on:keydown.enter="buscar_paciente()"/>
                
            </b-input-group>

            <!-- CONTENIDO: TABLA PACIENTES -->
            <div v-if="pacientes.length>0">
                <b-table
                    :items="pacientes" :fields="campos_pacientes" :per-page="per_page_pacientes" :current-page="current_page_pacientes" :busy.sync="is_busy_pacientes" head-variant="dark"
                    fixed striped hover small
                    @row-dblclicked="seleccion_paciente"
                >
                </b-table>
                <b-pagination v-model="current_page_pacientes" pills :total-rows="total_rows_pacientes" :per-page="per_page_pacientes" size="sm" align="center"></b-pagination>
            </div>
        </div>

        <div v-if="Boolean(paciente_seleccionado)">

            <!-- {{ this.paciente_seleccionado }} -->
            <b-card class="text-left">
                <b-container>
                    <b-row align-h="between">
                        <b-col cols="auto">
                            <font size="5"><b>{{paciente_seleccionado.nombres}} {{paciente_seleccionado.apellidos}}</b></font>
                        </b-col>
                        <b-col cols="auto">
                            <font size="3">
                                {{paciente_seleccionado.rut}}
                            </font><br>
                        </b-col>
                        <b-col cols="auto">
                            <font size="3">
                                {{paciente_seleccionado.edad}} años ({{ paciente_seleccionado.fecha_nacimiento }})
                            </font><br>
                        </b-col>
                        <b-col cols="auto">
                            <!-- <b-button  data-html2canvas-ignore="true">Cambiar Paciente</b-button> -->
                            <b-button pill size="sm" variant="outline-danger"
                                @click="paciente_seleccionado=null; busqueda_paciente=''; pacientes=[]; recetas=[]; receta_seleccionada=null;"
                                data-html2canvas-ignore="true">
                                <b-icon icon="x-lg" variant="outline-danger"></b-icon>
                            </b-button>
                        </b-col>
                    </b-row>
                </b-container>
            </b-card>
            <br>
            <b-card class="text-left">
                <!-- CONTENIDO: TABLA RECETAS -->
                <div v-if="recetas.length>0 & !Boolean(receta_seleccionada)">
                    <b-table
                        :items="recetas" :fields="campos_recetas" :per-page="per_page_recetas" :current-page="current_page_recetas" :busy.sync="is_busy_recetas" head-variant="dark"
                        :sort-by.sync="sortBy_recetas"
                        :sort-desc.sync="sortDesc_recetas"
                        fixed striped hover small
                        @row-dblclicked="seleccion_receta"
                    >
                    </b-table>
                    <b-pagination v-model="current_page_recetas" pills :total-rows="total_rows_recetas" :per-page="per_page_recetas" size="sm" align="center"></b-pagination>
                </div>
                <div v-if="Boolean(receta_seleccionada)">
                    <!-- {{ this.receta_seleccionada }} -->
                    <b-container fluid>
                        <b-row align-h="between">
                            <b-col cols="auto">
                                <font size="3">
                                    RUT EXAMINADOR: {{receta_seleccionada.rut_examinador}}
                                </font><br>
                            </b-col>
                            <b-col cols="auto">
                                <font size="3">
                                    FECHA DE EXAMEN: {{receta_seleccionada.fecha_examen}}
                                </font><br>
                            </b-col>
                            <b-col cols="auto">
                                <font size="3">
                                    ANTIGUEDAD: {{receta_seleccionada.antiguedad}}
                                </font><br>
                            </b-col>
                            <b-col cols="auto">
                                <b-button pill size="sm" variant="outline-danger"
                                    @click="receta_seleccionada=null; cristal_od_seleccionado=null; opciones_cristal_od=[]; cristal_oi_seleccionado=null; opciones_cristal_oi=[];"
                                    data-html2canvas-ignore="true">
                                    <b-icon icon="x-lg" variant="outline-danger"></b-icon>
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-container>
                    <br>
                    <b-container fluid>
                        <b-table-simple small caption-top responsive>
                            <b-thead head-variant="dark">
                                <b-tr>
                                    <b-th></b-th>
                                    <b-th class="text-center align-middle" width="1%">ESFERA</b-th>
                                    <b-th class="text-center align-middle" width="1%">CILINDRO</b-th>
                                    <b-th class="text-center align-middle" width="1%">EJE</b-th>
                                    <b-th class="text-center align-middle" width="1%">ADD</b-th>
                                    <b-th class="text-center align-middle" width="1%">DNP</b-th>
                                    <b-th class="text-center align-middle" width="1%">PRISMA</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr>
                                    <b-th class="text-center align-middle" width="1%"><h3>OD</h3></b-th>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.od_sph}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.od_cyl}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.od_axis}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.od_add}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.od_dnp}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">
                                        V: {{receta_seleccionada.od_vertical_prism}} {{receta_seleccionada.od_vertical_direction}}
                                        <br>
                                        H: {{receta_seleccionada.od_horizontal_prism}} {{receta_seleccionada.od_horizontal_direction}}
                                    </b-td>
                                </b-tr>
                                <b-tr>
                                    <b-th class="text-center align-middle" width="1%"><h3>OI</h3></b-th>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.oi_sph}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.oi_cyl}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.oi_axis}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.oi_add}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">{{receta_seleccionada.oi_dnp}}</b-td>
                                    <b-td class="text-center align-middle" width="1%">
                                        V: {{receta_seleccionada.oi_vertical_prism}} {{receta_seleccionada.oi_vertical_direction}}
                                        <br>
                                        H: {{receta_seleccionada.oi_horizontal_prism}} {{receta_seleccionada.oi_horizontal_direction}}
                                    </b-td>
                                </b-tr>
                            </b-tbody>
                        </b-table-simple>
                        {{ receta_seleccionada.comentarios }}
                    </b-container>
                </div>
            </b-card>
            <br>
            <b-card class="text-left">
                <b-container fluid>
                    <b-row>
                        <b-col>
                            <b-form-radio-group
                                class="d-flex flex-wrap"
                                v-model="seleccion_tipo_cristal"
                                :options="opciones_tipo_cristal"
                                button-variant="outline-primary"
                                size="md"
                                buttons
                            ></b-form-radio-group>
                        </b-col>
                    </b-row>       
                </b-container>
                <br>
                <b-container fluid v-if="opciones_cristal_od.length>0 & !Boolean(cristal_od_seleccionado)">
                    <b-row align-h="between">
                        <b-col cols="auto">
                            <h1>OPCIONES OD</h1>
                        </b-col>
                        <b-col cols="auto">
                            <b-button @click="cristal_od_seleccionado={'uuid':null}" data-html2canvas-ignore="true">
                                Ninguno
                            </b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <!-- CONTENIDO: TABLA OPCIONES OD -->
                        <b-table
                            :items="opciones_cristal_od" :fields="campos_opciones_cristal" :per-page="per_page_opciones_cristal_od" :current-page="current_page_opciones_cristal_od" :busy.sync="is_busy_opciones_cristal_od" head-variant="dark"
                            :sort-by.sync="sortBy_opciones_cristal_od"
                            :sort-desc.sync="sortDesc_opciones_cristal_od"
                            fixed striped hover small
                            @row-dblclicked="seleccion_cristal_od"
                        >
                        </b-table>
                        <b-pagination v-model="current_page_opciones_cristal_od" pills :total-rows="total_rows_opciones_cristal_od" :per-page="per_page_opciones_cristal_od" size="sm" align="center"></b-pagination>
                    </b-row>
                </b-container>
                <b-container fluid v-if="Boolean(cristal_od_seleccionado)">
                    <b-row>
                        {{ cristal_od_seleccionado }}
                        <b-button @click="cristal_od_seleccionado=null;" data-html2canvas-ignore="true">Cambiar OD</b-button>
                    </b-row>
                </b-container>
                <br>
                <b-container fluid v-if="opciones_cristal_oi.length>0 & !Boolean(cristal_oi_seleccionado)">
                    <b-row align-h="between">
                        <b-col cols="auto">
                            <h1>OPCIONES OI</h1>
                        </b-col>
                        <b-col cols="auto">
                            <b-button @click="cristal_oi_seleccionado={'uuid':null}" data-html2canvas-ignore="true">
                                Ninguno
                            </b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <!-- CONTENIDO: TABLA OPCIONES OI -->
                        <b-table
                            :items="opciones_cristal_oi" :fields="campos_opciones_cristal" :per-page="per_page_opciones_cristal_oi" :current-page="current_page_opciones_cristal_oi" :busy.sync="is_busy_opciones_cristal_oi" head-variant="dark"
                            :sort-by.sync="sortBy_opciones_cristal_oi"
                            :sort-desc.sync="sortDesc_opciones_cristal_oi"
                            fixed striped hover small
                            @row-dblclicked="seleccion_cristal_oi"
                        >
                        </b-table>
                        <b-pagination v-model="current_page_opciones_cristal_oi" pills :total-rows="total_rows_opciones_cristal_oi" :per-page="per_page_opciones_cristal_oi" size="sm" align="center"></b-pagination>
                    </b-row>
                </b-container>
                <b-container fluid v-if="Boolean(cristal_oi_seleccionado)">
                    <b-row>
                        {{ cristal_oi_seleccionado }}
                        <b-button @click="cristal_oi_seleccionado=null;" data-html2canvas-ignore="true">Cambiar OI</b-button>
                    </b-row>
                </b-container>
            </b-card>
        </div>

        <!-- FOOTER: BOTONES AL FINAL DEL FORM -->
        <template #footer>
            <b-container>
                <b-row align-h="between">
                    <b-col cols="auto">
                        <b-button @click="printContent" variant="primary" data-html2canvas-ignore="true">Imprimir</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </template>
    </b-card>

    <!-- MODAL PARA CONFIRMAR QUE DESEA BORRAR -->
    <!-- <b-modal id="modal-borrar" centered>
        <template #modal-header>
            <h5>Está seguro de que desea BORRAR ?</h5>
        </template>
        <template #default>
            <p>Esta acción es permanente.</p>
        </template>
        <template #modal-footer="{ ok, cancel, hide }">
            <b-button variant="danger" @click="deleteCristal($route.params.prefill_uuid)">Borrar</b-button>
            <b-button variant="secondary" @click="hide('forget')">Cancelar</b-button>
        </template>
    </b-modal> -->
</div></template>

<script>
// import { cristalMixin } from '@/mixins/cristalMixin'
import axios from 'axios'
import html2pdf from 'html2pdf.js'
// import Swal from 'sweetalert2'

export default {
    // mixins: [cristalMixin],
    data() {
        return {
            busqueda_paciente: '',
            campos_pacientes: [
                { key: 'rut', label: 'RUT', sortable: true},
                { key: 'nombres', label: 'NOMBRES', sortable: true},
                { key: 'apellidos', label: 'APELLIDOS', sortable: true},
                { key: 'edad', label: 'EDAD', sortable: true},
                { key: 'fecha_nacimiento', label: 'FECHA DE NACIMIENTO', sortable: true},
            ],
            pacientes: [],
            per_page_pacientes: 5,
            current_page_pacientes: 1,
            is_busy_pacientes: true,
            total_rows_pacientes: 0,
            paciente_seleccionado: null,

            campos_recetas: [
                { key: 'rut_examinador', label: 'RUT EXAMINADOR'},
                { key: 'fecha_examen', label: 'FECHA DE EXAMEN'},
                { key: 'antiguedad', label: 'ANTIGUEDAD', sortable: true},
                { key: 'od_sph', label: 'OD SPH'},
                { key: 'od_cyl', label: 'OD CYL'},
                { key: 'od_add', label: 'OD ADD'},
                { key: 'od_dnp', label: 'OD DNP'},
                { key: 'oi_sph', label: 'OI SPH'},
                { key: 'oi_cyl', label: 'OI CYL'},
                { key: 'oi_add', label: 'OI ADD'},
                { key: 'oi_dnp', label: 'OI DNP'},
            ],
            recetas: [],
            per_page_recetas: 5,
            current_page_recetas: 1,
            is_busy_recetas: true,
            total_rows_recetas: 0,
            receta_seleccionada: null,
            sortBy_recetas: 'antiguedad',
            sortDesc_recetas: false,

            campos_opciones_cristal: [
                { key: 'tipo_foco', label: 'TIPO FOCO', sortable: true},
                { key: 'material', label: 'MATERIAL', sortable: true},
                { key: 'nombre_comercial', label: 'NOMBRE COMERCIAL', sortable: true},
                { key: 'indice', label: 'INDICE', sortable: true},                
                { key: 'precio', label: 'PRECIO', sortable: true},
            ],

            opciones_cristal_od: [],
            per_page_opciones_cristal_od: 5,
            current_page_opciones_cristal_od: 1,
            is_busy_opciones_cristal_od: true,
            total_rows_opciones_cristal_od: 0,
            cristal_od_seleccionado: null,
            sortBy_opciones_cristal_od: 'antiguedad',
            sortDesc_opciones_cristal_od: false,

            opciones_cristal_oi: [],
            per_page_opciones_cristal_oi: 5,
            current_page_opciones_cristal_oi: 1,
            is_busy_opciones_cristal_oi: true,
            total_rows_opciones_cristal_oi: 0,
            cristal_oi_seleccionado: null,
            sortBy_opciones_cristal_oi: 'antiguedad',
            sortDesc_opciones_cristal_oi: false,

            opciones_tipo_cristal:['LEJOS','CERCA','BIFOCAL','PROGRESIVO'],
            seleccion_tipo_cristal:null,
        }
    },
    methods: {
        printContent () {
            var element = document.getElementById('printable-content')
            var opt = {
                margin:       1,
                filename:     'myfile.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { dpi: 300, letterRendering: false, width: 1080, removeContainer: true},
                // html2canvas:  { scale: 1, width:1080 },
                jsPDF:        { unit: 'cm', format: 'letter', orientation: 'landscape', compress: true }
            }
            html2pdf().from(element).set(opt).save()
        },
        buscar_paciente(){
            if(Boolean(this.buscar_paciente)){
                this.getPacientes(this.busqueda_paciente)
            }
        },
        getPacientes(input_busqueda){
            let path = `/api/v1/drf/pacientes/?search=${input_busqueda}`

            axios.get(path, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.pacientes = response.data
                this.is_busy_pacientes = false
                this.total_rows_pacientes = this.pacientes.length
                if(this.total_rows_pacientes==0){
                    // this.errores.push('La búsqueda "'+input_busqueda+'" no arrojó resultados')
                    // this.busqueda = ''
                    // this.showAlert()
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            })
        },
        seleccion_paciente(item, index){
            this.paciente_seleccionado = item
            this.getRecetas(this.paciente_seleccionado.uuid)            
        },
        getRecetas(input_uuid_paciente){
            let path = `/api/v1/drf/recetas/?paciente=${input_uuid_paciente}`

            axios.get(path, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.recetas = response.data
                this.is_busy_recetas = false
                this.total_rows_recetas = this.recetas.length
                if(this.total_rows_recetas==0){
                    // this.errores.push('La búsqueda "'+input_busqueda+'" no arrojó resultados')
                    // this.busqueda = ''
                    // this.showAlert()
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            })
        },
        seleccion_receta(item, index){
            this.receta_seleccionada = item
            // this.getOpcionesCristalOD()
            // this.getOpcionesCristalOI()
        },
        getOpcionesCristalOD(){
            let path = `api/v1/drf/cristables-disponibles/?sph=${this.receta_seleccionada.od_sph}&cyl=${this.receta_seleccionada.od_cyl}`
            axios.get(path, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.opciones_cristal_od = response.data
                this.is_busy_opciones_cristal_od = false
                this.total_rows_opciones_cristal_od= this.opciones_cristal_od.length
                if(this.total_rows_opciones_cristal_od==0){
                    // this.errores.push('La búsqueda "'+input_busqueda+'" no arrojó resultados')
                    // this.busqueda = ''
                    // this.showAlert()
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            })
        },
        getOpcionesCristalOI(){
            let path = `api/v1/drf/cristables-disponibles/?sph=${this.receta_seleccionada.oi_sph}&cyl=${this.receta_seleccionada.oi_cyl}`
            axios.get(path, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.opciones_cristal_oi = response.data
                this.is_busy_opciones_cristal_oi = false
                this.total_rows_opciones_cristal_oi= this.opciones_cristal_oi.length
                if(this.total_rows_opciones_cristal_oi==0){
                    // this.errores.push('La búsqueda "'+input_busqueda+'" no arrojó resultados')
                    // this.busqueda = ''
                    // this.showAlert()
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            })
        },
        seleccion_cristal_od(item, index){
            this.cristal_od_seleccionado = item
            // alert(this.cristal_od_seleccionado.uuid)
        },
        seleccion_cristal_oi(item, index){
            this.cristal_oi_seleccionado = item
            // alert(this.cristal_oi_seleccionado.uuid)
        },
    },
    mounted() {
        // this.getProveedores()
        // if (this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid){
        //     this.getCristal(this.$route.params.prefill_uuid)
        // } else if (this.$route.params.crear_editar == 'crear' ){
        // }
    }
}
</script>

<style lang="css" scoped>
</style>