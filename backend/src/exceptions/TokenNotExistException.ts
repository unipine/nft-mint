import HttpException from './HttpException';

class TokenNotExistException extends HttpException {
  constructor(token: string) {
    super(404, `token ${token} not exist`);
  }
}

export default TokenNotExistException;
