import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
          <div className="card p-8 max-w-md w-full text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-danger-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-danger-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-secondary-500 mb-6">
              An unexpected error occurred. Please try again.
            </p>
            <button onClick={this.handleReset} className="btn-primary">
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
