import { defineConfig } from 'umi';

export default defineConfig({
  history: {
    type: 'hash',
  },
  base: './',
  publicPath: './',
  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    // { path: '/', component: '@/pages/index' },
    { path: '/', component: '@/pages/test' },
  ],
  fastRefresh: {},
});
