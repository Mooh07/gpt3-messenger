import { adminDB } from "firebaseAdmin";
import { query } from "lib/queryApi";
import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { json } from "stream/consumers";

type Data = {
  answer: string;
};

export async function POST(req: Request) {
  const { prompt, chatId, model, session } = await req.json();

  if (!prompt) {
    return new Response("Please provide a prompt", {
      status: 400,
    });
  }
  if (!chatId) {
    return new Response("Please provide a valid chatId", {
      status: 400,
    });
  }
  const response = await query(prompt, chatId, model);
  const message: Message = {
    text: response || "chatGPT was unable to find an answer for that",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "chatGPT",
      name: "chatGPT",
      avatar: "https://links.papareact.com/89k",
    },
  };

  const doc = await adminDB
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);
  return new Response(JSON.stringify({ id: doc.id, ...message }), {
    status: 200,
  });
}
