import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { PreviewMessage, ThinkingMessage } from "./message";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { API_URL } from "@/functions/networkFunctions";

interface ChatProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export function Chat({ onClick }: ChatProps) {
  const chatId = "001";

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
  } = useChat({
    // maxSteps: 4,
    api: `${API_URL}/api/ai/chat`,
    streamProtocol: "text",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    onError: (error) => {
      if (error.message.includes("Too many requests")) {
        toast.error(
          "You are sending too many messages. Please try again later."
        );
      }
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-col min-w-0 max-h-[calc(100dvh-130px)] bg-background fixed bottom-6 right-6 z-50 rounded-3xl max-w-[550px] border-4">
      <div className="flex w-full flex-row-reverse pr-2 pt-2">
        <X
          onClick={(e) => {
            setInput("");
            if (onClick) onClick(e);
          }}
          className="cursor-pointer"
          color="#8d5e02"
          size={25}
        />
      </div>
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll no-scrollbar pt-4"
      >
        {messages.length === 0 && <Overview />}

        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            isLoading={isLoading && messages.length - 1 === index}
          />
        ))}

        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && <ThinkingMessage />}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl rounded-3xl">
        <MultimodalInput
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
      </form>
    </div>
  );
}
