"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Search, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, userProfile } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="font-bold hidden md:inline-block">Four Freedoms</span>
          </Link>
          
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What are you looking for?"
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/profile" className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">{userProfile?.first_name || 'User'}</span>
                <span className="text-xs text-muted-foreground">{userProfile?.subscription_type || 'Free'}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt={userProfile.first_name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
            </Link>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}