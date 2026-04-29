import { Affiliation } from "../models/affiliation.model.js";
import { Person } from "../models/person.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateSlug } from "../utils/slugify.js";
import { personValidationSchema } from "../validation/person.validation.js";

// crate Person
export const createPerson = asyncHandler(async (req, res) => {
  const validatedBody = personValidationSchema.safeParse(req.body);

  if (!validatedBody.success) {
    const errorMessage =
      validatedBody.error?.errors?.[0]?.message || "Validation failed";
    throw new ApiError(400, errorMessage);
  }

  const data = validatedBody.data;

  // Duplicate check
  const existingPerson = await Person.findOne({ name: data.name });
  if (existingPerson)
    throw new ApiError(
      400,
      "Person already exists. Duplicate entry is not allowed."
    );

  const lastPerson = await Person.findOne()
    .sort("-priority")
    .select("priority");

  const nextGlobalPriority = lastPerson ? (lastPerson.priority || 0) + 1 : 1;

  const slug = generateSlug(data.name);

  const newPerson = await Person.create({
    ...data,
    slug,
    priority: nextGlobalPriority,
    createdBy: req.user?._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newPerson, "Person created successfully"));
});

// Swap Person Order
export const swapPersonPriority = asyncHandler(async (req, res) => {
  const { firstPersonId, secondPersonId } = req.body;

  if (!firstPersonId || !secondPersonId) {
    throw new ApiError(400, "Both Person IDs are required for swapping");
  }

  // 1. Duto person-kei khuje ber koro
  const firstPerson = await Person.findById(firstPersonId);
  const secondPerson = await Person.findById(secondPersonId);

  if (!firstPerson || !secondPerson) {
    throw new ApiError(404, "One or both persons not found");
  }

  // 2. Priority swap koro (Temporary variable use kore)
  const tempPriority = firstPerson.priority;
  firstPerson.priority = secondPerson.priority;
  secondPerson.priority = tempPriority;

  // 3. Database-e save koro
  await firstPerson.save();
  await secondPerson.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Order swapped successfully"));
});

// Delete Person
// DELETE /api/v1/persons/:id
export const deletePerson = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Check if person exists
  const person = await Person.findById(id);
  if (!person) {
    throw new ApiError(404, "Person not found");
  }

  // 2. Related data clean-up (Affiliations delete kora)
  await Affiliation.deleteMany({ person: id });

  // 3. Final delete the person
  await Person.findByIdAndDelete(id);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        id,
        "Person and their affiliations deleted successfully"
      )
    );
});

// Get all Person with Pagination
// /api/v1/persons?page=1&limit=20&sortBy=latest
export const getAllPerson = asyncHandler(async (req, res) => {
  // 1. Query parameters theke value gulo nawa
  const { page = 1, limit = 20, sortBy = "priority" } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // 2. Sorting map ready kora
  // Frontend 'latest' pathale createdAt: -1 hobe, noile priority: -1 hobe
  const sortCriteria =
    sortBy === "latest" ? { createdAt: -1 } : { priority: -1 };

  // 3. Database query run kora
  const [people, totalPeople] = await Promise.all([
    Person.find().sort(sortCriteria).skip(skip).limit(limitNum),
    Person.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalPeople / limitNum);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        people,
        pagination: {
          totalPeople,
          totalPages,
          currentPage: pageNum,
          pageSize: people.length,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      `People fetched by ${sortBy}`
    )
  );
});
