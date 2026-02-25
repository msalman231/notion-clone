"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function inviteUserToRoom(roomId: string, email: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  console.log("Invite user to room", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}

export default inviteUserToRoom;
