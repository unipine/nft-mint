import HttpException from "./HttpException";

class WalletAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(409, `Wallet with email ${email} already exists`);
  }
}

export default WalletAlreadyExistsException;
