'use client'
import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import { useCollection } from "react-firebase-hooks/firestore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { collectionGroup, DocumentData, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";
import SidebarOptions from "./SidebarOptions";

interface RoomDocument extends DocumentData {
    createdAt: string;
    role: "owner" | "editor";
    roomId: string;
    userId: string;
}

function Sidebar() {
    const { user } = useUser();
    const [data] = useCollection(
        user && (
            query(collectionGroup(db, 'rooms'), where('userId', '==', user.emailAddresses[0].toString()))
        )
    );
    const groupedData = useMemo(() => {
        if (!data) {
            return { owner: [], editor: [] };
        }
        return data.docs.reduce<{
            owner: RoomDocument[];
            editor: RoomDocument[];
        }>(
            (acc, curr) => {
                const roomData = curr.data() as RoomDocument;
                const target = roomData.role === "owner"
                    ? acc.owner
                    : acc.editor;
                target.push({
                    id: curr.id,
                    ...roomData,
                });
                return acc;
            },
            { owner: [], editor: [] }
        );
    }, [data]);
    const menuOptions = (
        <>
            <NewDocumentButton />
            <div className="flex py-4 flex-col space-y-4 md:max-w-36">
                {groupedData.owner.length === 0 ? (
                    <h2 className="text-gray-500 font-semibold text-sm">
                        No Documents Found for this User
                    </h2>
                ) : (
                    <>
                        <h2 className="text-green-400 font-semibold text-sm">
                            My Documents
                        </h2>
                        {groupedData.owner.map((doc) => (
                            <SidebarOptions key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                        ))}
                    </>
                )}
            </div>
            {groupedData.editor.length > 0 && (
                <div className="flex py-4 flex-col space-y-4 md:max-w-36">
                    <h2 className="text-gray-500 font-semibold text-sm">
                        Shared With me.
                    </h2>
                    {groupedData.editor.map((doc) => (
                        <SidebarOptions
                            key={doc.id}
                            id={doc.id}
                            href={`/doc/${doc.id}`}
                        />
                    ))}
                </div>
            )}
        </>
    );
    return (
        <div className="p-2 md:p-5 bg-gray-200 relative">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon
                            className="p-2 hover:opacity-30 rounded-lg" size={40}
                        />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <div>
                                {menuOptions}
                            </div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="hidden md:inline">
                {menuOptions}
            </div>

        </div>
    )
}

export default Sidebar
