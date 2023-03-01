import Chat from "@component/components/Chat";
import ChatInput from "@component/components/ChatInput";
type Props = {
  params: { chatId: string };
};
function ChatPage({ params: { chatId } }: Props) {
  return (
    <section className="flex h-screen flex-col overflow-hidden">
      <Chat chatId={chatId} />
      <ChatInput chatId={chatId} />
    </section>
  );
}

export default ChatPage;
