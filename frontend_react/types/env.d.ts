interface ImportMetaEnv {
  /** 网站标题 */
  readonly VITE_APP_TITLE: string;
  /** 网站部署的目录 */
  readonly VITE_BASE_URL: string;
  /** API 接口路径 */
  readonly VITE_BASE_API: string;
  /** socket 请求路径前缀 */
  readonly VITE_BASE_SOCKET_PATH: string;
  /** socket 命名空间 */
  readonly VITE_BASE_SOCKET_NSP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
