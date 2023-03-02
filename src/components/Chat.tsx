"use client";
import { db } from "../../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import EmptyChat from "./EmptyChat";
import LoadingSpinner from "./LoadingSpinner";
import Message from "./Message";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  chatId: string;
};
function Chat({ chatId }: Props) {
  const [scrollToRef, setScrollToRef] = useState<Element | null>(null);

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

  useEffect(() => {
    scrollToRef?.scrollIntoView({ behavior: "smooth" });
    console.log(messages)
  }, [scrollToRef, messages]);
  if (loading)
    return (
      <section className="flex-1">
        <LoadingSpinner />
      </section>
    );
  return (
    <section className="flex-1 overflow-y-auto">
      {!messages?.empty ? (
        <ul>
          {messages?.docs.map((message) => (
            <Message key={message.id} message={message.data()} />
          ))}
          <div
            style={{ float: "left", clear: "both" }}
            ref={setScrollToRef}
          ></div>
        </ul>
      ) : (
        <EmptyChat />
      )}
    </section>
  );
}

export default Chat;
