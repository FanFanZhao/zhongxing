<template>
  <div id="allrec">
    <div class="title">{{$t('account.allRec')}}</div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      token:'',
      page:1,
      list:[]
    }
  },
  created(){
    var token = window.localStorage.getItem('token') || '';
    if(token){
      this.token = token;
      this.getList()
    }
  },
  methods:{
    getList(){
      if(this.token){
        this.$http({
          url:'/api/wallet/legal_log',
          method:'post',
          data:{page:this.page},
          headers:{Authorization:this.token}
        }).then(res => {
          if(res.data.type == 'ok'){
            
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#allrec{
  margin: 30px auto 0;
  width: 1200px;
  >.title{
    font-size: 20px;
    line-height: 40px;
    padding: 5px 20px;
    background: #fff;
  }
  >.list{
    margin-top: 20px;
    padding: 10px 20px;
    line-height: 30px;
    background: #fff;
  }
}
</style>
