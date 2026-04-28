import z from "zod";

export const personValidationSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty"),

  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),

  gender: z.enum(["Male", "Female", "Other", "Non-binary"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),

  birthDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),

  deathDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),

  placeOfBirth: z.string().optional(),

  nationality: z.array(z.string()).default([]),

  avatar: z
    .object({
      url: z.string().optional(),
      fileKey: z.string().optional(),
    })
    .optional(),
  coverImage: z
    .object({
      url: z.string().optional(),
      fileKey: z.string().optional(),
    })
    .optional(),

  isVerified: z.boolean().default(true),
  isTrending: z.boolean().default(false),
  priority: z
    .number()
    .int("Priority must be an integer") // Eita ensure korbe jeno decimal (1.5) na hoy
    .default(0)
    .optional(),

  knownFor: z
    .array(
      z.enum(["Actor", "Director", "Producer", "Writer", "Cinematographer"])
    )
    .default(["Actor"]),

  // 🔹 socialLinks Object Validation
  socialLinks: z
    .object({
      instagram: z.string().trim().optional().or(z.literal("")),
      twitter: z.string().trim().optional().or(z.literal("")),
      facebook: z.string().trim().optional().or(z.literal("")),
      others: z.string().trim().optional().or(z.literal("")),
    })
    .strict("Additional fields in socialLinks are not allowed")
    .optional()
    .default({}),
});
