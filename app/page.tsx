"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { TopicPanel } from "@/components/topic-panel";
import { ContentPanel } from "@/components/content-panel";
import { BottomBar } from "@/components/bottom-bar";

interface Podcast {
  id: string;
  title: string;
  image: string;
  audioUrl: string;
  duration: number;
}

export default function Home() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);
  const [activePodcast, setActivePodcast] = useState<Podcast | null>(null);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  const handleSelectPodcast = (podcast: Podcast) => {
    setActivePodcast(podcast);
    setShowFullPlayer(false);
  };

  const handleTogglePlayer = () => {
    setShowFullPlayer(!showFullPlayer);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <audio 
        ref={audioRef} 
        style={{ position: 'absolute', visibility: 'hidden' }} 
        preload="auto"
      />
      <Header onSearch={handleSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        <TopicPanel onSelectTopic={handleSelectTopic} />
        <ContentPanel 
          selectedTopicId={selectedTopicId} 
          activePodcast={activePodcast}
          onSelectPodcast={handleSelectPodcast}
          showFullPlayer={showFullPlayer}
          searchQuery={searchQuery}
          audioRef={audioRef}
        />
      </div>
      
      {activePodcast && !showFullPlayer && (
        <BottomBar 
          activePodcast={activePodcast} 
          onTogglePlayer={handleTogglePlayer}
          audioRef={audioRef}
        />
      )}
    </div>
  );
}