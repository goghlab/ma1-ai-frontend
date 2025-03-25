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
    <div className="flex-1 h-full w-full flex bg-black">
      <div className="w-full h-full bg-black border border-gray-800 rounded-md overflow-hidden">
        <CopilotKit publicApiKey={apiKey}>
          <CopilotChat 
            className="h-full w-full"
          />
        </CopilotKit>
      </div>
      
      {/* 覆盖CopilotKit样式的CSS - 强化深色主题 */}
      <style jsx global>{`
        /* 隐藏开发控制台元素 */
        .copilot-chat-debug-panel,
        .copilot-chat-header-debug-button,
        .copilot-version-label,
        .copilot-chat-header-help-button {
          display: none !important;
        }
        
        /* 全局背景设为黑色 */
        body {
          background-color: #000000;
        }
        
        /* 主容器深色主题 */
        .copilot-chat {
          background-color: #000000 !important;
          color: #e5e7eb !important;
          border-color: #1f2937 !important;
          border-radius: 8px !important;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) !important;
        }
        
        /* 头部标题和背景 */
        .copilot-chat-header-title {
          color: #e5e7eb !important;
          font-weight: 600 !important;
        }
        
        .copilot-chat-header-title::before {
          content: "MA-1 ";
        }
        
        .copilot-chat-header {
          background-color: #0c0c0c !important;
          border-bottom: 1px solid #1f2937 !important;
          padding: 16px !important;
        }
        
        /* 消息容器 */
        .copilot-chat-messages-container {
          background-color: #000000 !important;
          padding: 16px !important;
        }
        
        /* 用户消息气泡 */
        .copilot-chat-message-user {
          background-color: #1e3a8a !important;
          color: #ffffff !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          max-width: 85% !important;
          margin: 8px 0 !important;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* 助手消息气泡 */
        .copilot-chat-message-assistant {
          background-color: #111827 !important;
          color: #e5e7eb !important;
          border: 1px solid #1f2937 !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          max-width: 85% !important;
          margin: 8px 0 !important;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* 预格式化文本（代码块） */
        .copilot-chat-message-assistant pre,
        .copilot-chat-message-assistant code {
          background-color: #1e1e1e !important;
          border: 1px solid #2d3748 !important;
          color: #e2e8f0 !important;
        }
        
        /* 输入区域容器 */
        .copilot-chat-input-container {
          background-color: #0c0c0c !important;
          border-top: 1px solid #1f2937 !important;
          padding: 12px 16px !important;
        }
        
        /* 输入框 */
        .copilot-chat-input {
          background-color: #111827 !important;
          color: #ffffff !important;
          border: 1px solid #374151 !important;
          border-radius: 8px !important;
          padding: 12px !important;
        }
        
        .copilot-chat-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
        }
        
        /* 发送按钮 */
        .copilot-chat-send-button {
          background-color: #3b82f6 !important;
          border-radius: 8px !important;
          margin-left: 8px !important;
          padding: 8px 12px !important;
        }
        
        .copilot-chat-send-button:hover {
          background-color: #2563eb !important;
        }
        
        /* 滚动条样式 */
        .copilot-chat-messages-container::-webkit-scrollbar {
          width: 6px !important;
        }
        
        .copilot-chat-messages-container::-webkit-scrollbar-track {
          background: #000000 !important;
        }
        
        .copilot-chat-messages-container::-webkit-scrollbar-thumb {
          background-color: #4b5563 !important;
          border-radius: 6px !important;
        }
        
        /* 标签和状态文本 */
        .copilot-chat-status {
          color: #9ca3af !important;
        }
        
        /* 链接样式 */
        .copilot-chat a {
          color: #3b82f6 !important;
          text-decoration: none !important;
        }
        
        .copilot-chat a:hover {
          text-decoration: underline !important;
        }
        
        /* 按钮样式 */
        .copilot-chat button {
          background-color: #1f2937 !important;
          color: #e5e7eb !important;
          border-radius: 6px !important;
        }
        
        .copilot-chat button:hover {
          background-color: #374151 !important;
        }
      `}</style>
    </div>
  );
}