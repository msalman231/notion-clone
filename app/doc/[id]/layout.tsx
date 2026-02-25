import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation";


async function DocLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id?: string }>;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }
    const { id } = await params;
    if (!id) {
        notFound();
    }
    return (
        <RoomProvider roomId={id}>
            {children}
        </RoomProvider>
    )
}

export default DocLayout
