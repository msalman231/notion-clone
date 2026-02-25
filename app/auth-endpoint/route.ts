import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const { sessionClaims } = await auth();

  if (
    !sessionClaims?.email ||
    !sessionClaims?.fullName ||
    !sessionClaims?.image
  ) {
    throw new Error("Missing session claims");
  }

  const { room } = await req.json();
  const session = liveblocks.prepareSession(sessionClaims.email, {
    userInfo: {
      name: sessionClaims.fullName,
      email: sessionClaims.email,
      avatar: sessionClaims.image,
    },
  });
  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id == room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    console.log("You are authorised");
    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 },
    );
  }
}
