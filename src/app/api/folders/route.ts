import { connectDB } from "@/lib/db";
import { Folder } from "@/models/Folder";
import { NextResponse } from "next/server";

// ✅ CREATE A NEW FOLDER
export async function POST(req: Request) {
  await connectDB();

  try {
    const { name, parentId } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const newFolder = await Folder.create({ name, parentId: parentId || null });

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}

// ✅ FETCH ALL FOLDERS
export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");

    const folders = parentId ? await Folder.find({ parentId }) : await Folder.find();

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}
