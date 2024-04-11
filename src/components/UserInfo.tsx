import * as React from "react";
import { useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { Box } from "@mui/material";

function UserInfo() {
  // 设置状态来存储电子邮件地址
  const [email, setEmail] = useState('loading...');

  useEffect(() => {
    // 定义异步函数来获取当前认证用户的信息
    const fetchUserEmail = async () => {
      try {
        const userAttributes = await fetchUserAttributes();
        // 假设用户信息中包含电子邮件地址，并设置到状态中
        setEmail(userAttributes?.email as string);
      } catch (error) {
        console.error('Error fetching user email', error);
      }
    };

    // 调用异步函数
    fetchUserEmail();
  }, []); // 空依赖数组表示这个 effect 仅在组件挂载时执行一次

  return (
    <Box>
      <p>{email}</p>
    </Box>
  );
}

export default UserInfo;
