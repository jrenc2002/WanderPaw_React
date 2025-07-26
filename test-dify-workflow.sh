#!/bin/bash

# 测试Dify工作流API集成
echo "=== 测试Dify工作流API集成 ==="

# 服务器地址
SERVER_URL="http://localhost:8080"

# 登录获取JWT token
echo "1. 登录获取JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST "$SERVER_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dify-tester",
    "password": "test123456"
  }')

echo "登录响应: $LOGIN_RESPONSE"

# 提取JWT token
JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | sed 's/"accessToken":"//g' | sed 's/"//g')

if [ -z "$JWT_TOKEN" ]; then
  echo "无法获取JWT token，测试终止"
  exit 1
fi

echo "JWT Token: ${JWT_TOKEN:0:20}..."

# 测试Dify工作流 - 阻塞模式
echo -e "\n2. 测试Dify工作流 (阻塞模式)..."
DIFY_BLOCKING_RESPONSE=$(curl -s -X POST "$SERVER_URL/chat/message" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "测试Dify工作流集成"
      }
    ],
    "taskType": "dify_workflow",
    "difyWorkflow": {
      "inputs": {
        "query": "Hello from WanderPaw!",
        "context": "这是一个测试请求"
      },
      "user": "test-user-123",
      "response_mode": "blocking"
    },
    "config": {
      "temperature": 0.7
    },
    "streaming": false
  }')

echo "Dify阻塞模式响应:"
echo "$DIFY_BLOCKING_RESPONSE" | jq . 2>/dev/null || echo "$DIFY_BLOCKING_RESPONSE"

echo -e "\n=== 测试完成 ===" 