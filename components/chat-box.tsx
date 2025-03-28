"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, Mic, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { chatAPIService } from "@/lib/services/api-service";
import { chatsService } from "@/lib/services/database-service";
import { questionsService } from "@/lib/services/database-service";
import { Timestamp, Firestore } from "firebase/firestore";
import { Episode, PlayerEpisode, convertToPlayerEpisode } from "@/lib/schemas/episodes";
import { PodcastPlayer } from "@/components/podcast-player";
import { Separator } from "@/components/ui/separator";
import { FallbackMessage } from "@/components/ui/fallback-message";
import Image from "next/image";
import { convertToChat } from "@/lib/schemas/chats";
import type { ChatMessage, ChatMessageResponse } from "@/lib/schemas/chats";
import { SuggestedQuestion } from "@/lib/schemas/questions";
import ReactMarkdown from 'react-markdown';
import { audioService } from "@/lib/services/audio-service";


///////////////////////////////////////////////////////////////////////////////
// ChatBox component props
///////////////////////////////////////////////////////////////////////////////
interface ChatBoxProps {
  height?: number;
  onHeightChange?: (height: number) => void;
  activeEpisode?: PlayerEpisode;
}

///////////////////////////////////////////////////////////////////////////////
// ChatBox component
///////////////////////////////////////////////////////////////////////////////
export function ChatBox({ height = 40, onHeightChange, activeEpisode }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: `welcome-${Date.now()}`,
      content: "Hello! I'm your podcast assistant. Ask me anything about the episodes you're listening to or any other questions you might have.",
      sender: "system",  // this is a system message that is not sent to the LLM
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const audioRef = audioService.getAudioRef();
  
  const { user } = useAuth();
  const scrollAreaRef = useRef<any>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Helper function to ensure we have a Date object
  const ensureDate = (timestamp: Date | Timestamp): Date => {
    return timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Load chat history from Firestore if user is logged in
  ////////////////////////////////////////////////////////////////////////////////
  const loadChatHistory = useCallback(async () => {
    if (user) {
      try {
        setError(null);
        const chatHistory = await chatsService.getActiveChatHistory(user.uid);

        if (chatHistory && chatHistory.length > 0) {
          const formattedMessages: ChatMessage[] = chatHistory.map(chat => ({
            id: chat.chat_id,
            uid: chat.user_id,
            conversation_id: chat.conversation_id,
            content: chat.chat_text,
            sender: chat.sender,
            timestamp: chat.created_at,
            player_episode: chat.podcast_data
          }));

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        setError("Failed to load chat history. Please try again later.");
      }
    }
  }, [user]);

  ////////////////////////////////////////////////////////////////////////////////
  // Load chat history on component mount
  ////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  ////////////////////////////////////////////////////////////////////////////////
  // Retry loading chat history
  ////////////////////////////////////////////////////////////////////////////////
  const retryLoadingHistory = loadChatHistory;
  
  ////////////////////////////////////////////////////////////////////////////////
  // Get fallback questions
  ////////////////////////////////////////////////////////////////////////////////
  const getFallbackQuestions = (): SuggestedQuestion[] => {
    return [
      { id: 'fallback-1', text: 'What are the key points discussed in this episode?' },
      { id: 'fallback-2', text: 'Can you summarize the main takeaways?' },
      { id: 'fallback-3', text: 'What are the practical applications of this topic?' }
    ];
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Load suggested questions from Firestore
  ////////////////////////////////////////////////////////////////////////////////
  const loadSuggestedQuestions = useCallback(async (podcastId: string) => {
    if (!podcastId) {
      console.warn('No podcast ID provided for loading suggested questions');
      return;
    }

    try {
      setError(null);
      const questions = await questionsService.getPopularQuestions(podcastId, 3);
      
      if (questions && questions.length > 0) {
        setSuggestedQuestions(
          questions.map(q => ({
            id: q.id,
            text: q.question_text
          }))
        );
      } else {
        setSuggestedQuestions(getFallbackQuestions());
      }
    } catch (error) {
      console.error("Error loading suggested questions:", error);
      setSuggestedQuestions(getFallbackQuestions());
    }
  }, []); // loadSuggestedQuestions

  ////////////////////////////////////////////////////////////////////////////////
  // Add active podcast to chat when it changes
  ////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const handlePodcastChange = async () => {
      if (activeEpisode && activeEpisode.id) {
        const podcastMessage: ChatMessage = {
          id: `podcast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          uid: user?.uid,
          conversation_id: conversationId || undefined,
          content: `Playing: ${activeEpisode.title}`,
          sender: "podcast",
          timestamp: new Date(),
          player_episode: activeEpisode
        };
        
        setMessages(prev => [...prev, podcastMessage]);
        
        // Save podcast message to Firestore if logged in
        if (user) {
          try {
            const chatMessage = convertToChat(podcastMessage);
            await chatsService.createChatMessage(chatMessage);
          } catch (error) {
            console.error("Error saving podcast message to Firestore:", error);
          }
        }
        
        const podcastId = activeEpisode.podcastId.toString();
        loadSuggestedQuestions(podcastId);
      }
    };

    handlePodcastChange();
  }, [activeEpisode, loadSuggestedQuestions, conversationId, user]);

  ////////////////////////////////////////////////////////////////////////////////
  // Scroll to bottom when messages change
  ////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (scrollAreaRef.current) {
      try {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      } catch (error) {
        console.error('Error scrolling to bottom:', error);
      }
    }
  }, [messages]);

  ////////////////////////////////////////////////////////////////////////////////
  // Set up drag handlers for resizing
  ////////////////////////////////////////////////////////////////////////////////
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

  
  ////////////////////////////////////////////////////////////////////////////////
  // Handle drag start
  ////////////////////////////////////////////////////////////////////////////////
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle sending a message
  ////////////////////////////////////////////////////////////////////////////////
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Generate new conversation ID if needed
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = chatAPIService.generateConversationId();
      setConversationId(currentConversationId);
    }
    
    // create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      uid: user?.uid,
      conversation_id: currentConversationId || undefined,
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
          const chatMessage = convertToChat(userMessage);
          // const chatMessageResult = 
          await chatsService.createChatMessage(chatMessage);          
        } catch (error) {
          console.error("Error saving user message to Firestore:", error);
          // Continue with API call even if Firestore save fails
        }
      }
      
      // Get podcast context if there's an active podcast episode selected
      let podcastContext = undefined;
      if (activeEpisode) {
        podcastContext = {
          episodeId: activeEpisode.id.toString(),
        };
      }

      // Format conversation history for the API
      const conversationHistory = messages
        .filter(msg => msg.sender === "user" || msg.sender === "assistant")
        .slice(-5) // Get last 5 messages
        .map(msg => ({
          sender: msg.sender as "user" | "assistant",
          content: msg.content
        }));
      
      // Get response from API in api-service.ts
      // Parameters: message, conversationHistory, podcastContext
      const response = await chatAPIService.sendMessage(
        userMessage.content,
        conversationHistory,
        podcastContext
      );

      // create assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        uid: user?.uid,
        conversation_id: currentConversationId,
        content: response.response || "I'm sorry, I couldn't process your request at this time.",
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save assistant message to Firestore if logged in
      if (user) {
        try {
          const chatMessage = convertToChat(assistantMessage);
          await chatsService.createChatMessage(chatMessage);
        } catch (error) {
          console.error("Error saving assistant message to Firestore:", error);
          // Continue even if Firestore save fails
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
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
  }; // handleSendMessage

  ////////////////////////////////////////////////////////////////////////////////
  // Handle suggested question
  ////////////////////////////////////////////////////////////////////////////////
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle key down event
  ////////////////////////////////////////////////////////////////////////////////
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  
   
  ////////////////////////////////////////////////////////////////////////////////
  // Render the chat box
  ////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden" suppressHydrationWarning>
      <div 
        ref={dragHandleRef}
        className="p-2 border-b flex items-center justify-center cursor-ns-resize bg-muted/30"
        onMouseDown={handleDragStart}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1"
        suppressHydrationWarning
      >
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
                message.sender === "podcast" ? "justify-left" : ""
              )}
            >
              {message.sender === "podcast" && message.player_episode ? (
                <div className="w-full max-w-[90%]">
                  <div className="flex flex-col lg:flex-row items-start gap-6">
                    <div className="flex-[2] min-w-0 w-full">
                      <div className="flex flex-col lg:flex-row items-stretch gap-4">
                        <div className="relative h-[120px] aspect-[3/2] rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={message.player_episode.image}
                            alt={message.player_episode.title}
                            fill
                            sizes="180px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-[2] min-w-[400px]">
                          <PodcastPlayer podcast={message.player_episode} audioRef={audioRef} />
                        </div>
                      </div>
                    </div>
                    
                    {suggestedQuestions.length > 0 && (
                      <div className="flex-1 min-w-0 w-full lg:w-auto">
                        <p className="text-lg font-semibold mb-2">Suggested questions:</p>
                        <div className="space-y-2">
                          {suggestedQuestions.map((question) => (
                            <Button
                              key={question.id}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start h-auto py-2 px-3 text-sm whitespace-normal break-words bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900"
                              onClick={() => handleSuggestedQuestion(question.text)}
                            >
                              {question.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    "bg-muted"
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
                      <div className="text-sm prose dark:prose-invert max-w-none">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      <p className="text-xs opacity-50 mt-1">
                        {(message.sender === "assistant" || message.sender === "user") && (
                          <span suppressHydrationWarning>
                            {(message.timestamp instanceof Timestamp 
                              ? message.timestamp.toDate() 
                              : message.timestamp
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
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
  ); // Render ChatBox
} // ChatBox