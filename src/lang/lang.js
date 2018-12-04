import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
import zh from './zh'
import en from './en'
let locale = window.localStorage.getItem('locale') || 'zh';
export default new VueI18n({
  locale:'en',
  messages:{
    zh:zh,
    en:en
  }
})
