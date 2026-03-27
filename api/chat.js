/**
 * AI Chat API Endpoint
 * Handles customer service chat with Gemini AI
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// FAQ knowledge base
const FAQ_KNOWLEDGE = `
SimKaze eSIM常见问题：

1. 什么是eSIM？
eSIM是嵌入式SIM卡，无需实体卡即可使用。购买后通过二维码激活，支持iPhone和Android。

2. 如何激活？
购买后收到二维码 → 手机设置 → 蜂窝网络 → 添加eSIM → 扫描二维码 → 完成激活。

3. 支持哪些国家？
覆盖200+国家，包括日本、韩国、泰国、欧洲、美国、澳大利亚等热门目的地。

4. 价格多少？
日本1GB/7天 $4起，欧洲5GB/30天 $15起，全球套餐 $20起。比漫游便宜80%。

5. 如何查询用量？
购买后登录账户查看，或联系客服查询。

6. 退款政策？
未激活24小时内可退款，已激活不支持退款。

7. 支付方式？
支持信用卡(Stripe)、USDT、TON支付。

8. 客服联系方式？
Telegram: @Simryokoesimbot
邮箱: support@simkaze.com

9. 与Airalo有什么区别？
同样的网络，更好的中文服务。价格更优，支持USDT支付。

10. 有效期多久？
从激活日开始计算，套餐标注天数内有效。
`;

// Transfer to human keywords
const HUMAN_TRANSFER_KEYWORDS = [
  '人工', '客服', '转人工', '人工客服', '找人工',
  '退款', '投诉', '问题没解决', '联系你们', '电话',
  'human', 'agent', 'support', 'refund', 'complaint'
];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if should transfer to human
    const shouldTransfer = HUMAN_TRANSFER_KEYWORDS.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (shouldTransfer) {
      return res.json({
        reply: '',
        transferToHuman: true
      });
    }

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `你是SimKaze eSIM的智能客服助手。请根据以下知识库回答用户问题：

${FAQ_KNOWLEDGE}

用户问题：${message}

要求：
1. 用中文回答，语气友好专业
2. 回答简洁，不超过150字
3. 如果不确定，建议联系人工客服
4. 不要编造信息

请回答：`          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      '抱歉，我暂时无法回答。请添加Telegram客服：@Simryokoesimbot';

    res.json({ reply, transferToHuman: false });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      reply: '抱歉，服务暂时不可用。请添加Telegram客服：@Simryokoesimbot',
      transferToHuman: true
    });
  }
}