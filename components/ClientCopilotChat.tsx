"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import React, { lazy, Suspense, memo, useState, useEffect } from 'react';

// 懒加载组件
const LazyChat = lazy(() => import("@copilotkit/react-ui").then(module => ({ default: module.CopilotChat })));

// 加载指示器组件
const LoadingIndicator = () => (
  <div className="h-full w-full flex items-center justify-center bg-black text-white">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-300">正在加载 MA-1 AI...</p>
    </div>
  </div>
);

interface ClientCopilotChatProps {
  instructions?: string;
  botMessage?: string;
}

// 使用memo记忆组件，减少不必要的重渲染
const ClientCopilotChat = memo(function ClientCopilotChat({ instructions, botMessage }: ClientCopilotChatProps) {
  // 使用环境变量中的API密钥，或者在代码中直接使用
  const apiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY || "ck_pub_4ecb04ac2a37c735196d99b608b31919";
  
  // 添加页面载入状态
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 模拟延迟加载以减少首屏渲染时间
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex-1 h-full w-full flex flex-col bg-black">
      <div className="w-full h-full bg-black border border-gray-800 rounded-md overflow-hidden">
        <CopilotKit publicApiKey={apiKey}>
          {isLoaded ? (
            <Suspense fallback={<LoadingIndicator />}>
              <LazyChat className="h-full w-full" />
            </Suspense>
          ) : (
            <LoadingIndicator />
          )}
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
          will-change: transform; /* 性能优化: 使用GPU加速 */
          transform: translateZ(0); /* 性能优化: 强制GPU渲染 */
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
        
        /* 移动设备响应式设计 */
        @media (max-width: 768px) {
          /* 确保聊天区域显示在顶部 */
          .copilot-chat {
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
          }
          
          /* 调整消息容器高度，确保占据足够空间 */
          .copilot-chat-messages-container {
            flex: 1 !important;
            height: auto !important;
            max-height: 60vh !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important; /* 性能优化: 流畅滚动 */
          }
          
          /* 工作面板（如有）显示在下方 */
          .copilot-chat-panel {
            order: 2 !important;
            margin-top: auto !important;
          }
          
          /* 输入区域固定在底部 */
          .copilot-chat-input-container {
            order: 3 !important;
            position: sticky !important;
            bottom: 0 !important;
            width: 100% !important;
            z-index: 10 !important;
          }
          
          /* 优化消息气泡在移动设备上的显示 */
          .copilot-chat-message-user,
          .copilot-chat-message-assistant {
            max-width: 90% !important;
            contain: content !important; /* 性能优化: 隔离布局影响 */
          }
          
          /* 头部标题调整 */
          .copilot-chat-header {
            padding: 12px !important;
          }
          
          .copilot-chat-header-title {
            font-size: 16px !important;
          }
        }
        
        /* 小屏幕设备的进一步优化 */
        @media (max-width: 480px) {
          .copilot-chat-messages-container {
            padding: 10px !important;
          }
          
          .copilot-chat-message-user,
          .copilot-chat-message-assistant {
            padding: 10px !important;
            margin: 6px 0 !important;
          }
          
          .copilot-chat-input-container {
            padding: 8px 10px !important;
          }
          
          .copilot-chat-input {
            padding: 8px !important;
          }
        }
        
        /* 添加动画优化 */
        @media (prefers-reduced-motion: no-preference) {
          .copilot-chat-message-user,
          .copilot-chat-message-assistant {
            animation: fadeIn 0.3s ease-out;
            opacity: 0;
            animation-fill-mode: forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }

        /* 兼容性支持 */
        @supports not (backdrop-filter: blur(10px)) {
          .copilot-chat-header {
            background-color: rgba(0, 0, 0, 0.95) !important;
          }
        }
      `}</style>
    </div>
  );
});

export default ClientCopilotChat;