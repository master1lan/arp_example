import { defineConfig } from 'umi';

export default defineConfig({
  dynamicImport: {},
  history: {
    type: 'hash',
  },
  base: './',
  publicPath: './',
  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
