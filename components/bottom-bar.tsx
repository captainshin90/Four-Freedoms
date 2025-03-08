"use client";

import { PodcastPlayer } from "@/components/podcast-player";

interface BottomBarProps {
  activePodcast: any | null;
  onTogglePlayer: () => void;
}

export function BottomBar({ activePodcast, onTogglePlayer }: BottomBarProps) {
  if (!activePodcast) {
    return null;
  }

  return (
    <PodcastPlayer 
      podcast={activePodcast} 
      isMinimized={true} 
      onToggleMinimize={onTogglePlayer}
    />
  );
}