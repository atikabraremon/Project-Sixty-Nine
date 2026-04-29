import { z } from "zod";

export const networkValidationSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  status: z.enum(["Active", "Defunct", "Hidden"]).default("Active"),
  isVerified: z.boolean().default(true),
  // foundedDate fix:
  foundedDate: z.coerce.date().optional().nullable(),

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

  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  type: z.enum(["Network", "Studio", "Site", "Production House"]),
  priority: z.number().int().default(0),

  parentNetwork: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID")
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
