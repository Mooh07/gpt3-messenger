import { Inter } from "next/font/google";

import EmptyChat from "@component/components/EmptyChat";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <section className="flex flex-col">
      <EmptyChat />
    </section>
  );
}
