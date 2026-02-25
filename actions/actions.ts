'use server';

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";


export async function createnewDocument(){
    const {userId, sessionClaims } = await auth();
    if (!userId) {
        throw new Error("Unauthorize");
    }
    const email = sessionClaims?.email as string | undefined;

    if (!email) {
        throw new Error("User emaul not available");
    }

    const docRef = await adminDb.collection("documents").add({
        title: "New Doc",
        owner: email,
        createdAt: new Date(),
    })

    await adminDb.collection('users').doc(email!).collection('rooms').doc(docRef.id).set({
        userId: sessionClaims?.email,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
    });
    return { docId: docRef.id};
}

