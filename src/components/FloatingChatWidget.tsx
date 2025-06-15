
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Chatbot from "./Chatbot";

export default function FloatingChatWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Chat Window */}
      {isExpanded && (
        <div className="mb-4 bg-white rounded-lg shadow-2xl border border-gray-200 animate-scale-in">
          <div className="flex items-center justify-between p-3 bg-orange-500 text-white rounded-t-lg">
            <h3 className="font-medium">College Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="text-white hover:bg-orange-600 h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
          <div className="w-80 sm:w-96">
            <Chatbot />
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        className={`h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all duration-200 ${
          isExpanded ? "scale-0" : "scale-100"
        }`}
        size="icon"
      >
        <MessageCircle size={24} />
      </Button>
    </div>
  );
}
