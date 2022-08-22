import HttpException from "./HttpException";

class WalletNotExistException extends HttpException {
  constructor(email: string) {
    super(404, `User with email ${email} does not have a wallet`);
  }
}

export default WalletNotExistException;
