import Prompt from "@models/prompt";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const offset = Number(searchParams.get("o")) || 0;
    const count = Number(searchParams.get("l")) || 10;

    let result;
    if (query !== "") {
      const user = await User.findOne({
        username: query,
      });
      if (user) {
        const queryFilter = { creator: user._id };
        result = await getPrompts(offset, count, queryFilter);
      } else {
        const queryFilter = {
          $or: [
            { tag: { $regex: new RegExp(query, "i") } },
            { prompt: { $regex: new RegExp(query, "i") } },
          ],
        };
        result = await getPrompts(offset, count, queryFilter);
      }
    } else {
      result = await getPrompts(offset, count);
    }
    return new Response(result, { status: 200 });
    // return new Response(
    //     { prompts: JSON.stringify(prompts), total: totalPrompts },
    //     { status: 200 }
    // );
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};

async function getPrompts(offset, count, queryFilter = {}) {
  const totalPrompts = await Prompt.countDocuments(queryFilter);
  const prompts = await Prompt.find(queryFilter)
    .skip(offset)
    .limit(count)
    .sort({ _id: -1 })
    .populate("creator");
  return JSON.stringify({
    prompts: prompts,
    total: totalPrompts,
  });
}
