import { validadoresMixin, capitalizeMixin, generateFakeRutMixin } from '@/mixins/utilsMixin'
import axios from 'axios'
import Swal from 'sweetalert2'

export const pacienteMixin = {
    mixins: [validadoresMixin, capitalizeMixin, generateFakeRutMixin],
    data() {
        return {
            // BUSQUEDA
            pacientes: [],
            campos: [
                { key: 'rut', label: 'RUT', sortable: true},
                { key: 'nombres', label: 'Nombres', sortable: true},
                { key: 'apellidos', label: 'Apellidos', sortable: true},
                { key: 'fecha_nacimiento', label: 'Fecha de Nacimiento', sortable: true},
                { key: 'edad', label: 'Edad', sortable: true},
                { key: 'accion', label: 'Acción'}
            ],
            total_rows: 0,
            per_page: 5,
            current_page: 1,
            is_busy: true,

            // FORMULARIO
            errores: [],

            form: {
                nombres: '',
                apellidos: '',
                rut: '',
                fecha_nacimiento: null,
                genero: null,
                email: '',
                telefono_movil: '',
                telefono_fijo: ''
            },

            // OPCIONES
            opciones_genero: [
                {text: 'Femenino', value: 'Femenino'},
                {text: 'Masculino', value: 'Masculino'},
                {text: 'Otro', value: 'Otro'},
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
            this.form.fecha_nacimiento = this.form.fecha_nacimiento == '' ? null : this.form.fecha_nacimiento
            this.form.nombres = this.capitalize(this.form.nombres.replace(/\s+/g, ' ').trim())
            this.form.apellidos = this.capitalize(this.form.apellidos.replace(/\s+/g, ' ').trim())
            this.form.rut = this.form.rut.replace(/\s+/g, ' ').trim().toUpperCase()
            this.form.email = this.form.email.replace(/\s+/g, ' ').trim().toLowerCase()
            this.form.telefono_movil = this.form.telefono_movil.replace(/\s+/g, ' ').trim()
            this.form.telefono_fijo = this.form.telefono_fijo.replace(/\s+/g, ' ').trim()
        },
        validar_form() {
            this.errores = []
            if (this.form.nombres.length <=2){
                this.errores.push('No ha ingresado Nombres o es muy corto')
            }
            if (this.form.apellidos.length <=2){
                this.errores.push('No ha ingresado Apellidos o es muy corto')
            }
            if (!this.validarRut(this.form.rut) && !this.validarRutFalso(this.form.rut)){
                this.errores.push('RUT no es válido. No utilice puntos. Ejemplo: 12345678-k')
            }
            if ( !this.validarEmail(this.form.email) && this.form.email ){
                this.errores.push('Email incorrecto. Ejemplo: juan@gmail.com')
            }
            if ( !this.validarTelefono(this.form.telefono_movil) && this.form.telefono_movil ){
                this.errores.push('Teléfono móvil incorrecto. Ejemplo: +56991234567')
            }
            if ( !this.validarTelefono(this.form.telefono_fijo) && this.form.telefono_fijo ){
                this.errores.push('Teléfono fijo incorrecto. Ejemplo: +56221234567')
            }
            if ( this.form.telefono_movil==this.form.telefono_fijo && this.form.telefono_movil ){
                this.errores.push('Teléfonos no pueden ser iguales')
            }
            if ( this.form.nombres==this.form.apellidos && this.form.nombres ){
                this.errores.push('Nombres y Apellidos no pueden ser iguales')
            }
            if(this.form.fecha_nacimiento){
                var date_min = (new Date(1900, 0, 1)).toISOString().split('T')[0]
                var date_today = (new Date()).toISOString().split('T')[0]
                var date_fecha_nacimiento = (new Date(this.form.fecha_nacimiento)).toISOString().split('T')[0]
                if ( date_fecha_nacimiento >= date_today || date_min > date_fecha_nacimiento ){
                    this.errores.push('Fecha de nacimiento debe estar en el pasado y mayor a 01/01/1900')
                }
            }
            return !(this.errores.length>0)
        },
        // METODOS DE INTERACCION CON BACKEND
        postPaciente(){
            axios.post(`/api/v1/drf/pacientes/`, this.form, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Paciente creado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaPacientes' })
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
                    icon: 'error', title: 'Error al crear el Paciente', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        putPaciente(){
            axios.put(`/api/v1/drf/pacientes/${this.$route.params.prefill_uuid}/`, this.form, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Paciente actualizado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaPacientes' })
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
                    icon: 'error', title: 'Error al actualizar el Paciente', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        getPaciente(input_uuid){
            axios.get(`/api/v1/drf/pacientes/${input_uuid}/`, {
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
            })
        },
        getPacientes(input_busqueda=''){
            let path = ''
            if (input_busqueda.length==0) {
                path = `/api/v1/drf/pacientes/`
            } else {
                path = `/api/v1/drf/pacientes/?search=${input_busqueda}`                
            }

            axios.get(path, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.pacientes = response.data
                this.is_busy = false
                this.total_rows = this.pacientes.length
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
        deletePaciente(input_uuid){
            axios.delete(`/api/v1/drf/pacientes/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Paciente borrado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaPacientes' })
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
                    icon: 'error', title: 'Error al borrar el Paciente', html: errors_html, timer: 15000,
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