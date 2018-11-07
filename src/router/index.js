import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import homeContent from '@/view/homeContent'
import dealCenter from '@/components/dealCenter'
import userSetting from '@/components/userSetting'
import c2c from '@/components/c2c'
import login from '@/components/login'
import UserCenter from '@/components/UserCenter'
import BindEmail from '@/view/BindEmail'
import UserSecurity from '@/view/UserSecurity'
import register from '@/components/register'
import account from '@/components/account'
import accountCenter from '@/view/accountCenter'
import accountEntrust from '@/view/accountEntrust'
import accountSet from '@/view/accountSet'
import accountMessage from '@/view/accountMessage'
import setCash from '@/components/setCash'
import recharge from '@/view/recharge'
import rechargeMoney from '@/view/rechargeMoney'
import coinRecord from '@/view/coinRecord'
import noticeList from '@/components/noticeList'
import noticeDetail from '@/components/noticeDetail'
import aceite from '@/view/aceite'
import region from '@/view/region'
import chargeRecord from '@/view/chargeRecord'
import new_account from '@/components/new_account'
import finance from '@/view/accounts/finance'
import lever from '@/view/accounts/lever'
import finanrec from '@/view/accounts/finanrec'
import manger from '@/view/accounts/lever_manger'
import legal from '@/view/accounts/legal'
import legalAccount from '@/view/accounts/legalAccount'
import transferLegal from '@/view/accounts/transferLegal'
import currencyApply from '@/view/currency_apply'
import payOpts from '@/view/payOpts'
import currencyList from '@/view/currency_list'
import currencyEdit from '@/view/edit_currency'
//收款方式

import ForgetPwd from '@/components/ForgetPwd' //忘记密码
import ResetPwd from '@/components/ResetPwd' //重置密码密码
import withdraw_address from '@/view/accounts/withdraw_address'
Vue.use(Router)
export default new Router({
	routes: [

		{
			path: '/',
			name: 'home',
			component: home,

			children: [{
					path: '',
					name: 'homeContent',
					component: homeContent

				},
				
				
				{
					path: '/dealCenter',
					name: 'dealCenter',
					component: dealCenter
				},
			
				{
					path: '/userSetting',
					name: 'userSetting',
					component: userSetting,
					children: [{
						path: '',
						component: payOpts
					}]
				},
				{
					path: '/c2c',
					name: 'c2c',
					component: c2c
				},
				{
					path: '/currencyApply',
					name: 'currencyApply',
					component: currencyApply
				},
				{
					path: '/currencyEdit',
					name: 'currencyEdit',
					component: currencyEdit
				},
				{
					path: '/currencyList',
					name: 'currencyList',
					component: currencyList
				},
				{
					path: '/components/noticeList',
					name: 'noticeList',
					component: noticeList
				},
				{
					path: '/components/bindEmail',
					name: 'BindEmail',
					component: BindEmail
				},
				{
					path: '/components/resetPwd',
					name: 'ResetPwd',
					component: ResetPwd
				},
				{
					path: '/userCenter',
					name: 'UserCenter',
					component: UserCenter,
					children:[
						{
							path:'',
							component:UserSecurity
						}
					]
				},
				{
					path: '/new_account',
					name: 'new_account',
					component: new_account,
					children: [

						{
							path: '/finance',
							name: 'finance',
							component: finance
						},
						{
							path: '/lever',
							name: 'lever',
							component: lever
						},
						{
							path: '/legal',
							name: 'legal',
							component: legal
						},
						{
							path: '/legalAccount',
							name: 'legalAccount',
							component: legalAccount
						},
						{
							path: '/transferLegal',
							component: transferLegal
						},
						


					]

				}
			]
		},
		// {
		// 	path:'/dealCenter',
		// 	name:'dealCenter',
		// 	component:dealCenter
		// },

		{
			path: '/components/login',
			name: 'login',
			component: login
		},
		
		{
			path: '/components/register',
			name: 'register',
			component: register
		},
		{
			path: '/forgetPwd',
			name: 'forgetPwd',
			component: ForgetPwd
		},
		
		{
			path: '/components/noticeDetail',
			name: 'noticeDetail',
			component: noticeDetail
		},
		{
			path: '/account',
			name: 'account',
			component: account,
			children: [{
					path: '/accountCenter',
					name: 'accountCenter',
					component: accountCenter
				},
				{
					path: '/accountEntrust',
					name: 'accountEntrust',
					component: accountEntrust
				},
				{
					path: '/accountMessage',
					name: 'accountMessage',
					component: accountMessage
				},
				{
					path: '/accountSet',
					name: 'accountSet',
					component: accountSet
				},
				{
					path: '/recharge',
					name: 'recharge',
					component: recharge
				},
				{
					path: '/coinRecord',
					name: 'coinRecord',
					component: coinRecord
				},
				{
					path: '/rechargeMoney',
					name: 'rechargeMoney',
					component: rechargeMoney
				},
				{
					path: '/aceite',
					name: 'aceite',
					component: aceite
				},
				{
					path: '/region',
					name: 'region',
					component: region
				},
				{
					path: '/chargeRecord',
					name: 'chargeRecord',
					component: chargeRecord
				}

			]

		},

		// 杠杆管理
		{

			path: '/lever_manger',
			name: 'manger',
			component: manger,
		},
		// 财务记录
		{

			path: '/finanrec',
			name: 'finanrec',
			component: finanrec,
		},
		// 地址管理
		{

			path: '/withdraw_address',
			name: 'withdraw_address',
			component: withdraw_address,
		},
		{
			path: '/setCash',
			name: 'setCash',
			component: setCash
		},



	]
})
