import { firestore } from "@/app/lib/firebase";
import { doc, increment, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import NextCors from 'nextjs-cors';

export async function POST(req) {
    // Set CORS headers to allow all origins
  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle the request logic here
  const response = NextResponse.json({ message: 'Hello, world!' });
  response.headers.append('Access-Control-Allow-Origin', '*');
  response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return new NextResponse(null, { headers });
}
