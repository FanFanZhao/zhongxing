<template>
  <div id="mytransaction">
    <div class="filters">
      <div class="flex">
        <span>类型：</span>
        <ul class="types flex">
          <li @click="filterPms.type='buy';getList()" :class="{selected:filterPms.type=='buy'}">购买</li>
          <li @click="filterPms.type='sell';getList()" :class="{selected:filterPms.type=='sell'}">出售</li>
        </ul>
      </div>
      <!-- <div class="flex">
        <span>状态：</span>
        <ul class="types flex">
          <li @click="status!=3?status=3:status='none';getList()" :class="{selected:status==3}">已完成</li>
          <li @click="status!=3?status=3:status='none';getList()" :class="{selected:status==3}">已完成</li>
          <li @click="status!=4?status=4:status='none';getList()" :class="{selected:status==4}">已取消</li>
         
        </ul>
      </div> -->
      <div class="flex">
        <span>币种：</span>
        <ul class="coins flex">
          <li
            v-for="(coin,index) in coins"
            :key="index"
            @click="filterPms.currency_id = coin.id;getList()"
            :class="{selected:filterPms.currency_id==coin.id}"
          >{{coin.name}}</li>
        </ul>
      </div>
    </div>
    <div class="list-box">
      <div class="list-title">
        <el-row :gutter="10">
          <!-- <el-col :span="3">交易人</el-col> -->
          <el-col :span="4">单价</el-col>
          <el-col :span="5">数量</el-col>
          <el-col :span="5">发布时间</el-col>
          <el-col :span="4">支付方式</el-col>
          <el-col :span="6">操作 | 状态</el-col>
        </el-row>
      </div>
      <el-row :gutter="10" v-for="(item,index) in list" :key="index">
        <!-- <el-col :span="3">{{item.cny_uci.pay_account}}</el-col> -->

        <el-col :span="4">{{item.price}}</el-col>
        <el-col :span="5">{{item.number}}</el-col>
        <el-col :span="5">{{item.create_time}}</el-col>
        <el-col :span="4">
          <div class="pay">
            <img v-if="item.way=='ali_pay'" src="../../assets/images/zfb_icon.png" alt>
            <img v-else-if="item.way=='we_chat'" src="../../assets/images/wx_icon.png" alt>
            <img v-else src="../../assets/images/bank_icon.png" alt>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button  v-if="item.status == 1 || item.status == 2" size="mini" @click="cancel(item.id)" type="danger">取消订单</el-button>
          <el-button v-if="item.status == 1&&filterPms.type == 'buy'" size="mini" @click="confirmPay(item.id)" type="danger">确认付款</el-button>
          <el-button v-if="item.status == 2&&filterPms.type == 'sell'" size="mini" @click="confirm(item.id)" type="danger">确认收款</el-button>
         
          <el-button v-if="item.status == 2&&filterPms.type=='buy'" type="success" size="mini" disabled>已付款</el-button>
          <el-button v-if="item.status == 3" type="success" size="mini" disabled>已完成</el-button>
          <el-button v-if="item.status == 4" type="info" size="mini" disabled>已取消</el-button>
          <el-button size="mini" @click="getDetail(item.id)">详情</el-button>
          <!-- <router-link :to="{path:'/orderDetail',query:{id:item.id}}">
          </router-link>-->
        </el-col>
      </el-row>
      <div v-if="!list.length" class="tip tc" style="padding:20px">暂无更多</div>
      <div class="mask" v-if="selId != ''">
        <div class="content">
          <i class="el-icon-close" @click="selId = ''"></i>
          <div class="flex">
            <span>币种 ：</span>
            <div>{{detail.currency_name}}</div>
          </div>
          <div class="flex">
            <span>时间：</span>
            <div>{{detail.create_time}}</div>
          </div>
          <div class="flex">
            <span>单价：</span>
            <div>{{detail.price}}</div>
          </div>
          <div class="flex">
            <span>数量：</span>
            <div>{{detail.number}}</div>
          </div>
          <div class="flex">
            <span>支付账户：</span>
            <div>{{filterPms.type == 'sell'?detail.cny_uci.pay_account:detail.currency_uci.pay_account}}</div>
          </div>
          <div class="flex">
            <span>支付方式：</span>
            <div>{{filterPms.type == 'sell'?detail.cny_uci.pay_name:detail.currency_uci.pay_name}}</div>
          </div>
          <!-- <div class="flex">
            <span>名称：</span>
            <div>{{detail.cny_uci.pay_name}}</div>
          </div> -->
          <!-- <div class="flex" v-if="detail.status != 1">
            <span>状态：</span>
            <div v-if="detail.status == 2">已付款</div>
            <div v-if="detail.status == 3">已完成</div>
            <div v-if="detail.status == 4">已取消</div>
          </div> -->
          <!-- <div class="flex btns" v-if="detail.status == 1">
            <el-button @click="cancel" size="medium" >取消交易</el-button>
            <el-button type="danger" @click="confirm" size="medium">确认付款</el-button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status:'none',
      filterPms: { currency_id: "", type: "buy" },
      coins: [],
      list: [],
      selId: "",
      detail: {}
    };
  },
  created() {
    this.token = window.localStorage.getItem("token") || "";
    this.getCoins();
  },
  methods: {
    getCoins() {
      if (this.token) {
        var i = layer.load();
        this.$http({
          url: "/api/currency/list",
          heades: { Authorization: this.token }
        }).then(res => {
          layer.close(i);
          if (res.data.type == "ok") {
            var coins = res.data.message.legal;
            if (coins.length) {
              this.coins = coins;
              this.filterPms.currency_id = this.coins[0].id;
              this.getList();
            }
          }
        });
      }
    },
    getList() {
      if (this.token) {
        var i = layer.load();
        this.$http({
          url: "/api/ctoc/my_ctoc",
          method: "post",
          data: this.filterPms,
          headers: { Authorization: this.token }
        }).then(res => {
          layer.close(i);
          console.log(res);
          if (res.data.type == "ok") {
            var list = res.data.message;
            this.list = list;
          }
        });
      }
    },
    getDetail(id) {
      if (this.token) {
        var i = layer.load();
        this.$http({
          url: "/api/ctoc/order_detail",
          method: "post",
          data: { id: id },
          headers: { Authorization: this.token }
        }).then(res => {
          this.selId = id;
          layer.close(i);
          console.log(res);
          if (res.data.type == "ok") {
            this.detail = res.data.message;
            
          }
        });
      }
    },
    cancel(id) {
      if (this.token) {
        var i = layer.load();
        this.$http({
          url: "/api/ctoc/cancel",
          method:'post',
          data: { id: id },
          headers: { Authorization: this.token }
        }).then(res => {
          layer.close(i);
          layer.msg(res.data.message);
          if(res.data.type == 'ok'){
            this.getList()
          }
          console.log(res);
        });
      }
    },
    confirmPay(id) {
      var i = layer.load();
      this.$http({
        url: "/api/ctoc/pay",
        method: "post",
        data: { id: id },
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        this.selId = '';
        layer.msg(res.data.message);
        if (res.data.type == "ok") {
          this.getList()
        }
      });
    },
    confirm(id) {
      var i = layer.load();
      this.$http({
        url: "/api/ctoc/confirm",
        method: "post",
        data: { id: id },
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        this.selId = '';
        layer.msg(res.data.message);
        if (res.data.type == "ok") {
          this.getList()
        }
      });
    }
  }
};
</script>

<style lang='scss'>
#mytransaction {
  > .filters {
    // border-bottom: 1px solid #f3f3f3;
    margin-bottom: 20px;
    > .flex {
      margin-bottom: 15px;
      > span {
        width: 70px;
      }
      li {
        margin: 0 20px;
        cursor: pointer;
        padding-bottom: 2px;
      }
      .selected {
        font-weight: bold;
        color: blueviolet;
        border-bottom: 2px solid blueviolet;
      }
    }
  }
  .pay {
    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }
  }
  .list-box {
    font-size: 14px;
    line-height: 40px;
    > .list-title {
      font-weight: 600;
      padding: 5px 0;
    }
    .el-row {
      padding: 5px;
      border-top: 1px solid #f3f3f3;
      .el-button {
        margin-top: 6px;
        max-width: 80px;
      }
    }
    .first {
      align-items: center;

      > span {
        margin-right: 10px;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        background: #ccc;
        color: #fff;
        text-align: center;
      }
      > div {
        line-height: 20px;
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    .content {
      position: relative;
      margin: 100px auto;
      border-radius: 4px;
      padding: 20px 30px;
      max-width: 300px;
      background: #fff;
      line-height: 36px;
      > .el-icon-close {
        position: absolute;
        top: 0;
        right: 0;
        padding: 12px;
        font-weight: bold;
        cursor: pointer;
      }
      .flex {
        color: blueviolet;
        >span {
          color: #333;
          width: 80px;
        }
      }
      .btns{
        
        justify-content: center;
        .el-button{
          margin: 10px 20px;
        }
      }
    }
  }
}
</style>
