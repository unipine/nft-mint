import HttpException from "./HttpException";

class WrongParamsException extends HttpException {
  constructor() {
    super(400, "Wrong parameters provided");
  }
}

export default WrongParamsException;
