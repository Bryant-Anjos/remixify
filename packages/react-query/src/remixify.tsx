/* global Awaited */

import React from 'react'

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ErrorBoundary } from '@remixify/core'

type QueryParameters = Parameters<typeof useQuery>

type LoaderArguments = {
  params: unknown
}

type LoaderFunction = (args: LoaderArguments) => {
  key: QueryParameters[0]
  query: QueryParameters[1]
  params?: QueryParameters[2]
}

type Module<Props = unknown> = {
  default: React.FC<Props>
  Layout?: React.FC<{ children: React.ReactNode }>
  ErrorBoundary?: React.FC
  loader: LoaderFunction
  useLoaderParams?: () => unknown
}

const RemixedContext = React.createContext({} as UseQueryResult)

export default function remixify<Props extends Record<string, unknown>>(
  module: Module<Props>,
) {
  const loader = module.loader
  const useLoaderParams = module.useLoaderParams ?? (() => null)
  const Component = module.default
  const Layout = module.Layout ?? React.Fragment
  const ErrorComponent = module.ErrorBoundary

  return function RemixedComponent(props: Props) {
    const loaderParams = useLoaderParams()

    const { key, query, params } = React.useMemo(
      () => loader({ params: loaderParams }),
      [loaderParams],
    )

    const data = useQuery(key, query, params)

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
