<template>
    <div class="advice_wrap bg-part">
       <div class="title ft16">投诉留言</div>
       <ul>
           <li v-for="(item,index) in lists" :key="index">
               <div>
               <h2>{{item.content}}</h2>
               <span class="fr ft12">{{item.create_time}}</span>
               </div>
                <div>
               <p>{{item.reply_content||''}}</p>
               <span class="fr ft12">{{item.reply_time||''}}</span>
               </div>
           </li>
       </ul>
       <textarea class="texta ft14" v-model="texta" placeholder="请填写留言内容"></textarea>
       <div class="tc submit_btn blue_bg ft16" @click="submit">提交</div>
    </div>
</template>
<script>
export default {
     data(){
         return{
             texta:'',
             token:'',
             lists:[]
         }
     },
     created(){
         this.token = window.localStorage.getItem("token") || "";
         this.getlist();
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
                headers:{
                    Authorization:this.token,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    }
            }).then(res => {
                layer.close(i);
                console.log(res)
                layer.msg(res.data.message);
                this.texta = '';
                
            })
                },
                //留言列表
               
             getlist(){
                 var i = layer.load();
                 this.$http({
                url:'/api/feedback/list',
                method:'post',
                data:{userId:localStorage.getItem('user_id')},
                headers:{Authorization:this.token}
            }).then(res => {
                console.log(res)
                layer.close(i);
                if(res.data.type == 'ok'){
                    console.log(res)
                    this.lists = this.lists.concat(res.data.message.data);
                }
                
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

