import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import { type ConfigEnv, type UserConfig, loadEnv } from 'vite';

import WindiCSS from 'vite-plugin-windicss';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE } = loadEnv(mode, CWD);

  const isBuild = command === 'build';
  console.log('当前执行环境：', isBuild);
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        },
        {
          find: '~antd',
          replacement: path.resolve(__dirname, 'node_modules/antd')
        }
      ]
    },
    server: {
      port: 8080,
      cors: true,
      open: true,
      proxy: {
        '/api': {
          target: `http://localhost:9090/api`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: { '@primary-color': '#13c2c2' }
        }
        // ....
      }
    },
    plugins: [
      WindiCSS(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    ],
    build: {
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: !!VITE_DROP_CONSOLE
        }
      }
    }
  };
};
