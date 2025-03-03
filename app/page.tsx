"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { TopicPanel } from "@/components/topic-panel";
import { ContentPanel } from "@/components/content-panel";
import { BottomBar } from "@/components/bottom-bar";

export default function Home() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);
  const [activePodcast, setActivePodcast] = useState<any | null>(null);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  const handleSelectPodcast = (podcast: any) => {
    setActivePodcast(podcast);
    setShowFullPlayer(true);
  };

  const handleTogglePlayer = () => {
    setShowFullPlayer(!showFullPlayer);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <TopicPanel onSelectTopic={handleSelectTopic} />
        <ContentPanel 
          selectedTopicId={selectedTopicId} 
          activePodcast={activePodcast}
          onSelectPodcast={handleSelectPodcast}
          showFullPlayer={showFullPlayer}
        />
      </div>
      
      {activePodcast && !showFullPlayer && (
        <BottomBar 
          activePodcast={activePodcast} 
          onTogglePlayer={handleTogglePlayer} 
        />
      )}
    </div>
  );
}