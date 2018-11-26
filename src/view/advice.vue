<template>
    <div class="advice_wrap bg-part">
       <div class="title ft16">留言记录</div>
       <ul>
           <li v-for="(item,index) in lists" :key="index">
               <div class="list-item">
               <div class="mb10 flex between">
               <h2 class="creat">发布：{{item.content}}</h2>
               <span class="fr ft12">{{item.create_time}}</span>
               </div>
                <div class=" flex between">
               <p class="ft14 reply">回复：{{item.reply_content||'暂无'}}</p>
               <span class="fr ft12">{{item.reply_time||''}}</span>
               </div>
               </div>
           </li>
           <li class="more tc ft14 mb10 gray" @click="getMore">{{more}}</li>
       </ul>
       <div class="title ft16">发布留言</div>
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
             lists:[],
             more:'加载更多',
             page:1
         }
     },
     created(){
         this.token = window.localStorage.getItem("token") || "";
         this.getlist(1);
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
               
             getlist(page){
                 var i = layer.load();
                 this.$http({
                url:'/api/feedback/list',
                method:'post',
                data:{userId:localStorage.getItem('user_id'),page:page},
                headers:{Authorization:this.token}
            }).then(res => {
                console.log(res)
                layer.close(i);
                if(res.data.type == 'ok'){
                    console.log(res);
                    if(res.data.message.data.length>0){
                      this.more = '加载更多'
                        this.lists = this.lists.concat(res.data.message.data);
                    }else{
                      this.more = '没有更多了'
                    }
                }
                
            })
             },
             //加载更多
             getMore(){
                 this.page++;
                 this.more = '加载中...'
                 this.getlist(this.page)
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
    .list-item{
        background: #eee;
        padding: 30px 20px;
        margin-bottom: 10px;
    }
    .creat,.reply{
        width: 80%;
    }
    .more{
        cursor: pointer;
    }
</style>

