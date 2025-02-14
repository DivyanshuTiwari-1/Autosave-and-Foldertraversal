import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TextUpdate } from "@/models/TextUpdate";
import { diff_match_patch } from "diff-match-patch";

export async function POST(req: Request) {
  await connectDB();
  const dmp = new diff_match_patch();

  try {
    const { diffs, startTime, endTime } = await req.json();

    if (!diffs || !Array.isArray(diffs)) {
      return NextResponse.json({ error: "Invalid diffs format" }, { status: 400 });
    }

    let lastTextUpdate = await TextUpdate.findOne().sort({ createdAt: -1 });
    let storedText = lastTextUpdate?.text || "";

    // Apply the patch
    let [patchedText, results] = dmp.patch_apply(dmp.patch_make(storedText, diffs), storedText);

    // Ensure all patches were applied successfully
    if (results.includes(false)) {
      return NextResponse.json({ error: "Patch application failed" }, { status: 500 });
    }

    // Save updated text
    const newTextUpdate = await TextUpdate.create({ text: patchedText, startTime, endTime });

    return NextResponse.json({ message: "Saved", patchedText: newTextUpdate.text }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error", details: error }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const latestTextUpdate = await TextUpdate.findOne().sort({ createdAt: -1 });

    if (!latestTextUpdate) {
      return NextResponse.json({ message: "No text updates found" }, { status: 404 });
    }

    return NextResponse.json(latestTextUpdate, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error", details: error }, { status: 500 });
  }
}
