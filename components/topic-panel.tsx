"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PlusCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { topicsService } from "@/lib/services/database-service";
import { Topic } from "@/lib/schemas/topics";
// import {db} from "@/lib/firebase";
// import { Firestore } from "firebase/firestore";

interface TopicPanelProps {
  onSelectTopic?: (topicId: string) => void;
}

export function TopicPanel({ onSelectTopic }: TopicPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [userLocation, setUserLocation] = useState<string>("Newton, MA"); // Default location
  const { user, userProfile } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
    setIsExpanded(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!isClicked) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
        setIsExpanded(false);
      }, 300); // Small delay before closing
    }
  };

  // Handle panel click
  const handlePanelClick = () => {
    setIsClicked(!isClicked);
    setIsExpanded(true);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById('topic-panel');
      if (panel && !panel.contains(event.target as Node)) {
        setIsClicked(false);
        if (!isHovered) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHovered]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        let fetchedTopics;
        
        if (user && userProfile?.following_topics && userProfile?.following_topics.length > 0) {
          // If user is logged in, fetch their followed topics
          const userTopics = await Promise.all(
            userProfile.following_topics.map(async (topicId) => {
              return await topicsService.getTopicById(topicId);
            })
          );
          fetchedTopics = userTopics.filter(Boolean);
        } else {
          // Otherwise, fetch public topics
          fetchedTopics = await topicsService.getPublicTopics();
          
          // Filter to include location-based topics first
          if (userLocation && fetchedTopics) {
            fetchedTopics = [
              ...fetchedTopics.filter(t => t.topic_name === userLocation),
              ...fetchedTopics.filter(t => t.topic_name !== userLocation)
            ];
          }
        }
        
        setTopics(fetchedTopics as Topic[]);
//        setTopics(mockTopics);

      } catch (error) {
        console.error("Error fetching topics:", error);
        // Fallback to mock data
        setTopics(mockTopics);
      }
    };
    
    // why is this called again?
    fetchTopics();
  }, [user, userProfile, userLocation]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSelectedTopic(null);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    if (onSelectTopic) {
      onSelectTopic(topic.topic_id);
    }
    
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleAddTopic = () => {
    // Implement add topic functionality
    console.log("Add topic clicked");
  };

  return (
    <div 
      id="topic-panel"
      className={`border-r bg-card transition-all duration-500 flex flex-col h-full ${
        isExpanded ? "w-1/4" : "w-[10%]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePanelClick}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className={`font-semibold ${isExpanded ? "block" : "hidden"}`}>Topics</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={(e) => {
            e.stopPropagation();
            handleAddTopic();
          }} title="Add Topic">
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }} 
            className="md:hidden"
          >
            {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {mockTopics.map((topic) => (
            <div key={topic.topic_id} onClick={() => handleTopicClick(topic)}>
              {isExpanded && selectedTopic?.topic_id === topic.topic_id ? (
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-3">
                    <div className="space-y-3">
                        <Image
                          src={topic.topic_image}
                          width="300"
                          height="200"
                          alt={topic.topic_name}
                          //fill
                          sizes="100vw"
                          style={{
                            objectFit: "cover"
                          }} />
                      </div>
                      <div>
                        <h3 className="font-medium">{topic.topic_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {topic.topic_type.charAt(0).toUpperCase() + topic.topic_type.slice(1)}
                        </p>
                      </div>
                  </CardContent>
                </Card>
              ) : (
                <div 
                  className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                    selectedTopic?.topic_id === topic.topic_id ? "bg-accent" : ""
                  }`}
                >
                  <div className="h-8 w-8 rounded-md overflow-hidden mr-2">
                    <Image
                      src={topic.topic_image}
                      width="300"
                      height="200"
                      alt={topic.topic_name}
                      className="object-cover w-full h-full"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                  </div>
                  <span className={`truncate ${isExpanded ? "block" : "hidden"}`}>{topic.topic_name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}


// Mock data for fallback
const mockTopics = [
  {
    topic_id: "1",
    topic_name: "Newton, MA",
    topic_image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&h=200&fit=crop",
    topic_type: "place",
    related_topic_tags: ["Massachusetts", "Boston suburbs", "education"],
    datetime: new Date(),
    is_private: false,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    topic_id: "2",
    topic_name: "Massachusetts",
    topic_image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&h=200&fit=crop",
    topic_type: "place",
    related_topic_tags: ["New England", "Boston", "education", "politics"],
    datetime: new Date(),
    is_private: false,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    topic_id: "3",
    topic_name: "Education Reform",
    topic_image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop",
    topic_type: "issue",
    related_topic_tags: ["education", "schools", "policy"],
    datetime: new Date(),
    is_private: false,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];