<template><div>
    <b-card header-tag="header" footer-tag="footer">
        <!-- HEADER: TITULO DE LA PAGINA -->
        <template #header>
            <h3>Rangos de Cristal</h3>
        </template>

        <!-- CONTENIDO: FORMULARIO -->
        <b-container>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="3">
                <b-col>Proveedor<b-form-input v-model="form_cristal.proveedor_nombre" disabled/></b-col>

                <b-col>Nombre Comercial<b-form-input v-model="form_cristal.nombre_comercial" disabled/></b-col>

                <b-col>Código Comercial<b-form-input v-model="form_cristal.codigo_comercial" disabled/></b-col>
            </b-row>
            <br>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="3">
                <b-col>Foco<b-form-input v-model="form_cristal.tipo_foco" disabled/></b-col>

                <b-col>Material<b-form-input v-model="form_cristal.material" disabled/></b-col>

                <b-col>Índice<b-form-input v-model="form_cristal.indice" disabled/></b-col>
            </b-row>
        </b-container>
        <br>
        <b-container fluid>
            <b-row>
                <b-col class="text-left">
                    <b-button variant="primary" @click="NuevoRango()" v-b-modal.modal-rangos>Nuevo Rango</b-button>
                </b-col>
                <b-col class="text-center">
                    <input type="file" id="archivo" @change="subirArchivo()"/>
                </b-col>
                <b-col class="text-right" v-if="rangosCristal.length>0">
                    <b-button variant="primary" @click="descargarArchivo()">Descargar Rangos</b-button>
                </b-col>
                <b-col class="text-right" v-if="rangosCristal.length>0">
                    <b-button variant="danger" @click="borrarTodosRangos()">BORRAR Rangos</b-button>
                </b-col>
            </b-row>
            <br>
        </b-container>
        <!-- CONTENIDO: TABLA -->
        <!-- <div v-if="rangosCristal.length>0">
            <b-table
                :items="rangosCristal" :fields="campos" :per-page="per_page" :current-page="current_page" :busy.sync="is_busy" head-variant="dark"
                fixed striped hover small
                @row-clicked="myRowClickHandler()"
            >
                <template #cell(accion)="data">
                    <b-button size="sm" variant="primary" @click="EditarRango(data.item)" v-b-modal.modal-rangos>Editar</b-button>
                </template>
            </b-table>
            <b-pagination v-model="current_page" pills :total-rows="total_rows" :per-page="per_page" size="sm" align="center"></b-pagination>
        </div> -->

        <b-tabs card>
            <!-- Render Tabs, supply a unique `key` to each tab -->
            <b-tab v-for="d in diametros" :key="'dyn-tab-' + d" :title="'Ø '+d+' mm'">
                <!-- CONTENIDO: TABLA -->
                <div v-if="rangosCristal.length>0">
                    <b-table
                        :items="diametros_rangos[d]" :fields="campos" :per-page="per_page" :current-page="current_page" :busy.sync="is_busy" head-variant="dark"
                        fixed striped hover small
                        @row-clicked="myRowClickHandler()"
                    >
                        <template #cell(accion)="data">
                            <b-button size="sm" variant="primary" @click="EditarRango(data.item)" v-b-modal.modal-rangos>Editar</b-button>
                        </template>
                    </b-table>
                    <b-pagination v-model="current_page" pills :total-rows="total_rows" :per-page="per_page" size="sm" align="center"></b-pagination>
                </div>

                <b-container>
                    <b-row>
                        <b-col cols="auto">
                            <b-table responsive sticky-header small head-variant="dark"  striped hover :items="tablaRangos.tabla_rangos_cristal[d]">
                                <template #cell()="data">
                                    <span v-html="data.value"></span>
                                </template>
                            </b-table>
                        </b-col>
                    </b-row>
                </b-container>
                <br>
                <div id="heatmap-container"></div>
            </b-tab>

            <!-- Render this if no tabs -->
            <template #empty>
            <div class="text-center text-muted">
                There are no open tabs
            </div>
            </template>
        </b-tabs>

        <br>
        <!-- FOOTER: BOTONES AL FINAL DEL FORM -->
        <template #footer>
            <b-container>
                <b-row align-h="between">
                    <b-col cols="auto">
                    </b-col>
                    <b-col cols="auto" v-if="$route.params.crear_editar=='editar'">
                    </b-col>
                </b-row>
            </b-container>
        </template>
    </b-card>

    <!-- MODAL CON FORM PARA CREAR/EDITAR RANGO -->
    <b-modal id="modal-rangos" centered size="md">
        <template #modal-header>
            <h5>Rango de Cristal</h5>
        </template>
        <template #default>

            <b-container>
                <b-row align-v="center">
                    <b-col></b-col>
                    <b-col class="text-center">Desde / Mínimo</b-col>
                    <b-col class="text-center">Hasta / Máximo</b-col>
                </b-row>
                <b-row align-v="center">
                    <b-col class="text-right">Esfera</b-col>
                    <b-col><b-form-select v-model="form_rango.sph_desde" :options="opciones_sph"/></b-col>
                    <b-col><b-form-select v-model="form_rango.sph_hasta" :options="opciones_sph"/></b-col>
                </b-row>
                <b-row align-v="center">
                    <b-col class="text-right">Cilindro</b-col>
                    <b-col><b-form-select v-model="form_rango.cyl_desde" :options="opciones_cyl"/></b-col>
                    <b-col><b-form-select v-model="form_rango.cyl_hasta" :options="opciones_cyl"/></b-col>
                </b-row>
                <b-row align-v="center">
                    <b-col class="text-right">Poder</b-col>
                    <b-col><b-form-select v-model="form_rango.min_poder" :options="opciones_poder"/></b-col>
                    <b-col><b-form-select v-model="form_rango.max_poder" :options="opciones_poder"/></b-col>
                </b-row>
                <b-row align-v="center">
                    <b-col class="text-right">Add / Adición</b-col>
                    <b-col><b-form-select v-model="form_rango.add_desde" :options="opciones_add"/></b-col>
                    <b-col><b-form-select v-model="form_rango.add_hasta" :options="opciones_add"/></b-col>
                </b-row>
                <br>
                <b-row align-v="center">
                    <b-col class="text-right">Diámetro</b-col>
                    <b-col><b-form-select v-model="form_rango.diametro" :options="opciones_diametro"/></b-col>
                    <b-col></b-col>
                </b-row>
                <b-row align-v="center">
                    <b-col class="text-right">Costo Neto</b-col>
                    <b-col><b-form-input type="number" step="1" v-model="form_rango.costo_neto"/></b-col>
                    <b-col></b-col>
                </b-row>
            </b-container>
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
        </template>
        <template #modal-footer="{ ok, cancel, hide }">
            <b-button variant="primary" @click="crearEditarRango(); hide('forget');">Guardar</b-button>
            <b-button variant="secondary" @click="hide('forget')">Cancelar</b-button>
            <b-button variant="danger" v-if="form_rango.uuid" v-b-modal.modal-borrar>Borrar</b-button>
        </template>
    </b-modal>

    <!-- MODAL PARA CONFIRMAR QUE DESEA BORRAR RANGO -->
    <b-modal id="modal-borrar" centered>
    <template #modal-header>
        <h5>Está seguro de que desea BORRAR ?</h5>
    </template>
    <template #default>
        <p>Esta acción es permanente.</p>
    </template>
    <template #modal-footer="{ ok, cancel, hide }">
        <b-button variant="danger" @click="deleteRango(form_rango.uuid)">Borrar</b-button>
        <b-button variant="secondary" @click="hide('forget')">Cancelar</b-button>
    </template>
</b-modal>
</div></template>

<script>
import { rangosCristalMixin } from '@/mixins/rangosCristalMixin'
import readXlsxFile from 'read-excel-file'
import exportFromJSON from 'export-from-json'
import Papa from 'papaparse'

export default {
    mixins: [rangosCristalMixin],
    data() {
        return {
            items_archivo: [],
        }
    },
    methods: {
        crearEditarRango(){
            this.pre_procesar_rango_form()
            var form_rango_valido = this.validar_rango_form()

            if (form_rango_valido){
                if(this.form_rango.uuid) { // si el form contiene un uuid entonces es EDITAR
                    this.putRango()
                } else { // si el form NO contiene un uuid entonces es CREAR
                    this.postRango()
                }
                this.getRangos(this.$route.params.prefill_uuid)
                this.getTablasRangos(this.$route.params.prefill_uuid)
            } else {
                this.showAlert()
            }
        },
        subirArchivo(){
            var input = document.getElementById("archivo")
            const file = input.files[0]
            Papa.parse(file, {
                complete: (results) => {
                    const csvData = results.data
                    const headers = csvData.shift()
                    const jsonData = csvData.map((row) => {
                    return headers.reduce((obj, header, index) => {
                        obj[header] = row[index]
                        return obj
                    }, {})
                    })
                    this.items_archivo = jsonData

                    for (var new_rango of this.items_archivo) {
                        this.NuevoRango()
                        const keys = Object.keys(new_rango)
                        keys.forEach(key => {
                            if (new_rango[key]!='null'){
                                this.form_rango[key] = new_rango[key]
                            }
                        })
                        this.postRango()
                    }
                }
            })            
        },
        borrarTodosRangos(){
            for (var rango of this.rangosCristal) {
                this.deleteRango(rango['uuid'])
            }
        },
        descargarArchivo(){
            const data = this.rangosCristal
            const fileName = 'rangos_'+this.$route.params.prefill_uuid
            const exportType = exportFromJSON.types.csv

            for (const row of data) {
                delete row['uuid']
                delete row['created_at']
                delete row['updated_at']
                delete row['cristal']
            }

            if (data) exportFromJSON({ data, fileName, exportType})
        },
    },
    mounted() {
        this.getCristal(this.$route.params.prefill_uuid)
        this.getRangos(this.$route.params.prefill_uuid)
        this.getTablasRangos(this.$route.params.prefill_uuid)

        readXlsxFile(arrayBuffer).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
        })
    }
}
</script>

<style lang="css" scoped>
</style>