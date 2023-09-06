export const validadoresMixin = {
    methods: {
        validarRut (rutCompleto) {
            rutCompleto = rutCompleto.replace("‐","-");
            if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
                return false;
            var tmp 	= rutCompleto.split('-');
            var digv	= tmp[1]; 
            var rut 	= tmp[0];
            if ( digv == 'K' ) digv = 'k' ;
            
            return (this.dv(rut) == digv );
        },
        validarRutFalso (rutCompleto) {
            // SR-230217-7644 // ejemplo de formato para rut_falso valido
            var valid = true;
            valid = rutCompleto.slice(0,3)!='SR-' ? false : valid;
            valid = rutCompleto.length!=14 ? false : valid;
            valid = rutCompleto.slice(2,3)+rutCompleto.slice(9,10)!='--' ? false : valid;
            return valid;
        },
        dv (T) {
            var M=0,S=1;
            for(;T;T=Math.floor(T/10))
                S=(S+T%10*(9-M++%6))%11;
            return S?S-1:'k';
        },
        validarEmail(email) {
            // const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validarTelefono(telefono) {
            const re = /^(\+{1}\d{11})$/;
            return re.test(telefono);
        },
        
    }
}
export const capitalizeMixin = {
    methods: {
        capitalize(sentence) {
            return sentence.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
    }
}
export const generateFakeRutMixin = {
    methods: {
        generar_rut_falso(){
            var rightnow = new Date();
            rightnow = (new Date()).toISOString().split('T')[0].replaceAll('-','').slice(2, 8)+'-'+(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 4);
            return 'SR-'+rightnow.toUpperCase();
        }
    }
}
export const checkDocumentoExisteMixin = {
    methods: {
        check_documento_existe(documento_url){
            var http = new XMLHttpRequest();
            http.open('HEAD', documento_url, false);
            http.send();
            return http.status != 404;
        }
    }
}


