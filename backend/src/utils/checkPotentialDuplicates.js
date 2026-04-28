import { Video } from "../models/video.model.js";

export const checkPotentialDuplicates = async (videoData) => {
  const { title, stars, network, releaseDate } = videoData;

  // ১. ডাটা নরমালিশন ফাংশন (সব ছোট হাতের করা এবং স্পেশাল ক্যারেক্টার বাদ দেয়া)
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim();

  const normalizedNewTitle = normalize(title);
  const newYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const newStarIds = stars ? stars.map((id) => id.toString()) : [];

  // ২. ডাটাবেস থেকে পটেনশিয়াল ম্যাচ খুঁজে আনা
  // নেটওয়ার্ক এবং স্ট্যাটাস (failed ছাড়া সব) দিয়ে ফিল্টার করা হচ্ছে
  const potentialMatches = await Video.find({
    network: network,
    status: {
      $in: [
        "completed",
        "review-required",
        "pending",
        "processing",
        "uploading",
      ],
    },
  }).select("title stars releaseDate thumbnail slug status");

  let foundMatches = [];

  for (const video of potentialMatches) {
    const normalizedExistingTitle = normalize(video.title);
    const existingYear = video.releaseDate
      ? new Date(video.releaseDate).getFullYear()
      : null;
    const existingStarIds = video.stars.map((id) => id.toString());

    // --- এ্যালগরিদম ১: টাইটেল সিমিলারিটি (Smart Match) ---
    // হুবহু মিল অথবা আংশিক মিল চেক (যেমন: "John Wick" matches "John Wick 4")
    const isTitleSimilar =
      normalizedExistingTitle.includes(normalizedNewTitle) ||
      normalizedNewTitle.includes(normalizedExistingTitle);

    // --- এ্যালগরিদম ২: কাস্ট/স্টার ম্যাচিং (Percentage) ---
    const commonStars = existingStarIds.filter((id) => newStarIds.includes(id));
    const matchPercentage =
      existingStarIds.length > 0
        ? (commonStars.length /
            Math.max(existingStarIds.length, newStarIds.length)) *
          100
        : 0;

    // --- এ্যালগরিদম ৩: ফাইনাল স্কোরিং এবং ডিসিশন ---
    const isSameYear = newYear && existingYear && newYear === existingYear;
    const isHighCastMatch = matchPercentage >= 50; // অর্ধেক কাস্ট মিলে গেলে

    let duplicateChance = "None";
    let matchReason = "";

    if (isTitleSimilar && isSameYear) {
      duplicateChance = "High";
      matchReason = "Same title & release year detected.";
    } else if (isTitleSimilar && isHighCastMatch) {
      duplicateChance = "Medium-High";
      matchReason = "Similar title & high cast matching.";
    } else if (isTitleSimilar) {
      duplicateChance = "Low-Medium";
      matchReason = "Title has partial match, please verify manually.";
    }

    // যদি পটেনশিয়াল ডুপ্লিকেট মনে হয়, তবেই লিস্টে যোগ হবে
    if (duplicateChance !== "None") {
      foundMatches.push({
        _id: video._id,
        title: video.title,
        thumbnail: video.thumbnail,
        slug: video.slug,
        status: video.status, // অ্যাডমিন দেখবে যে ভিডিওটা এখন কি অবস্থায় আছে
        releaseDate: video.releaseDate,
        confidence: duplicateChance,
        matchReason: matchReason,
        matchDetails: {
          yearMatch: isSameYear,
          castSimilarity: `${Math.round(matchPercentage)}%`,
        },
      });
    }
  }

  // সবচেয়ে বেশি মিল থাকা ভিডিওগুলোকে আগে দেখানোর জন্য সর্ট করা
  return foundMatches.sort((a, b) => {
    const priority = { High: 3, "Medium-High": 2, "Low-Medium": 1 };
    return priority[b.confidence] - priority[a.confidence];
  });
};
