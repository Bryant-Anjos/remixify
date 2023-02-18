# Remixify (Alpha)

Remixify is a library for creating React Native components.

It is inspired by the [Remix](https://remix.run), but also has its own unique features.

This library makes it easier to manage state, handle errors and create layouts.

## Installation

Yarn

```sh
yarn add @remixify/native
```

npm

```sh
npm install @remixify/native
```

## Usage

In a file write a React Native component with `export default` and also define the optional `loader`, `Layout`, and `ErrorBoundary` with `named export` as show the example.

The component uses useData from @remixify/native to fetch data from the loader function and the refetch function to fetch the data again.

```typescript
// Component.tsx

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { useData } from '@remixify/native'

export async function loader() {
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    message: 'Hello World!',
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
  const { data, loading, refetch } = useLoaderData<typeof loader>()

  if (loading) {
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

import remixify from '@remixify/native'

import * as Component from './Component'

export default remixify(Component)
```

In this file, remixify is imported from @remixify/native and is used to wrap the imported Component to create a remixed component with the defined loader, Layout, and ErrorBoundary.

## Component API

The following are optional functionalities that can be defined as desired by the user when using the remixify library. These functionalities are designed to allow for greater flexibility in customizing the behavior of the created components. Users can choose which functionalities to implement based on their specific needs and preferences.

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

### loader

The `loader` must be an exported asynchronous function that returns a value. The value can be anything, such as the response of an API call.

The data returned by the loader can be accessed in the component created by remixify using a hook called `useLoaderData`. This hook returns an object with the value returned by the loader in an attribute called data, an attribute called loading indicating if the Promise of the loader has been resolved, and an attribute called error that will store any errors that occurred in the loader.

The loader also receives an object with an attribute called params, which is defined in another function called useLoaderParams.

```typescript
export async function loader({ params }) {
  const todos = await getTodos()

  return {
    todos,
  }
}

// inside the component
const { data, loading, refetch } = useLoaderData<typeof loader>()

if (loading) {
  return <Text>Loading...</Text>
}

console.log(data.todos)
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
