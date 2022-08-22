export interface IUser {
  _id?: string;
  email: string;
  password: string;
  createdAt?: string;
}

export interface IUserWithToken {
  token: string;
  user: IUser;
}
