# Remixify Babel Plugin (Alpha)

This is a plugin that enables the creation of React Native components using Remixify without the need to create an additional file to implement Remixify in your component.
You just need to create a file with the extensions `.remix.js` or `.remix.jsx` or `.remix.tsx`. This is a project in an early stage, and many things are subject to change or still do not work correctly. We are working to make it stable and as complete as possible.

## Installation

To make the Remixify Babel Plugin work correctly, you need to install [@remixify/native](../native/README.md), [@remixify/react-query](../react-query/README.md), or both, depending on which one you are using in your project.
You can install them via npm:

```bash
npm install --save-dev @remixify/babel-plugin
```

Using together with @remixify/native:

```bash
npm install @remixify/native
```

Using together with @remixify/react-query:

```bash
npm install @remixify/react-query @tanstack/react-query
```

## Configuration

In your babel.config.js file, add `['./remixify-plugin.js']`.
Example with Expo:

```javascript
module.exports = function (api) {
  api.cache(true)
  api.debug = true

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ... other plugins in your project
      ['@remixify/babel-plugin'],
    ],
  }
}
```

## How to use

Create a React Native component with one of the following extensions: `.remix.js` or `.remix.jsx` or `.remix.tsx`.
You can see the documentations of [@remixify/native](../native/README.md) and [@remixify/react-query](../react-query/README.md) for all the available functionalities.
With this, you no longer need to create a Remixify configuration file, and you can import your component directly.
See the example with and without the plugin:

### Without the plugin

```javascript
// Component/Component.jsx
import React from 'react'
import { useLoaderData } from '@remixify/native'

export async function loader() {
  return {
    message: 'Hello World!',
  }
}

export default function Component() {
  const { data, isLoading } = useLoaderData()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  return <Text>{data.message}emix</Text>
}


// Component/index.tsx
import remixify from '@remixify/react-query'

import * as Component from './Component'

export default remixify(Component)

// AnotherComponent.jsx
import Component from './Component'

export default function AnotherComponent() {
  return <Component />
}
```

### With the plugin

```javascript
// Component/Component.remix.jsx
import React from 'react'
import { useLoaderData } from '@remixify/native'

export async function loader() {
  return {
    message: 'Hello World!',
  }
}

export default function Component() {
  const { data, isLoading } = useLoaderData()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  return <Text>{data.message}emix</Text>
}

// AnotherComponent.jsx
import Component from './Component/Component.remix'

export default function AnotherComponent() {
  return <Component />
}
```

## Limitations

This plugin is still in initial development, and not everything works as expected. It should be considered an alpha-stage project, and we do not recommend using it in a production application at the moment. Additionally, the plugin only currently works with export functions and export default functions. Arrow functions, classes, and previously declared functions are not currently supported.

## Contributing

If you find a bug or want to suggest a feature, feel free to create an issue or submit a pull request. We are always looking for ways to improve the plugin and make it more robust.
