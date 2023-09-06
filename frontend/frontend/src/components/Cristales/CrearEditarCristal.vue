<template><div>
    <b-card header-tag="header" footer-tag="footer">
        <!-- HEADER: TITULO DE LA PAGINA -->
        <template #header>
            <h3>{{ $route.params.crear_editar == 'crear' ? 'Crear' : 'Editar' }} Cristal</h3>
        </template>

        <!-- CONTENIDO: FORMULARIO -->
        <b-container>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="3">
                <b-col>Proveedor<b-form-select v-model="form.proveedor" :options="opciones_proveedor"/></b-col>

                <b-col>Nombre Comercial<b-form-input v-model="form.nombre_comercial"/></b-col>

                <b-col>Código Comercial<b-form-input v-model="form.codigo_comercial"/></b-col>
            </b-row>
            <br>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="3">
                <b-col>Foco<b-form-select v-model="form.tipo_foco" :options="opciones_foco"/></b-col>

                <b-col>Material<b-form-select v-model="form.material" :options="opciones_material"/></b-col>

                <b-col>Índice<b-form-input type="number" v-model="form.indice" step="0.01"/></b-col>
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
                        <b-button @click="crearEditarCristal()" variant="primary">Guardar</b-button>
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
            <b-button variant="danger" @click="deleteCristal($route.params.prefill_uuid)">Borrar</b-button>
            <b-button variant="secondary" @click="hide('forget')">Cancelar</b-button>
        </template>
    </b-modal>
</div></template>

<script>
import { cristalMixin } from '@/mixins/cristalMixin'

export default {
    mixins: [cristalMixin],
    data() {
        return {
        }
    },
    methods: {
        crearEditarCristal(){
            this.pre_procesar_cristal_form()
            var form_cristal_valido = this.validar_cristal_form()

            if (form_cristal_valido){
                if(this.$route.params.crear_editar == 'crear') {
                    this.postCristal()
                } else if(this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid) {
                    this.putCristal()
                }
            } else {
                this.showAlert()
            }
        },
    },
    mounted() {
        this.getProveedores()
        if (this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid){
            this.getCristal(this.$route.params.prefill_uuid)
        } else if (this.$route.params.crear_editar == 'crear' ){
        }
    }
}
</script>

<style lang="css" scoped>
</style>