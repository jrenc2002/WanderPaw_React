#!/bin/bash

# 认证API测试脚本
echo "🚀 开始测试 WanderPaw 认证API..."
echo "========================================"

# API基础地址
API_BASE="http://localhost:3000"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_api() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    
    echo -e "\n${YELLOW}测试: $name${NC}"
    echo "URL: $method $url"
    
    if [ -n "$data" ]; then
        echo "Data: $data"
        response=$(curl -s -w "%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$url")
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✅ 成功 ($http_code)${NC}"
        echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
    else
        echo -e "${RED}❌ 失败 ($http_code)${NC}"
        echo "Response: $body"
    fi
}

# 测试健康检查
test_api "健康检查" "GET" "$API_BASE/health"

# 测试用户注册
echo -e "\n${YELLOW}=== 用户注册测试 ===${NC}"
register_data='{"username":"testuser123","password":"password123","phoneNumber":"+8613800138000"}'
test_api "用户注册" "POST" "$API_BASE/auth/register" "$register_data"

# 测试用户登录
echo -e "\n${YELLOW}=== 用户登录测试 ===${NC}"
login_data='{"username":"testuser123","password":"password123"}'
echo -e "\n${YELLOW}测试: 用户登录${NC}"
echo "URL: POST $API_BASE/auth/login"
echo "Data: $login_data"

response=$(curl -s -w "%{http_code}" -X "POST" "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "$login_data")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ 登录成功 ($http_code)${NC}"
    echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
    
    # 提取访问令牌
    access_token=$(echo "$body" | jq -r '.accessToken' 2>/dev/null)
    
    if [ "$access_token" != "null" ] && [ -n "$access_token" ]; then
        echo -e "${GREEN}🔑 获取到访问令牌${NC}"
        
        # 测试受保护的API
        echo -e "\n${YELLOW}=== 受保护API测试 ===${NC}"
        echo -e "\n${YELLOW}测试: 获取用户资料${NC}"
        echo "URL: GET $API_BASE/users/profile"
        
        profile_response=$(curl -s -w "%{http_code}" -X "GET" "$API_BASE/users/profile" \
            -H "Authorization: Bearer $access_token")
        
        profile_http_code="${profile_response: -3}"
        profile_body="${profile_response%???}"
        
        if [ "$profile_http_code" -eq 200 ]; then
            echo -e "${GREEN}✅ 获取用户资料成功 ($profile_http_code)${NC}"
            echo "Response: $profile_body" | jq . 2>/dev/null || echo "Response: $profile_body"
        else
            echo -e "${RED}❌ 获取用户资料失败 ($profile_http_code)${NC}"
            echo "Response: $profile_body"
        fi
    else
        echo -e "${RED}❌ 未能获取访问令牌${NC}"
    fi
else
    echo -e "${RED}❌ 登录失败 ($http_code)${NC}"
    echo "Response: $body"
fi

# 测试重复注册（应该失败）
echo -e "\n${YELLOW}=== 重复注册测试（应该失败）===${NC}"
test_api "重复注册" "POST" "$API_BASE/auth/register" "$register_data"

# 测试错误密码登录（应该失败）
echo -e "\n${YELLOW}=== 错误密码登录测试（应该失败）===${NC}"
wrong_login_data='{"username":"testuser123","password":"wrongpassword"}'
test_api "错误密码登录" "POST" "$API_BASE/auth/login" "$wrong_login_data"

echo -e "\n${YELLOW}========================================"
echo -e "🎉 测试完成！"
echo -e "📝 如果看到上述测试结果，说明认证API工作正常"
echo -e "🌐 前端地址: http://localhost:5173"
echo -e "🔧 后端地址: http://localhost:3000"
echo -e "========================================${NC}" 