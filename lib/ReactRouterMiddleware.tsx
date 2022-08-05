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

type DynamicImportProps = {
  element: DynamicElementType<unknown>
  loading?: React.ReactNode
}

export const DynamicImport: React.FC<DynamicImportProps> = ({ element, loading }) => {
  const LazyComponent = React.lazy(element)
  return (
    <React.Suspense fallback={loading || null}>
      <LazyComponent />
    </React.Suspense>
  )
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
): React.ReactElement | null => {
  return useRoutes(buildRoutes(routes))
}
