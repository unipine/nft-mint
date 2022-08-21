import { any, object, string, TypeOf } from "zod";

export const createNftSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    description: string(),
    file: any({
      required_error: "File is required",
    }),
  }),
});

export type CreateNftData = TypeOf<typeof createNftSchema>;
