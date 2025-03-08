"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/legacy/image";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface PodcastPlayerProps {
  podcast: {
    id: string;
    title: string;
    image: string;
    audioUrl: string;
    duration: number;
  };
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function PodcastPlayer({ podcast, isMinimized = false, onToggleMinimize }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(podcast.duration || 0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Auto-play when podcast changes
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Auto-play failed:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [podcast.id]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Play failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };
  
  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 15);
    }
  };
  
  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 15);
    }
  };

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like episodes.",
        variant: "default"
      });
      return;
    }
    
    // Toggle like status
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // If liking, remove dislike
    if (newLikedState && isDisliked) {
      setIsDisliked(false);
    }
    
    toast({
      title: newLikedState ? "Liked" : "Removed Like",
      description: `You ${newLikedState ? "liked" : "removed your like from"} this episode.`
    });
    
    // Here you would update the like in your database
    // This is a placeholder for the actual implementation
  };

  const handleDislike = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to dislike episodes.",
        variant: "default"
      });
      return;
    }
    
    // Toggle dislike status
    const newDislikedState = !isDisliked;
    setIsDisliked(newDislikedState);
    
    // If disliking, remove like
    if (newDislikedState && isLiked) {
      setIsLiked(false);
    }
    
    toast({
      title: newDislikedState ? "Disliked" : "Removed Dislike",
      description: `You ${newDislikedState ? "disliked" : "removed your dislike from"} this episode.`
    });
    
    // Here you would update the dislike in your database
    // This is a placeholder for the actual implementation
  };

  if (isMinimized) {
    return (
      <div className="border-t bg-card p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 w-1/4">
          <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
            <Image src={podcast.image} alt={podcast.title} className="w-full h-full object-cover" />
          </div>
          <div className="truncate">
            <h3 className="font-medium truncate">{podcast.title}</h3>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleSkipBack}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button 
            onClick={togglePlay} 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSkipForward}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isLiked ? 'text-green-500' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isDisliked ? 'text-red-500' : ''}`}
            onClick={handleDislike}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
          {onToggleMinimize && (
            <Button variant="ghost" size="icon" onClick={onToggleMinimize}>
              <Maximize2 className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <audio
          ref={audioRef}
          src={podcast.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={handleTimeUpdate}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden border">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
              <Image src={podcast.image} alt={podcast.title} layout="fill" objectFit="cover" />
            <div>
              <h3 className="font-medium">{podcast.title}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${isLiked ? 'text-green-500' : ''}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${isDisliked ? 'text-red-500' : ''}`}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            {onToggleMinimize && (
              <Button variant="ghost" size="icon" onClick={onToggleMinimize}>
                <Minimize2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleSkipBack}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                onClick={togglePlay} 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSkipForward}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="w-[88px]"></div> {/* Spacer to balance the layout */}
          </div>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={podcast.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
        className="hidden"
      />
    </div>
  );
}