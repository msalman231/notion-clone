"use server";
import { adminDb } from "@/firebase-admin";
// import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function deleteDocument(roomId: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    await adminDb.collection("documents").doc(roomId).delete();
    return { success: true };

    // const query = await adminDb
    //   .collectionGroup("rooms")
    //   .where("roomId", "==", roomId)
    //   .get();
    // const batch = adminDb.batch();

    // query.docs.forEach((doc) => {
    //   batch.delete(doc.ref);
    // });

    // await batch.commit();

    // await liveblocks.deleteRoom(roomId);
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}

export default deleteDocument;
