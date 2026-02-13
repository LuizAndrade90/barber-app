"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <span className="material-icons-round text-4xl text-red-500">
            error
          </span>
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            Algo deu errado
          </h3>
          <p className="mt-1 text-center text-xs text-muted-foreground max-w-xs">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
