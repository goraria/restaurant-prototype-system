import { MessageApp } from "@/components/elements/message"

export default function Message() {
  return (
    <div className="flex h-full flex-col">
      <main className="flex-grow p-0">
        <MessageApp />
      </main>
    </div>
  );
}