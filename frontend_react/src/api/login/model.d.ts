declare namespace API {
  type LoginParams = {
    username: string;
    password: string;
    captchaId: string;
    verifyCode: string;
  };
  type LoginResult = {
    token: string;
  };
  type CaptChaParams = {
    width: number;
    height: number;
  };
  type CaptChaResult = {
    img: string;
    id: string;
  };
}
