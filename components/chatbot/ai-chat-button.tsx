"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ChatbotBox from "./chatbot-box";
import { Bot } from "lucide-react";

type Props = {};

const AiChatButton = (props: Props) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatbotOpen(true)}>
        <Bot size={20} className="mr-2" />
        Note AI
      </Button>
      <ChatbotBox open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </>
  );
};

export default AiChatButton;
