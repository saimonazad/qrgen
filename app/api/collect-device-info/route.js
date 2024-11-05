import { firestore } from "@/app/lib/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import NextCors from 'nextjs-cors';

export async function POST(req, res) {
    // Set CORS headers to allow all origins
  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  
  const { id, deviceName } = await req.json();

  if (!id || !deviceName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const docRef = doc(firestore, "QR_Generator", id);
  const device =
    deviceName.toLowerCase() === "ios"
      ? "ios"
      : deviceName.toLowerCase() === "android"
        ? "android"
        : "others";
  try {
    await updateDoc(docRef, {
      totalViews: increment(1),
      [device]: increment(1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}
