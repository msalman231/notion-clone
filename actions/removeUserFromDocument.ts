"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function removeUserFromDocument(roomId: string, email: string) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
export default removeUserFromDocument;
