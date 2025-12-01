import React from 'react';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error | null; info?: any };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught an error', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="mx-auto my-8 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-900">
          <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm mb-3">The design studio encountered an unexpected error. Try refreshing.</p>
          <details className="whitespace-pre-wrap rounded bg-white/60 p-2 text-xs text-gray-700">
            {this.state.error?.message ?? 'No error message available'}
            {this.state.info ? `\n\n${JSON.stringify(this.state.info)}` : ''}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;