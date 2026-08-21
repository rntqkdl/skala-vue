import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 메인 프로젝트 B2B UI 라이브러리: Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 교재(233p~248p) 실습용 UI 라이브러리: Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(ElementPlus)

app.mount('#app')
