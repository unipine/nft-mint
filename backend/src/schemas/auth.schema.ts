import { object, string, TypeOf } from "zod";

const payload = {
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
  }),
};

const emailTokenVerifyPayload = {
  body: object({
    token: string({
      required_error: "Token is required",
    }),
  }),
};

export const emailLoginSchema = object({
  ...payload,
});

export const emailTokenVerifySchema = object({
  ...emailTokenVerifyPayload,
});

export type EmailLoginInput = TypeOf<typeof emailLoginSchema>;
export type EmailTokenVerifyInput = TypeOf<typeof emailTokenVerifySchema>;
