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

        let prompts;
        if (query !== "") {
            const user = await User.findOne({
                username: query,
            });
            if (user) {
                prompts = await Prompt.find({ creator: user._id })
                    .skip(offset)
                    .limit(count)
                    .populate("creator");
            } else {
                prompts = await Prompt.find({
                    $or: [
                        { tag: { $regex: new RegExp(query, "i") } },
                        { prompt: { $regex: new RegExp(query, "i") } },
                    ],
                })
                    .skip(offset)
                    .limit(count)
                    .populate("creator");
            }
        } else {
            prompts = await Prompt.find({})
                .skip(offset)
                .limit(count)
                .populate("creator");
        }
        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};
