import { schema } from "./deps/nodl.ts"
import { z } from "./deps/zod.ts"

export const numberSchema = schema("number", z.number())
export const stringSchema = schema("string", z.string())
