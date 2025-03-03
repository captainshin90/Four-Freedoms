"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { authService } from "@/lib/services/auth-service";
import { useToast } from "@/hooks/use-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  // Handle redirect result when the app loads
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await authService.getRedirectResult();
        if (result) {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
        }
      } catch (error: any) {
        toast({
          title: "Login failed",
          description: error.message || "An error occurred during social login.",
          variant: "destructive",
        });
      }
    };

    handleRedirectResult();
  }, [toast]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}