/**
 * @file: 路由组件配置
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:45:03
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-06-08 23:39:04
*/
import React from 'react';
import { useNavigate,BrowserRouter } from 'react-router-dom'
import { ReactRouterMiddleware, useMiddlewareRoutes } from '../lib/index'
import App from './App'
import Home from './home'
import Login from './login'
import Admin from './admin'

export default function Router () {
  const navigate = useNavigate();

  /**
   * @method checkLogin
   * @description 鉴权-登录
  */
  const checkLogin = () => {
    // 获取登录信息
    const isLogin = !!localStorage.getItem('username')

    if (!isLogin) {
      navigate('/login', {
        replace: true
      })
      return false;
    }
    return true
  }

  /**
   * @method checkRole
   * @description 鉴权-用户角色
  */
  const checkRole = () => {
    // 根据自己的页面，判断处理，async/await异步拉取用户数据即可。
    const isAdmin = localStorage.getItem('role') === 'admin';

    if (!isAdmin) {
      navigate('/', {
        replace: true
      })
      // 未通过鉴权，返回false
      return false;
    }
    
    // 通过鉴权，返回true
    return true
  }

  /**
   * @description 路由配置
   * 
  */
  const routes = [
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
          middleware: [checkLogin, checkRole],
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

  return <ReactRouterMiddleware routes={routes}></ReactRouterMiddleware>
  // const RoutesElement = useMiddlewareRoutes(routes);

  // return RoutesElement
}