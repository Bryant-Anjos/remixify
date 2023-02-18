/* global Awaited */

import React from 'react'

import { ErrorBoundary } from '@remixify/core'

type LoaderArguments = {
  params: unknown
}

type LoaderFunction = (args: LoaderArguments) => Promise<unknown>

type Module<Props = unknown> = {
  default: React.FC<Props>
  Layout?: React.FC<{ children: React.ReactNode }>
  ErrorBoundary?: React.ComponentProps<typeof ErrorBoundary>['fallback']
  loader?: LoaderFunction
  useLoaderParams?: () => unknown
}

type Data<T extends LoaderFunction> =
  | { loading: true; data: null; error: null }
  | { loading: false; data: Awaited<ReturnType<T>>; error: null }
  | { loading: false; data: null; error: Error }

const INITIAL_STATE: Data<LoaderFunction> = {
  loading: true,
  error: null,
  data: null,
}

type Context<T extends LoaderFunction> = Data<T> & {
  refetch: () => void
}

const RemixedContext = React.createContext({} as Context<LoaderFunction>)

export default function remixify<Props extends Record<string, unknown>>(
  module: Module<Props>,
) {
  const loader = module.loader ?? (async () => null)
  const useLoaderParams = module.useLoaderParams ?? (() => null)
  const Component = module.default
  const Layout = module.Layout ?? React.Fragment
  const ErrorComponent = module.ErrorBoundary

  return function RemixedComponent(props: Props) {
    const [data, setData] = React.useState<Data<LoaderFunction>>(INITIAL_STATE)
    const params = useLoaderParams()

    const fetch = React.useCallback(() => {
      setData(INITIAL_STATE)

      loader({ params })
        .then(response =>
          setData({ loading: false, data: response, error: null }),
        )
        .catch(error => setData({ loading: false, data: null, error }))
    }, [params])

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

export function useLoaderData<T extends LoaderFunction>() {
  return React.useContext(RemixedContext) as Context<T>
}
