/**
 * @file: description
 * @author: huxiaoshuai
 * @Date: 2022-08-05 16:25:24
 * @LastEditors: huxiaoshuai
 * @LastEditTime: 2022-08-12 11:00:09
*/
import * as React from 'react'
import { Outlet, RouteObject, useRoutes } from 'react-router-dom'

type DynamicElementType<T> = () => Promise<{ default: React.ComponentType<T> }>

type MiddlewareType<T = React.PropsWithChildren> = React.FC<T>

export type MergeRouteObject<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

export type RouteObjectWithMiddleware = MergeRouteObject<
  RouteObject,
  {
    middleware?: MiddlewareType[]
    children?: RouteObjectWithMiddleware[]
  }
  >

const buildMiddlewares = (
  element: React.ReactNode,
  middleware: MiddlewareType[],
): React.ReactNode => {
  middleware = [...middleware].reverse()
  let component: React.ReactNode = element
  middleware.forEach(Middleware => {
    component = <Middleware>{component}</Middleware>
  })

  return component
}

type DynamicImportState = {
  loading: boolean
  Component: React.ComponentType<unknown> | null
}

type DynamicImportProps = {
  element: DynamicElementType<unknown>
  loading?: React.ReactNode
}

export class DynamicImport extends React.PureComponent<DynamicImportProps, DynamicImportState> {
  constructor(props: DynamicImportProps | Readonly<DynamicImportProps>) {
    super(props)
    this.state = {
      loading: false,
      Component: null,
    }
  }

  componentDidMount() {
    const { element } = this.props
    this.handlerLoadComponent(element)
  }

  componentDidUpdate(prevProps: Readonly<DynamicImportProps>) {
    if (prevProps.element.toString() !== this.props.element.toString()) {
      this.handlerLoadComponent(this.props.element)
    }
  }

  handlerLoadComponent(element: DynamicElementType<unknown>) {
    this.setState({ loading: true })
    element()
      .then(module => module.default || module)
      .then(Component => {
        this.setState({ Component })
      })
      .catch(err => {
        throw err
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }
  render() {
    const { Component, loading } = this.state
    if (loading) {
      return this.props.loading
    }
    return Component ? <Component /> : null
  }
}

const buildRoutes = (routes: RouteObjectWithMiddleware[]): RouteObject[] => {
  const items: RouteObject[] = []

  routes.forEach(route => {
    const { children, middleware, ...rest } = route
    const item: RouteObject = {
      ...rest,
    }

    // 存在中间件
    if (middleware?.length) {
      const element = item.element || <Outlet />
      item.element = buildMiddlewares(element, middleware)
    }

    // 子路由处理
    if (children?.length) {
      item.children = buildRoutes(children)
    }
    items.push(item)
  })

  return items
}

export const useRoutesWithMiddleware = (
  routes: RouteObjectWithMiddleware[],
  locationArg?: string | Partial<Location> | undefined
): React.ReactElement | null => {
  return useRoutes(buildRoutes(routes), locationArg)
}
