
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Use the custom hook for session (returns { sessionId, deviceType })
  const { sessionId } = useSession();

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
      console.log("Sending query to answer-query function:", content);
      
      const { data, error } = await supabase.functions.invoke('answer-query', {
        body: { 
          query: content,
          sessionId: sessionId 
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "No response from bot.");
      }

      const response = data?.answer || "Sorry, I couldn't find an answer.";
      console.log("Received response:", response);
      
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: response },
      ]);
    } catch (e: any) {
      console.error("Error calling chatbot:", e);
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "There was an error processing your request. Please try again." },
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

  // Since this project doesn't have user authentication, allow all users to chat
  // If you want to restrict access, you'll need to implement proper authentication
  const isAuthenticated = !!sessionId; // Anyone with a session can chat

  if (!isAuthenticated) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-40">
        <MessageCircle className="mb-2 text-orange-500" size={32} />
        <div className="text-sm mb-2 font-medium">Loading session...</div>
        <p className="text-xs text-gray-500 text-center">Please wait while we initialize your session.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="h-64 overflow-y-auto mb-4 bg-gray-50 rounded flex flex-col gap-3 px-3 py-3">
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
                " px-3 py-2 rounded-lg shadow-sm max-w-[240px] flex items-start gap-2 text-sm"
              }
            >
              {msg.sender === "user" && <User size={14} className="mt-0.5" />}
              {msg.sender === "bot" && <MessageCircle size={14} className="mt-0.5" />}
              <span className="break-words">{msg.text}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg shadow-sm max-w-[240px] flex items-start gap-2 text-sm">
              <MessageCircle size={14} className="mt-0.5" />
              <span className="break-words">Thinking...</span>
            </div>
          </div>
        )}
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
          placeholder="Ask about colleges..."
          className="flex-1 text-sm"
          disabled={loading}
          minLength={1}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3"
          size="sm"
        >
          <Send size={14} />
        </Button>
      </form>
    </div>
  );
}
