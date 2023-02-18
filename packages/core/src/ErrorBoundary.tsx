import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
  children: React.ReactNode
  fallback?: React.FC<Record<'error', Error | null>>
}

type State = {
  error: Error | null
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // eslint-disable-next-line node/handle-callback-err, @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    const { fallback: Fallback } = this.props

    if (this.state.hasError) {
      if (Fallback) {
        return <Fallback error={this.state.error} />
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
