# Remixify

A React Native Higher-Order Components to create components inspired on the Remix.run

## Installation

Yarn

```sh
yarn add @remixify/react-query @tanstack/react-query
```

npm

```sh
npm install @remixify/react-query @tanstack/react-query
```

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
