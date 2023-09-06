<template><div>
    <b-card header-tag="header" footer-tag="footer">
        <!-- HEADER: TITULO DE LA PAGINA -->
        <template #header>
            <h3>{{ $route.params.crear_editar == 'crear' ? 'Crear' : 'Editar' }} Paciente</h3>
        </template>

        <!-- CONTENIDO: FORMULARIO -->
        <b-container>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="2">
                <b-col>Nombres<b-form-input v-model="form.nombres"/></b-col>

                <b-col>Apellidos<b-form-input v-model="form.apellidos"/></b-col>
            </b-row>
            <br>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="3">
                <b-col>
                    <b-row align-v="center" align-h="start">
                        <b-col>
                            RUT
                            <b-form-input v-model="form.rut" :disabled="$route.params.crear_editar=='editar' || sin_rut"/>
                        </b-col>
                        <b-col cols="auto" v-if="$route.params.crear_editar=='crear'">
                            <b-form-checkbox v-model="sin_rut" v-if="$route.params.crear_editar=='crear'" @change="sin_rut_ha_cambiado()">
                                Sin<br>RUT
                            </b-form-checkbox>
                        </b-col>
                    </b-row>
                </b-col>

                <b-col>Fecha de Nacimiento<input type="date" v-model="form.fecha_nacimiento" class="form-control"/></b-col>

                <b-col>Género<b-form-select v-model="form.genero" :options="opciones_genero"/></b-col>
            </b-row>
            <br>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="3">
                <b-col>Email<b-form-input v-model="form.email"/></b-col>

                <b-col>Teléfono Móvil<b-form-input v-model="form.telefono_movil"/></b-col>

                <b-col>Teléfono Fijo<b-form-input v-model="form.telefono_fijo"/></b-col>
            </b-row>
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
                        <b-button @click="crearEditarPaciente()" variant="primary">Guardar</b-button>
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
            <b-button variant="danger" @click="deletePaciente($route.params.prefill_uuid)">Borrar</b-button>
            <b-button variant="secondary" @click="hide('forget')">Cancelar</b-button>
        </template>
    </b-modal>
</div></template>

<script>
import { pacienteMixin } from '@/mixins/pacienteMixin'

export default {
    mixins: [pacienteMixin],
    data() {
        return {
            sin_rut: false,
        }
    },
    methods: {
        crearEditarPaciente(){
            this.pre_procesar_form()
            let form_valido = this.validar_form()

            if (form_valido){
                if(this.$route.params.crear_editar == 'crear') {
                    this.postPaciente()
                } else if(this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid) {
                    this.putPaciente()
                }
            } else {
                this.showAlert()
            }
        },
        sin_rut_ha_cambiado() {
            this.form.rut = this.sin_rut ? this.generar_rut_falso() : ''
        },
    },
    mounted() {
        if (this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid){
            this.getPaciente(this.$route.params.prefill_uuid)
        }
    }
}
</script>

<style lang="css" scoped>
</style>