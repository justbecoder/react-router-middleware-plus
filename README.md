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
1. **配置路由**
  ```tsx
  /**
   * @file router.tsx 路由配置组件
  */
  import React, { useEffect, useState } from 'react';
  import { BrowserRouter, useNavigate, useParams } from 'react-router-dom';
  import { ReactRouterMiddleware, useMiddlewareRoutes } from 'react-router-middleware-plus';

  import App from './App';
  import Home from './home';
  import Login from './login';
  import Admin from './admin';
  
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
        // resolve(null)
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
    return isAdmin ? children : null
  }

  // router config
  export default () => {

    // 定义路由配置，与react-router-dom是一致的，只是新增了middleware参数，可选
    // middleware中的鉴权组件是从左向右依次执行的，返回嵌套的children，则通过。返回null，表示拦截
    // 可根据实际业务需求，调整鉴权组件中的拦截逻辑
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
            // middleware中鉴权组件从左向右依次执行
            middleware: [CheckLogin, CheckRole],
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
        
    // 1. Component 渲染
    // return <ReactRouterMiddleware routes={routes}></ReactRouterMiddleware>;
    
    // 2. Hook渲染
    return useMiddlewareRoutes(routes);
  }
  ```
2. **渲染路由**

  ```tsx
    /**
     * @file index.tsx 入口文件
    */
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import { BrowserRouter } from 'react-router-dom';
    import Router from './router';


    ReactDOM.createRoot(document.getElementById('root')!).render(
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    );
  ```

对，是的，就是这么简单！就通过配置middleware，灵活搭配组合鉴权组件，在鉴权组件中自定义处理逻辑，路由权限处理问题解决了。

## Props
react-router-middleware-plus在使用时和react-router-dom中的`useRoutes`是一致的。


| 属性 | 类型 | 描述 | 是否可选 |
| --- | --- |  --- |  --- |
| routes  | RoutesMiddlewareObject[]  | 路由配置，在RoutesObject类型上扩展了`middleware`属性 | 否 |
| locationArg | Partial\<Location\> \| string | 用户传入的location对象 | 可选 |


