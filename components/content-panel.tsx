"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PodcastList } from "@/components/podcast-list";
import { ChatBox } from "@/components/chat-box";
import { Separator } from "@/components/ui/separator";
import { PodcastPlayer } from "@/components/podcast-player";

interface ContentPanelProps {
  selectedTopicId?: string;
  activePodcast?: any | null;
  onSelectPodcast: (podcast: any) => void;
  showFullPlayer?: boolean;
}

export function ContentPanel({ 
  selectedTopicId, 
  activePodcast, 
  onSelectPodcast,
  showFullPlayer = false
}: ContentPanelProps) {
  const [chatHeight, setChatHeight] = useState(40); // 40% of the panel height
  const [bannerImage, setBannerImage] = useState("/banner.jpg");

  // Set banner image based on selected topic
  useEffect(() => {
    if (selectedTopicId) {
      // In a real app, you would fetch the banner image for the selected topic
      // For now, we'll use a placeholder
      setBannerImage(`https://images.unsplash.com/photo-1572719314664-fb1a81c61e43?w=1200&h=400&fit=crop`);
    } else {
      setBannerImage(`https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&h=400&fit=crop`);
    }
  }, [selectedTopicId]);

  const handleChatHeightChange = (height: number) => {
    setChatHeight(height);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1" style={{ height: `${100 - chatHeight}%` }}>
        <div className="p-6 space-y-6">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img 
              src={bannerImage} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h1 className="text-2xl font-bold">
                  {selectedTopicId ? "Topic Podcasts" : "Featured Podcasts"}
                </h1>
                <p className="text-sm opacity-80">
                  {selectedTopicId 
                    ? "Podcasts related to your selected topic" 
                    : "Discover trending and popular podcasts"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              {selectedTopicId ? "Topic Podcasts" : "Recommended For You"}
            </h2>
            <PodcastList 
              topicId={selectedTopicId} 
              onSelectPodcast={onSelectPodcast} 
            />
          </div>
        </div>
      </ScrollArea>
      
      <div style={{ height: `${chatHeight}%` }}>
        {showFullPlayer && activePodcast ? (
          <div className="p-4">
            <PodcastPlayer podcast={activePodcast} />
          </div>
        ) : (
          <ChatBox 
            height={chatHeight} 
            onHeightChange={handleChatHeightChange}
            activePodcast={activePodcast}
          />
        )}
      </div>
    </div>
  );
}