"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PodcastList } from "@/components/podcast-list";
import { ChatBox } from "@/components/chat-box";
import { Separator } from "@/components/ui/separator";
import { PodcastPlayer } from "@/components/podcast-player";
import { PlayerEpisode } from "@/lib/schemas/episodes";
import { Podcast } from "@/lib/schemas/podcasts";
import { RefObject } from "react";
import { Button } from "@/components/ui/button";

///////////////////////////////////////////////////////////////////////////////
// ContentPanel component props
///////////////////////////////////////////////////////////////////////////////
interface ContentPanelProps {
  selectedTopicId?: string;
  activePodcast: PlayerEpisode | null;
  onSelectPodcast: (podcast: PlayerEpisode) => void;
  showFullPlayer: boolean;
  searchQuery: string;
  audioRef: RefObject<HTMLAudioElement>;
  onAddPodcast: ((podcast: Podcast) => void) | null;
  onClearTopic?: () => void;
}

///////////////////////////////////////////////////////////////////////////////
// ContentPanel component
///////////////////////////////////////////////////////////////////////////////
export function ContentPanel({ 
  selectedTopicId, 
  activePodcast, 
  onSelectPodcast,
  showFullPlayer = false,
  searchQuery = "",
  audioRef,
  onAddPodcast,
  onClearTopic
}: ContentPanelProps) {
  const [chatHeight, setChatHeight] = useState(40); // 40% of the panel height
  const [bannerImage, setBannerImage] = useState("/banner.jpg");
  const [isPlaying, setIsPlaying] = useState(false);

  ///////////////////////////////////////////////////////////////////////////////
  // Set banner image based on selected topic
  ///////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (selectedTopicId) {
      // In a real app, you would fetch the banner image for the selected topic
      // For now, we'll use a placeholder
      setBannerImage(`https://images.unsplash.com/photo-1541726260-e6b6a6a08b27?w=1200&h=400&fit=crop`);
    } else {
      setBannerImage(`https://images.unsplash.com/photo-1541726260-e6b6a6a08b27?w=1200&h=400&fit=crop`);
    }
  }, [selectedTopicId]);

  ///////////////////////////////////////////////////////////////////////////////
  // Handle chat height change
  ///////////////////////////////////////////////////////////////////////////////
  const handleChatHeightChange = (height: number) => {
    setChatHeight(height);
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Handle time update
  ///////////////////////////////////////////////////////////////////////////////
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      // Update any components that need this information
    }
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Render the ContentPanel component
  ///////////////////////////////////////////////////////////////////////////////
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1" style={{ height: `${100 - chatHeight}%` }}>
        <div className="p-6 space-y-6">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={bannerImage}
              alt="Banner"
              className="w-full h-full"
              fill
              sizes="100vw"
              priority
              style={{
                objectFit: "cover"
              }} />
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
            <div className="flex items-center justify-left gap-4">
              {selectedTopicId && onClearTopic && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearTopic}
                  className="text-muted-foreground hover:text-primary bg-muted/50"
                >
                  See All
                </Button>
              )}
              <h2 className="text-xl font-bold">
                {selectedTopicId ? "Topic Podcasts" : "Recommended For You"}
              </h2>
            </div>
            <PodcastList 
              topicId={selectedTopicId}
              searchQuery={searchQuery}
              onSelectPodcast={onSelectPodcast}
              onAddPodcast={onAddPodcast || undefined}
            />
          </div>
        </div>
      </ScrollArea>
      <div style={{ height: `${chatHeight}%` }}>
        {showFullPlayer && activePodcast ? (
          <div className="p-4">
            <PodcastPlayer 
              podcast={activePodcast} 
              audioRef={audioRef}
            />
          </div>
        ) : (
          <ChatBox 
            height={chatHeight} 
            onHeightChange={handleChatHeightChange}
            activeEpisode={activePodcast || undefined}
          />
        )}
      </div>
    </div>
  );
}