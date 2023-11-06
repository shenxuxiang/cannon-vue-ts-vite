import basicContext from '@/common/basicContext';
import { createPinia } from 'pinia';
import vAuth from '@/common/vAuth';
import { createApp } from 'vue';
import router from '@/router';
import App from './App.vue';
import '@/mock/mock-home';
import '@/mock/mock';
import './main.less';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(basicContext);
app.use(vAuth);

app.mount('#app');
