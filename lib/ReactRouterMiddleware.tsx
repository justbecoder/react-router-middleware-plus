/**
 * @file: 路由中间件
 * @author: huxiaoshuai
 * @Date: 2022-06-08 00:32:14
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-06-10 23:26:39
*/
import React, { useEffect, useState, useMemo, } from 'react'
import { useRoutes, RouteObject, useNavigate } from 'react-router-dom'

/**
 * @description 中间件的回调函数callback
 * 
*/
export interface MiddlewareFunction {
  (element?: Partial<React.ReactElement>): Partial<React.ReactElement>
}

export interface RoutesMiddlewareObject extends RouteObject  {
  /**
   * @description 权限处理的middleware callback[]
   * 
  */
  middleware?: MiddlewareFunction[];
  /**
   * @description 子路由
   * 
  */
  children?: RoutesMiddlewareObject[];

  /**
   * @description route key
   * 
  */
  key?: string;
}

interface IProps {
  routes: RoutesMiddlewareObject[];
  locationArg?: Partial<Location> | string
}

interface IMiddlewareProps {
  middleware?: MiddlewareFunction[];
  children?: React.ReactElement | null
}


/**
 * @description 中间件组件，处理中间件权限逻辑
 * 
*/
function  MiddlewareComponent (props: IMiddlewareProps) {
  const { middleware = [], children = null } = props;

  return middleware.length ? (middleware.reduceRight((prev: any, Current: any) => {
    return <Current>
      {prev}
    </Current>
  }, children)) : children
};

/**
 * @method middlewarePlugin
 * @description 处理routes config
*/
function middlewarePlugin (routesConfig: RoutesMiddlewareObject[]) {
  return routesConfig.map((routeItem: RoutesMiddlewareObject) => {
    const { element, children, middleware,  ...otherRouteProps } = routeItem
    const newRouteItem: RoutesMiddlewareObject = {
      ...otherRouteProps
    }
    newRouteItem.element = (
      <MiddlewareComponent middleware={middleware}>{element as React.ReactElement}</MiddlewareComponent>
    );
    if (children && children.length) {
      newRouteItem.children = middlewarePlugin(children);
    }
    return newRouteItem;
  });
};


/**
 * @method useMiddlewareRoutes
 * @description 渲染middleware routes的hook
*/
export function useMiddlewareRoutes (routes:RoutesMiddlewareObject[],  locationArg?: Partial<Location> | string) {
  const routeElement = useRoutes(middlewarePlugin(routes));
  return routeElement;
}

export default function renderRoutes (props: IProps) {
  const {routes, locationArg} = props;
  const routeElement = useMiddlewareRoutes(routes, locationArg);
  return routeElement;
}


