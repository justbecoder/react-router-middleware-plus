/**
 * @file: description
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:33:11
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-06-08 02:00:30
*/
import React from 'react';
import { useNavigate } from 'react-router-dom'

export default function Login () {
  const navigate = useNavigate();
  
  return <div>
    <h3>登录页面</h3>
    <button onClick={() => {
      localStorage.setItem('isLogin', '1')
      navigate('/')
    }}>登录</button>
  </div>
}