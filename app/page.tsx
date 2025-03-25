"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { TopicPanel } from "@/components/topic-panel";
import { ContentPanel } from "@/components/content-panel";
import { BottomBar } from "@/components/bottom-bar";
import { PlayerEpisode, convertToPlayerEpisode } from "@/lib/schemas/episodes";
import { Podcast } from "@/lib/schemas/podcasts";
import { episodesService } from "@/lib/services/database-service";
import { audioService } from "@/lib/services/audio-service";

///////////////////////////////////////////////////////////////////////////////
// Home component
///////////////////////////////////////////////////////////////////////////////
export default function Home() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);
  const [activePodcast, setActivePodcast] = useState<PlayerEpisode | null>(null);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = audioService.getAudioRef();
  const [handleAddPodcastCallback, setHandleAddPodcastCallback] = useState<((podcast: Podcast) => void) | null>(null);

  ///////////////////////////////////////////////////////////////////////////////
  // Handle select topic called from onSelectTopic events in TopicPanel.tsx
  ///////////////////////////////////////////////////////////////////////////////
  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Handle select podcast called from onSelectPodcast events in PodcastList.tsx 
  // and ContentPanel.tsx
  ///////////////////////////////////////////////////////////////////////////////
  const handleSelectPodcast = (playerEpisode: PlayerEpisode) => {
    setActivePodcast(playerEpisode);
    setShowFullPlayer(false);
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Handle toggle player called from onTogglePlayer events in BottomBar.tsx
  ///////////////////////////////////////////////////////////////////////////////
  const handleTogglePlayer = () => {
    setShowFullPlayer(!showFullPlayer);
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Handle search called from onSearch events in Header.tsx
  /////////////////////////////////////////////////////////////////////////////// 
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Handle clear topic
  ///////////////////////////////////////////////////////////////////////////////
  const handleClearTopic = () => {
    setSelectedTopicId(undefined);
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Render the Home component
  ///////////////////////////////////////////////////////////////////////////////
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        <TopicPanel 
          onSelectTopic={handleSelectTopic} 
          onSelectPodcast={handleSelectPodcast}
          onInitAddPodcast={(callback) => {
            console.log("Setting podcast callback");
            setHandleAddPodcastCallback(() => callback);
          }} 
        />
        <ContentPanel 
          selectedTopicId={selectedTopicId} 
          activePodcast={activePodcast}
          onSelectPodcast={handleSelectPodcast}
          showFullPlayer={showFullPlayer}
          searchQuery={searchQuery}
          audioRef={audioRef}
          onAddPodcast={handleAddPodcastCallback}
          onClearTopic={handleClearTopic}
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