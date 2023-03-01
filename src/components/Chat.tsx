"use client";
import { db } from "../../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import EmptyChat from "./EmptyChat";
import LoadingSpinner from "./LoadingSpinner";
import Message from "./Message";

type Props = {
  chatId: string;
};
function Chat({ chatId }: Props) {
  const { data: session } = useSession();
  const [messages, loading] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );
  if (loading)
    return (
      <section className="flex-1">
        <LoadingSpinner />
      </section>
    );
  return (
    <section className="flex-1 overflow-y-auto">
      {!messages?.empty ? (
        messages?.docs.map((message) => (
          <Message key={message.id} message={message.data()} />
        ))
      ) : (
        <EmptyChat />
      )}
    </section>
  );
}

export default Chat;
