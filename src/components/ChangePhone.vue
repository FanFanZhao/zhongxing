<template>
  <div id="changephone" class="bg-main">
    <h1>{{$t('change.changePhone')}}</h1>
    <el-form>
      <el-form-item :label="$t('change.enterEmail')">
        <el-input v-model="email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('register.codenum')">
        <el-input v-model="pms.email_code">
          <template slot="append">
            <el-button :disabled="email == '' || emailTip !=$t('register.sendcode')" @click="sendCode('email')">{{emailTip}}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('change.newPhone')">
        <el-input v-model="pms.new_phone">
          <template slot="prepend">
            <el-select v-model="front" clearable filterable :placeholder="$t('change.select')">
              <el-option
                v-for="item in countries"
                :value="item.area_code"
                :key="item.name_en"
                :label="item.area_code"
              >
                <span style="float: left">{{ $i18n.locale == 'zh'?item.name_cn:item.name_en }}</span>
                <span style="float: right; color: #8492a6">{{ item.area_code }}</span>
              </el-option>
            </el-select>  
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('register.codenum')">
        <el-input v-model="pms.phone_code">
          <template slot="append">
            <el-button
              :disabled="pms.email_code == '' || pms.new_phone == '' || phoneTip != $t('register.sendcode')"
              @click="sendCode('phone')"
            >{{phoneTip}}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" class="change" :disabled="pms.emailCode == ''||pms.new_phone == ''||pms.phone_code == ''" @click="change">{{$t('confirm')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import countries from "../lib/country.js";
export default {
  data() {
    return {
      token: "",
      countries: countries,
      email: "",
      emailTip: this.$t('register.sendcode'),
      phoneTip: this.$t('register.sendcode'),
      front: "+86",
      pms: {
        email_code: "",
        new_phone: "",
        phone_code: ""
      }
    };
  },
  created() {
    this.token = window.localStorage.getItem("token") || "";
  },
  methods: {
    setTip(key) {
      var time = 31;
      var timer = setInterval(() => {
        time--;
        this[key] = time + "" + "s";
        if (time == 0) {
          this[key] = this.$t('register.sendcode');
          clearInterval(timer);
        }
      }, 1000);
    },
    sendCode(which) {
      var reg = '';
      var data = {};
      var url = 'sms_amend';
      if (which == "email") {
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(reg.test(this.email)){
          data = {number:this.email,type:'phone'}
        } else {
          layer.msg(this.$t('lay.noemail'));return;
        }
      } else {
        if(typeof (this.pms.new_phone-0) == 'number'){
          data = {user_string:this.pms.new_phone,front:this.front};
          url = 'sms_send';
        } else {
          layer.msg(this.$t('lay.phonenot'))
        }
      }
      var i = layer.load();
        this.$http({
          url: "/api/"+url,
          data:data,
          method:'post',
          headers: { Authorization: this.token }
        }).then(res => {
          layer.close(i);
          layer.msg(res.data.message)
          if (res.data.type == "ok") {
            if(which == 'email'){
              this.setTip('emailTip');
            } else {
              this.setTip('phoneTip')
            }
          }
        });
      
    },
    change() {
      this.$http({
        url:'/api/user/amend_phone',
        data:this.pms,
        method:'post',
        headers: { Authorization: this.token }
      }).then( res => {
        layer.msg(res.data.message)
        if(res.data.type == 'ok'){
          this.$router.push('/userCenter')
        }
      })
    }
  }
};
</script>

<style lang='scss'>
#changephone {
  width: 520px;
  margin: 100px 300px;
  h1 {
    font-size: 40px;
  }
  .change {
    width: 50%;
  }
  .el-input-group__prepend {
    width: 120px;
    background: #fff;
  }
}
</style>
