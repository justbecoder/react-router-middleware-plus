## react-router-middleware-plus

## Introduce
react-router-middleware-plus是基于react-router-dom v6版本的路由权限配置化解决方案，引入中间件`middleware`的概念，零成本式解决路由权限控制难题。

## Install

```shell
yarn add react-router-middleware-plus

OR 

npm install react-router-middleware-plus
```

## Usage

```tsx
import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ReactRouterMiddleware, useMiddlewareRoutes } from 'react-router-middleware-plus';

import App from './App'
import Home from './home'
import Login from './login'
import Admin from './admin'


// router config
export default () => {
  const navigate = useNavigate();


  /**
   * @description 鉴权-登录
   * 
  */
  const checkLogin = () => {
    const isLogin = !!localStorage.getItem('username');
    if (!isLogin) {
      navigate('/login');
      // 不要忘记这里的return false，拦截路由渲染
      return false;
    }

    // 表示通过了鉴权
    return true;
  }

  // 定义路由配置，与react-router-dom是一致的，只是新增了middleware参数，可选
  // middleware中的鉴权逻辑callback，是从左向右依次调用的，遇到第一个返回false的callback会拦截路由组件的渲染，走callback中用户自定义逻辑
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

  // 生成路由配置由两种方式：Component  或者是使用Hook useMiddlewareRoutes
  const RoutesElement = useMiddlewareRoutes(routes);

  return <BrowserRouter>
    {/* 1. Component 渲染 */} 
    {/* <ReactRouterMiddleware routes={routes}></ReactRouterMiddleware> */}

    {/* 2. Hook渲染 */}
    <RoutesElement></RoutesElement>
  </BrowserRouter>
}
```
> 通过配置middleware，在callback中自定义处理逻辑，灵活可靠！就是这么简单，路由权限处理问题解决了

## Props
react-router-middleware-plus在使用时和react-router-dom中的`useRoutes`是一致的。


| 属性 | 类型 | 描述 | 是否可选 |
| --- | --- |  --- |  --- |
| routes  | RoutesMiddlewareObject[]  | 路由配置，在RoutesObject类型上扩展了`middleware`属性 | 否 |
| locationArg | Partial\<Location\> \| string | 用户传入的location对象 | 可选 |


