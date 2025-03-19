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
import Image from "next/image";
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
  audioRef: React.RefObject<HTMLAudioElement>;
}

export function PodcastPlayer({ podcast, isMinimized = false, onToggleMinimize, audioRef }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(podcast.duration || 0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState("");
  const [isAudioReady, setIsAudioReady] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize audio element
  useEffect(() => {
    if (!audioRef?.current) return;

    const audio = audioRef.current;
    
    // Set up event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      toast({
        title: "Error playing audio",
        description: "There was an error playing the podcast. Please try again.",
        variant: "destructive",
      });
    };

    const handleCanPlay = () => {
      setIsAudioReady(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioRef, toast]);

  // Handle podcast changes
  useEffect(() => {
    if (!audioRef?.current || !isAudioReady) return;

    const audio = audioRef.current;
    const playAudio = async () => {
      try {
        audio.src = podcast.audioUrl;
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Auto-play failed:", error);
          setIsPlaying(false);
        }
      }
    };
    
    playAudio();
    
    return () => {
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    };
  }, [podcast.id, podcast.audioUrl, audioRef, isAudioReady]);
  
  useEffect(() => {
    setTimeDisplay(new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    }));
  }, []);

  const togglePlay = () => {
    if (!audioRef?.current || !isAudioReady) {
      console.warn('Audio element not ready');
      return;
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!audioRef?.current || !isAudioReady) return;
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef?.current || !isAudioReady) return;
    const newVolume = value[0];
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
    setIsMuted(newVolume === 0);
  };
  
  const handleSeek = (value: number[]) => {
    if (!audioRef?.current || !isAudioReady) return;
    audioRef.current.currentTime = value[0];
  };
  
  const handleSkipBack = () => {
    if (!audioRef?.current || !isAudioReady) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };
  
  const handleSkipForward = () => {
    if (!audioRef?.current || !isAudioReady) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like podcasts.",
        variant: "destructive",
      });
      return;
    }

    setIsLiked(!isLiked);
    setIsDisliked(false);
    // TODO: Implement like functionality
  };

  const handleDislike = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to dislike podcasts.",
        variant: "destructive",
      });
      return;
    }

    setIsDisliked(!isDisliked);
    setIsLiked(false);
    // TODO: Implement dislike functionality
  };

  if (isMinimized) {
    return (
      <div className="flex items-center justify-between p-2 bg-card rounded-lg border">
        <div className="flex items-center space-x-3">
          <div className="relative w-[40px] h-[40px] rounded-md overflow-hidden">
            <Image
              src={podcast.image}
              alt={podcast.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm">{podcast.title}</h3>
            <p className="text-xs text-muted-foreground">{formatTime(currentTime)} / {formatTime(duration)}</p>
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
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden border">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden">
              <Image
                src={podcast.image}
                alt={podcast.title}
                fill
                sizes="100px"
                className="object-cover"
              />
            </div>
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
              <span>{timeDisplay}</span>
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
    </div>
  );
}