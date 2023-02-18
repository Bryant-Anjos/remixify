# Remixify with React Query (Alpha)

Remixify with React Query is a library for creating React Native components with integration with [React Query](https://tanstack.com/query/latest) for data management. If you prefer not to use React Query, you can use our sister library [@remixify/native](https://www.npmjs.com/package/@remixify/native) which provides the same features without the React Query integration.

Inspired by [Remix](https://remix.run), this library aims to simplify state management, error handling, and layout creation for React Native development.

## Installation

Yarn

```sh
yarn add @remixify/react-query @tanstack/react-query
```

npm

```sh
npm install @remixify/react-query @tanstack/react-query
```

## Getting Started

Before you can use `@remixify/react-query`, you need to configure `react-query`. You can learn more about how to use `react-query` in their [official documentation](https://tanstack.com/query/latest/docs/react/quick-start).

Here's an example of how to configure react-query:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MyApp from './MyApp'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyApp />
    </QueryClientProvider>
  )
}
```

Now you're ready to start using @remixify/react-query!

## Usage

First, make sure you have configured the react-query provider, as explained in the previous section.

Then, in a file, write a React Native component with `export default` and define the `loader` function as a named export, which must be a synchronous function that returns an object with the following arguments: `key`, `query`, and `params`.

The component uses useLoaderData from @remixify/react-query to fetch data from the loader function and the refetch function to fetch the data again.

```typescript
// Component.tsx

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { useLoaderData } from '@remixify/react-query'

export function loader({ params }) {
  return {
    key: ['hello'],
    query: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        message: 'Hello World!',
      }
    },
  }
}

export function Layout({ children }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </View>
  )
}

export function ErrorBoundary() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Oops!</Text>
    </View>
  )
}

export default function Component() {
  const { data, isLoading, refetch } = useLoaderData<typeof loader>()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  return (
    <>
      <Text>{data.message}</Text>
      <TouchableOpacity onPress={refetch}>
        <Text>Load</Text>
      </TouchableOpacity>
    </>
  )
}
```

In a second file, index.ts, import everything from the first file and use it as shown in the example:

```typescript
// index.ts

import remixify from '@remixify/react-query'

import * as Component from './Component'

export default remixify(Component)
```

In this file, remixify is imported from @remixify/react-query and is used to wrap the imported Component to create a remixed component with the defined loader, Layout, and ErrorBoundary.

## Component API

The following are optional functionalities that can be defined as desired by the user when using the remixify library. These functionalities are designed to allow for greater flexibility in customizing the behavior of the created components. Users can choose which functionalities to implement based on their specific needs and preferences. The `loader` is a required functionality, while the others are optional.

### loader

The `loader` must be an exported synchronous function that returns an object with the arguments of `useQuery` from `react-query`, which are `key`, `query`, and `params`. The `key` and `query` attributes are required, while `params` is optional. The query function can be `asynchronous` and can return any type of value, such as the response of an API call.

The data returned by the `query` function can be accessed in the component created by `@remixify/react-query` using a hook called `useLoaderData`. This hook returns an object with the same attributes as the `useQuery` hook from `react-query`, like: data, isLoading, error and refetch.

The loader also receives an object with an attribute called params, which is defined in another function called useLoaderParams.

```typescript
export function loader({ params }) {
  return {
    key: ['todos'],
    query: async () => {
      const todos = await getTodos()

      return {
        todos,
      }
    },
  }
}

// inside the component
const { data, isLoading, refetch } = useLoaderData<typeof loader>()

if (isLoading) {
  return <Text>Loading...</Text>
}

console.log(data.todos)
```

### ErrorBoundary

The `ErrorBoundary` function needs to be exported and it should return a React component. This component will be called every time there is an error in the component wrapped by the `remixify` function.

```typescript
export function ErrorBoundary({ error }) {
  return (
    <View
      style={{
        backgroundColor: 'red',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
      }}
    >
      <Text style={{ color: 'white' }}>Oops an error!</Text>
      <Text style={{ color: 'white' }}>{error.message}</Text>
    </View>
  )
}
```

### Layout

The `Layout` should be an exported function that returns a React component. It should accept an object with a `children` property as an argument, and this `children` property should be used in the layout to render the component created with the `remixify` library. The Layout component is the component that will always be displayed, regardless of the changes made to the component created with the `remixify`.

```typescript
export function Layout({ children }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}
    >
      {children}
    </View>
  )
}
```

### useLoaderParams

The `useLoaderParams` needs to be exported and return a value. The value returned by this function will be the data received in the params of the loader. This function was created to allow access to component hooks data in the loader. The user can return anything in this function and access any hook by it, such as a parameter received by the useParams from react-navigation.

```typescript
export function useLoaderParams() {
  const params = useParams()

  return {
    todoId: params.todoId,
  }
}

// In the loader, it can be accessed like this:
export async function loader({ params }) {
  const todo = await getTodo(params.todoId)

  return {
    todo,
  }
}
```
