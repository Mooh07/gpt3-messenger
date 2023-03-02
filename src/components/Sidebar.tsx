"use client";
import { signOut, useSession } from "next-auth/react";
import NewChat from "./NewChat";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import ChatRow from "./ChatRow";
import LoadingSpinner from "./LoadingSpinner";

function Sidebar() {
  const { data: session } = useSession();
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "desc")
      )
  );
  return (
    <section
      className="flex max-h-screen
     max-w-xs flex-col overflow-y-auto bg-[#202123] p-2 md:min-w-[20rem] "
    >
      {/* new chat */}
      <NewChat />
      <nav className="flex flex-1 flex-col space-y-2 p-2">
        {loading && <LoadingSpinner />}
        {chats?.docs.map((chat) => (
          <ChatRow key={chat.id} id={chat.id} />
        ))}
      </nav>
      {session && (
        <div className="sticky -bottom-2 bg-[#202123] p-2 ">
          <img
            onClick={() => signOut()}
            src={session.user?.image!}
            alt="profile picture"
            className="mx-auto mb-2 h-12 w-12 cursor-pointer rounded-full hover:opacity-50"
          />
        </div>
      )}
    </section>
  );
}

export default Sidebar;
