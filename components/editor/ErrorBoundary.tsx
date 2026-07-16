"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught layout render error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 border-2 border-dashed border-red-300 bg-red-50/50 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 font-sans select-none my-4">
          <AlertTriangle size={24} className="text-red-500 animate-pulse" />
          <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider font-nunito">
            Component Render Failure
          </h4>
          <p className="text-[10px] text-gray-400 max-w-xs font-nunito leading-tight">
            {this.state.error?.message || "An error occurred while compiling this block. Check its property values in the inspector."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
