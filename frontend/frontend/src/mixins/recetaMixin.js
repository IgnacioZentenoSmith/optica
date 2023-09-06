import { validadoresMixin } from '@/mixins/utilsMixin'
import axios from 'axios'
import Swal from 'sweetalert2'

export const recetaMixin = {
    mixins: [validadoresMixin],
    data() {
        return {
            // BUSQUEDA
            recetas: [],
            campos: [
                { key: 'paciente_rut', label: 'RUT Paciente', sortable: true},
                { key: 'paciente_nombres_apellidos', label: 'Paciente', sortable: true},
                { key: 'fecha_examen', label: 'Fecha Examen', sortable: true},
                { key: 'rut_examinador', label: 'RUT Examinador', sortable: true},
                { key: 'antiguedad', label: 'Antiguedad', sortable: true},
                { key: 'accion', label: 'Acción'}
            ],
            total_rows: 0,
            per_page: 5,
            current_page: 1,
            is_busy: true,

            // FORMULARIO
            errores: [],

            paciente: '',
            add_unica: true,
            add: null,
            dnp_unica: true,
            dp: null,
            ver_prismas: false,

            trasponer_od: false,
            trasponer_oi: false,

            form: {
                paciente: '',
                fecha_examen: null,
                rut_examinador: '',

                od_sph: null,
                od_cyl: null,
                od_axis: null,
                od_add: null,
                od_dnp: null,
                od_vertical_prism: null,
                od_vertical_direction: '',
                od_horizontal_prism: null,
                od_horizontal_direction: '',

                oi_sph: null,
                oi_cyl: null,
                oi_axis: null,
                oi_add: null,
                oi_dnp: null,
                oi_vertical_prism: null,
                oi_vertical_direction: '',
                oi_horizontal_prism: null,
                oi_horizontal_direction: '',

                comentarios: '',

                documento: null,
            },

            // ALERTAS DE this.errores
            dismissSecs: 0,
            dismissCountDown: 0,

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
                {text: '-10.00', value: '-10.00'}
            ],
            opciones_add: [
                {text: '+4.00', value: '4.00'},{text: '+3.75', value: '3.75'},{text: '+3.50', value: '3.50'},{text: '+3.25', value: '3.25'},
                {text: '+3.00', value: '3.00'},{text: '+2.75', value: '2.75'},{text: '+2.50', value: '2.50'},{text: '+2.25', value: '2.25'},
                {text: '+2.00', value: '2.00'},{text: '+1.75', value: '1.75'},{text: '+1.50', value: '1.50'},{text: '+1.25', value: '1.25'},
                {text: '+1.00', value: '1.00'},{text: '+0.75', value: '0.75'},{text: '+0.50', value: '0.50'},{text: '+0.25', value: '0.25'},
                {text: '+0.00', value: '0.00'},
                {text: '', value: null}
            ],
            opciones_axis: [
                {text: '180°', value: '180'},{text: '179°', value: '179'},{text: '178°', value: '178'},{text: '177°', value: '177'},{text: '176°', value: '176'},{text: '175°', value: '175'},{text: '174°', value: '174'},{text: '173°', value: '173'},{text: '172°', value: '172'},{text: '171°', value: '171'},
                {text: '170°', value: '170'},{text: '169°', value: '169'},{text: '168°', value: '168'},{text: '167°', value: '167'},{text: '166°', value: '166'},{text: '165°', value: '165'},{text: '164°', value: '164'},{text: '163°', value: '163'},{text: '162°', value: '162'},{text: '161°', value: '161'},
                {text: '160°', value: '160'},{text: '159°', value: '159'},{text: '158°', value: '158'},{text: '157°', value: '157'},{text: '156°', value: '156'},{text: '155°', value: '155'},{text: '154°', value: '154'},{text: '153°', value: '153'},{text: '152°', value: '152'},{text: '151°', value: '151'},
                {text: '150°', value: '150'},{text: '149°', value: '149'},{text: '148°', value: '148'},{text: '147°', value: '147'},{text: '146°', value: '146'},{text: '145°', value: '145'},{text: '144°', value: '144'},{text: '143°', value: '143'},{text: '142°', value: '142'},{text: '141°', value: '141'},
                {text: '140°', value: '140'},{text: '139°', value: '139'},{text: '138°', value: '138'},{text: '137°', value: '137'},{text: '136°', value: '136'},{text: '135°', value: '135'},{text: '134°', value: '134'},{text: '133°', value: '133'},{text: '132°', value: '132'},{text: '131°', value: '131'},
                {text: '130°', value: '130'},{text: '129°', value: '129'},{text: '128°', value: '128'},{text: '127°', value: '127'},{text: '126°', value: '126'},{text: '125°', value: '125'},{text: '124°', value: '124'},{text: '123°', value: '123'},{text: '122°', value: '122'},{text: '121°', value: '121'},
                {text: '120°', value: '120'},{text: '119°', value: '119'},{text: '118°', value: '118'},{text: '117°', value: '117'},{text: '116°', value: '116'},{text: '115°', value: '115'},{text: '114°', value: '114'},{text: '113°', value: '113'},{text: '112°', value: '112'},{text: '111°', value: '111'},
                {text: '110°', value: '110'},{text: '109°', value: '109'},{text: '108°', value: '108'},{text: '107°', value: '107'},{text: '106°', value: '106'},{text: '105°', value: '105'},{text: '104°', value: '104'},{text: '103°', value: '103'},{text: '102°', value: '102'},{text: '101°', value: '101'},
                {text: '100°', value: '100'},{text: '99°', value: '99'},{text: '98°', value: '98'},{text: '97°', value: '97'},{text: '96°', value: '96'},{text: '95°', value: '95'},{text: '94°', value: '94'},{text: '93°', value: '93'},{text: '92°', value: '92'},{text: '91°', value: '91'},
                {text: '90°', value: '90'},{text: '89°', value: '89'},{text: '88°', value: '88'},{text: '87°', value: '87'},{text: '86°', value: '86'},{text: '85°', value: '85'},{text: '84°', value: '84'},{text: '83°', value: '83'},{text: '82°', value: '82'},{text: '81°', value: '81'},
                {text: '80°', value: '80'},{text: '79°', value: '79'},{text: '78°', value: '78'},{text: '77°', value: '77'},{text: '76°', value: '76'},{text: '75°', value: '75'},{text: '74°', value: '74'},{text: '73°', value: '73'},{text: '72°', value: '72'},{text: '71°', value: '71'},
                {text: '70°', value: '70'},{text: '69°', value: '69'},{text: '68°', value: '68'},{text: '67°', value: '67'},{text: '66°', value: '66'},{text: '65°', value: '65'},{text: '64°', value: '64'},{text: '63°', value: '63'},{text: '62°', value: '62'},{text: '61°', value: '61'},
                {text: '60°', value: '60'},{text: '59°', value: '59'},{text: '58°', value: '58'},{text: '57°', value: '57'},{text: '56°', value: '56'},{text: '55°', value: '55'},{text: '54°', value: '54'},{text: '53°', value: '53'},{text: '52°', value: '52'},{text: '51°', value: '51'},
                {text: '50°', value: '50'},{text: '49°', value: '49'},{text: '48°', value: '48'},{text: '47°', value: '47'},{text: '46°', value: '46'},{text: '45°', value: '45'},{text: '44°', value: '44'},{text: '43°', value: '43'},{text: '42°', value: '42'},{text: '41°', value: '41'},
                {text: '40°', value: '40'},{text: '39°', value: '39'},{text: '38°', value: '38'},{text: '37°', value: '37'},{text: '36°', value: '36'},{text: '35°', value: '35'},{text: '34°', value: '34'},{text: '33°', value: '33'},{text: '32°', value: '32'},{text: '31°', value: '31'},
                {text: '30°', value: '30'},{text: '29°', value: '29'},{text: '28°', value: '28'},{text: '27°', value: '27'},{text: '26°', value: '26'},{text: '25°', value: '25'},{text: '24°', value: '24'},{text: '23°', value: '23'},{text: '22°', value: '22'},{text: '21°', value: '21'},
                {text: '20°', value: '20'},{text: '19°', value: '19'},{text: '18°', value: '18'},{text: '17°', value: '17'},{text: '16°', value: '16'},{text: '15°', value: '15'},{text: '14°', value: '14'},{text: '13°', value: '13'},{text: '12°', value: '12'},{text: '11°', value: '11'},
                {text: '10°', value: '10'},{text: '9°', value: '9'},{text: '8°', value: '8'},{text: '7°', value: '7'},{text: '6°', value: '6'},{text: '5°', value: '5'},{text: '4°', value: '4'},{text: '3°', value: '3'},{text: '2°', value: '2'},{text: '1°', value: '1'},
                {text: '0°', value: '0'},
                {text: '', value: null}
            ],
            opciones_dnp: [
                {text: '40.0 mm', value: '40.0'},{text: '39.5 mm', value: '39.5'},{text: '39.0 mm', value: '39.0'},{text: '38.5 mm', value: '38.5'},{text: '38.0 mm', value: '38.0'},{text: '37.5 mm', value: '37.5'},{text: '37.0 mm', value: '37.0'},{text: '36.5 mm', value: '36.5'},{text: '36.0 mm', value: '36.0'},{text: '35.5 mm', value: '35.5'},
                {text: '35.0 mm', value: '35.0'},{text: '34.5 mm', value: '34.5'},{text: '34.0 mm', value: '34.0'},{text: '33.5 mm', value: '33.5'},{text: '33.0 mm', value: '33.0'},{text: '32.5 mm', value: '32.5'},{text: '32.0 mm', value: '32.0'},{text: '31.5 mm', value: '31.5'},{text: '31.0 mm', value: '31.0'},{text: '30.5 mm', value: '30.5'},
                {text: '30.0 mm', value: '30.0'},{text: '29.5 mm', value: '29.5'},{text: '29.0 mm', value: '29.0'},{text: '28.5 mm', value: '28.5'},{text: '28.0 mm', value: '28.0'},{text: '27.5 mm', value: '27.5'},{text: '27.0 mm', value: '27.0'},{text: '26.5 mm', value: '26.5'},{text: '26.0 mm', value: '26.0'},{text: '25.5 mm', value: '25.5'},
                {text: '25.0 mm', value: '25.0'},{text: '24.5 mm', value: '24.5'},{text: '24.0 mm', value: '24.0'},{text: '23.5 mm', value: '23.5'},{text: '23.0 mm', value: '23.0'},{text: '22.5 mm', value: '22.5'},{text: '22.0 mm', value: '22.0'},{text: '21.5 mm', value: '21.5'},{text: '21.0 mm', value: '21.0'},{text: '20.5 mm', value: '20.5'},
                {text: '20.0 mm', value: '20.0'},
                {text: '', value: null}
            ],
            opciones_dp: [
                {text: '80 mm', value: '80'},{text: '79 mm', value: '79'},{text: '78 mm', value: '78'},{text: '77 mm', value: '77'},{text: '76 mm', value: '76'},{text: '75 mm', value: '75'},{text: '74 mm', value: '74'},{text: '73 mm', value: '73'},{text: '72 mm', value: '72'},{text: '71 mm', value: '71'},
                {text: '70 mm', value: '70'},{text: '69 mm', value: '69'},{text: '68 mm', value: '68'},{text: '67 mm', value: '67'},{text: '66 mm', value: '66'},{text: '65 mm', value: '65'},{text: '64 mm', value: '64'},{text: '63 mm', value: '63'},{text: '62 mm', value: '62'},{text: '61 mm', value: '61'},
                {text: '60 mm', value: '60'},{text: '59 mm', value: '59'},{text: '58 mm', value: '58'},{text: '57 mm', value: '57'},{text: '56 mm', value: '56'},{text: '55 mm', value: '55'},{text: '54 mm', value: '54'},{text: '53 mm', value: '53'},{text: '52 mm', value: '52'},{text: '51 mm', value: '51'},
                {text: '50 mm', value: '50'},{text: '49 mm', value: '49'},{text: '48 mm', value: '48'},{text: '47 mm', value: '47'},{text: '46 mm', value: '46'},{text: '45 mm', value: '45'},{text: '44 mm', value: '44'},{text: '43 mm', value: '43'},{text: '42 mm', value: '42'},{text: '41 mm', value: '41'},
                {text: '40 mm', value: '40'},
                {text: '', value: null}
            ],
            opciones_prism: [
                {text: '4.00', value: '4.00'},
                {text: '3.75', value: '3.75'},
                {text: '3.50', value: '3.50'},
                {text: '3.25', value: '3.25'},
                {text: '3.00', value: '3.00'},
                {text: '2.75', value: '2.75'},
                {text: '2.50', value: '2.50'},
                {text: '2.25', value: '2.25'},
                {text: '2.00', value: '2.00'},
                {text: '1.75', value: '1.75'},
                {text: '1.50', value: '1.50'},
                {text: '1.25', value: '1.25'},
                {text: '1.00', value: '1.00'},
                {text: '0.75', value: '0.75'},
                {text: '0.50', value: '0.50'},
                {text: '0.25', value: '0.25'},
                {text: '0.00', value: '0.00'},
                {text: '', value: null}            
            ],
            opciones_prism_vertical_direction: [
                {text: 'Arriba', value: 'Arriba'},
                {text: '', value: ''},
                {text: 'Abajo', value: 'Abajo'}
            ],
            opciones_prism_horizontal_direction: [
                {text: 'Dentro', value: 'Dentro'},
                {text: '', value: ''},
                {text: 'Fuera', value: 'Fuera'}
            ],
        }
    },
    methods: {
        // NECESARIAS PARA ALERTA DE this.errores
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        showAlert() {
            this.dismissSecs = 5+this.errores.length*2
            this.dismissCountDown = this.dismissSecs
        },
        // PREPROCESAR Y VALIDAR FORMULARIO
        pre_procesar_form() {
            this.form.fecha_examen = this.form.fecha_examen == '' ? null : this.form.fecha_examen
            this.form.comentarios = this.form.comentarios == '' ? null : this.form.comentarios
            this.form.rut_examinador = this.form.rut_examinador.replace(/\s+/g, ' ').trim().toUpperCase()

            if(this.add_unica){
                this.form.od_add=this.add
                this.form.oi_add=this.form.od_add
            }
            if(this.dnp_unica){
                var temp = this.dp/2
                temp = temp > 0 ? temp.toString() : ""
                this.form.od_dnp=temp
                this.form.oi_dnp=temp
            }
        },
        validar_form() {
            this.errores = []
            if (!this.form.paciente){
                this.errores.push('Debe seleccionar un Paciente')
            }
            if (!this.form.fecha_examen) {
                this.errores.push('Debe seleccionar una Fecha de Examen')
            }

            var date_min = (new Date(1900, 0, 1)).toISOString().split('T')[0]
            var today = new Date()
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            today = today.toISOString().split('T')[0]
            if(this.form.fecha_examen > today){
                this.errores.push('Fecha de Examen debe estar en el pasado.')
            }
            if ( date_min > this.form.fecha_examen ){
                this.errores.push('Fecha de Examen debe ser mayor a ' + date_min)
            }
            if (this.form.od_cyl*1.0 > 0){
                this.errores.push('Debe trasponer el OD porque tiene Cilindro Positivo (+)')
            }
            if (this.form.oi_cyl*1.0 > 0){
                this.errores.push('Debe trasponer el OI porque tiene Cilindro Positivo (+)')
            }

            if (!this.validarRut(this.form.rut_examinador) && this.form.rut_examinador) {
                this.errores.push('RUT del Examinador no es válido. No utilice puntos. Ejemplo: 12345678-k')
            }
            if (this.form.od_sph != '' && this.form.od_dnp == '') {
                this.errores.push('Necesita DNP en OD o DP')
            }
            if (this.form.oi_sph != '' && this.form.oi_dnp == '') {
                this.errores.push('Necesita DNP en OI o DP')
            }
            if (this.form.od_sph == '' && this.form.od_cyl != '') {
                this.errores.push('OD no puede tener CYL si no hay SPH')
            }
            if (this.form.oi_sph == '' && this.form.oi_cyl != '') {
                this.errores.push('OI no puede tener CYL si no hay SPH')
            }
            if (this.form.od_cyl != '' && this.form.od_axis == '') {
                this.errores.push('OD no puede tener CYL sin un Angulo')
            }
            if (this.form.oi_cyl != '' && this.form.oi_axis == '') {
                this.errores.push('OI no puede tener CYL sin un Angulo')
            }
            if ( (this.form.od_cyl == '' || this.form.od_cyl == '+0.00') && this.form.od_axis != '') {
                this.errores.push('OD no puede tener Angulo sin CYL')
            }
            if ( (this.form.oi_cyl == '' || this.form.oi_cyl == '+0.00') && this.form.oi_axis != '') {
                this.errores.push('OI no puede tener Angulo sin CYL')
            }
            if (this.form.od_add != '' && this.form.od_sph == '') {
                this.errores.push('OD no puede tener ADD sin SPH')
            }
            if (this.form.oi_add != '' && this.form.oi_sph == '') {
                this.errores.push('OI no puede tener ADD sin SPH')
            }
            if (this.form.od_vertical_prism && !this.form.od_vertical_direction) {
                this.errores.push('OD no puede tener Prisma Vertical si no tiene Dirección')
            }
            if (this.form.oi_vertical_prism && !this.form.oi_vertical_direction) {
                this.errores.push('OI no puede tener Prisma Vertical si no tiene Dirección')
            }
            if ( !this.form.od_vertical_prism && this.form.od_vertical_direction) {
                this.errores.push('OD no puede tener Dirección si no tiene Prisma Vertical')
            }
            if ( !this.form.oi_vertical_prism && this.form.oi_vertical_direction) {
                this.errores.push('OI no puede tener Dirección si no tiene Prisma Vertical')
            }
            if (this.form.od_horizontal_prism && !this.form.od_horizontal_direction) {
                this.errores.push('OD no puede tener Prisma Horizontal si no tiene Dirección')
            }
            if (this.form.oi_horizontal_prism && !this.form.oi_horizontal_direction) {
                this.errores.push('OI no puede tener Prisma Horizontal si no tiene Dirección')
            }
            if ( !this.form.od_horizontal_prism && this.form.od_horizontal_direction) {
                this.errores.push('OD no puede tener Dirección si no tiene Prisma Horizontal')
            }
            if ( !this.form.oi_horizontal_prism && this.form.oi_horizontal_direction ) {
                this.errores.push('OI no puede tener Dirección si no tiene Prisma Horizontal')
            }
            if (
                    !this.form.od_sph &&
                    !this.form.od_cyl &&
                    !this.form.od_axis &&
                    !this.form.od_add &&
                    !this.form.od_dnp &&
                    !this.form.od_vertical_prism &&
                    this.form.od_vertical_direction == '' &&
                    !this.form.od_horizontal_prism &&
                    this.form.od_horizontal_direction == '' &&

                    !this.form.oi_sph &&
                    !this.form.oi_cyl &&
                    !this.form.oi_axis &&
                    !this.form.oi_add &&
                    !this.form.oi_dnp &&
                    !this.form.oi_vertical_prism &&
                    this.form.oi_vertical_direction == '' &&
                    !this.form.oi_horizontal_prism &&
                    this.form.oi_horizontal_direction == ''
                ) {
                this.errores.push('La Receta no contiene información')
            }
            return !(this.errores.length>0)
        },
        getRecetas(input_busqueda=''){
            let path = ''
            if (input_busqueda.length==0) {
                path = `/api/v1/drf/recetas/`
            } else {
                path = `/api/v1/drf/recetas/?search=${input_busqueda}`                
            }

            axios.get(path, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.recetas = response.data
                this.is_busy = false
                this.total_rows = this.recetas.length
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
                //     icon: 'error', title: 'Error al buscar en Recetas', html: errors_html, timer: 15000,
                //     buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                // })
            })
            .finally(() => {
            })
        },
        getPaciente(input_uuid){
            axios.get(`/api/v1/drf/pacientes/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.paciente = response.data.rut+', '+response.data.nombres+' '+response.data.apellidos
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            })
        },
        getReceta(input_uuid){
            axios.get(`/api/v1/drf/recetas/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.form=response.data
                this.getPaciente(this.form.paciente)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            })
        },
        putReceta(){
            axios.put(`/api/v1/drf/recetas/${this.$route.params.prefill_uuid}/`, this.form, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Receta actualizada con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaRecetas' })
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
                    icon: 'error', title: 'Error al actualizar la Receta', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        postReceta(){
            axios.post(`/api/v1/drf/recetas/`, this.form, {
                'headers': {
                    'Authorization': 'Bearer '+this.$store.state.access,
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Receta creada con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaRecetas' })
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
                    icon: 'error', title: 'Error al crear la Receta', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        deleteReceta(input_uuid){
            axios.delete(`/api/v1/drf/recetas/${input_uuid}/`, {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                Swal.fire({
                    icon: 'success', title: 'Receta borrada con exito!', timer: 2000,
                    position: 'top-end', showConfirmButton: false
                }).then((result) => {
                    this.$router.push({ name: 'ListaRecetas' })
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
                    icon: 'error', title: 'Error al borrar la Receta', html: errors_html, timer: 15000,
                    buttonsStyling: false, customClass: { confirmButton: 'btn btn-primary btn-lg', cancelButton: 'btn btn-danger btn-lg'}
                })
            })
            .finally(() => {
            })
        },
        trasponer(input_ojo){
            if(input_ojo=='OD'){
                var sph = this.form.od_sph*1.0
                var cyl = this.form.od_cyl*1.0
                var axis = this.form.od_axis*1.0

                sph = sph+cyl
                cyl = cyl*-1.0
                axis = axis+90 > 180 ? axis-90 : axis+90

                this.form.od_sph = sph.toFixed(2).toString()
                this.form.od_cyl = cyl.toFixed(2).toString()
                this.form.od_axis = axis.toString()                
            }
            if(input_ojo=='OI'){
                var sph = this.form.oi_sph*1.0
                var cyl = this.form.oi_cyl*1.0
                var axis = this.form.oi_axis*1.0

                sph = sph+cyl
                cyl = cyl*-1.0
                axis = axis+90 > 180 ? axis-90 : axis+90

                this.form.oi_sph = sph.toFixed(2).toString()
                this.form.oi_cyl = cyl.toFixed(2).toString()
                this.form.oi_axis = axis.toString()   
            }
        }
    },
    created() {
    }
}