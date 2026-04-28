import { z } from "zod";

export const networkValidationSchema = z.object({
  name: z
    .string({ required_error: "Network name is required" })
    .trim()
    .min(1, "Name cannot be empty"),

  status: z.enum(["Active", "Defunct", "Hidden"]).default("Active"),

  isVerified: z.boolean().default(true),

  media: z
    .object({
      logo: z
        .object({
          url: z.string().url("Invalid logo URL").default(""),
          fileKey: z.string().default(""),
        })
        .optional(),
      coverImage: z
        .object({
          url: z.string().url("Invalid cover image URL").default(""),
          fileKey: z.string().default(""),
        })
        .optional(),
    })
    .optional(),

  foundedDate: z.string().datetime().optional().nullable(),

  location: z.string().optional(),

  website: z.string().url("Invalid website URL").optional().or(z.literal("")),

  type: z.enum(["Network", "Studio", "Site", "Production House"], {
    required_error: "Network type is required",
  }),

  priority: z
    .number()
    .int("Priority must be an integer") // Eita ensure korbe jeno decimal (1.5) na hoy
    .default(0)
    .optional(),

  parentNetwork: z
    .string()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid parentNetwork MongoDB ID",
    })
    .optional()
    .nullable(),

  social: z
    .object({
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      others: z.string().optional(),
    })
    .optional(),
});
