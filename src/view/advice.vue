<template>
    <div class="advice_wrap bg-part">
       <div class="title ft16">投诉留言</div>
       <textarea class="texta ft14" v-model="texta" placeholder="请填写留言内容"></textarea>
       <div class="tc submit_btn blue_bg ft16" @click="submit">提交</div>
    </div>
</template>
<script>
export default {
     data(){
         return{
             texta:'',
             token:''
         }
     },
     created(){
         this.token = window.localStorage.getItem("token") || "";
     },
     methods:{
         submit(){
             if(this.texta == ''){
                 layer.msg('请填写留言内容');
                 return;
             }
             var i = layer.load();
             this.$http({
                url:'/api/feedback/add',
                method:'post',
                data:{content:this.texta},
                headers:{Authorization:this.token}
            }).then(res => {
                layer.close(i);
                console.log(res)
                layer.msg(res.data.message);
                this.texta = '';
                
            })
                }
     }

}
</script>
<style scoped>
    .advice_wrap{
        width: 80%;
        margin: 50px auto;
        padding: 30px;
    }
    .title{
        margin-bottom: 30px; 
    }
    .texta{
        width: 100%;
        height: 300px;
        border: 1px solid #eee;
        border-radius: 3px;
        padding: 20px;
        line-height: 1.8;
    }
    .submit_btn{
        width: 150px;
        line-height: 50px;
        border-radius: 5px;
        margin: 20px auto;
        cursor: pointer;
    }
</style>

