<template>
	<div id="legaltrade-box">
		<div class="buy-sell flex">
			<div class="buy-box">
				<div class="title">购买</div>
				<ul :class="['flex',{'now':type == 'buy'}]">
					<li v-for="(coin,index) in legals" :key="index" :class="{'current':coin.id == id}" @click="changeClassify(coin.id,1,coin.name)">{{coin.name}}</li>
				</ul>
			</div>
			<div class="sell-box">
				<div class="title">出售</div>
				<ul :class="['flex',{'now':type=='sell'}]">
					<li v-for="(coin,index) in legals" :key="index" :class="{'current':coin.id == id}" @click="changeClassify(coin.id,2,coin.name)">{{coin.name}}</li>
				</ul>
			</div>
		</div>
		<div class="list-box">
			<div class="list-title flex">
				<div>商家</div>
				<div>数量</div>
				<div>限额</div>
				<div>单价</div>
				<div>支付方式</div>
				<div>操作</div>
			</div>
			<ul class="list">
				<li v-for="(item,index) in list" :key="index" class="flex">
					<div>
						<img :src="url+'upload/'+item.currency_logo" alt="">
						<span>{{item.currency_name}}</span>
					</div>
					<div>{{item.surplus_number}}</div>
					<div>{{item.limitation.min}}-{{item.limitation.max}}CNY</div>
					<div>{{item.price}}</div>
					<div>{{item.way_name}}</div>
					<div @click="buySell(item.price,item.limitation.min,item.limitation.max)"><button>{{classify}}{{name}}</button></div>
				</li>
			</ul>
			<!-- 分页 -->
			<paginate v-show="pages" :page-count="pages" :click-handler="pagesList" :prev-text="'上一页'" :next-text="'下一页'"
			 :container-class="'pages'">
			</paginate>
		</div>
		<div class="modal">
			<p class="title">{{classify}}{{name}}</p>' + '<p class="price">单价{{prices}}</p>
			<div class="trade">
				<p class="trade-name">{{name}}交易</p>
				<p class="trade-num">{{classify}}数量</p>
			</div>'+ '<div>' + '<input class="number" type="number" placeholder="请输入欲出售数量">
				<span class="name">{{name}}</span>
				<button class="all" type="button" v-if=" type== 'buy' ">全部买入</button>
				<button class="all" type="button" v-else>全部卖出</button>
			</div>
			<div class="maxnum">限额{{minNum}}-{{maxNum}}</div>
			<div>
				<p class="total-price">交易总额</p>
				<p class="prices">￥0.00</p>
			</div>
			<p class="tip">请在24小时内联系商家付款，超出24小时将自动取消</p>
			<div class="btns">
				<p class="cannel">60s自动取消</p>
				<button class="comfirm" type="button">下单</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Paginate from 'vuejs-paginate';
	export default {
		components: {
			Paginate
		},
		data() {
			return {
				legals: [],
				list: [],
				type: 'buy',
				id: 0,
				page: 1,
				classify: '购买',
				name: '',
				pages: 0,
				prices: 0,
				minNum: 0,
				maxNum: 0,
			};
		},
		template: '',
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
							this.name = list[0].name;
							this.getList("buy", id, 1);
						}
					}
				});
			},
			getList(type, id, page) {
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
					headers: {
						Authorization: this.token
					}
				}).then(res => {
					if (res.data.type == 'ok') {
						this.list = res.data.message.data;
						let total = parseInt(res.data.message.total);
						if (total > 10) {
							this.pages = Math.ceil(total / 10)
						}
					}
				});
			},
			// 点击改变选中分类
			changeClassify(ids, type, names) {
				let _this = this;
				console.log(type);
				_this.id = ids;
				if (type == 1) {
					_this.type = 'buy';
					_this.classify = '购买'
				} else {
					_this.type = 'sell';
					_this.classify = '出售'
				}
				_this.name = names;
				_this.getList(_this.type, ids, 1)

			},
			// 分页改变
			pagesList(pageNum) {
				let _this = this;
				_this.getList(_this.type, _this.id, pageNum);
			},
			// 出售或者购买按钮
			buySell(prices, min, max) {

			}
		}
	};
</script>

<style lang='scss'>
	$purple:#563BD1;

	#legaltrade-box {
		width: 1200px;
		margin: 30px auto;

		>.buy-sell {
			>.buy-box {
				padding: 20px;
				border-right: 1px solid #ccc;
			}

			>.sell-box {
				padding: 20px;
			}

			>div {
				width: 50%;
				font-weight: bold;

				ul {
					margin-top: 20px;

					li {
						margin-right: 16px;
						cursor: pointer;
					}
				}

				>.now {
					>.current {
						color: $purple;
						border-bottom: 2px solid $purple;
					}
				}
			}
		}

		>.list-box {
			margin-top: 20px;

			>.list-title {
				>div {
					flex: 1;
				}

				>div:last-child {
					text-align: right;
				}
			}

			>.list {
				>li {
					padding: 20px 0;
					border-bottom: 1px solid #e5e5e5;

					>div {
						flex: 1;
						line-height: 36px;

						>img {
							width: 36px;
							height: 36px;
							border-radius: 50%;
							margin-right: 10px;
						}

						>span {
							display: inline-block;
							position: relative;
							top: -10px;
							color: $purple;
						}
					}

					>div:last-child {
						text-align: right;

						>button {
							background-color: $purple;
							padding: 5px 15px;
							color: #fff;
							border-radius: 8px;
							line-height: 36px;
						}
					}
				}
			}

			>.pages {
				display: flex;
				justify-content: center;
				margin-top: 30px;

				>li {
					padding: 10px;
					border: 1px solid #e5e5e5;
					margin-right: 10px;
					border-radius: 6px;
				}

				>.active {
					border: 1px solid $purple;
					color: $purple;
				}
			}
		}

		>.modal {
			width: 400px;

			>.title {
				font-size: 16px;
			}
		}
	}
</style>
