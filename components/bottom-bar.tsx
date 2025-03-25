"use client";

import { PodcastPlayer } from "@/components/podcast-player";

interface BottomBarProps {
  activePodcast: any | null;
  onTogglePlayer: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}
///////////////////////////////////////////////////////////////////////////////
// BottomBar component for the bottom bar of the app
///////////////////////////////////////////////////////////////////////////////
export function BottomBar({ activePodcast, onTogglePlayer, audioRef }: BottomBarProps) {
  if (!activePodcast) {
    return null;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Render the component
  ///////////////////////////////////////////////////////////////////////////////
  return (
    <PodcastPlayer 
      podcast={activePodcast} 
      isMinimized={true} 
      onToggleMinimize={onTogglePlayer}
      audioRef={audioRef}
    />
  );
}