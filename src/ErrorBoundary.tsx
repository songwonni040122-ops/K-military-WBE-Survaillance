import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 40,
          background: '#0a0a0f',
          color: '#ff4444',
          fontFamily: 'monospace',
          height: '100vh',
          overflow: 'auto',
        }}>
          <h1 style={{ color: '#ff6666' }}>DEEPSTREAM - Runtime Error</h1>
          <pre style={{ marginTop: 20, whiteSpace: 'pre-wrap', color: '#ffaaaa' }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ marginTop: 10, whiteSpace: 'pre-wrap', color: '#888', fontSize: 12 }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
