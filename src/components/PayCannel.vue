<template>
	<div id="paycannel-box">
		<div class="content-header">
			<div class="content-header-left">
				<p class="status">{{status}}</p>
				<p class="status-text">{{statusText}}</p>
			</div>
			<div class="content-header-right">
				<img class="contact-img" src="../assets/images/msg.png" alt="">
				<p class="contact-text">联系对方</p>
			</div>
		</div>
		<div class="total">
			<p class="total-text">交易总额</p>
			<p class="total-price">￥{{datas.deal_money}}</p>
		</div>
		<ul class="list">
			<li>
				<p class="left">买家</p>
				<p class="right">{{datas.seller_name}}</p>
			</li>
			<li>
				<p class="left">单价</p>
				<p class="right">{{datas.price}}</p>
			</li>
			<li>
				<p class="left">数量</p>
				<p class="right">{{datas.number}}{{datas.currency_name}}</p>
			</li>
			<li>
				<p class="left">下单时间</p>
				<p class="right">{{datas.format_create_time}}</p>
			</li>
			<li>
				<p class="left">参考号</p>
				<p class="right">{{datas.id}}</p>
			</li>
			<li>
				<button class="right" v-show="cannelBtn" type="button"></button>
				<button class="right" v-show="comfirmBtn" type="button"></button>
			</li>
		</ul>
		<!-- 取消订单弹窗 -->
		<div class="confirm-t">
            <div class=" ft16">确认取消交易</div>
            <div class="blue">如果您已向卖家付款，请千万不要取消交易</div>
            <div class="ft16">
                <input type="checkbox" value=""><span>我还没有付款给对方</span>
            </div>
        </div>
		<!-- 确认订单弹窗 -->
		<div class="confirm-content tc">
                <div class="confirm-t">
                    <div>付款确认</div>
                    <div class="color1 ">请确认买家已向您付款</div>
                </div>
            </div>
	</div>
</template>

<script>
	export default {

		data() {
			return {
				status: '',
				statusText: '',
				datas: {},
				cannelBtn:false,
				comfirmBtn:false

			};
		},
		created() {
			let token = window.localStorage.getItem("token") || "";
			let ids = this.$route.query.id;
			console.log(ids);
			if (token) {
				this.token = token;
				this.getList(ids);
			}
		},
		methods: {
			getList(id) {
				let _this = this;
				_this.$http({
					url: "/api/legal_deal",
					params: {
						id: id,
					},
					headers: {
						Authorization: _this.token
					}
				}).then(res => {
					console.log(res);
					if (res.data.type == 'ok') {
						_this.datas = res.data.message;
						switch (_this.datas.is_sure) {
							case 0:
								_this.status = '待付款';
								_this.statusText = '请等待买家付款';
								break;
							case 1:
								_this.status = '已完成';
								_this.statusText = "订单已完成";
								break;
							case 2:
								_this.status = '已取消';
								_this.statusText = "订单已取消";
								break;
							case 3:
								_this.status = '已付款';
								_this.statusText = "买家已付款，请核实后确认";
								break;
						}
						// if (_this.datas.is_sure == 0 && _this.datas.type == 'sell') {
							_this.cannelBtn = true;
// 						} else {
// 							_this.cannelBtn = false;
// 						}
						if (_this.datas.is_sure == 3 && _this.datas.type == 'buy') {
							_this.comfirmBtn = true;
						} else {
							_this.comfirmBtn = true;
						}
					}
				});
			},
		}
	};
</script>

<style lang='scss'>
	$purple:#563BD1;

	#paycannel-box {
		width: 1200px;
		margin: 30px auto;

		>.buy-sell {}
	}
</style>
