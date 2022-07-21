/*
 * @Description: 
 * @Author: huxiaoshuai
 * @Date: 2022-07-21 21:51:06
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-07-21 22:26:12
 */
import React from 'react';
import { useNavigate } from 'react-router-dom'

export default function Home () {
  const navigate = useNavigate();

  return <div>
    这里是首页
    <button onClick={() => {
      navigate('/login')
    }}>去登录</button>    
  </div>
}