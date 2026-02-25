'use client';
import { useTransition } from "react";
import { Button } from "./ui/button"
import { createnewDocument } from "@/actions/actions";
import { useRouter } from "next/navigation";

function NewDocumentButton() {

    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const handleCreaterNewDocument = () => {
        startTransition(async () => {
            const { docId } = await createnewDocument();
            router.push(`/doc/${docId}`);
        })
    };

    return (
        <Button onClick={handleCreaterNewDocument} disabled={isPending}>
            {isPending ? "Creatin..." : "New Document"}
        </Button>
    )
}

export default NewDocumentButton;
