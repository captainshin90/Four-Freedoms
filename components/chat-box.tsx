"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, Mic, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { chatService } from "@/lib/services/api-service";
import { chatsService } from "@/lib/services/database-service";
import { questionsService } from "@/lib/services/database-service";
import { Timestamp, Firestore } from "firebase/firestore";
import { PodcastPlayer } from "@/components/podcast-player";
import { Separator } from "@/components/ui/separator";
import { FallbackMessage } from "@/components/ui/fallback-message";
import {db} from "@/lib/firebase";


type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant" | "podcast";
  timestamp: Date;
  podcastData?: any;
};

type SuggestedQuestion = {
  id: string;
  text: string;
};

interface ChatBoxProps {
  height?: number;
  onHeightChange?: (height: number) => void;
  activePodcast?: any;
}

export function ChatBox({ height = 40, onHeightChange, activePodcast }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your podcast assistant. Ask me anything about the episodes you're listening to or any other questions you might have.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(height);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Load chat history from Firestore if user is logged in
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user) {
        try {
          setError(null);

          const chatHistory = await chatsService.getActiveChatHistory(db as Firestore, user.uid);
          
          if (chatHistory && chatHistory.length > 0) {
            const formattedMessages = chatHistory.map(chat => ({
              id: chat.id,
              content: chat.chat_text,
              sender: chat.is_user ? "user" : "assistant" as "user" | "assistant",
              timestamp: chat.create_datetime
            }));
            
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
          setError("Failed to load chat history. Please try again later.");
        }
      }
    };
    
    loadChatHistory();
  }, [user]);

  // Add active podcast to chat when it changes
  useEffect(() => {
    if (activePodcast) {
      const podcastMessage: Message = {
        id: `podcast-${Date.now()}`,
        content: `Now playing: ${activePodcast.title}`,
        sender: "podcast",
        timestamp: new Date(),
        podcastData: activePodcast
      };
      
      setMessages(prev => [...prev, podcastMessage]);
      
      // Load suggested questions for this podcast
      loadSuggestedQuestions(activePodcast.id.split('-')[0]); // Extract podcast ID from episode ID
    }
  }, [activePodcast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Set up drag handlers for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaY = startY - e.clientY;
      const newHeight = Math.min(Math.max(20, startHeight + (deltaY / window.innerHeight) * 100), 80);
      
      if (onHeightChange) {
        onHeightChange(newHeight);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startHeight, onHeightChange]);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  const loadSuggestedQuestions = async (podcastId: string) => {
    try {
      setError(null);
      const questions = await questionsService.getPopularQuestions(db as Firestore, podcastId, 3);
      
      if (questions && questions.length > 0) {
        setSuggestedQuestions(
          questions.map(q => ({
            id: q.id,
            text: q.question_text
          }))
        );
      } else {
        // Fallback questions if none found
        setSuggestedQuestions([
          { id: 'q1', text: 'What are the key points from this episode?' },
          { id: 'q2', text: 'Can you summarize this podcast?' },
          { id: 'q3', text: 'Who are the hosts of this podcast?' }
        ]);
      }
    } catch (error) {
      console.error("Error loading suggested questions:", error);
      // Don't show error for suggested questions, just use fallbacks
      setSuggestedQuestions([
        { id: 'q1', text: 'What are the key points from this episode?' },
        { id: 'q2', text: 'Can you summarize this podcast?' },
        { id: 'q3', text: 'Who are the hosts of this podcast?' }
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);
    
    try {
      // Save user message to Firestore if logged in
      if (user) {
        try {
          await chatsService.createChatMessage(db as Firestore, {
            user_id: user.uid,
            chat_text: userMessage.content,
            create_datetime: Timestamp.fromDate(userMessage.timestamp),
            is_user: true
          });
        } catch (error) {
          console.error("Error saving user message to Firestore:", error);
          // Continue with API call even if Firestore save fails
        }
      }
      
      // Get response from API
      const response = await chatService.sendMessage(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response || "I'm sorry, I couldn't process your request at this time.",
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save assistant message to Firestore if logged in
      if (user) {
        try {
          await chatsService.createChatMessage(db as Firestore, {
            user_id: user.uid,
            chat_text: assistantMessage.content,
            create_datetime: Timestamp.fromDate(assistantMessage.timestamp),
            is_user: false
          });
        } catch (error) {
          console.error("Error saving assistant message to Firestore:", error);
          // Continue even if Firestore save fails
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, there was an error processing your request. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setError("Failed to get a response from the AI service. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const retryLoadingHistory = async () => {
    if (user) {
      try {
        setError(null);
        const chatHistory = await chatsService.getActiveChatHistory(db as Firestore, user.uid);
        
        if (chatHistory && chatHistory.length > 0) {
          const formattedMessages = chatHistory.map(chat => ({
            id: chat.id,
            content: chat.chat_text,
            sender: chat.is_user ? "user" : "assistant" as "user" | "assistant",
            timestamp: chat.create_datetime
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error retrying chat history load:", error);
        setError("Failed to load chat history. Please try again later.");
      }
    }
  };

  // Format time on client-side only to avoid hydration mismatch
  const formatMessageTime = (date: Date) => {
    return "";  // Return empty string initially to avoid hydration mismatch
  };

  // Update time display after component mounts
  useEffect(() => {
    // This will force a re-render after hydration is complete
    const timer = setTimeout(() => {
      setMessages(prev => [...prev]);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div 
        ref={dragHandleRef}
        className="p-2 border-b flex items-center justify-center cursor-ns-resize bg-muted/30"
        onMouseDown={handleDragStart}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="p-4 space-y-4">
          {error && (
            <FallbackMessage
              title="Connection Error"
              message={error}
              type="error"
              retry={retryLoadingHistory}
            />
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start",
                message.sender === "podcast" ? "justify-center" : ""
              )}
            >
              {message.sender === "podcast" ? (
                <div className="w-full max-w-[90%]">
                  <PodcastPlayer podcast={message.podcastData} />
                  
                  {suggestedQuestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Suggested questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question) => (
                          <Button
                            key={question.id}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleSuggestedQuestion(question.text)}
                          >
                            {question.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {message.sender === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {typeof window !== 'undefined' ? message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted max-w-[80%] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 bg-muted-foreground/30 rounded-full animate-bounce"></div>
                    <div className="h-3 w-3 bg-muted-foreground/30 rounded-full animate-bounce delay-75"></div>
                    <div className="h-3 w-3 bg-muted-foreground/30 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Ask
          </Button>
        </div>
        {!user && (
          <p className="text-xs text-muted-foreground mt-2">
            Sign in to save your chat history and access premium features.
          </p>
        )}
      </div>
    </div>
  );
}