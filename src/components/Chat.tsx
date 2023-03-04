"use client";
import { db } from "../../firebase";
import {
  collection,
  DocumentData,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import EmptyChat from "./EmptyChat";
import LoadingSpinner from "./LoadingSpinner";
import Message from "./Message";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";

type Props = {
  chatId: string;
};

function Chat({ chatId }: Props) {
  const [scrollBottomRef, setScrollBottomRef] = useState<Element | null>(null);
  const [topOfCurrentChatRef, setTopOfCurrentChatRef] =
    useState<Element | null>(null);
  const [scrollContainer, setScrollContainer] = useState<Element | null>(null);
  const [totalChatMessages, setTotalChatMessages] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [nextPageLoading, setNextPageLoading] = useState<boolean>(false);
  const [previousScrollHeight, setPreviousScrollHeight] = useState<number>(0);
  const [previousScrollPosition, setPreviousScrollPosition] =
    useState<number>(0);
  const [lastItem, setLastItem] = useState<DocumentData | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    scrollBottomRef?.scrollIntoView();
  }, [scrollBottomRef]);
  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      const coll = collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      );
      const snapshot = await getCountFromServer(coll);
      const data = await getDocs(
        query(coll, limit(9), orderBy("createdAt", "desc"))
      );
      setTotalChatMessages(snapshot.data().count);
      setMessages(getMessagesFromDoc(data.docs));
      setLastItem(data.docs[data.docs.length - 1]);
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  useEffect(() => {
    if (!topOfCurrentChatRef) return;
    const fetchNextPage = async () => {
      if (messages.length >= totalChatMessages) return;
      setPreviousScrollHeight(scrollContainer?.scrollHeight!);
      setPreviousScrollPosition(scrollContainer?.scrollTop!);
      if (nextPageLoading) return;
      setNextPageLoading(true);

      const coll = collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      );
      const data = await getDocs(
        query(
          coll,
          limit(9),
          orderBy("createdAt", "desc"),
          startAfter(lastItem)
        )
      );
      setMessages([...messages, ...getMessagesFromDoc(data.docs)]);
      setLastItem(data.docs[data.docs.length - 1]);
      setNextPageLoading(false);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchNextPage();
      }
    });

    observer.observe(topOfCurrentChatRef);
    return () => observer.unobserve(topOfCurrentChatRef);
  }, [topOfCurrentChatRef]);
  useEffect(() => {
    if (!scrollContainer) return;
    scrollContainer.scrollTo({
      left: 0,
      top:
        scrollContainer.scrollHeight -
        previousScrollHeight +
        previousScrollPosition,
    });
  }, [messages]);

  if (loading)
    return (
      <section className="flex-1">
        <LoadingSpinner />
      </section>
    );
  const reversedMessages = [...messages].reverse();
  console.log(messages);
  return (
    <>
      <section
        className="flex-1 overflow-y-auto"
        ref={setScrollContainer}
        id="test"
        onScroll={(e) => setPreviousScrollPosition(e.currentTarget.scrollTop)}
      >
        {messages?.length ? (
          <ul>
            {nextPageLoading && (
              <div className="py-4">
                <LoadingSpinner />
              </div>
            )}
            {reversedMessages.map((message: Message, index: number) => (
              <div
                ref={index === 0 ? setTopOfCurrentChatRef : null}
                key={message.id}
              >
                <Message message={message} />
              </div>
            ))}
            <div
              style={{ float: "left", clear: "both" }}
              ref={setScrollBottomRef}
            ></div>
          </ul>
        ) : (
          <EmptyChat />
        )}
      </section>
      <ChatInput chatId={chatId} setMessages={setMessages} />
    </>
  );
}

export default Chat;

const getMessagesFromDoc = (
  docs: QueryDocumentSnapshot<DocumentData>[]
): Message[] => {
  let data: Message[] = [];
  docs.forEach((doc: DocumentData) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};
