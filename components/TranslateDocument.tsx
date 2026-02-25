'use client'

import * as Y from 'yjs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { FormEvent, useState, useTransition } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BotIcon, LanguagesIcon } from 'lucide-react';
import { toast } from 'sonner';
import Markdown from "react-markdown"


type Language =
    | "english"
    | "spanish"
    | "potuguese"
    | "french"
    | "german"
    | "chinese"
    | "aradbic"
    | "russian"
    | "japanese";


const languages: Language[] = [
    "english",
    "spanish",
    "potuguese",
    "french",
    "german",
    "chinese",
    "aradbic",
    "russian",
    "japanese"
]
function TranslateDocument({ doc }: { doc: Y.Doc }) {
    const [isOpen, setIsOpen] = useState(false);
    const [summary, setSummary] = useState("");
    const [question] = useState("");
    const [language, setLanguage] = useState<string>("");
    const [isPending, startTransition] = useTransition();



    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentData,
                    targetLang: language,
                }),
            }
            );
            if (res.ok) {
                const { translated_text } = await res.json();
                setSummary(translated_text);
                toast.success("Translate Summary successfully!");
            }
        });
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger>
                    <LanguagesIcon />
                    Translate
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate the Document</DialogTitle>
                    <DialogDescription>
                        Select a Language and AI will translate a summary of the document in the selected language.
                    </DialogDescription>
                    <hr className='mt-5' />
                    {question && <p className='mt-5 text-gray-500'>Q: {question}</p>}
                </DialogHeader>

                {summary && (
                    <div className='flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100'>
                        <div className='flex'>
                            <BotIcon className='w-10 shrink-0 flex' />
                            <span className='font-bold'>
                                GPT {isPending ? "is thinking..." : "Says:"}
                            </span>
                        </div>
                        <span>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</span>
                    </div>
                )}

                <form className="flex gap-2" onSubmit={handleAskQuestion}>
                    <Select
                        value={language}
                        onValueChange={(value) => setLanguage(value)}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Select a Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((language) => (
                                <SelectItem key={language} value={language}>
                                    {language.charAt(0).toUpperCase() + language.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit" disabled={!language || isPending}>
                        {isPending ? "Translating" : "Translate"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TranslateDocument
