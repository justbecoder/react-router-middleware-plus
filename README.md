## react-router-middleware-plus

## Introduce

1、react-router-middleware-plus是基于react-router-dom v6版本的路由权限配置化解决方案，引入中间件`middleware`的概念，零成本式解决路由权限控制难题。

2、支持 element 使用 `() => import(xxx)` 的形式引入组件

3、支持 React.Suspense 的 fallback 属性，用于指定 loading 组件

## Install

```shell
yarn add react-router-middleware-plus

OR

npm install react-router-middleware-plus
```

## Usage

1. **配置路由**

  ```tsx
  /**
 * @file: 路由组件配置
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:45:03
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-06-10 23:33:14
 */
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import {RouteTypeWithMiddleware, useMiddlewareRoutes} from 'react-router-middleware-plus'
import App from './App'
import Home from './home'
import Login from './login'
import Admin from './admin'

/**
 * @method getUserInfoApi
 * @description 模拟后端接口，返回用户登录数据
 */
const getUserInfoApi: any = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 已登录
      resolve({
        username: '胡小帅'
      })
      // 未登录
      resolve(null)
    }, 100)
  })
}


/**
 * @method CheckLogin
 * @description 鉴权-登录
 */
const CheckLogin = ({children}: any) => {
  const navigate = useNavigate();
  const params = useParams();
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    const userInfo = await getUserInfoApi();

    if (userInfo) {
      setUserInfo(userInfo)
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])


  if (!userInfo) {
    return null;
  }
  return children
}

export default function Router() {
  /**
   * @method checkRole
   * @description 鉴权-用户角色
   */
  const CheckRole = ({children}: any) => {
    const navigate = useNavigate();
    // 根据自己的页面，判断处理，async/await异步拉取用户数据即可。
    const isAdmin = localStorage.getItem('role') === 'admin';

    useEffect(() => {
      if (!isAdmin) {
        navigate('/', {
          replace: true
        })
      }
    }, [isAdmin])

    // 通过鉴权
    return children
  }

  /**
   * @description 路由配置
   *
   */
  const routes: RouteTypeWithMiddleware[] = [
    {
      path: '/',
      element: () => import("./App"),
      children: [
        {
          index: true,
          element: () => import("./home")
        },
        {
          path: 'admin',
          middleware: [CheckLogin, CheckRole],
          element: () => import("./admin")
        }
      ]
    },
    {
      path: '/login',
      element: () => import("./login")
    },
  ]

  // return <ReactRouterMiddleware routes={routes}></ReactRouterMiddleware>
  return useMiddlewareRoutes(routes)
}
  ```

2. **渲染路由**

  ```tsx
    /**
 * @file index.tsx 入口文件
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import Router from './router';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Router/>
  </BrowserRouter>
);
  ```

对，是的，就是这么简单！就通过配置middleware，灵活搭配组合鉴权组件，在鉴权组件中自定义处理逻辑，路由权限处理问题解决了。

## Props

react-router-middleware-plus在使用时和react-router-dom中的`useRoutes`是一致的。

| 属性      | 类型                        | 描述                             | 是否可选 |
|---------|---------------------------|--------------------------------|------|
| routes  | RouteTypeWithMiddleware[] | 路由配置，在RoutesObject类型上扩展了`middleware`属性 | 否    |
| loading | React.ReactNode           | 支持指定一个 Loading 组件，用作懒加载显示      | 可选   |

## 贡献者

- [justbecoder](https://github.com/justbecoder)
- [smithyj](https://github.com/smithyj)
