import { z } from "zod"

export const numberSchema = z.number().describe("number")
export const stringSchema = z.string().describe("string")
