import { Component } from 'react';
import { analytics } from '@zoonk/utils';

interface ErrorProps {
  children: React.ReactNode;
}

interface ErrorState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorProps, ErrorState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    analytics().logEvent('exception', {
      description: String(errorInfo),
      error: String(error || error.message),
    });
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <h1>something went wrong... please, refresh this page.</h1>;
    }

    return children;
  }
}

export default ErrorBoundary;
