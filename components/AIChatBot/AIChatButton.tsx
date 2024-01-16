import React, { useState } from "react";
import { Button } from "../ui/button";
import ChatbotBox from "./ChatbotBox";
import { Bot } from "lucide-react";

type Props = {};

const AIChatButton = (props: Props) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatbotOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>
      <ChatbotBox open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </>
  );
};

export default AIChatButton;
