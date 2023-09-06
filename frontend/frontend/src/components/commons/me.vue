<template>
    <div>
        <h1>me</h1>
        {{ me }}
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            me:{}
        }
    },
    methods: {
        getMe(){
            // /api/v1/drf/users/
            // axios.get('/api/v1/auth/me/', {
            axios.get('/api/v1/drf/users/', {
                'headers': { 'Authorization': 'Bearer '+this.$store.state.access }
            })
            .then((response) => {
                this.me = response.data
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            })
        }
    },
    mounted() {
        this.getMe()
    }
}
</script>