import { validadoresMixin, capitalizeMixin, generateFakeRutMixin } from '@/mixins/utilsMixin'
import axios from 'axios'
import Swal from 'sweetalert2'

export const armazonMixin = {
    mixins: [validadoresMixin, capitalizeMixin, generateFakeRutMixin],
    data() {
        return {
            // BUSQUEDA
            armazones: [],
            campos: [
                { key: 'uuid', label: 'COD. BARRAS', sortable: true},
                { key: 'codigo_armazon', label: 'COD. ARMAZON', sortable: true},

                { key: 'proveedor_nombre', label: 'Proveedor', sortable: true},
                { key: 'marca', label: 'Marca', sortable: true},
                { key: 'material', label: 'Material', sortable: true},
                { key: 'aro', label: 'Aro', sortable: true},
                { key: 'tipo', label: 'Tipo', sortable: true},
                { key: 'genero', label: 'Género', sortable: true},

                { key: 'foto', label: 'Foto'},
                
                { key: 'accion', label: 'Acción'}
            ],
            total_rows: 0,
            per_page: 5,
            current_page: 1,
            is_busy: true,

            // FORMULARIO
            errores: [],

            form: {
                uuid: null,
                proveedor: null,
                marca: '',
                codigo_armazon: '',
                material: '',
                aro: '',
                tipo: '',
                genero: '',
                costo_neto: null,
                foto: null,
            },

            // OPCIONES
            opciones_proveedor: [],
            opciones_marca: [],
            opciones_material: [
                {text: 'Celuloide', value: 'Celuloide'},
                {text: 'Acetato', value: 'Acetato'},
                {text: 'Metálico', value: 'Metálico'},
            ],
            opciones_aro: [
                {text: 'Completo', value: 'Completo'},
                {text: 'Aire', value: 'Aire'},
                {text: 'Semi Aire', value: 'Semi Aire'},
            ],
            opciones_tipo: [
                {text: 'Normal', value: 'Normal'},
                {text: 'Sol', value: 'Sol'},
                {text: 'Lectura', value: 'Lectura'},
                {text: 'Seguridad', value: 'Seguridad'},
            ],
            opciones_genero: [
                {text: 'Femenino', value: 'Femenino'},
                {text: 'Masculino', value: 'Masculino'},
                {text: 'Unisex', value: 'Unisex'},
            ],

            // ALERTAS DE ERRORES
            dismissSecs: 0,
            dismissCountDown: 0,
        }
    },
    methods: {
        // NECESARIAS PARA ALERTA DE ERRORES
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        showAlert() {
            this.dismissSecs = 5+this.errores.length*2
            this.dismissCountDown = this.dismissSecs
        },
        // PREPROCESAR Y VALIDAR FORMULARIO
        pre_procesar_form() {
            this.form.marca = String(this.form.marca).replace(/\s+/g, ' ').trim()
        },
        validar_form() {
            this.errores = []
            if (String(this.form.uuid).length != 10){
                this.errores.push('Código de Barras debe ser de 10 dígitos')
            }
            if ( this.form.uuid%1 != 0 ){
                this.errores.push('Código de Barras debe ser entero')
            }
            if ( !this.form.proveedor ){
                this.errores.push('Debe ingresar un Proveedor')
            }
            if ( !this.form.marca ){
                this.errores.push('Debe ingresar una Marca')
            }
            if ( !this.form.material ){
                this.errores.push('Debe ingresar un Material')
            }
            if ( !this.form.aro ){
                this.errores.push('Debe ingresar un Tipo de Aro')
            }
            if ( !this.form.tipo ){
                this.errores.push('Debe ingresar un Tipo de Armazón')
            }
            if ( !this.form.genero ){
                this.errores.push('Debe ingresar un Género')
            }
            if ( !this.form.codigo_armazon ){
                this.errores.push('Debe ingresar un Código del Armazón. Usualmente está en la pata/varilla.')
            }
            if ( this.form.costo_neto <= 499 ){
                this.errores.push('Debe ingresar un Costo Neto mayor o igual 500')
            }
            if ( this.form.costo_neto % 1 != 0 ){
                this.errores.push('Costo Neto debe ser Entero')
            }
            
            return !(this.errores.length>0)
        },
        // METODOS DE INTERACCION CON BACKEND
        postArmazon(){
            axios.post(`/api/v1/drf/armazones/`, this.form, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Armazón creado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaArmazones' })
                })
            })
            .catch((error) => {
                console.log(error)

                let errors = JSON.parse(error.request.response)
                let errors_html = '<div align="left"><ul>'
                for (var key of Object.keys(errors)) {
                    errors_html += "<li>"+key+": "+errors[key]+"</li>"
                }
                errors_html += '</ul></div>'
                Swal.fire({
                    icon: 'error', title: 'Error al crear el Armazón', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        putArmazon(){
            axios.put(`/api/v1/drf/armazones/${this.$route.params.prefill_uuid}/`, this.form, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Armazón actualizado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaArmazones' })
                })
            })
            .catch((error) => {
                console.log(error)

                let errors = JSON.parse(error.request.response)
                let errors_html = '<div align="left"><ul>'
                for (var key of Object.keys(errors)) {
                    errors_html += "<li>"+key+": "+errors[key]+"</li>"
                }
                errors_html += '</ul></div>'
                Swal.fire({
                    icon: 'error', title: 'Error al actualizar el Armazón', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        getArmazon(input_uuid){
            axios.get(`/api/v1/drf/armazones/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.form = {}
                for(var key in response.data) {
                    this.form[key] = response.data[key]
                }
            })
            .catch((error) => {
                console.log(error)

                // let errors = JSON.parse(error.request.response)
                // let errors_html = '<div align="left"><ul>'
                // for (var key of Object.keys(errors)) {
                //     errors_html += "<li>"+key+": "+errors[key]+"</li>"
                // }
                // errors_html += '</ul></div>'
                // Swal.fire({
                //     icon: 'error', title: 'Error al obtener el Paciente', html: errors_html, timer: 15000,
                //     buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                // })
            })
            .finally(() => {
                this.getMarcas()
            })
        },
        getArmazones(input_busqueda=''){
            let path = ''
            if (input_busqueda.length==0) {
                path = `/api/v1/drf/armazones/`
            } else {
                path = `/api/v1/drf/armazones/?search=${input_busqueda}`                
            }

            axios.get(path, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.armazones = response.data
                this.is_busy = false
                this.total_rows = this.armazones.length
                if(this.total_rows==0){
                    this.errores.push('La búsqueda "'+input_busqueda+'" no arrojó resultados')
                    this.busqueda = ''
                    this.showAlert()
                }
            })
            .catch((error) => {
                console.log(error)

                // let errors = JSON.parse(error.request.response)
                // let errors_html = '<div align="left"><ul>'
                // for (var key of Object.keys(errors)) {
                //     errors_html += "<li>"+key+": "+errors[key]+"</li>"
                // }
                // errors_html += '</ul></div>'
                // Swal.fire({
                //     icon: 'error', title: 'Error al buscar en Pacientes', html: errors_html, timer: 15000,
                //     buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                // })
            })
            .finally(() => {
            })
        },
        deleteArmazon(input_uuid){
            axios.delete(`/api/v1/drf/armazones/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Armazón borrado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaArmazones' })
                })
            })
            .catch((error) => {
                console.log(error)

                let errors = JSON.parse(error.request.response)
                let errors_html = '<div align="left"><ul>'
                for (var key of Object.keys(errors)) {
                    errors_html += "<li>"+key+": "+errors[key]+"</li>"
                }
                errors_html += '</ul></div>'
                Swal.fire({
                    icon: 'error', title: 'Error al borrar el Armazón', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        getProveedores(){
            axios.get(`/api/v1/drf/proveedores/`, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                }
            })
            .then((response) => {
                for (const prov of response.data) {
                    this.opciones_proveedor.push({
                        "value": prov.uuid,
                        "text": prov.nombre+' ('+prov.rut+')'
                    })
                }               
            })
            .catch((error) => {
                console.log(error)

                let errors = JSON.parse(error.request.response)
                let errors_html = '<div align="left"><ul>'
                for (var key of Object.keys(errors)) {
                    errors_html += "<li>"+key+": "+errors[key]+"</li>"
                }
                errors_html += '</ul></div>'
                Swal.fire({
                    icon: 'error', title: 'Error al obtener los Proveedores', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        getMarcas(){
            axios.get(`/api/v1/drf/marcas-from-proveedor/?proveedor_uuid=${this.form.proveedor}`, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                }
            })
            .then((response) => {
                // this.opciones_marca = []
                // for (const marca of response.data['marcas']) {
                //     this.opciones_marca.push({
                //         "value": marca,
                //         "text": marca
                //     })
                // } 
                this.opciones_marca = response.data['marcas']
            })
            .catch((error) => {
                console.log(error)

                let errors = JSON.parse(error.request.response)
                let errors_html = '<div align="left"><ul>'
                for (var key of Object.keys(errors)) {
                    errors_html += "<li>"+key+": "+errors[key]+"</li>"
                }
                errors_html += '</ul></div>'
                Swal.fire({
                    icon: 'error', title: 'Error al obtener las Marcas', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
    },
    created() {
    }
}