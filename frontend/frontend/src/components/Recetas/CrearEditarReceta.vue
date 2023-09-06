<template><div>
    <b-card header-tag="header" footer-tag="footer">
        <!-- HEADER: TITULO DE LA PAGINA -->
        <template #header>
            <h3>{{ $route.params.crear_editar == 'crear' ? 'Crear' : 'Editar' }} Receta
                <!-- <b-btn @click="validar_form()">VALIDAR</b-btn> -->
            </h3>
        </template>

        <!-- CONTENIDO: FORMULARIO -->
        <b-container>
            <b-row align-v="center" align-h="start" cols="1" cols-md="3">
                <b-col>PACIENTE<b-form-input disabled v-model="paciente"/></b-col>

                <b-col>FECHA DE EXAMEN<input type="date" v-model="form.fecha_examen" class="form-control"/></b-col>

                <b-col>RUT EXAMINADOR<b-form-input v-model="form.rut_examinador"/></b-col>
            </b-row>
            <br>
            <b-table-simple small caption-top responsive>
                <b-thead head-variant="dark">
                    <b-tr>
                        <b-th></b-th>
                        <b-th>ESFERA</b-th>
                        <b-th>CILINDRO</b-th>
                        <b-th>EJE</b-th>
                        <b-th>
                            ADD
                            <b-button variant="transparent" size="sm" @click="add_unica=!add_unica; add=''; form.od_add=''; form.oi_add='';">
                                <b-icon icon="eye" variant="white"></b-icon>
                                <b-icon v-if="add_unica" icon="eye" variant="white"></b-icon>
                                <b-icon v-if="!add_unica" icon="eye-fill" variant="white"></b-icon>
                            </b-button>
                        </b-th>
                        <b-th>
                            <label v-if="dnp_unica">DP</label>
                            <label v-if="!dnp_unica">DNP</label>
                            <b-button variant="transparent" size="sm" @click="dnp_unica=!dnp_unica; dp=''; form.od_dnp=''; form.oi_dnp='';">
                                <b-icon icon="eye" variant="white"></b-icon>
                                <b-icon v-if="dnp_unica" icon="eye" variant="white"></b-icon>
                                <b-icon v-if="!dnp_unica" icon="eye-fill" variant="white"></b-icon>
                            </b-button>
                        </b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr>
                        <b-th class="text-center align-middle" width="1%"><h3>OD</h3></b-th>
                        <b-td><b-form-select v-model="form.od_sph" :options="opciones_sph" required/></b-td>
                        <b-td><b-form-select v-model="form.od_cyl" :options="opciones_cyl" required/></b-td>
                        <b-td><b-form-select v-model="form.od_axis" :options="opciones_axis" required/></b-td>
                        <b-td v-if="add_unica" rowspan="2" class="text-center align-middle">
                            <b-form-select v-model="add" :options="opciones_add" required/>
                        </b-td>
                        <b-td v-if="!add_unica">
                            <b-form-select v-model="form.od_add" :options="opciones_add" required/>
                        </b-td>
                        <b-td v-if="dnp_unica" rowspan="2" class="text-center align-middle">
                            <b-form-select v-model="dp" :options="opciones_dp" required/>
                        </b-td>
                        <b-td v-if="!dnp_unica">
                            <b-form-select v-model="form.od_dnp" :options="opciones_dnp" required/>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-th class="text-center align-middle" width="1%"><h3>OI</h3></b-th>
                        <b-td><b-form-select v-model="form.oi_sph" :options="opciones_sph" required/></b-td>
                        <b-td><b-form-select v-model="form.oi_cyl" :options="opciones_cyl" required/></b-td>
                        <b-td><b-form-select v-model="form.oi_axis" :options="opciones_axis" required/></b-td>
                        <b-td v-if="!add_unica">
                            <b-form-select v-model="form.oi_add" :options="opciones_add" required/>
                        </b-td>
                        <b-td v-if="!dnp_unica">
                            <b-form-select v-model="form.oi_dnp" :options="opciones_dnp" required/>
                        </b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
            <b-container>
                <b-row>
                    <b-col class="text-left" cols="auto" v-if="form.od_cyl>0 & Boolean(form.od_sph) & Boolean(form.od_axis)">
                        <b-form-checkbox v-model="trasponer_od" switch @change="trasponer('OD')">Trasponer OD</b-form-checkbox>
                    </b-col>
                    <b-col class="text-left" cols="auto" v-if="form.oi_cyl>0 & Boolean(form.oi_sph) & Boolean(form.oi_axis)">
                        <b-form-checkbox v-model="trasponer_oi" switch @change="trasponer('OI')">Trasponer OI</b-form-checkbox>
                    </b-col>
                    <b-col class="text-right">
                        <b-form-checkbox v-model="ver_prismas" switch>
                            Prismas
                        </b-form-checkbox>
                    </b-col>
                </b-row>
                <br>
            </b-container>
            <b-table-simple small caption-top responsive v-if="ver_prismas">
                <b-thead head-variant="light">
                    <b-tr>
                        <b-th></b-th>
                        <b-th>PRISMA VERTICAL</b-th>
                        <b-th>DIRECCION VERTICAL</b-th>
                        <b-th>PRISMA HORIZONTAL</b-th>
                        <b-th>DIRECCION HORIZONTAL</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr>
                        <b-th class="text-center align-middle" width="1%"><h3>OD</h3></b-th>
                        <b-td><b-form-select v-model="form.od_vertical_prism" :options="opciones_prism" required/></b-td>
                        <b-td><b-form-select v-model="form.od_vertical_direction" :options="opciones_prism_vertical_direction" required/></b-td>
                        <b-td><b-form-select v-model="form.od_horizontal_prism" :options="opciones_prism" required/></b-td>
                        <b-td><b-form-select v-model="form.od_horizontal_direction" :options="opciones_prism_horizontal_direction" required/></b-td>
                    </b-tr>
                    <b-tr>
                        <b-th class="text-center align-middle" width="1%"><h3>OI</h3></b-th>
                        <b-td><b-form-select v-model="form.oi_vertical_prism" :options="opciones_prism" required/></b-td>
                        <b-td><b-form-select v-model="form.oi_vertical_direction" :options="opciones_prism_vertical_direction" required/></b-td>
                        <b-td><b-form-select v-model="form.oi_horizontal_prism" :options="opciones_prism" required/></b-td>
                        <b-td><b-form-select v-model="form.oi_horizontal_direction" :options="opciones_prism_horizontal_direction" required/></b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
            <b-table-simple small responsive borderless>
                <b-tbody>
                    <b-tr>
                        <b-th class="text-center" width="1%">COMENTARIOS</b-th>
                        <b-td><b-form-textarea v-model="form.comentarios" rows="6"/></b-td>
                    </b-tr>
                    <b-tr>
                        <b-th class="text-center align-middle">DOCUMENTO</b-th>
                        <b-td v-if="!Boolean(form.documento)">
                            <b-form-file
                                v-model="form.documento"
                                ref="file-input"
                                accept=".jpg, .png, .pdf"
                                placeholder="Adjuntar la Receta Original"
                                drop-placeholder="Drop file here..."
                                capture
                            />
                        </b-td>
                        <b-td v-else class="text-left align-middle">
                            <b-container>
                                <b-row align-h="between" align-v="center">
                                    <b-col cols="auto">
                                        <a :href="form.documento" target="_blank">{{ form.documento.split('/').slice(-1)[0] }}</a>
                                    </b-col>
                                    <b-col cols="auto">
                                        <b-button @click="form.documento=''">Borrar</b-button>
                                    </b-col>
                                </b-row>
                            </b-container>                            
                        </b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
        </b-container>
        
        <br>
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

        <!-- FOOTER: BOTONES AL FINAL DEL FORM -->
        <template #footer>
            <b-container>
                <b-row align-h="between">
                    <b-col cols="auto">
                        <b-button @click="crearEditarReceta()" variant="primary">Guardar</b-button>
                    </b-col>
                    <b-col cols="auto" v-if="$route.params.crear_editar=='editar'">
                        <b-button v-b-modal.modal-borrar variant="danger">Borrar</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </template>
    </b-card>

    <!-- MODAL PARA CONFIRMAR QUE DESEA BORRAR -->
    <b-modal id="modal-borrar" centered>
        <template #modal-header>
            <h5>Está seguro de que desea BORRAR ?</h5>
        </template>
        <template #default>
            <p>Esta acción es permanente.</p>
        </template>
        <template #modal-footer="{ ok, cancel, hide }">
            <b-button variant="danger" @click="deleteReceta($route.params.prefill_uuid)">Borrar</b-button>
            <b-button variant="secondary" @click="hide('forget')">Cancelar</b-button>
        </template>
    </b-modal>
</div></template>

<script>
import { recetaMixin } from '@/mixins/recetaMixin'

export default {
    mixins: [recetaMixin],
    data() {
        return {
        }
    },
    methods: {
        crearEditarReceta(){
            this.pre_procesar_form()
            let form_valido = this.validar_form()

            if (form_valido){
                if(this.$route.params.crear_editar == 'crear') {
                    this.postReceta()
                } else if(this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid != '_') {
                    this.putReceta()
                }
            } else {
                this.showAlert()
            }
        },
    },
    mounted() {
        if(this.$route.params.crear_editar == 'crear' && this.$route.params.prefill_paciente_uuid != '_') {
            this.form.paciente = this.$route.params.prefill_paciente_uuid
            this.getPaciente(this.form.paciente)
        } else if(this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid != '_') {
            this.getReceta(this.$route.params.prefill_uuid)
            this.add_unica=false
            this.dnp_unica=false
        }
    }
}
</script>

<style lang="css" scoped>
</style>