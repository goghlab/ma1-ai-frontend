"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import React from 'react';

interface ClientCopilotChatProps {
  instructions?: string;
  botMessage?: string;
}

export default function ClientCopilotChat({ instructions, botMessage }: ClientCopilotChatProps) {
  // 使用环境变量中的API密钥，或者在代码中直接使用
  const apiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY || "ck_pub_4ecb04ac2a37c735196d99b608b31919";
  
  return (
    <div className="flex-1 h-full w-full flex">
      <div className="w-full h-full">
        <CopilotKit publicApiKey={apiKey}>
          <CopilotChat 
            className="h-full w-full"
          />
        </CopilotKit>
      </div>
      
      {/* 覆盖CopilotKit样式的CSS - 只保留必要的部分 */}
      <style jsx global>{`
        /* 隐藏开发控制台元素 */
        .copilot-chat-debug-panel,
        .copilot-chat-header-debug-button,
        .copilot-version-label,
        .copilot-chat-header-help-button {
          display: none !important;
        }
        
        /* 确保深色主题 */
        .copilot-chat {
          background-color: #000000 !important;
          color: #e5e7eb !important;
          border-color: #374151 !important;
        }
        
        .copilot-chat-header-title {
          color: white !important;
        }
        
        .copilot-chat-header-title::before {
          content: "MA-1 ";
        }
        
        .copilot-chat-header {
          background-color: #111827 !important;
          border-bottom: 1px solid #1f2937 !important;
        }
        
        .copilot-chat-messages-container {
          background-color: #000000 !important;
        }
        
        .copilot-chat-message-user {
          background-color: #1e3a8a !important;
          color: white !important;
        }
        
        .copilot-chat-message-assistant {
          background-color: #111827 !important;
          color: #e5e7eb !important;
          border: 1px solid #1f2937 !important;
        }
        
        .copilot-chat-input-container {
          background-color: #111111 !important;
          border-top: 1px solid #1f2937 !important;
        }
        
        .copilot-chat-input {
          background-color: #1f2937 !important;
          color: white !important;
          border: 1px solid #374151 !important;
        }
        
        .copilot-chat-send-button {
          background-color: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
}