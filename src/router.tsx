/**
 * @file: 路由组件配置
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:45:03
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-08-05 16:30:31
*/
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import {DynamicImport, RouteObjectWithMiddleware, useRoutesWithMiddleware} from '../lib'
import App from './App'
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

export default function Router () {
  /**
   * @description 路由配置
   *
  */
  const routes: RouteObjectWithMiddleware[] = [
    {
      path: '/',
      element: <App></App>,
      children: [
        {
          index: true,
          element: <DynamicImport element={() => import("./home")} />
        },
        {
          path: 'admin',
          middleware: [CheckLogin, CheckRole],
          element: <DynamicImport element={() => import("./admin")} />
        }
      ]
    },
    {
      path: '/login',
      element: <DynamicImport element={() => import("./login")} />
    },
  ]

  return useRoutesWithMiddleware(routes)
}
