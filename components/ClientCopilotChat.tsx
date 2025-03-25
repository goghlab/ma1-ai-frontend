"use client";

import React, { useState, useEffect, useRef } from 'react';

interface ClientCopilotChatProps {
  instructions?: string;
  botMessage?: string;
}

interface Message {
  content: string;
  role: string;
  status?: 'loading' | 'error' | 'success';
  timestamp?: Date;
}

export default function ClientCopilotChat({ instructions, botMessage }: ClientCopilotChatProps) {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(
    botMessage ? [{ content: botMessage, role: 'assistant', timestamp: new Date() }] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!userInput.trim() || isLoading) return;
    
    setError(null);
    setIsLoading(true);
    
    // 添加用户消息到列表
    const newUserMessage = { 
      content: userInput, 
      role: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    // 创建临时的"正在思考"消息
    const tempMessage: Message = {
      content: '',
      role: 'assistant',
      status: 'loading',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, tempMessage]);
    const tempMessageIndex = messages.length + 1; // 新用户消息 + 临时消息的索引
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });
      
      if (!response.ok) {
        throw new Error(`服务器返回错误: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 使用实际回复替换临时消息
      setMessages(prevMessages => 
        prevMessages.map((msg, idx) => 
          idx === tempMessageIndex ? { 
            content: data.reply, 
            role: 'assistant', 
            status: 'success',
            timestamp: new Date()
          } : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : '发送消息时出错');
      
      // 将临时消息更改为错误消息
      setMessages(prevMessages => 
        prevMessages.map((msg, idx) => 
          idx === tempMessageIndex ? { 
            content: '抱歉，无法获取响应。请稍后再试。', 
            role: 'assistant', 
            status: 'error',
            timestamp: new Date()
          } : msg
        )
      );
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 格式化时间
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 rounded-md shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* 聊天头部 */}
      <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">AI 助手</h2>
        <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
      </div>
      
      {/* 聊天消息区 */}
      <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-900">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-4">
            <strong className="font-bold">错误:</strong> {error}
          </div>
        )}
        
        {/* 初始提示消息 */}
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
              <p>👋 你好！我是AI助手，有什么可以帮助你的吗？</p>
            </div>
          </div>
        )}
        
        {/* 消息列表 */}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col max-w-[75%]">
                <div className={`flex items-center mb-1 text-xs text-gray-500 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'user' ? '你' : 'AI助手'} {message.timestamp && formatTime(message.timestamp)}
                </div>
                <div 
                  className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white rounded-tr-none' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none'
                  } ${message.status === 'loading' ? 'min-w-[60px]' : ''}`}
                >
                  {message.status === 'loading' ? (
                    <div className="flex space-x-1 justify-center items-center h-5">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  ) : (
                    <div>
                      {message.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < message.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="在此输入消息..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            className={`py-2 px-4 rounded-r-lg ${
              isLoading 
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            } text-white`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                发送中
              </span>
            ) : (
              <span>发送</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}