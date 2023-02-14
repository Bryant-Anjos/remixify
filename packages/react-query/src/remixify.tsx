/* global Awaited */

import React from 'react'

import { useQuery, UseQueryResult, QueryFunction } from '@tanstack/react-query'
import { ErrorBoundary } from '@remixify/core'

type QueryParameters = Parameters<typeof useQuery>

type Module<Props = unknown> = {
  default: React.FC<Props>
  Layout?: React.FC<{ children: React.ReactNode }>
  ErrorBoundary?: React.FC
  loader: {
    key: QueryParameters[0]
    query: QueryParameters[1]
    params?: QueryParameters[2]
  }
}

type Loader<T> = Omit<Module['loader'], 'query'> & {
  query: (context?: Parameters<QueryFunction<T>>[0]) => T | Promise<T>
  resolver?: (data: unknown) => T
}

export function createLoader<T>(
  loader: Loader<T>,
): Omit<Loader<T>, 'resolver'> {
  const { resolver, ...params } = loader

  return {
    ...params,
    query: async (context?: Parameters<QueryFunction<T>>[0]) => {
      const result = await params.query(context)
      if (resolver) {
        return resolver(result)
      }
      return result
    },
  }
}

const RemixedContext = React.createContext({} as UseQueryResult)

export default function remixify<Props extends Record<string, unknown>>(
  module: Module<Props>,
) {
  const loader = module.loader
  const Component = module.default
  const Layout = module.Layout ?? React.Fragment
  const ErrorComponent = module.ErrorBoundary

  return function RemixedComponent(props: Props) {
    const data = useQuery(loader.key, loader.query, loader.params)

    return (
      <ErrorBoundary fallback={ErrorComponent}>
        <RemixedContext.Provider value={data}>
          <Layout>
            <Component {...props} />
          </Layout>
        </RemixedContext.Provider>
      </ErrorBoundary>
    )
  }
}

export function useLoaderData<
  T extends { query: (...args: unknown[]) => unknown | Promise<unknown> },
>() {
  return React.useContext(RemixedContext) as UseQueryResult<
    Awaited<ReturnType<T['query']>>,
    Error
  >
}
