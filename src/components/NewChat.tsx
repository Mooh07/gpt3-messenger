import { PlusIcon } from "@heroicons/react/24/outline";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function NewChat() {
  const router = useRouter();
  const { data: session } = useSession();
  const createNewChat = async () => {
    const doc = await addDoc(
      collection(db, "users", session?.user?.email!, "chats"),
      {
        messages: [],
        userId: session?.user?.email,
        createdAt: serverTimestamp(),
      }
    );
    router.push(`/chat/${doc.id}`);
  };
  return (
    <button
      onClick={createNewChat}
      className="chatRow flex w-full items-center
     justify-center border border-gray-700"
    >
      <PlusIcon className="h-4 w-4" />
      <p>New chat</p>
    </button>
  );
}

export default NewChat;
