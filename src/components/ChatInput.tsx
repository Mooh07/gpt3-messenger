"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  chatId: string;
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

function ChatInput({ chatId, setMessages }: Props) {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const model = "text-davinci-003";
  const generateMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;
    const input = prompt.trim();

    setPrompt("");
    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };
    const notification = toast.loading("chatGPT is thinking...");
    const doc = await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );
    message.id = doc.id;
    setMessages((prevState): Message[] => [message, ...prevState]);
    await fetch("/api/askQuestions", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
      }),
    }).then(async (data) => {
      const response = (await data.json()) as Message;
      setMessages((prevState): Message[] => [{ ...response }, ...prevState]);
      toast.success("chatGPT has responded", {
        id: notification,
      });
    });
  };
  return (
    <section className="rounded-lg bg-gray-700/50 text-sm text-gray-400 ">
      <form onSubmit={generateMessage} className="flex space-x-5 p-5">
        <input
          value={prompt}
          type="text"
          placeholder="Start a conversation with me"
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-transparent focus:outline-none disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={!session}
        />
        <button
          type="submit"
          disabled={!session || !prompt}
          className="rounded bg-[#11A37F] px-4 py-2
           font-bold text-white hover:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
        </button>
      </form>
      <section>{/* modal  */}</section>
    </section>
  );
}

export default ChatInput;
