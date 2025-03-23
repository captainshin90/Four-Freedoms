"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Search, Home, Settings, LogOut, Trash2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { chatsService } from "@/lib/services/database-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

///////////////////////////////////////////////////////////////////////////////
// Header component props
///////////////////////////////////////////////////////////////////////////////
interface HeaderProps {
  onSearch: (query: string) => void;
}

///////////////////////////////////////////////////////////////////////////////
// Header component
///////////////////////////////////////////////////////////////////////////////
export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, userProfile, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleClearHistory = async () => {
    try {
      if (user?.uid) {
        const confirmed = window.confirm("Are you sure you want to clear your chat history? This action cannot be undone.");
        if (confirmed) {
          // We'll implement the clear functionality in the chat service
          await chatsService.clearChatHistory(user.uid);
          window.location.reload(); // Refresh to show cleared state
        }
      }
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Render the Header component
  ///////////////////////////////////////////////////////////////////////////////
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="font-bold hidden md:inline-block whitespace-nowrap">Four Freedoms</span>
          </Link>
          
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What are you looking for?"
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
            />
          </form>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-muted">
                    {userProfile?.avatar || user?.photoURL ? (
                      <Image
                        src={userProfile?.avatar || user?.photoURL || "/default-avatar.png"}
                        alt={userProfile?.first_name || user?.displayName || "User"}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="h-4 w-4 text-foreground" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.first_name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClearHistory} className="cursor-pointer text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Clear Chat History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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