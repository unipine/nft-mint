import HttpException from "./HttpException";

class WrongFileException extends HttpException {
  constructor() {
    super(400, "Wrong file provided, file must be image (or text less than 1kb)");
  }
}

export default WrongFileException;
