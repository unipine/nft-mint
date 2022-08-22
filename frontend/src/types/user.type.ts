export default interface IUser {
  token?: string;
  user: {
    _id?: string;
    email: string;
    password: string;
    createdAt?: string;
  };
}
