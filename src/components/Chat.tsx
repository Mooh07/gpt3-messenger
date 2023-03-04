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
  const [refBottomChatContainer, setScrollBottomRef] = useState<Element | null>(
    null
  );
  const [refTopChatContainer, setTopOfCurrentChatRef] =
    useState<Element | null>(null);

  const [refScrollContainer, setScrollContainer] = useState<Element | null>(
    null
  );
  const [refFirstMessageInOurList, setFirstMessageInOurList] =
    useState<DocumentData | null>(null);

  const [loading, setIsLoading] = useState<boolean>(true);
  const [nextPageLoading, setNextPageLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [totalChatMessages, setTotalChatMessages] = useState<number>(0);

  // scroll container: height before pulling next page, and position of scroll right when we start pulling
  const [previousScrollHeight, setPreviousScrollHeight] = useState<number>(0);
  const [previousScrollPosition, setPreviousScrollPosition] =
    useState<number>(0);

  const { data: session } = useSession();

  useEffect(() => {
    const scrollToBottomOfChatContainerOnMount = () => {
      refBottomChatContainer?.scrollIntoView();
    };
    scrollToBottomOfChatContainerOnMount();
  }, [refBottomChatContainer]);
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
      setMessages(getMessagesFromDocs(data.docs));
      setFirstMessageInOurList(data.docs[data.docs.length - 1]);
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  useEffect(() => {
    if (!refTopChatContainer) return;
    const fetchNextPage = async () => {
      setPreviousScrollHeight(refScrollContainer?.scrollHeight!);
      setPreviousScrollPosition(refScrollContainer?.scrollTop!);
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
          startAfter(refFirstMessageInOurList)
        )
      );
      setMessages([...messages, ...getMessagesFromDocs(data.docs)]);
      const lastMessageWePulled = data.docs[data.docs.length - 1];
      setFirstMessageInOurList(lastMessageWePulled);
      setNextPageLoading(false);
    };
    // watch scrolling to top of chat container to pull next page
    const observer = new IntersectionObserver(([entry]) => {
      const pulledAllMessages = messages.length >= totalChatMessages;
      if (!pulledAllMessages && entry.isIntersecting) {
        fetchNextPage();
      }
    });

    observer.observe(refTopChatContainer);
    return () => observer.unobserve(refTopChatContainer);
  }, [refTopChatContainer]);
  useEffect(() => {
    if (!refScrollContainer) return;
    const previousScrollPositionBeforeFetchingNextPage =
      refScrollContainer.scrollHeight -
      previousScrollHeight +
      previousScrollPosition;

    refScrollContainer.scrollTo({
      left: 0,
      top: previousScrollPositionBeforeFetchingNextPage,
    });
  }, [messages]);

  if (loading)
    return (
      <section className="flex-1">
        <LoadingSpinner />
      </section>
    );
  const reversedMessages = [...messages].reverse();
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

const getMessagesFromDocs = (
  docs: QueryDocumentSnapshot<DocumentData>[]
): Message[] => {
  let data: Message[] = [];
  docs.forEach((doc: DocumentData) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};
