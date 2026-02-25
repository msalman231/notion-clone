import { useRoom, useSelf } from "@liveblocks/react/suspense"
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";
import TranslateDocument from "./TranslateDocument";
// import ChatToDocument from "./ChatToDocument";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

type EditorProps = {
    doc: Y.Doc;
    provider: any;
    darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: EditorProps) {

    const userInfo = useSelf((me) => me.info);

    const editor: BlockNoteEditor = useCreateBlockNote({
        collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: {
                name: userInfo?.name,
                color: stringToColor(userInfo?.email),
            },
        },
    });


    return (
        <div className="relative max-w-6xl mx-auto">

            <BlockNoteView
                className="min-h-screen"
                editor={editor}
                theme={darkMode ? "dark" : "light"} />
        </div>
    )
}

function Editor() {
    const room = useRoom();
    const [doc, setDoc] = useState<Y.Doc | null>(null);
    const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    // const doc = useMemo(() => new Y.Doc(), [room]);
    // const provider = useMemo(() => new LiveblocksYjsProvider(room, doc), [room, doc]);

    // useEffect(() => {
    //     return () => {
    //         doc.destroy();
    //         provider.destroy();
    //     };
    // }, [doc, provider]);

    useEffect(() => {
        const yDoc = new Y.Doc();
        const yProvider = new LiveblocksYjsProvider(room, yDoc);
        setDoc(yDoc);
        setProvider(yProvider);

        return () => {
            yDoc?.destroy();
            yProvider?.destroy();
        };
    }, [room]);

    if (!doc || !provider) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 justify-end mb-10">
                <TranslateDocument doc={doc} />

                {/* <ChatToDocument doc={doc} /> */}


                {/* Dark Mode */}
                <Button className={darkMode
                    ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
                    : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
                } onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                </Button>
            </div>
            {/* BlockNote */}
            <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
        </div>
    )
}

export default Editor
