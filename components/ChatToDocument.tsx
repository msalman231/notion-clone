// 'use client'

// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { FormEvent, useState, useTransition } from "react";
// import { Button } from "./ui/button";
// import { toast } from "sonner";
// import { Input } from "./ui/input";
// import * as Y from "yjs";
// import { BotIcon, MessageCircleCode } from "lucide-react";
// import Markdown from "react-markdown";


// // function extractPlainText(docData: any): string {
// //     try {
// //         if (!docData?.blocks) return "";
// //         return docData.blocks
// //             .map((block: any) => block.text ?? "")
// //             .join("\n")
// //             .slice(0, 12_000);
// //     } catch {
// //         return "";
// //     }
// // }

// function ChatToDocument({ doc }: { doc: Y.Doc }) {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [answer, setAnswer] = useState("");
//     const [isPending] = useTransition();
//     const [question, setQuestion] = useState("");

//     const [summary, setSummary] = useState("");
//     const [input, setInput] = useState("");

//     const handleAskQuestion = async (e: FormEvent) => {
//         e.preventDefault();
//         if (!input.trim()) return;

//         setIsLoading(true);
//         setQuestion(input);
//         setAnswer("");

//         try {
//             const rawDoc = doc.get("document-store")?.toJSON();
//             const documentText =
//                 typeof rawDoc === "string"
//                     ? rawDoc
//                     : JSON.stringify(rawDoc, null, 2).slice(0, 12_000);

//             if (!documentText.trim()) {
//                 throw new Error("Document is empty");
//             }
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         documentData: documentText,
//                         question: input,
//                     }),
//                 }
//             );

//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err?.error || "AI request failed");
//             }
//             const { message } = await res.json();
//             setAnswer(message);
//             setInput("");
//             toast.success("Question answered");

//         } catch (err: any) {
//             console.error(err);
//             toast.error(err.message ?? "Something went wrong");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // const handleAskQuestion = async (e: FormEvent) => {
//     //     e.preventDefault();

//     //     setQuestion(input);

//     //     startTransition(async () => {
//     //         const documentData = doc.get("document-store").toJSON();

//     //         const res = await fetch(
//     //             `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`, {
//     //             method: "POST",
//     //             headers: {
//     //                 "Content-Type": "application/json",
//     //             },
//     //             body: JSON.stringify({
//     //                 documentData,
//     //                 question: input,
//     //             }),
//     //         })
//     //         if (res.ok) {
//     //             const { message } = await res.json();
//     //             setInput("");
//     //             setSummary(message);

//     //             toast.success("Question asked successfully!");
//     //         }
//     //     })
//     // }


//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <Button asChild variant="outline">
//                 <DialogTrigger>
//                     <MessageCircleCode className="mr-2" />
//                     Chat to Document
//                 </DialogTrigger>
//             </Button>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Chat to the Document!</DialogTitle>
//                     <DialogDescription>
//                         Ask a question and chat to the document with AI.
//                     </DialogDescription>
//                     <hr className="mt-5" />
//                     {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
//                 </DialogHeader>

//                 {summary && (
//                     <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
//                         <div className="flex">
//                             <BotIcon className="w-10 shrink-0" />
//                             <p className="font-bold">
//                                 Ai {isPending ? "is thinking..." : "Says:"}
//                             </p>
//                         </div>
//                         <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
//                     </div>
//                 )}

//                 <form className="flex gap-2" onSubmit={handleAskQuestion}>
//                     <Input
//                         type="text"
//                         placeholder="i.e. what is this about?"
//                         className="w-full"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                     />
//                     <Button type="submit" disabled={!input || isPending}>
//                         {isPending ? "Asking" : "Ask"}
//                     </Button>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default ChatToDocument
