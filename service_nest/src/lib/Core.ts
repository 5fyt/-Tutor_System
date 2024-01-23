export class Core {
  private app = null;
  constructor(app) {
    this.app = app;
    this.handle();
  }
  handle() {
    this.app.enableCors({
      origin: '*',
      allowedHanders: ['Authorization', 'content-type'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
  }
}
