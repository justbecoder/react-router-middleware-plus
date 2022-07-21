import * as React from 'react'
import {Outlet, RouteObject, useRoutes} from 'react-router-dom'

type DynamicElementType<T> = () => Promise<{ default: React.ComponentType<T> }>

type ElementType<T> = React.ReactNode | DynamicElementType<T>

type MiddlewareType<T = React.PropsWithChildren> = React.FC<T>

export function isDynamicElement<T = unknown>(node: unknown): node is DynamicElementType<T> {
  return typeof node === 'function' && node?.toString().startsWith('() => import')
}

export type MergeRouteObject<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

export type RouteTypeWithDynamic<T = unknown> = MergeRouteObject<
    RouteObject,
    {
      element?: ElementType<T>
      children?: RouteTypeWithDynamic<T>[]
    }
    >

export type RouteTypeWithMiddleware = MergeRouteObject<
    RouteTypeWithDynamic,
    {
      middleware?: MiddlewareType[]
      children?: RouteTypeWithMiddleware[]
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

const buildRoutes = (routes: RouteTypeWithMiddleware[], loading?: React.ReactNode): RouteObject[] => {
  const items: RouteObject[] = []

  routes.forEach(route => {
    const { element, children, middleware, ...rest } = route
    const item: RouteObject = {
      ...rest,
    }

    // check dynamic element
    if (isDynamicElement(element)) {
      const LazyComponent = React.lazy(element)
      item.element = (
          <React.Suspense fallback={loading || null}>
            <LazyComponent />
          </React.Suspense>
      )
    } else {
      item.element = element
    }

    // exists middleware process
    if (middleware?.length) {
      const element = item.element || <Outlet />
      item.element = buildMiddlewares(element, middleware)
    }

    // child routes process
    if (children?.length) {
      item.children = buildRoutes(children)
    }
    items.push(item)
  })

  return items
}

export const useMiddlewareRoutes = (
    routes: RouteTypeWithMiddleware[],
    loading?: React.ReactNode,
): React.ReactElement | null => {
  return useRoutes(buildRoutes(routes, loading))
}

export default useMiddlewareRoutes
