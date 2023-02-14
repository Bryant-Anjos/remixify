/* global Awaited */

import React from 'react'

import { ErrorBoundary } from '@remixify/core'

type Module<Props = unknown, T = unknown> = {
  default: React.FC<Props>
  Layout?: React.FC<{ children: React.ReactNode }>
  ErrorBoundary?: React.FC
  loader?: {
    query: () => Promise<T>
  }
}

type Loader<T> = {
  query: () => Promise<T>
  resolver?: (data: unknown) => T
}

export function createLoader<T>(
  loader: Loader<T>,
): Omit<Loader<T>, 'resolver'> {
  const { resolver, ...params } = loader

  return {
    ...params,
    query: async () => {
      const result = await params.query()
      if (resolver) {
        return resolver(result)
      }
      return result
    },
  }
}

type Data<T extends () => Promise<unknown>> =
  | { loading: true; data: null; error: null }
  | { loading: false; data: Awaited<ReturnType<T>>; error: null }
  | { loading: false; data: null; error: Error }

const INITIAL_STATE: Data<() => Promise<unknown>> = {
  loading: true,
  error: null,
  data: null,
}

type Context<T extends () => Promise<unknown>> = Data<T> & {
  refetch: () => void
}

const RemixedContext = React.createContext(
  {} as Context<() => Promise<unknown>>,
)

export default function remixify<Props extends Record<string, unknown>, T>(
  module: Module<Props, T>,
) {
  const query = module.loader?.query ?? (async () => null)
  const Component = module.default
  const Layout = module.Layout ?? React.Fragment
  const ErrorComponent = module.ErrorBoundary

  return function RemixedComponent(props: Props) {
    const [data, setData] =
      React.useState<Data<() => Promise<unknown>>>(INITIAL_STATE)

    const fetch = React.useCallback(() => {
      setData(INITIAL_STATE)

      query()
        .then(response =>
          setData({ loading: false, data: response, error: null }),
        )
        .catch(error => setData({ loading: false, data: null, error }))
    }, [])

    React.useEffect(() => {
      fetch()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <ErrorBoundary fallback={ErrorComponent}>
        <RemixedContext.Provider value={{ ...data, refetch: fetch }}>
          <Layout>
            <Component {...props} />
          </Layout>
        </RemixedContext.Provider>
      </ErrorBoundary>
    )
  }
}

export function useLoaderData<T extends () => Promise<unknown>>() {
  return React.useContext(RemixedContext) as Context<T>
}
