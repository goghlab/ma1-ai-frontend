require('dotenv').config();
const express = require('express');
const { ChatXAI } = require('@langchain/xai');

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(express.json());

const llm = new ChatXAI({
  apiKey: process.env.XAI_API_KEY,
  model: "grok",
});

// 定义/api/chat端点
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await llm.invoke(message);
    res.json({ reply: response.content });
  } catch (error) {
    res.status(500).json({ error: "Failed to process chat request. Please try again." });
  }
});

// 定义/api/campaign端点
app.post('/api/campaign', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `${message}. Research popular hashtags and trendy content styles on X and Instagram related to this topic. Suggest 2 posts with 3-5 hashtags each and a content style (e.g., short video, image). Format the response as: Post 1: [Image: description] Content with #hashtags\n---\nPost 2: [Image: description] Content with #hashtags`;
    const response = await llm.invoke(prompt);

    const campaignId = `camp_${Date.now()}`;
    const platforms = message.toLowerCase().includes("x") ? ["X", "Instagram"] : ["Instagram"];
    const title = message.split("about")[1]?.trim() || "New Campaign";
    const scheduledDate = "Not scheduled";

    res.json({
      campaignId,
      details: {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        platforms,
        content: response.content,
        targetAudience: "General audience",
        scheduledDate,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate campaign. Please try again." });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 