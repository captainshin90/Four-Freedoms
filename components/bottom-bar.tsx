"use client";

import { PodcastPlayer } from "@/components/podcast-player";

interface BottomBarProps {
  activePodcast: any | null;
  onTogglePlayer: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export function BottomBar({ activePodcast, onTogglePlayer, audioRef }: BottomBarProps) {
  if (!activePodcast) {
    return null;
  }

  return (
    <PodcastPlayer 
      podcast={activePodcast} 
      isMinimized={true} 
      onToggleMinimize={onTogglePlayer}
      audioRef={audioRef}
    />
  );
}