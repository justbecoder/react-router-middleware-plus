/*
 * @Description: 
 * @Author: huxiaoshuai
 * @Date: 2022-07-21 21:51:06
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-07-21 22:27:29
 */
import React from 'react';
import { useNavigate } from 'react-router-dom'

export default function Login () {
  const navigate = useNavigate();
  
  return <div>
    <h3>登录页面</h3>
    <button onClick={() => {
      localStorage.setItem('isLogin', '1')
      localStorage.setItem('role', 'admin')
      navigate('/')
    }}>登录</button>
  </div>
}