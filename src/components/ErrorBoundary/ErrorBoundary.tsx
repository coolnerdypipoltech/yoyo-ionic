import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Without this, a render-time crash anywhere in the tree unmounts the
// whole app silently — on the unauthenticated flow that leaves only the
// background video visible (it's mounted outside the router outlet, so
// it survives), with no buttons, images, or text underneath it. Kept
// dependency-free (no i18n/router/etc.) since the whole point is to
// still work when something else in the tree has already broken.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="yoyo-error-boundary">
          <p className="yoyo-error-boundary__text">
            Something went wrong.
            <br />
            Algo salió mal.
          </p>
          <button type="button" className="yoyo-error-boundary__button" onClick={() => window.location.reload()}>
            Reload / Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
