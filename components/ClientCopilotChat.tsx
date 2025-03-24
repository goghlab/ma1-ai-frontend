"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

interface ClientCopilotChatProps {
  instructions?: string;
  placeholder?: string;
  onResponse?: (response: any) => void;
  onRequest?: (request: any) => void;
  botMessage?: string;
}

export default function ClientCopilotChat({ instructions, placeholder, onResponse, onRequest, botMessage }: ClientCopilotChatProps) {
  return (
    <CopilotChat
      instructions={instructions}
      placeholder={placeholder}
      onResponse={onResponse}
      onRequest={onRequest}
      botMessage={botMessage}
    />
  );
} 