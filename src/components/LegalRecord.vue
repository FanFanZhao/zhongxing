<template>
  <div id="legal-record">
    <div class="title">法币交易记录</div>
    <div class="filter-box">
      <div>
        <span>交易类型：</span>
        <span :class="{'select':type == 'buy'}" @click="setFilter('type','buy')">购买</span>
        <span :class="{'select':type == 'sell'}" @click="setFilter('type','sell')">出售</span>
      </div>
      <div>
        <span>订单状态：</span>
        <span :class="{'select':status == 'unfinish'}" @click="setFilter('status','unfinish')">未完成</span>
        <span :class="{'select':status == 'finish'}" @click="setFilter('status','finish')">已完成</span>
        <span :class="{'select':status == 'cancel'}" @click="setFilter('status','cancel')">已取消</span>
        <span :class="{'select':status == 'pay'}" @click="setFilter('status','pay')">已付款</span>
      </div>
    </div>
    <ul :class="{'buy-box':type == 'buy','sell-box':type == 'sell',
    'finish-box':status == 'finish','unfinish-box':status == 'unfinish','cancel-box':status == 'cancel','pay-box':status == 'pay'}">
      <li v-for="(item,index) in list" :key="index" :class="[item.type == 'sell'?'buy-item':'sell-item',{
        'unfinish-item':item.is_sure == 0,
        'finish-item':item.is_sure == 1,
        'cancel-item':item.is_sure == 2,
        'pay-item':item.is_sure == 3,
      }]">
        <div class="flex li-t">
          <div>
            <span v-if="item.type == 'sell'">购买</span>
            <span v-else>出售</span>
            <span>{{item.currency_name}}</span>
          </div>
          <div class="status">
            <router-link to="/" v-if="item.is_sure == 0">未完成 ></router-link>
            <router-link v-else-if="item.is_sure == 1">已完成 ></router-link>
            <router-link v-else-if="item.is_sure == 2">已取消 ></router-link>
            <router-link v-else>已付款 ></router-link>
          </div>
        </div>
        <div class="flex li-b">
          <div>
            <div>时间</div>
            <div>{{item.create_time}}</div>
          </div>
          <div>
            <div>数量</div>
            <div>{{item.number}}</div>
          </div>
          <div>
            <div>交易总额（{{item.currency_name}})</div>
            <div>{{item.deal_money}}</div>
          </div>
        </div>
      </li>
      
    </ul>
    <div class="more" @click="getList(true)" >加载更多</div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      currencyId:'1',
      page:1,
      list:[],
      type:'none',
      status:'none'
    }
  },
  created(){
    
    this.getList()
  },
  methods:{
    setFilter(type,v){
      if(this[type] == v){
        this[type] = 'none'
      } else {
        this[type] = v;
      }
    },
    getList(more=false){
      var token = window.localStorage.getItem('token')||'';
      if(!token){
        return;
      }
      var id = this.$route.query.id;//从上一页传过来的币种id，暂时写死为1
      this.type = 'none';
      this.status = 'none';
      var i = layer.load();
      this.$http({
        url:'/api/legal_user_deal',
        params:{
          currency_id:this.currencyId,
          page:this.page
        },
        headers:{Authorization:token}
      }).then(res => {
        layer.close(i)
        if(res.data.type == 'ok'){
          var msg = res.data.message;
          if(more){
            if(msg.data.length){

              this.list = this.list.concat(msg.data);
            } else {
              layer.msg('暂无更多')
            }
            
          } else {
            this.list = msg.data;
            
          }
          this.page+=1;
        }
        
      })
    }
  }
}
</script>

<style lang='scss'>
#legal-record{
  width: 1200px;
  margin: 30px auto;
  >.title{
    margin-bottom: 30px;
    padding: 0 30px;
    line-height: 50px;
    font-size: 20px;
    background: #f8f8f8;
  }
  >.filter-box{
    line-height: 30px;
    background: #f8f8f8;
    span{
      margin-left: 16px;
      cursor: pointer;
      
    }
    span:nth-child(n+2){
      font-weight: 600;
    }
    .select{
      color: #563BD1;
    }
  }
  >ul{
    padding: 10px 30px;
    background: #f8f8f8;
    li{
      >div{
        justify-content: space-between;
        line-height: 30px;
      }
    }
    >li:nth-child(n+2){
      border-top: 1px solid #ccc;
    }
  }
  >.buy-box .sell-item,.sell-box .buy-item,.unfinish-box li:not(.unfinish-item),.finish-box li:not(.finish-item),.cancel-box li:not(.cancel-item),.pay-box li:not(.pay-item){
    display: none;
  }
  >.more{
    text-align: center;
    padding: 20px;
    background: #f8f8f8;
    cursor: pointer;
  }
}
</style>
