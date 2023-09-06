<template><div>
    <b-card header-tag="header" footer-tag="footer">
        <!-- HEADER: TITULO DE LA PAGINA -->
        <template #header>
            <h3>{{ $route.params.crear_editar == 'crear' ? 'Crear' : 'Editar' }} Armazón</h3>
        </template>

        <!-- CONTENIDO: FORMULARIO -->
        <b-container>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="3">

                <b-col>CÓDIGO BARRAS<input type="number" v-model="form.uuid" class="form-control"/></b-col>

                <b-col>Proveedor<b-form-select v-model="form.proveedor" :options="opciones_proveedor" @change="proveedor_ha_cambiado()"/></b-col>

                <!-- <b-col>Marca<b-form-select v-model="form.marca" :options="opciones_marca"/></b-col> -->

                <b-col>
                    <b-row align-v="center" align-h="start">
                        <b-col>
                            Marca
                            <input v-model="form.marca" class="form-control" v-if="marca_nueva"/>
                            <b-form-select v-model="form.marca" :options="opciones_marca" v-if="!marca_nueva"/>
                        </b-col>
                        <b-col cols="auto">
                            <b-form-checkbox v-model="marca_nueva" @change="form.marca=''">Nueva</b-form-checkbox>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <br>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="4">
                <b-col>Material<b-form-select v-model="form.material" :options="opciones_material"/></b-col>

                <b-col>Aro<b-form-select v-model="form.aro" :options="opciones_aro"/></b-col>

                <b-col>Tipo<b-form-select v-model="form.tipo" :options="opciones_tipo"/></b-col>

                <b-col>Género<b-form-select v-model="form.genero" :options="opciones_genero"/></b-col>
            </b-row>
            <br>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="2">
                <b-col>CÓDIGO ARMAZON<input v-model="form.codigo_armazon" class="form-control"/></b-col>

                <b-col>Costo Neto<input type="number" v-model="form.costo_neto" class="form-control"/></b-col>
            </b-row>
            <br>
            <b-row align-v="center" align-h="start" cols="1" cols-lg="2">
                <b-col cols="auto">
                    <img :src="form.foto" width="200px">
                </b-col>

                <b-col>
                    FOTO
                    <b-form-file
                        v-model="form.foto"
                        ref="file-input"
                        accept=".jpg, .png"
                        placeholder="Cargar foto de Armazón"
                        drop-placeholder="Drop file here..."
                        capture
                    />
                </b-col>
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
                        <b-button @click="crearEditarArmazon()" variant="primary">Guardar</b-button>
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
            <b-button variant="danger" @click="deleteArmazon($route.params.prefill_uuid)">Borrar</b-button>
            <b-button variant="secondary" @click="hide('forget')">Cancelar</b-button>
        </template>
    </b-modal>
</div></template>

<script>
import { armazonMixin } from '@/mixins/armazonMixin'

export default {
    mixins: [armazonMixin],
    data() {
        return {
            marca_nueva: false,
        }
    },
    methods: {
        crearEditarArmazon(){
            this.pre_procesar_form()
            let form_valido = this.validar_form()

            if (form_valido){
                if(this.$route.params.crear_editar == 'crear') {
                    this.postArmazon()
                } else if(this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid) {
                    this.putArmazon()
                }
            } else {
                this.showAlert()
            }
        },
        proveedor_ha_cambiado(){
            this.getMarcas()
        },
        foto_ha_cambiado(e) {
            const file = e.target.files[0]
            this.form.foto = URL.createObjectURL(file)
        },
    },
    mounted() {
        this.getProveedores()
        if (this.$route.params.crear_editar == 'editar' && this.$route.params.prefill_uuid){
            this.getArmazon(this.$route.params.prefill_uuid)
        }
    }
}
</script>

<style lang="css" scoped>
</style>