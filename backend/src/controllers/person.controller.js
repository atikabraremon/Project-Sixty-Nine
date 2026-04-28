import { Person } from "../models/person.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { generateSlug } from "../utils/slugify";
import { personValidationSchema } from "../validation/person.validation";

export const createPerson = asyncHandler(async (req, res) => {
  const validatedBody = personValidationSchema.safeParse(req.body);

  if (!validatedBody.success) {
    const errorMessage =
      validatedBody.error?.errors?.[0]?.message || "Validation failed";
    throw new ApiError(400, errorMessage);
  }

  const data = validatedBody.data;

  // Duplicate check (Safe side thakar jonno)
  const existingPerson = await Person.findOne({ name: data.name });
  if (existingPerson)
    throw new ApiError(
      400,
      "Person already exists. Duplicate entry is not allowed."
    );

  const slug = generateSlug(data.name);

  const newPerson = await Person.create({
    ...data,
    slug,
    createdBy: req.user?._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newPerson, "Person created successfully"));
});
