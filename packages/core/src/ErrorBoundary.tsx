import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
  children: React.ReactNode
  fallback?: React.FC
}

type State = {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  render() {
    const { fallback: Fallback } = this.props

    if (this.state.hasError) {
      if (Fallback) {
        return <Fallback />
      }

      return (
        <View style={styles.container}>
          <Text style={styles.text}>Something went wrong.</Text>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc0000',
  },
  text: {
    fontSize: 22,
    color: 'white',
  },
})
