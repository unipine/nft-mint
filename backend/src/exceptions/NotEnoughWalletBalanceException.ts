import HttpException from "./HttpException";

class NotEnoughWalletBalanceException extends HttpException {
  constructor(wallet: string) {
    super(
      406,
      `Admin wallet ${wallet} does not have sufficient balance to mint NFT`
    );
  }
}

export default NotEnoughWalletBalanceException;
