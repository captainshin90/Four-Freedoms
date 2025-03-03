"use client";

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface FallbackMessageProps {
  title: string;
  message: string;
  type?: "error" | "warning" | "success" | "info";
  retry?: () => void;
}

export function FallbackMessage({ 
  title, 
  message, 
  type = "error", 
  retry 
}: FallbackMessageProps) {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "success":
        return "default";
      case "info":
        return "default";
      default:
        return "destructive";
    }
  };

  return (
    <Alert variant={getVariant()}>
      <div className="flex items-start">
        {getIcon()}
        <div className="ml-2">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="flex flex-col">
            <span>{message}</span>
            {retry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retry} 
                className="mt-2 self-start"
              >
                Try Again
              </Button>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}