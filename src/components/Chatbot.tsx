
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, User } from "lucide-react";
import { useUser } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! Ask me anything about colleges or general queries.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: content }]);
    setLoading(true);
    setInput("");

    try {
      // Call your backend API (replace with real endpoint)
      const res = await fetch("/api/answer-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you want, you can add user id: user?.id
        },
        body: JSON.stringify({ query: content }),
      });
      if (!res.ok) throw new Error("No response from bot.");
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.answer || "Sorry, I couldn't find an answer." },
      ]);
    } catch (e: any) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "There was an error processing your request." },
      ]);
      toast({
        title: "Error",
        description: e.message || "Message failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-80">
        <MessageCircle className="mb-2 text-orange-500" size={40} />
        <div className="text-lg mb-2 font-medium">Sign in to chat with the bot</div>
        <a
          href="/auth"
          className="mt-2 px-4 py-2 bg-orange-400 text-white rounded shadow hover:bg-orange-500 transition"
        >
          Sign in
        </a>
        <p className="mt-4 text-sm text-gray-500">Chatting is available only for signed-in users.</p>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto w-full shadow-md">
      <CardContent className="p-4">
        <div className="h-80 overflow-y-auto mb-4 bg-gray-50 rounded flex flex-col gap-4 px-2 py-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.sender === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={
                  (msg.sender === "user"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200 text-gray-800") +
                  " px-3 py-2 rounded-lg shadow-md max-w-xs flex items-center gap-2"
                }
              >
                {msg.sender === "user" && <User size={18} />}
                {msg.sender === "bot" && <MessageCircle size={18} />}
                <span className="break-words">{msg.text}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>
        <form
          className="flex gap-2"
          onSubmit={handleSend}
          autoComplete="off"
          spellCheck={false}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your college or FAQ question..."
            className="flex-1"
            disabled={loading}
            minLength={1}
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex gap-1"
          >
            <Send size={18} /> {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
