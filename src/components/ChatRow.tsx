import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

type Props = {
  id: string;
};
function ChatRow({ id }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);
  const [messages, loading, error] = useCollection(
    query(
      collection(db, "users", session?.user?.email!, "chats", id, "messages"),
      orderBy("createdAt", "asc")
    )
  );

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname]);

  const removeChat = async () => {
    await deleteDoc(doc(db, "users", session?.user?.email!, "chats", id));
    if (active) router.replace("/");
  };
  return (
    <section className={`chatRow justify-center ${active && "bg-gray-700/50"}`}>
      <Link className="flex flex-1 space-x-5" href={`/chat/${id}`}>
        <ChatBubbleLeftIcon className="h-5 w-5 " />
        <p className="hidden flex-1 truncate md:inline-flex w-40">
          {messages?.docs[messages?.docs.length - 1]?.data().text || "New Chat"}
        </p>
      </Link>
      <button onClick={removeChat} className='ml-3'>
        <TrashIcon className="h-5 w-5  transition-all duration-200 ease-in hover:text-red-500" />
      </button>
    </section>
  );
}

export default ChatRow;
