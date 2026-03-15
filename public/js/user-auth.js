// User API 签名工具
// 用于生成访问 /api/user/* 端点的签名

const USER_API_SECRET = 'simryoko-user-api-secret'; // 必须与后端一致

// 生成 HMAC-SHA256 签名
function generateUserSignature(email, timestamp) {
  const payload = `${email.toLowerCase()}:${timestamp}`;
  // 使用 Web Crypto API 生成 HMAC
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const key = encoder.encode(USER_API_SECRET);
  
  return crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    .then(cryptoKey => crypto.subtle.sign('HMAC', cryptoKey, data))
    .then(signature => {
      const array = new Uint8Array(signature);
      return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

// 获取用户请求头
async function getUserAuthHeaders(email) {
  const timestamp = Date.now().toString();
  const signature = await generateUserSignature(email, timestamp);
  return {
    'X-User-Signature': signature,
    'X-User-Timestamp': timestamp
  };
}

// 封装 fetch 请求
async function fetchUserApi(url, options = {}) {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) throw new Error('User email not found');
  
  const headers = await getUserAuthHeaders(userEmail);
  const separator = url.includes('?') ? '&' : '?';
  const urlWithEmail = `${url}${separator}email=${encodeURIComponent(userEmail)}`;
  
  return fetch(urlWithEmail, {
    ...options,
    headers: { ...options.headers, ...headers }
  });
}

// 导出全局函数
window.userAuth = { generateUserSignature, getUserAuthHeaders, fetchUserApi };
