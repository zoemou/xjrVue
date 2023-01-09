<template>
<div align="center">

    <h1>{{title}}</h1>

</div>
</template>

<script>
    export default {
        name: "index",
        props:{
            title:{
                type:String,
                default:"标题"
            }
        },
        data(){

        }
    }
</script>

<style scoped>

</style>