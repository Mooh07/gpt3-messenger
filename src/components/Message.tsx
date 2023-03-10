import { DocumentData } from "firebase/firestore";

type Props = {
  message: Message;
};
function Message({ message }: Props) {
  const messageFromChatGpt = message.user.name === "chatGPT";
  return (
    <section
      className={`py-5 text-white ${messageFromChatGpt && "bg-[#434654]"}`}
    >
      <div className="mx-auto flex max-w-2xl space-x-5 px-10">
        <img src={message.user.avatar} alt="" className="h-8 w-8" />
        <p className="pt-1 text-sm">{message.text}</p>
      </div>
    </section>
  );
}

export default Message;
