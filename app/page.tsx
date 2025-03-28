"use client"
import { useState, useEffect } from "react"
import type React from "react"
import dynamic from "next/dynamic"

import { CopilotKit } from "@copilotkit/react-core"
import {
  MessageSquare,
  Calendar,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  ImageIcon,
  Upload,
  ChevronDown,
  ChevronRight,
  Edit,
  Clock,
} from "lucide-react"

// 动态导入 ClientCopilotChat 组件，并禁用 SSR
const ClientCopilotChat = dynamic(() => import("../components/ClientCopilotChat"), {
  ssr: false,
})

// Define campaign type
type Campaign = {
  id: string
  title: string
  platforms: string[]
  content: string
  targetAudience?: string
  scheduledDate?: string
  createdAt: string
  images?: { [key: string]: string } // Store image URLs by post index
}

// Parse posts from content
type Post = {
  imageDescription: string | null
  content: string
}

// Dummy campaign data
const dummyCampaign: Campaign = {
  id: "camp_insta123",
  title: "Summer Coffee Collection Launch",
  platforms: ["Instagram"],
  content: `Post 1: [Image: Iced coffee with condensation on glass against a bright summer background]\n\n🌞 Introducing our NEW Summer Coffee Collection! ☀️\n\nBeat the heat with our refreshing cold brew infusions, crafted to perfection and designed to keep you cool.\n\n#MorningBlissCoffee #SummerVibes #ColdBrew\n\n---\n\nPost 2: [Image: Person enjoying coffee on a patio with friends]\n\nShare the joy of summer with our limited edition flavors. Tag a friend you'd love to enjoy a Morning Bliss moment with!\n\n👉 Available in-store and online starting this Monday.\n\n#CoffeeLovers #SummerCollection #MorningRitual`,
  targetAudience: "Coffee enthusiasts, 25-35 year olds, urban professionals",
  scheduledDate: "2025-06-15",
  createdAt: "2025-06-01T10:30:00Z",
  images: {}, // No images uploaded yet
}

export default function Home() {
  // State for storing campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // 检测窗口大小变化
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    // 初始检查
    checkIsMobile()
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkIsMobile)
    
    // 清理监听器
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // 设置移动设备的viewport
  useEffect(() => {
    // 移动设备优化：禁止用户缩放以避免缩放导致的布局问题
    const meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  // Load dummy campaign on initial render
  useEffect(() => {
    setCampaigns([dummyCampaign])
  }, [])

  // Function to handle new campaigns from the chat
  const handleChatResponse = (response: any) => {
    setIsLoading(false)
    // Check if the response contains campaign data
    if (response && response.campaignId) {
      const newCampaign: Campaign = {
        id: response.campaignId,
        title: response.details.title,
        platforms: response.details.platforms,
        content: response.details.content,
        targetAudience: response.details.targetAudience,
        scheduledDate: response.details.scheduledDate,
        createdAt: response.details.createdAt || new Date().toISOString(),
        images: {},
      }

      setCampaigns((prev) => [newCampaign, ...prev])
      setExpandedCampaignId(newCampaign.id)
    }
  }

  // Function to handle image upload
  const handleImageUpload = (campaignId: string, postIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return

    const file = event.target.files[0]
    const imageUrl = URL.createObjectURL(file)

    // Update the campaign with the new image
    setCampaigns((prev) =>
      prev.map((camp) =>
        camp.id === campaignId
          ? {
              ...camp,
              images: {
                ...(camp.images || {}),
                [postIndex.toString()]: imageUrl,
              },
            }
          : camp,
      ),
    )
  }

  // Function to toggle campaign expansion
  const toggleCampaignExpansion = (campaignId: string) => {
    setExpandedCampaignId((prev) => (prev === campaignId ? null : campaignId))
    setIsEditing(false) // Reset editing state when toggling
  }

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  // Function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter size={16} />
      case "instagram":
        return <Instagram size={16} />
      case "facebook":
        return <Facebook size={16} />
      case "linkedin":
        return <Linkedin size={16} />
      default:
        return <MessageSquare size={16} />
    }
  }

  // Function to extract image description from post content
  const getImageDescription = (postContent: string): string | null => {
    const match = postContent.match(/\[Image:(.*?)\]/i)
    return match ? match[1].trim() : null
  }

  // Function to clean post content by removing image placeholders
  const cleanPostContent = (postContent: string): string => {
    return postContent.replace(/\[Image:(.*?)\]/i, "").trim()
  }

  // Function to parse posts from campaign content
  const parsePosts = (content: string): Post[] => {
    return content.split("---").map((postContent) => {
      const imageDescription = getImageDescription(postContent)
      const cleanedContent = cleanPostContent(postContent)

      return {
        imageDescription,
        content: cleanedContent,
      }
    })
  }

  return (
    <>
      <style jsx global>{`
        /* 移动设备响应式样式 */
        @media (max-width: 768px) {
          body {
            overflow: hidden;
            padding-top: 0px; /* 移除上边距，因为我们使用JS控制main边距 */
          }
          
          header {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 1000 !important;
            padding: 0.75rem 1rem !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
            background-color: #000000 !important; /* 黑色背景 */
            color: #ffffff !important; /* 白色文字 */
          }
          
          .copilot-chat {
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          
          .copilot-chat-header {
            flex-shrink: 0 !important;
          }
          
          .copilot-chat-messages-container {
            max-height: none !important; /* 移除最大高度限制 */
            height: calc(65vh - 140px) !important; /* 聊天区域高度：70vh减去头部和输入框 */
            overflow-y: scroll !important; /* 强制显示滚动条 */
            flex: 1 !important;
            -webkit-overflow-scrolling: touch !important;
            contain: content !important; /* 优化滚动性能 */
            will-change: transform !important; /* 硬件加速 */
            overscroll-behavior: contain !important; /* 防止过度滚动 */
            padding-bottom: 8px !important; /* 底部填充 */
          }
          
          .copilot-chat-input-container {
            padding: 8px !important;
            position: relative !important;
            bottom: 0 !important;
            width: 100% !important;
            flex-shrink: 0 !important;
            background-color: #000000 !important; /* 确保输入框有背景色 */
            z-index: 2 !important; /* 确保在消息上方 */
          }
          
          .copilot-chat-input {
            max-height: 80px !important;
            overflow-y: auto !important;
          }
          
          /* 改善聊天气泡在移动设备上的尺寸 */
          .copilot-chat-message-user,
          .copilot-chat-message-assistant {
            max-width: 90% !important;
            padding: 10px 12px !important;
            margin: 4px 0 !important;
          }
          
          /* 优化页脚在移动设备上的显示 */
          footer {
            padding: 0.5rem !important;
          }
        }
      `}</style>
      
      <div style={{
        ...styles.container,
        paddingTop: isMobile ? '60px' : '0' // 为固定标题栏腾出空间
      }}>
        <header style={{
          ...styles.header,
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          right: isMobile ? 0 : 'auto',
          zIndex: isMobile ? 1000 : 'auto',
          backgroundColor: '#000000', // 黑色背景
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem 1rem',
        }}>
          <div style={{
            height: '28px',
            width: '28px',
            marginRight: '8px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              height: '24px',
              width: '24px',
              overflow: 'hidden',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #d4d4d8 0%, #71717a 100%)'
              }}></div>
            </div>
          </div>
          <span style={{
            fontSize: '1.125rem',
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            position: 'relative',
            zIndex: 10,
            color: '#d4d4d8',
            textTransform: 'uppercase',
            fontWeight: 300
          }}>
            MA-1
          </span>
        </header>

        <main style={{
          ...styles.main,
          flexDirection: isMobile ? 'column' : 'row',
          height: isMobile ? 'calc(100vh - 60px)' : 'calc(100vh - 120px)',
          marginTop: isMobile ? '0' : '0'
        }}>
          {/* Chat interface */}
          <div style={{
            ...styles.chatColumn,
            width: isMobile ? '100%' : '40%',
            borderRight: isMobile ? 'none' : '1px solid #eaeaea',
            borderBottom: isMobile ? '1px solid #eaeaea' : 'none',
            height: isMobile ? 'calc(70vh - 60px)' : 'auto',
            minHeight: isMobile ? '350px' : 'auto',
            overflow: 'hidden', // 隐藏外层溢出
            position: 'relative' // 添加相对定位
          }}>
            {isLoading && (
              <div style={styles.loadingOverlay}>
                <p>Generating campaign...</p>
              </div>
            )}
            {error && (
              <div style={styles.errorMessage}>
                <p>{error}</p>
                <button onClick={() => setError(null)} style={styles.errorDismissButton}>
                  Dismiss
                </button>
              </div>
            )}
            <CopilotKit runtimeUrl="http://localhost:3001/api">
              <div style={{
                ...styles.chatContainer,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden' // 容器不滚动，内部元素滚动
              }}>
                <ClientCopilotChat
                  instructions="Send campaign requests to /api/campaign. For general chat, use /api/chat."
                />
              </div>
            </CopilotKit>
          </div>

          {/* Workspace for campaigns */}
          <div style={{
            ...styles.workspaceColumn,
            width: isMobile ? '100%' : '60%',
            height: isMobile ? 'calc(30vh)' : 'auto',
            overflow: 'auto'
          }}>
            <div style={styles.workspaceHeader}>
              <h2 style={styles.workspaceTitle}>Campaigns</h2>
            </div>

            <div style={styles.workspaceContent}>
              {campaigns.length === 0 ? (
                <div style={styles.emptyState}>
                  <MessageSquare size={48} color="#ccc" />
                  <p style={styles.emptyStateText}>No campaigns yet. Start a conversation to create one!</p>
                </div>
              ) : (
                <div style={styles.campaignsList}>
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} style={styles.campaignPanel}>
                      {/* Campaign header - always visible */}
                      <div style={styles.campaignHeader} onClick={() => toggleCampaignExpansion(campaign.id)}>
                        <div style={styles.campaignHeaderLeft}>
                          {expandedCampaignId === campaign.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          <h3 style={styles.campaignTitle}>{campaign.title}</h3>
                        </div>
                        <div style={styles.campaignHeaderRight}>
                          <div style={styles.platformIcons}>
                            {campaign.platforms.map((platform) => (
                              <span key={platform} style={styles.platformIcon}>
                                {getPlatformIcon(platform)}
                              </span>
                            ))}
                          </div>
                          {campaign.scheduledDate && (
                            <span style={styles.scheduledBadge}>
                              <Clock size={14} />
                              <span style={styles.scheduledText}>Scheduled</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Campaign details - visible when expanded */}
                      {expandedCampaignId === campaign.id && (
                        <div style={styles.campaignDetails}>
                          <div style={styles.campaignActions}>
                            <button style={styles.editButton} onClick={toggleEditMode}>
                              <Edit size={14} />
                              {isEditing ? "Save Changes" : "Edit Campaign"}
                            </button>
                          </div>

                          <div style={styles.campaignMetadata}>
                            <div style={styles.metadataItem}>
                              <span style={styles.metadataLabel}>Platforms:</span>
                              <div style={styles.platformsContainer}>
                                {campaign.platforms.map((platform) => (
                                  <span key={platform} style={styles.platformBadge}>
                                    {getPlatformIcon(platform)}
                                    <span style={styles.platformName}>{platform}</span>
                                  </span>
                                ))}
                              </div>
                            </div>

                            {campaign.targetAudience && (
                              <div style={styles.metadataItem}>
                                <span style={styles.metadataLabel}>Target Audience:</span>
                                <span>{campaign.targetAudience}</span>
                              </div>
                            )}

                            {campaign.scheduledDate && campaign.scheduledDate !== "Not scheduled" && (
                              <div style={styles.metadataItem}>
                                <span style={styles.metadataLabel}>Scheduled Date:</span>
                                <span style={styles.scheduledDate}>
                                  <Calendar size={14} />
                                  {campaign.scheduledDate}
                                </span>
                              </div>
                            )}
                          </div>

                          <div style={styles.contentSection}>
                            <h3 style={styles.contentTitle}>Campaign Content</h3>

                            {parsePosts(campaign.content).map((post, index) => (
                              <div
                                key={index}
                                style={index > 0 ? { ...styles.post, ...styles.postDivider } : styles.post}
                              >
                                <div style={styles.postHeader}>
                                  <span style={styles.postNumber}>Post {index + 1}</span>
                                </div>

                                {/* Image upload area */}
                                {post.imageDescription && (
                                  <div style={styles.imageUploadContainer}>
                                    {campaign.images && campaign.images[index.toString()] ? (
                                      <div style={styles.imagePreviewContainer}>
                                        <img
                                          src={campaign.images[index.toString()] || "/placeholder.svg"}
                                          alt={post.imageDescription}
                                          style={styles.imagePreview}
                                        />
                                        {isEditing && (
                                          <label
                                            htmlFor={`image-upload-${campaign.id}-${index}`}
                                            style={styles.changeImageButton}
                                          >
                                            Change Image
                                          </label>
                                        )}
                                      </div>
                                    ) : (
                                      <label
                                        htmlFor={`image-upload-${campaign.id}-${index}`}
                                        style={{
                                          ...styles.imageUploadArea,
                                          ...(isEditing ? {} : styles.disabledUpload),
                                        }}
                                      >
                                        <div style={styles.imageUploadContent}>
                                          <ImageIcon size={32} color="#999" />
                                          <p style={styles.imageUploadText}>Upload image</p>
                                          <p style={styles.imageDescription}>{post.imageDescription}</p>
                                          {isEditing && (
                                            <div style={styles.uploadButtonContainer}>
                                              <span style={styles.uploadButton}>
                                                <Upload size={14} />
                                                Select Image
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </label>
                                    )}
                                    {isEditing && (
                                      <input
                                        id={`image-upload-${campaign.id}-${index}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(campaign.id, index, e)}
                                        style={styles.hiddenInput}
                                        disabled={!isEditing}
                                      />
                                    )}
                                  </div>
                                )}

                                {/* Post content */}
                                <div style={styles.postContent}>{post.content}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <footer style={{
          ...styles.footer,
          backgroundColor: '#000000',
          borderTop: '1px solid #222222',
          padding: '0.75rem',
        }}>
          <p style={{
            ...styles.footerText,
            color: '#888888',
            fontSize: '0.75rem',
          }}>Powered by goghlab</p>
        </footer>
      </div>
    </>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    padding: "1rem",
    textAlign: "center" as const,
    borderBottom: "1px solid #eaeaea",
    backgroundColor: "white",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "row" as const,
    height: "calc(100vh - 120px)", // Adjust based on header and footer height
  },
  // Left column - Chat
  chatColumn: {
    width: "40%",
    padding: "1rem",
    borderRight: "1px solid #eaeaea",
    display: "flex",
    flexDirection: "column" as const,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  chat: {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
  },
  // Right column - Workspace
  workspaceColumn: {
    width: "60%",
    display: "flex",
    flexDirection: "column" as const,
    "@media (max-width: 768px)": {
      width: "100%",
      height: "50vh", // 在移动设备上占据页面高度的一半
    }
  },
  workspaceHeader: {
    padding: "1rem",
    borderBottom: "1px solid #eaeaea",
    backgroundColor: "white",
  },
  workspaceTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  workspaceContent: {
    flex: 1,
    padding: "1rem",
    overflow: "auto",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center" as const,
  },
  emptyStateText: {
    marginTop: "1rem",
    color: "#666",
    fontSize: "1rem",
  },
  // Campaign list and panels
  campaignsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  campaignPanel: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  campaignHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "white",
    borderBottom: "1px solid #eaeaea",
    cursor: "pointer",
  },
  campaignHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  campaignHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  campaignTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  platformIcons: {
    display: "flex",
    gap: "0.5rem",
  },
  platformIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
  },
  scheduledBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    backgroundColor: "#e6f7ff",
    color: "#0070f3",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.8rem",
  },
  scheduledText: {
    fontSize: "0.8rem",
  },
  // Campaign details
  campaignDetails: {
    padding: "1rem",
    backgroundColor: "#f9f9f9",
  },
  campaignActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1rem",
  },
  campaignMetadata: {
    marginBottom: "1.5rem",
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #eaeaea",
  },
  metadataItem: {
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
  },
  metadataLabel: {
    fontWeight: "bold",
    marginRight: "0.5rem",
    color: "#666",
    width: "120px",
  },
  platformsContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  },
  platformBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    padding: "0.25rem 0.5rem",
    fontSize: "0.8rem",
  },
  platformName: {
    marginLeft: "0.25rem",
  },
  scheduledDate: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  contentSection: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #eaeaea",
  },
  contentTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "1rem",
  },
  post: {
    padding: "0.5rem 0",
  },
  postDivider: {
    borderTop: "1px dashed #ddd",
    marginTop: "1rem",
    paddingTop: "1rem",
  },
  postHeader: {
    marginBottom: "0.5rem",
  },
  postNumber: {
    fontWeight: "bold",
    color: "#666",
    fontSize: "0.9rem",
  },
  postContent: {
    marginTop: "1rem",
    whiteSpace: "pre-wrap" as const,
    fontSize: "0.9rem",
    lineHeight: "1.5",
  },
  // Image upload styling
  imageUploadContainer: {
    marginBottom: "1rem",
  },
  imageUploadArea: {
    display: "block",
    width: "100%",
    height: "200px",
    border: "2px dashed #ccc",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  disabledUpload: {
    cursor: "default",
    opacity: 0.8,
  },
  imageUploadContent: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "1rem",
    textAlign: "center" as const,
  },
  imageUploadText: {
    margin: "0.5rem 0",
    fontWeight: "bold",
    color: "#666",
  },
  imageDescription: {
    margin: "0.5rem 0",
    color: "#999",
    fontSize: "0.85rem",
    fontStyle: "italic",
  },
  uploadButtonContainer: {
    marginTop: "1rem",
  },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  hiddenInput: {
    display: "none",
  },
  imagePreviewContainer: {
    position: "relative" as const,
    width: "100%",
    height: "200px",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "1rem",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  changeImageButton: {
    position: "absolute" as const,
    bottom: "10px",
    right: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  editButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontWeight: "500",
  },
  footer: {
    padding: "0.75rem",
    textAlign: "center" as const,
    borderTop: "1px solid #eaeaea",
    backgroundColor: "white",
  },
  footerText: {
    fontSize: "0.8rem",
    color: "#666",
    margin: 0,
  },
  loadingOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorMessage: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  errorDismissButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontWeight: "500",
  },
}

