<template>
    <div class="main bgf8">
        <p class="legal_name">{{legal_name}}</p>
        <div class="legalAccount_msg flex between">
          <div>
              <p class="ft12 msg_title">可用</p>
              <p>{{legal_balance}}</p>
          </div>
          <div>
              <p class="ft12 msg_title">冻结</p>
              <p>{{lock_legal_balance}}</p>
          </div>
          <div>
              <p class="ft12 msg_title">折合（CNY）</p>
              <p>{{ustd_price}}</p>
          </div>
        </div>
        <div class="rec_wrap">
           <p class="rec_title flex between">
               <span>财务记录</span>
               <span class="all">全部</span>
           </p>
           <p class="list_title flex around">
               <span class="ft14">数量</span>
               <span class="ft14">记录</span>
               <span class="ft14">时间</span>
           </p>
           
           <ul>
              <li class="flex around ft12" v-for="(item,index) in recData" :key="index">
                  <span class="flex1 ft12 ptb tc">{{item.change}}</span>
                  <span class="flex1 ft12 ptb tc">{{item.memo}}</span>
                  <span class="flex1 ft12 ptb tc">{{item.create_time}}</span>
              </li>
           </ul>
           <p style="text-align:center;margin:30px 0;" v-show="recData.length == 0">暂无记录</p>
           <p style="text-align:center;margin:30px 0;" v-show="recData.length != 0" @click="more">{{moreLog}}</p>
        </div>
        <router-link tag="p" class="huazhuan redBg" to='/transferLegal'>划转</router-link>
    </div>
</template>
<script>
export default {
    data(){
        return{
           legal_name:'',
           legal_balance:'',
           lock_legal_balance:'',
           ustd_price:'',
           recData:[],
           moreLog:'加载更多',
           page:1
        }
    },
    created(){
       this.token = localStorage.getItem('token') || '';
    },
    mounted(){
        this.init();
       
    },
    methods:{
        init(){
        var that = this
                 this.$http({
                    url: '/api/' + 'wallet/detail',
                    method:'post',
                    data:{
                        currency:this.$route.params.currency_id,
                        type:'legal'
                    },
                    headers: {'Authorization':  that.token}
                    }).then(res=>{
                    console.log(res)  
                        if(res.data.type  =='ok'){
                            var msg = res.data.message;
                            that.legal_name = msg.currency_name;
                            that.legal_balance = msg.legal_balance;
                            that.lock_legal_balance = msg.lock_legal_balance;
                            that.ustd_price = msg.ustd_price;
                             this.getLog(msg.currencyId);
                        }else{
                            layer.msg(res.message);
                        }
                    }).catch(error=>{
                        console.log(error)
                    })
                        
        },
        //获取记录
        getLog(currencyId){
            
            this.$http({
                        url: '/api/wallet/legal_log',
                        method:'post',
                        data:{type:'1',currency:currencyId,page:this.page},
                        headers:{'Authorization':this.token}
                    }).then( res => {
                        console.log(res);
                        console.log(res.data.message.list)
                        if(res.data.type == 'ok'){
                            console.log(res);
                            this.recData = this.recData.concat(res.data.message.list);
                            if(res.data.message.list.length != 0){
                                this.moreLog = '加载更多'
                            }else{
                                this.moreLog = '没有更多记录了'
                            }
                        }
                    })
        },
        //加载更多
        more(currencyId){
            this.page++;
            this.getLog(currencyId)
        }
    }
}
</script>
<style scoped>
   .legal_name{
       /* background: #1b1e2e; */
       padding: 5px 0;
   }
    .msg_title{
        /* color: #61688a; */
    }
   .main{
       /* color:#fff; */
       padding: 30px;
   }
   .legalAccount_msg{
       /* background: #1b1e2e; */
       padding: 6px 0;
   }
   .legalAccount_msg div p:first-child{
       margin-bottom: 10px;
   }
   .rec_wrap{
       margin-top: 30px;
       margin-bottom: 30px;
   }
   .rec_title{
       margin-bottom: 10px;
       
   }
   .all{
        /* color: #61688a; */
   }
   .list_title{
       padding: 10px 0;
       /* background: #1b1e2e; */
   }
   .huazhuan{
       text-align: center;
       margin-top: 60px;
       background: #d45858;
       padding: 8px;
   }
   .huazhuan:hover{
       cursor: pointer;
   }
   .ptb{
       padding: 8px 0;
   }
</style>
