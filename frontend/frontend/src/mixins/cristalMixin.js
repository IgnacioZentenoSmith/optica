import axios from 'axios'
import Swal from 'sweetalert2'

export const cristalMixin = {
    data() {
        return {
            // BUSQUEDA
            cristales: [],
            campos: [
                { key: 'proveedor_nombre', label: 'Proveedor', sortable: true },
                { key: 'nombre_comercial', label: 'Nombre Comercial', sortable: true },
                { key: 'codigo_comercial', label: 'Código Comercial', sortable: true },
                { key: 'tipo_foco', label: 'Foco', sortable: true },
                { key: 'material', label: 'Material', sortable: true },
                { key: 'indice', label: 'Índice', sortable: true },
                { key: 'accion', label: 'Acción' }
            ],
            total_rows: 0,
            per_page: 5,
            current_page: 1,
            is_busy: true,

            // FORMULARIO
            errores: [],

            form: {
                proveedor: '',
                nombre_comercial: '',
                codigo_comercial: '',
                tipo_foco: '',
                material: '',
                indice: 1.5
            },

            // OPCIONES
            opciones_proveedor: [
            ],
            opciones_material: [
                { text: 'Mineral', value: 'Mineral' },
                { text: 'Orgánico', value: 'Orgánico' },
                { text: 'Policarbonato', value: 'Policarbonato' },
            ],
            opciones_foco: [
                { text: 'Monofocal', value: 'Monofocal' },
                { text: 'Bifocal', value: 'Bifocal' },
                { text: 'Progresivo', value: 'Progresivo' },
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
            this.dismissSecs = 5 + this.errores.length * 2
            this.dismissCountDown = this.dismissSecs
        },
        pre_procesar_cristal_form() {
        },
        validar_cristal_form() {
            this.errores = []
            if (!this.form.proveedor) {
                this.errores.push('No ha ingresado Proveedor')
            }
            if (this.form.nombre_comercial.length <= 2) {
                this.errores.push('No ha ingresado Nombre Comercial o es muy corto')
            }
            if (this.form.material.length <= 2) {
                this.errores.push('No ha ingresado Material o es muy corto')
            }
            if (!this.form.tipo_foco) {
                this.errores.push('No ha ingresado Tipo de Foco')
            }
            if (!this.form.material) {
                this.errores.push('No ha ingresado Material')
            }
            if (!this.form.indice) {
                this.errores.push('No ha ingresado Indice')
            }
            if (this.form.indice * 1.0 < 1.5) {
                this.errores.push('Índice no debe ser inferior a 1.5')
            }
            if (this.form.indice * 1.0 > 1.8) {
                this.errores.push('Índice no debe ser mayor a 1.8')
            }
            return !(this.errores.length > 0)
        },
        // METODOS DE INTERACCION CON BACKEND
        getCristales(input_busqueda = '') {
            let path = ''
            if (input_busqueda.length == 0) {
                path = `/api/v1/drf/cristales/`
            } else {
                path = `/api/v1/drf/cristales/?search=${input_busqueda}`
            }

            axios.get(path, {
                'headers': { 'Authorization': 'Bearer ' + this.$store.state.access }
            })
                .then((response) => {
                    this.cristales = response.data
                    this.is_busy = false
                    this.total_rows = this.cristales.length
                    if (this.total_rows == 0) {
                        this.errores.push('La búsqueda "' + input_busqueda + '" no arrojó resultados')
                        this.busqueda = ''
                        this.showAlert()
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                })
        },
        getCristal(input_uuid) {
            axios.get(`/api/v1/drf/cristales/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer ' + this.$store.state.access }
            })
                .then((response) => {
                    this.form = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                })
        },
        postCristal() {
            axios.post(`/api/v1/drf/cristales/`, this.form, {
                'Authorization': 'Bearer ' + this.$store.state.access,
            })
                .then((response) => {
                    Swal.fire({
                        icon: 'success', title: 'Cristal creado con exito!', timer: 2000,
                        position: 'top-end', showConfirmButton: false
                    }).then((result) => {
                        this.$router.push({ name: 'ListaCristales' })
                    })
                })
                .catch((error) => {
                    console.log(error)

                    let errors = JSON.parse(error.request.response)
                    let errors_html = '<div align="left"><ul>'
                    for (var key of Object.keys(errors)) {
                        errors_html += "<li>" + key + ": " + errors[key] + "</li>"
                    }
                    errors_html += '</ul></div>'
                    Swal.fire({
                        icon: 'error', title: 'Error al crear el Cristal', html: errors_html, timer: 15000,
                        buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg' }
                    })
                })
                .finally(() => {
                })
        },
        putCristal() {
            axios.put(`/api/v1/drf/cristales/${this.$route.params.prefill_uuid}/`, this.form, {
                'Authorization': 'Bearer ' + this.$store.state.access,
            })
                .then((response) => {
                    Swal.fire({
                        icon: 'success', title: 'Cristal modificado con exito!', timer: 2000,
                        position: 'top-end', showConfirmButton: false
                    }).then((result) => {
                        this.$router.push({ name: 'ListaCristales' })
                    })
                })
                .catch((error) => {
                    console.log(error)

                    let errors = JSON.parse(error.request.response)
                    let errors_html = '<div align="left"><ul>'
                    for (var key of Object.keys(errors)) {
                        errors_html += "<li>" + key + ": " + errors[key] + "</li>"
                    }
                    errors_html += '</ul></div>'
                    Swal.fire({
                        icon: 'error', title: 'Error al modificar el Cristal', html: errors_html, timer: 15000,
                        buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg' }
                    })
                })
                .finally(() => {
                })
        },
        getProveedores() {
            axios.get(`http://localhost:8000/backend/api/v1/drf/proveedores/`, {
                'headers': {
                    'Authorization': 'Bearer ' + this.$store.state.access,
                }
            })
                .then((response) => {
                    for (const prov of response.data) {
                        this.opciones_proveedor.push({
                            "value": prov.uuid,
                            "text": prov.nombre + ' (' + prov.rut + ')'
                        })
                    }
                })
                .catch((error) => {
                    console.log(error)

                    let errors = JSON.parse(error.request.response)
                    let errors_html = '<div align="left"><ul>'
                    for (var key of Object.keys(errors)) {
                        errors_html += "<li>" + key + ": " + errors[key] + "</li>"
                    }
                    errors_html += '</ul></div>'
                    Swal.fire({
                        icon: 'error', title: 'Error al obtener los Proveedores', html: errors_html, timer: 15000,
                        buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg' }
                    })
                })
                .finally(() => {
                })
        },
        deleteCristal(input_uuid) {
            axios.delete(`/api/v1/drf/cristales/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer ' + this.$store.state.access }
            })
                .then((response) => {
                    Swal.fire({
                        icon: 'success', title: 'Cristal borrado con exito!', timer: 2000,
                        position: 'top-end', showConfirmButton: false
                    }).then((result) => {
                        this.$router.push({ name: 'ListaCristales' })
                    })
                })
                .catch((error) => {
                    console.log(error)

                    let errors = JSON.parse(error.request.response)
                    let errors_html = '<div align="left"><ul>'
                    for (var key of Object.keys(errors)) {
                        errors_html += "<li>" + key + ": " + errors[key] + "</li>"
                    }
                    errors_html += '</ul></div>'
                    Swal.fire({
                        icon: 'error', title: 'Error al borrar el Cristal', html: errors_html, timer: 15000,
                        buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg' }
                    })
                })
                .finally(() => {
                })
        },
    },
    created() {
    }
}