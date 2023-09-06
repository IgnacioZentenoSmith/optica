import axios from 'axios'
import Swal from 'sweetalert2'

export const rangosCristalMixin = {
    data() {
        return {
            // BUSQUEDA
            campos: [
                // { key: 'diametro', label: 'Diámetro', sortable: true},
                { key: 'sph_desde', label: 'SPH Desde', sortable: true},
                { key: 'sph_hasta', label: 'SPH Hasta', sortable: true},
                { key: 'cyl_desde', label: 'CYL Desde', sortable: true},
                { key: 'cyl_hasta', label: 'CYL Hasta', sortable: true},
                { key: 'min_poder', label: 'Min Poder', sortable: true},
                { key: 'max_poder', label: 'Max Poder', sortable: true},
                { key: 'add_desde', label: 'Add Desde', sortable: true},
                { key: 'add_hasta', label: 'Add Hasta', sortable: true},
                { key: 'costo_neto', label: 'Costo Neto', sortable: true},
                { key: 'accion', label: 'Acción'}
            ],
            total_rows: 0,
            per_page: 5,
            current_page: 1,
            is_busy: true,
            
            // FORMULARIO
            errores: [],

            rangosCristal: [],
            tablaRangos: null,

            diametros: [],
            diametros_rangos: {},
            
            form_cristal: {
                proveedor: '',
                nombre_comercial: '',
                codigo_comercial: '',
                tipo_foco:'',
                material: '',
                indice: null,
            },

            form_rango: {
                cristal: null,
                diametro: '65',
                sph_desde: '0.00',
                sph_hasta: '0.00',
                cyl_desde: '0.00',
                cyl_hasta: '0.00',
                min_poder: null,
                max_poder: null,
                add_desde: null,
                add_hasta: null,
                costo_neto: null,
            },

            // OPCIONES
            opciones_sph: [
                {text: '+20.00', value: '20.00'},{text: '+19.75', value: '19.75'},{text: '+19.50', value: '19.50'},{text: '+19.25', value: '19.25'},
                {text: '+19.00', value: '19.00'},{text: '+18.75', value: '18.75'},{text: '+18.50', value: '18.50'},{text: '+18.25', value: '18.25'},
                {text: '+18.00', value: '18.00'},{text: '+17.75', value: '17.75'},{text: '+17.50', value: '17.50'},{text: '+17.25', value: '17.25'},
                {text: '+17.00', value: '17.00'},{text: '+16.75', value: '16.75'},{text: '+16.50', value: '16.50'},{text: '+16.25', value: '16.25'},
                {text: '+16.00', value: '16.00'},{text: '+15.75', value: '15.75'},{text: '+15.50', value: '15.50'},{text: '+15.25', value: '15.25'},
                {text: '+15.00', value: '15.00'},{text: '+14.75', value: '14.75'},{text: '+14.50', value: '14.50'},{text: '+14.25', value: '14.25'},
                {text: '+14.00', value: '14.00'},{text: '+13.75', value: '13.75'},{text: '+13.50', value: '13.50'},{text: '+13.25', value: '13.25'},
                {text: '+13.00', value: '13.00'},{text: '+12.75', value: '12.75'},{text: '+12.50', value: '12.50'},{text: '+12.25', value: '12.25'},
                {text: '+12.00', value: '12.00'},{text: '+11.75', value: '11.75'},{text: '+11.50', value: '11.50'},{text: '+11.25', value: '11.25'},
                {text: '+11.00', value: '11.00'},{text: '+10.75', value: '10.75'},{text: '+10.50', value: '10.50'},{text: '+10.25', value: '10.25'},
                {text: '+10.00', value: '10.00'},{text: '+9.75', value: '9.75'},{text: '+9.50', value: '9.50'},{text: '+9.25', value: '9.25'},
                {text: '+9.00', value: '9.00'},{text: '+8.75', value: '8.75'},{text: '+8.50', value: '8.50'},{text: '+8.25', value: '8.25'},
                {text: '+8.00', value: '8.00'},{text: '+7.75', value: '7.75'},{text: '+7.50', value: '7.50'},{text: '+7.25', value: '7.25'},
                {text: '+7.00', value: '7.00'},{text: '+6.75', value: '6.75'},{text: '+6.50', value: '6.50'},{text: '+6.25', value: '6.25'},
                {text: '+6.00', value: '6.00'},{text: '+5.75', value: '5.75'},{text: '+5.50', value: '5.50'},{text: '+5.25', value: '5.25'},
                {text: '+5.00', value: '5.00'},{text: '+4.75', value: '4.75'},{text: '+4.50', value: '4.50'},{text: '+4.25', value: '4.25'},
                {text: '+4.00', value: '4.00'},{text: '+3.75', value: '3.75'},{text: '+3.50', value: '3.50'},{text: '+3.25', value: '3.25'},
                {text: '+3.00', value: '3.00'},{text: '+2.75', value: '2.75'},{text: '+2.50', value: '2.50'},{text: '+2.25', value: '2.25'},
                {text: '+2.00', value: '2.00'},{text: '+1.75', value: '1.75'},{text: '+1.50', value: '1.50'},{text: '+1.25', value: '1.25'},
                {text: '+1.00', value: '1.00'},{text: '+0.75', value: '0.75'},{text: '+0.50', value: '0.50'},{text: '+0.25', value: '0.25'},
                {text: '+0.00', value: '0.00'},
                {text: '-0.25', value: '-0.25'},{text: '-0.50', value: '-0.50'},{text: '-0.75', value: '-0.75'},
                {text: '-1.00', value: '-1.00'},{text: '-1.25', value: '-1.25'},{text: '-1.50', value: '-1.50'},{text: '-1.75', value: '-1.75'},
                {text: '-2.00', value: '-2.00'},{text: '-2.25', value: '-2.25'},{text: '-2.50', value: '-2.50'},{text: '-2.75', value: '-2.75'},
                {text: '-3.00', value: '-3.00'},{text: '-3.25', value: '-3.25'},{text: '-3.50', value: '-3.50'},{text: '-3.75', value: '-3.75'},
                {text: '-4.00', value: '-4.00'},{text: '-4.25', value: '-4.25'},{text: '-4.50', value: '-4.50'},{text: '-4.75', value: '-4.75'},
                {text: '-5.00', value: '-5.00'},{text: '-5.25', value: '-5.25'},{text: '-5.50', value: '-5.50'},{text: '-5.75', value: '-5.75'},
                {text: '-6.00', value: '-6.00'},{text: '-6.25', value: '-6.25'},{text: '-6.50', value: '-6.50'},{text: '-6.75', value: '-6.75'},
                {text: '-7.00', value: '-7.00'},{text: '-7.25', value: '-7.25'},{text: '-7.50', value: '-7.50'},{text: '-7.75', value: '-7.75'},
                {text: '-8.00', value: '-8.00'},{text: '-8.25', value: '-8.25'},{text: '-8.50', value: '-8.50'},{text: '-8.75', value: '-8.75'},
                {text: '-9.00', value: '-9.00'},{text: '-9.25', value: '-9.25'},{text: '-9.50', value: '-9.50'},{text: '-9.75', value: '-9.75'},
                {text: '-10.00', value: '-10.00'},{text: '-10.25', value: '-10.25'},{text: '-10.50', value: '-10.50'},{text: '-10.75', value: '-10.75'},
                {text: '-11.00', value: '-11.00'},{text: '-11.25', value: '-11.25'},{text: '-11.50', value: '-11.50'},{text: '-11.75', value: '-11.75'},
                {text: '-12.00', value: '-12.00'},{text: '-12.25', value: '-12.25'},{text: '-12.50', value: '-12.50'},{text: '-12.75', value: '-12.75'},
                {text: '-13.00', value: '-13.00'},{text: '-13.25', value: '-13.25'},{text: '-13.50', value: '-13.50'},{text: '-13.75', value: '-13.75'},
                {text: '-14.00', value: '-14.00'},{text: '-14.25', value: '-14.25'},{text: '-14.50', value: '-14.50'},{text: '-14.75', value: '-14.75'},
                {text: '-15.00', value: '-15.00'},{text: '-15.25', value: '-15.25'},{text: '-15.50', value: '-15.50'},{text: '-15.75', value: '-15.75'},
                {text: '-16.00', value: '-16.00'},{text: '-16.25', value: '-16.25'},{text: '-16.50', value: '-16.50'},{text: '-16.75', value: '-16.75'},
                {text: '-17.00', value: '-17.00'},{text: '-17.25', value: '-17.25'},{text: '-17.50', value: '-17.50'},{text: '-17.75', value: '-17.75'},
                {text: '-18.00', value: '-18.00'},{text: '-18.25', value: '-18.25'},{text: '-18.50', value: '-18.50'},{text: '-18.75', value: '-18.75'},
                {text: '-19.00', value: '-19.00'},{text: '-19.25', value: '-19.25'},{text: '-19.50', value: '-19.50'},{text: '-19.75', value: '-19.75'},
                {text: '-20.00', value: '-20.00'}
            ],
            opciones_cyl: [
                {text: '+10.00', value: '10.00'},{text: '+9.75', value: '9.75'},{text: '+9.50', value: '9.50'},{text: '+9.25', value: '9.25'},
                {text: '+9.00', value: '9.00'},{text: '+8.75', value: '8.75'},{text: '+8.50', value: '8.50'},{text: '+8.25', value: '8.25'},
                {text: '+8.00', value: '8.00'},{text: '+7.75', value: '7.75'},{text: '+7.50', value: '7.50'},{text: '+7.25', value: '7.25'},
                {text: '+7.00', value: '7.00'},{text: '+6.75', value: '6.75'},{text: '+6.50', value: '6.50'},{text: '+6.25', value: '6.25'},
                {text: '+6.00', value: '6.00'},{text: '+5.75', value: '5.75'},{text: '+5.50', value: '5.50'},{text: '+5.25', value: '5.25'},
                {text: '+5.00', value: '5.00'},{text: '+4.75', value: '4.75'},{text: '+4.50', value: '4.50'},{text: '+4.25', value: '4.25'},
                {text: '+4.00', value: '4.00'},{text: '+3.75', value: '3.75'},{text: '+3.50', value: '3.50'},{text: '+3.25', value: '3.25'},
                {text: '+3.00', value: '3.00'},{text: '+2.75', value: '2.75'},{text: '+2.50', value: '2.50'},{text: '+2.25', value: '2.25'},
                {text: '+2.00', value: '2.00'},{text: '+1.75', value: '1.75'},{text: '+1.50', value: '1.50'},{text: '+1.25', value: '1.25'},
                {text: '+1.00', value: '1.00'},{text: '+0.75', value: '0.75'},{text: '+0.50', value: '0.50'},{text: '+0.25', value: '0.25'},
                {text: '+0.00', value: '0.00'},
                {text: '-0.25', value: '-0.25'},{text: '-0.50', value: '-0.50'},{text: '-0.75', value: '-0.75'},
                {text: '-1.00', value: '-1.00'},{text: '-1.25', value: '-1.25'},{text: '-1.50', value: '-1.50'},{text: '-1.75', value: '-1.75'},
                {text: '-2.00', value: '-2.00'},{text: '-2.25', value: '-2.25'},{text: '-2.50', value: '-2.50'},{text: '-2.75', value: '-2.75'},
                {text: '-3.00', value: '-3.00'},{text: '-3.25', value: '-3.25'},{text: '-3.50', value: '-3.50'},{text: '-3.75', value: '-3.75'},
                {text: '-4.00', value: '-4.00'},{text: '-4.25', value: '-4.25'},{text: '-4.50', value: '-4.50'},{text: '-4.75', value: '-4.75'},
                {text: '-5.00', value: '-5.00'},{text: '-5.25', value: '-5.25'},{text: '-5.50', value: '-5.50'},{text: '-5.75', value: '-5.75'},
                {text: '-6.00', value: '-6.00'},{text: '-6.25', value: '-6.25'},{text: '-6.50', value: '-6.50'},{text: '-6.75', value: '-6.75'},
                {text: '-7.00', value: '-7.00'},{text: '-7.25', value: '-7.25'},{text: '-7.50', value: '-7.50'},{text: '-7.75', value: '-7.75'},
                {text: '-8.00', value: '-8.00'},{text: '-8.25', value: '-8.25'},{text: '-8.50', value: '-8.50'},{text: '-8.75', value: '-8.75'},
                {text: '-9.00', value: '-9.00'},{text: '-9.25', value: '-9.25'},{text: '-9.50', value: '-9.50'},{text: '-9.75', value: '-9.75'},
                {text: '-10.00', value: '-10.00'}
            ],
            opciones_poder: [
                {text: '+20.00', value: '20.00'},{text: '+19.75', value: '19.75'},{text: '+19.50', value: '19.50'},{text: '+19.25', value: '19.25'},
                {text: '+19.00', value: '19.00'},{text: '+18.75', value: '18.75'},{text: '+18.50', value: '18.50'},{text: '+18.25', value: '18.25'},
                {text: '+18.00', value: '18.00'},{text: '+17.75', value: '17.75'},{text: '+17.50', value: '17.50'},{text: '+17.25', value: '17.25'},
                {text: '+17.00', value: '17.00'},{text: '+16.75', value: '16.75'},{text: '+16.50', value: '16.50'},{text: '+16.25', value: '16.25'},
                {text: '+16.00', value: '16.00'},{text: '+15.75', value: '15.75'},{text: '+15.50', value: '15.50'},{text: '+15.25', value: '15.25'},
                {text: '+15.00', value: '15.00'},{text: '+14.75', value: '14.75'},{text: '+14.50', value: '14.50'},{text: '+14.25', value: '14.25'},
                {text: '+14.00', value: '14.00'},{text: '+13.75', value: '13.75'},{text: '+13.50', value: '13.50'},{text: '+13.25', value: '13.25'},
                {text: '+13.00', value: '13.00'},{text: '+12.75', value: '12.75'},{text: '+12.50', value: '12.50'},{text: '+12.25', value: '12.25'},
                {text: '+12.00', value: '12.00'},{text: '+11.75', value: '11.75'},{text: '+11.50', value: '11.50'},{text: '+11.25', value: '11.25'},
                {text: '+11.00', value: '11.00'},{text: '+10.75', value: '10.75'},{text: '+10.50', value: '10.50'},{text: '+10.25', value: '10.25'},
                {text: '+10.00', value: '10.00'},{text: '+9.75', value: '9.75'},{text: '+9.50', value: '9.50'},{text: '+9.25', value: '9.25'},
                {text: '+9.00', value: '9.00'},{text: '+8.75', value: '8.75'},{text: '+8.50', value: '8.50'},{text: '+8.25', value: '8.25'},
                {text: '+8.00', value: '8.00'},{text: '+7.75', value: '7.75'},{text: '+7.50', value: '7.50'},{text: '+7.25', value: '7.25'},
                {text: '+7.00', value: '7.00'},{text: '+6.75', value: '6.75'},{text: '+6.50', value: '6.50'},{text: '+6.25', value: '6.25'},
                {text: '+6.00', value: '6.00'},{text: '+5.75', value: '5.75'},{text: '+5.50', value: '5.50'},{text: '+5.25', value: '5.25'},
                {text: '+5.00', value: '5.00'},{text: '+4.75', value: '4.75'},{text: '+4.50', value: '4.50'},{text: '+4.25', value: '4.25'},
                {text: '+4.00', value: '4.00'},{text: '+3.75', value: '3.75'},{text: '+3.50', value: '3.50'},{text: '+3.25', value: '3.25'},
                {text: '+3.00', value: '3.00'},{text: '+2.75', value: '2.75'},{text: '+2.50', value: '2.50'},{text: '+2.25', value: '2.25'},
                {text: '+2.00', value: '2.00'},{text: '+1.75', value: '1.75'},{text: '+1.50', value: '1.50'},{text: '+1.25', value: '1.25'},
                {text: '+1.00', value: '1.00'},{text: '+0.75', value: '0.75'},{text: '+0.50', value: '0.50'},{text: '+0.25', value: '0.25'},
                {text: '+0.00', value: '0.00'},
                {text: '', value: null},
                {text: '-0.25', value: '-0.25'},{text: '-0.50', value: '-0.50'},{text: '-0.75', value: '-0.75'},
                {text: '-1.00', value: '-1.00'},{text: '-1.25', value: '-1.25'},{text: '-1.50', value: '-1.50'},{text: '-1.75', value: '-1.75'},
                {text: '-2.00', value: '-2.00'},{text: '-2.25', value: '-2.25'},{text: '-2.50', value: '-2.50'},{text: '-2.75', value: '-2.75'},
                {text: '-3.00', value: '-3.00'},{text: '-3.25', value: '-3.25'},{text: '-3.50', value: '-3.50'},{text: '-3.75', value: '-3.75'},
                {text: '-4.00', value: '-4.00'},{text: '-4.25', value: '-4.25'},{text: '-4.50', value: '-4.50'},{text: '-4.75', value: '-4.75'},
                {text: '-5.00', value: '-5.00'},{text: '-5.25', value: '-5.25'},{text: '-5.50', value: '-5.50'},{text: '-5.75', value: '-5.75'},
                {text: '-6.00', value: '-6.00'},{text: '-6.25', value: '-6.25'},{text: '-6.50', value: '-6.50'},{text: '-6.75', value: '-6.75'},
                {text: '-7.00', value: '-7.00'},{text: '-7.25', value: '-7.25'},{text: '-7.50', value: '-7.50'},{text: '-7.75', value: '-7.75'},
                {text: '-8.00', value: '-8.00'},{text: '-8.25', value: '-8.25'},{text: '-8.50', value: '-8.50'},{text: '-8.75', value: '-8.75'},
                {text: '-9.00', value: '-9.00'},{text: '-9.25', value: '-9.25'},{text: '-9.50', value: '-9.50'},{text: '-9.75', value: '-9.75'},
                {text: '-10.00', value: '-10.00'},{text: '-10.25', value: '-10.25'},{text: '-10.50', value: '-10.50'},{text: '-10.75', value: '-10.75'},
                {text: '-11.00', value: '-11.00'},{text: '-11.25', value: '-11.25'},{text: '-11.50', value: '-11.50'},{text: '-11.75', value: '-11.75'},
                {text: '-12.00', value: '-12.00'},{text: '-12.25', value: '-12.25'},{text: '-12.50', value: '-12.50'},{text: '-12.75', value: '-12.75'},
                {text: '-13.00', value: '-13.00'},{text: '-13.25', value: '-13.25'},{text: '-13.50', value: '-13.50'},{text: '-13.75', value: '-13.75'},
                {text: '-14.00', value: '-14.00'},{text: '-14.25', value: '-14.25'},{text: '-14.50', value: '-14.50'},{text: '-14.75', value: '-14.75'},
                {text: '-15.00', value: '-15.00'},{text: '-15.25', value: '-15.25'},{text: '-15.50', value: '-15.50'},{text: '-15.75', value: '-15.75'},
                {text: '-16.00', value: '-16.00'},{text: '-16.25', value: '-16.25'},{text: '-16.50', value: '-16.50'},{text: '-16.75', value: '-16.75'},
                {text: '-17.00', value: '-17.00'},{text: '-17.25', value: '-17.25'},{text: '-17.50', value: '-17.50'},{text: '-17.75', value: '-17.75'},
                {text: '-18.00', value: '-18.00'},{text: '-18.25', value: '-18.25'},{text: '-18.50', value: '-18.50'},{text: '-18.75', value: '-18.75'},
                {text: '-19.00', value: '-19.00'},{text: '-19.25', value: '-19.25'},{text: '-19.50', value: '-19.50'},{text: '-19.75', value: '-19.75'},
                {text: '-20.00', value: '-20.00'}
            ],
            opciones_add: [
                {text: '+4.00', value: '4.00'},{text: '+3.75', value: '3.75'},{text: '+3.50', value: '3.50'},{text: '+3.25', value: '3.25'},
                {text: '+3.00', value: '3.00'},{text: '+2.75', value: '2.75'},{text: '+2.50', value: '2.50'},{text: '+2.25', value: '2.25'},
                {text: '+2.00', value: '2.00'},{text: '+1.75', value: '1.75'},{text: '+1.50', value: '1.50'},{text: '+1.25', value: '1.25'},
                {text: '+1.00', value: '1.00'},{text: '+0.75', value: '0.75'},{text: '+0.50', value: '0.50'},{text: '+0.25', value: '0.25'},
                {text: '+0.00', value: '0.00'},
                {text: '', value: null}
            ],
            opciones_diametro: [
                {text: '80 mm', value: '80'},{text: '79 mm', value: '79'},{text: '78 mm', value: '78'},{text: '77 mm', value: '77'},{text: '76 mm', value: '76'},{text: '75 mm', value: '75'},{text: '74 mm', value: '74'},{text: '73 mm', value: '73'},{text: '72 mm', value: '72'},{text: '71 mm', value: '71'},
                {text: '70 mm', value: '70'},{text: '69 mm', value: '69'},{text: '68 mm', value: '68'},{text: '67 mm', value: '67'},{text: '66 mm', value: '66'},{text: '65 mm', value: '65'},{text: '64 mm', value: '64'},{text: '63 mm', value: '63'},{text: '62 mm', value: '62'},{text: '61 mm', value: '61'},
                {text: '60 mm', value: '60'},{text: '59 mm', value: '59'},{text: '58 mm', value: '58'},{text: '57 mm', value: '57'},{text: '56 mm', value: '56'},{text: '55 mm', value: '55'},{text: '54 mm', value: '54'},{text: '53 mm', value: '53'},{text: '52 mm', value: '52'},{text: '51 mm', value: '51'},
                {text: '50 mm', value: '50'},
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
        pre_procesar_rango_form() {
        },
        validar_rango_form() {
            this.errores = []
            if (this.form_rango.sph_desde*1.0 > this.form_rango.sph_hasta*1.0){
                this.errores.push('"Desde" debe ser menor o igual que "Hasta" en ESFERA')
            }
            if (this.form_rango.cyl_desde*1.0 > this.form_rango.cyl_hasta*1.0){
                this.errores.push('"Desde" debe ser menor o igual que "Hasta" en CILINDRO')
            }
            if (this.form_rango.min_poder && this.form_rango.max_poder && this.form_rango.min_poder*1.0 > this.form_rango.max_poder*1.0){
                this.errores.push('"Desde" debe ser menor o igual que "Hasta" en PODER')
            }
            if ( (this.form_rango.add_desde && !this.form_rango.add_hasta) || (!this.form_rango.add_desde && this.form_rango.add_hasta) ){
                this.errores.push('Si el cristal tiene ADICIÓN debe indicar DESDE y HASTA')
            }
            if (this.form_rango.add_desde && this.form_rango.add_hasta && this.form_rango.add_desde*1.0 > this.form_rango.add_hasta*1.0){
                this.errores.push('"Desde" debe ser menor o igual que "Hasta" en PODER')
            }
            if (!this.form_rango.costo_neto){
                this.errores.push('Debe ingresar un Costo Neto (sin IVA)')
            }
            if (this.form_rango.costo_neto*1.0 < 100){
                this.errores.push('El Costo Neto debe ser mayor o igual a $100 (pesos)')
            }
            return !(this.errores.length>0)
        },
        getCristal(input_uuid){
            axios.get(`/api/v1/drf/cristales/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.form_cristal=response.data
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            })
        },
        getRangos(input_cristal){
            axios.get(`api/v1/drf/rangos-cristales/?cristal=${input_cristal}`, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                }
            })
            .then((response) => {
                this.rangosCristal = response.data

                this.is_busy = false
                this.total_rows = this.rangosCristal.length
                if(this.total_rows==0){
                    this.errores.push('El Cristal aún no tiene Rangos')
                    this.showAlert()
                } else {
                    // for (const rango of this.rangosCristal) {
                    //     this.diametros.push(rango.diametro)
                    // }
                    // this.diametros = [...new Set(this.diametros)].sort()

                    // this.diametros_rangos = {}
                    // for (const diametro of this.diametros) {
                    //     this.diametros_rangos[diametro] = []
                    // }

                    // for (const rango of this.rangosCristal) {
                    //     this.diametros_rangos[rango.diametro].push(rango)
                    // }
                    this.diametros_rangos = {}
                    for (const rango of this.rangosCristal) {
                        if(this.diametros_rangos[rango.diametro]!==undefined){ // quiere decir que ya esta creado el diametro en el listado
                            this.diametros_rangos[rango.diametro].push(rango)
                        } else { // no esta creado el diametro en el listado, por lo que se genera con un solo dato
                            this.diametros_rangos[rango.diametro] = [rango]
                        }
                    }
                    this.diametros = Object.keys(this.diametros_rangos)
                    this.diametros = this.diametros.sort()
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
                    icon: 'error', title: 'Error al obtener los Rangos de Cristal', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        getTablasRangos(input_cristal){
            axios.get(`api/v1/drf/cristales-tabla-rangos/${input_cristal}`, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                }
            })
            .then((response) => {
                this.tablaRangos = response.data
                // JSON.parse('{"name":"John", "age":30, "city":"New York"}')
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
                    icon: 'error', title: 'Error al obtener la Tabla de Rangos del Cristal', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        NuevoRango(){
            this.form_rango = {
                cristal: this.$route.params.prefill_uuid,
                diametro: '65',
                sph_desde: '0.00',
                sph_hasta: '0.00',
                cyl_desde: '0.00',
                cyl_hasta: '0.00',
                min_poder: null,
                max_poder: null,
                add_desde: null,
                add_hasta: null,
                costo_neto: null,
            }
        },
        EditarRango(input_rango){
            this.form_rango = input_rango
        },
        postRango(){
            axios.post(`/api/v1/drf/rangos-cristales/`, this.form_rango, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Rango creado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
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
                    icon: 'error', title: 'Error al crear el Rango', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        putRango(){
            axios.put(`/api/v1/drf/rangos-cristales/${this.form_rango.uuid}/`, this.form_rango, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Rango actualizado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
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
                    icon: 'error', title: 'Error al actualizar el Rango', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        deleteRango(input_uuid){
            axios.delete(`/api/v1/drf/rangos-cristales/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Rango borrado con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
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
                    icon: 'error', title: 'Error al borrar el Rango', html: errors_html, timer: 15000,
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