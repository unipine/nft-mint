import HttpException from './HttpException';

class TokenExpiredException extends HttpException {
  constructor(email: string, token: string) {
    super(400, `token ${token} for ${email} expired`);
  }
}

export default TokenExpiredException;
