import path from 'path';
import process from 'process';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import legacy from '@vitejs/plugin-legacy';
import vueJsx from '@vitejs/plugin-vue-jsx';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  const define = Object.keys(env).reduce((memo, key) => {
    memo[key] = JSON.stringify(env[key]);
    return memo;
  }, {});

  return {
    mode,
    define,
    base: env.VITE_BASE_URL,
    clearScreen: true,
    publicDir: 'public',
    plugins: [
      vue(),
      vueJsx(),
      legacy(),
      splitVendorChunkPlugin(),
      svgLoader({ defaultImport: 'component' }),
    ],
    resolve: {
      extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
      alias: {
        '@': path.resolve('src'),
      }
    },
    css: {
      devSourcemap: false,
      postcss: {
        plugins: [ postcssPresetEnv ]
      },
      preprocessorOptions: {
        less: {
          globalVars: {},
          additionalData: '',
          javascriptEnable: true,
          modifyVars: {
            themeColor: env.VITE_THEME_COLOR,
            // 在每个 less 文件中导入定义的 less 变量。
            // var.less 中定义的变量全局共享。
            hack: `true; @import (reference) "${path.resolve('src/assets/styles/var.less')}";`,
          },
        }
      },
    },
    build: {
      outDir: 'build',
      cssMinify: true,
      minify: 'terser',
      emptyOutDir: true,
      cssCodeSplit: true,
      copyPublicDir: true,
      assetsInlineLimit: 10240,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          entryFileNames: 'static/js/[name][hash:8].js',
          chunkFileNames: 'static/js/[name][hash:8].chunk.js',
          assetFileNames: (chunkInfo) => {
            const { name } = chunkInfo;
            if (/\.(jpg|jpeg|png|webp|bmp|gif)$/.test(name)) {
              return 'static/image/[name].[hash][extname]';
            } else if (/\.(woff2|woff|ttf|eot)$/.test(name)) {
              return 'static/font/[name].[hash][extname]';
            } else if (/\.css$/.test(name)) {
              return 'static/css/[name].[hash].css';
            } else {
              return 'static/[ext]/[name].[hash][extname]';
            }
          },
        }
      }
    },
    server: {
      port: 3333,
      open: true,
      strictPort: true,
      host: 'localhost',
      proxy: {
        '/v1.0': {
          target: 'http://192.168.5.2:20021',// 测试环境
          // target: 'http://192.168.5.2:30021',// 正式环境
          // target: 'http://192.168.5.120:2006',
          // 测试
          // target: 'http://192.168.5.61:2006',
          changeOrigin: true,
        },
        '/group1': {
          // target: 'http://192.168.5.120:2005',
          // 测试
          target: 'http://192.168.5.2:20021',
          changeOrigin: true,
        },
      }
    }
  };
})
