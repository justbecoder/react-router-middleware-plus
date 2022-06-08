/**
 * @file: description
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:45:03
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-06-08 15:49:13
*/
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { ReactRouterMiddleware, useMiddlewareRoutes } from '../lib/index'
// @ts-ignore
// import { ReactRouterMiddlewarePlus } from '../dist/index.es.js'
import App from './App'
import Home from './home'
import Login from './login'
import Admin from './admin'

export default function Router () {
  const navigate = useNavigate();
  const checkLogin = () => {

    // 获取登录信息
    const isLogin = localStorage.getItem('isLogin') === '1'

    if (!isLogin) {
      navigate('/login', {
        replace: true
      })
      return false;
    }
    return true
  }

  const routesConfig = [
    {
      path: '/',
      key: 'index',
      element: <App></App>,
      children: [
        {
          index: true,
          key: 'home',
          element: <Home></Home>
        },
        {
          path: 'admin',
          key: 'admin',
          middleware: [checkLogin],
          element: <Admin></Admin>
        }
      ]
    },
    {
      path: '/login',
      key: 'login',
      element: <Login></Login>
    },
  ]

  // return <ReactRouterMiddleware routes={routesConfig}></ReactRouterMiddleware>
  return useMiddlewareRoutes(routesConfig)
}