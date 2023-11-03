import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig, loadEnv } from 'vite';
import postcssPresetEnv from 'postcss-preset-env';

const __dirname = fileURLToPath(new URL('./', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '_VITE');

  const define = Object.keys(env).reduce((memo, key) => {
    memo[key] = JSON.stringify(env[key]);
    return memo;
  }, {});

  return {
    mode,
    define,
    clearScreen: true,
    publicDir: 'public',
    plugins: [ vue(), vueJsx(), legacy() ],
    resolve: {
      extensions: ['.tsx', '.ts'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
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
          modifyVars: { themeColor: '#6C69FF' },
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
            if (/\.(jpg|jpeg|png|webp|bmp|gif|svg)$/.test(name)) {
              return 'static/image/[name].[hash][extname]';
            } else if (/\.(woff2|woff|ttf|eot)$/.test(name)) {
              return 'static/font/[name].[hash][extname]';
            } else if (/\.css$/.test(name)) {
              return 'static/css/[name].[hash].css';
            } else {
              return 'static/[ext]/[name].[hash][extname]';
            }
          },
          manualChunks: {
            'vendor-react': [ 'react', 'react-dom' ]
          }
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
