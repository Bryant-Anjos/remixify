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

```javascript
// Component.tsx

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { createLoader, useData } from '@remixify/native'

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
  const { data, loading, refetch } = useLoaderData()

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <>
      <Text>{data.message}</Text>
      <TouchableOpacity>
        <Text onPress={refetch}>Load</Text>
      </TouchableOpacity>
    </>
  )
}
```

In a second file, index.ts, import everything from the first file and use it as shown in the example:

```javascript
// index.ts

import remixify from '@remixify/native'

import * as Component from './Component'

export default remixify(Component)
```

In this file, remixify is imported from @remixify/native and is used to wrap the imported Component to create a remixed component with the defined loader, Layout, and ErrorBoundary.
