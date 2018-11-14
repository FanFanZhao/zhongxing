<template>
  <div id="legaltrade-box">
    <div class="buy-sell flex">
      <div class="buy-box">
        <div class="title">购买</div>
        <ul :class="['flex',{'now':type == 'buy'}]">
          <li  v-for="(coin,index) in legals" :key="index" :class="{'current':coin.id == id}">{{coin.name}}</li>
        </ul>
      </div>
      <div class="sell-box">
        <div class="title">购买</div>
        <ul :class="['flex',{'now':type=='sell'}]">
          <li v-for="(coin,index) in legals" :key="index" :class="{'current':coin.id == id}">{{coin.name}}</li>
        </ul>
      </div>
    </div>
    <div class="list-box">
      <div class="list-title flex">
        <div>商家</div>
        <div>数量</div>
        <div>限额</div>
        <div>支付方式</div>
        <div>操作</div>
      </div>
      <ul>
        <li v-for="(item,index) in list" :key="index" class="flex">
          <div>
            <img :src="url+'upload/'+item.currency_logo" alt="">
            <span>{{item.currency_name}}</span>
          </div>
          <div>{{item.surplus_number}}</div>
          <div>{{item.limitation.min}}-{{item.limitation.max}}CNY</div>
          <div>{{item.price}}</div>
          <div>{{item.way_name}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      legals: [],
      list:[],
      type:'buy',
      id:0,
      page:1
    };
  },
  created() {
    console.log(window.location);
    
    let token = window.localStorage.getItem("token") || "";
    if (token) {
      this.token = token;
      this.getCoins();
    }
  },
  methods: {
    getCoins() {
      this.$http({
        url: "/api/currency/list"
      }).then(res => {
        if (res.data.type == "ok") {
          var list = res.data.message.legal;
          if (list.length) {
            this.legals = list;
            var id = list[0].id;
            this.getList("buy", id,1);
          }
        }
      });
    },
    getList(type, id,page) {
      this.type = type;
      this.id = id;
      this.page = page;
      this.$http({
        url: "/api/legal_deal_platform",
        params: {
          type: type,
          page: page,
          currency_id: id
        },
        headers: { Authorization: this.token }
      }).then(res => {
        if(res.data.type == 'ok'){
          this.list = res.data.message.data;
        }
      });
    }
  }
};
</script>

<style lang='scss'>
$purple:#563BD1;
#legaltrade-box {
  width: 1200px;
  margin: 30px auto;
  > .buy-sell {
    >.buy-box{
      padding: 20px;
      border-right: 1px solid #ccc;
    }
    >.sell-box{
      padding-left: 20px;
    }
    > div {
      width: 50%;
      font-weight: bold;
      ul{
        margin-top: 20px;
        li{
          margin-right: 16px;
          cursor: pointer;
        }
      }
      >.now{
        >.current{
          color: $purple;
          border-bottom: 2px solid $purple;
        }
      }
    }
  }
  >.list-box{
    margin-top: 20px;
    >.list-title{
      >div{
        flex:1;
      }
      >div:last-child{
        text-align: right;
      }
    }
    >ul{

    }
  }
}
</style>
