"use client";

import { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { podcastsService } from "@/lib/services/database-service";
import { Podcast } from "@/lib/schemas/podcasts";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {Firestore} from "firebase/firestore";
import {db} from "@/lib/firebase";

interface PodcastListProps {
  topicId?: string;
  onSelectPodcast: (podcast: any) => void;
}

export function PodcastList({ topicId, onSelectPodcast }: PodcastListProps) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPodcasts, setLikedPodcasts] = useState<Record<string, boolean>>({});
  const [dislikedPodcasts, setDislikedPodcasts] = useState<Record<string, boolean>>({});
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        let podcastData;
        
        if (topicId) {
          podcastData = await podcastsService.getPodcastsByTopic(topicId);
        } else {
          podcastData = await podcastsService.getAllPodcasts();
        }
        
        setPodcasts(podcastData as Podcast[]);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        // Fallback to mock data
        setPodcasts(mockPodcasts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPodcasts();
  }, [topicId]);

  const handlePlayPodcast = (podcast: Podcast) => {
    // Check if premium content is accessible
    if (podcast.subscription_type === 'premium' && (!user || userProfile?.subscription_type !== 'premium')) {
      toast({
        title: "Premium Content",
        description: "This is premium content. Please subscribe to access.",
        variant: "destructive"
      });
      return;
    }
    
    // Get the first episode for this podcast
    const firstEpisode = {
      id: `${podcast.podcast_id}-ep1`,
      title: podcast.podcast_title,
      image: podcast.podcast_image,
      audioUrl: 'https://example.com/audio/episode1.mp3', // This would be a real URL in production
      duration: 1800 // 30 minutes in seconds
    };
    
    onSelectPodcast(firstEpisode);
  };

  const handleAddToTopics = (podcast: Podcast) => {
    // Implement add to topics functionality
    toast({
      title: "Added to Topics",
      description: `${podcast.podcast_title} has been added to your topics.`
    });
  };

  const handleLike = (podcast: Podcast, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like podcasts.",
        variant: "default"
      });
      return;
    }
    
    const podcastId = podcast.podcast_id;
    
    // Toggle like status
    setLikedPodcasts(prev => {
      const newState = { ...prev };
      newState[podcastId] = !prev[podcastId];
      
      // If liking, remove from disliked
      if (newState[podcastId]) {
        setDislikedPodcasts(prev => ({
          ...prev,
          [podcastId]: false
        }));
      }
      
      return newState;
    });
    
    toast({
      title: likedPodcasts[podcastId] ? "Removed Like" : "Liked",
      description: `You ${likedPodcasts[podcastId] ? "removed your like from" : "liked"} ${podcast.podcast_title}.`
    });
    
    // Here you would update the like in your database
    // This is a placeholder for the actual implementation
  };

  const handleDislike = (podcast: Podcast, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to dislike podcasts.",
        variant: "default"
      });
      return;
    }
    
    const podcastId = podcast.podcast_id;
    
    // Toggle dislike status
    setDislikedPodcasts(prev => {
      const newState = { ...prev };
      newState[podcastId] = !prev[podcastId];
      
      // If disliking, remove from liked
      if (newState[podcastId]) {
        setLikedPodcasts(prev => ({
          ...prev,
          [podcastId]: false
        }));
      }
      
      return newState;
    });
    
    toast({
      title: dislikedPodcasts[podcastId] ? "Removed Dislike" : "Disliked",
      description: `You ${dislikedPodcasts[podcastId] ? "removed your dislike from" : "disliked"} ${podcast.podcast_title}.`
    });
    
    // Here you would update the dislike in your database
    // This is a placeholder for the actual implementation
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-muted animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // If no podcasts from database, use mock data
  const displayPodcasts = podcasts && podcasts.length > 0 ? podcasts : mockPodcasts;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {displayPodcasts.map((podcast) => (
        <Card key={podcast.podcast_id} className="overflow-hidden group">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <Image
                src={podcast.podcast_image}
                alt={podcast.podcast_title}
                fill
                className="object-cover transition-all"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full h-12 w-12 mr-2"
                  onClick={() => handlePlayPodcast(podcast)}
                >
                  <Play className="h-6 w-6" />
                </Button>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full h-12 w-12"
                  onClick={() => handleAddToTopics(podcast)}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
              {podcast.subscription_type === 'premium' && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Premium
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">{podcast.podcast_title}</h3>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${likedPodcasts[podcast.podcast_id] ? 'text-green-500' : ''}`}
                    onClick={(e) => handleLike(podcast, e)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${dislikedPodcasts[podcast.podcast_id] ? 'text-red-500' : ''}`}
                    onClick={(e) => handleDislike(podcast, e)}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {Array.isArray(podcast.podcast_hosts) 
                  ? podcast.podcast_hosts.join(', ') 
                  : 'Various Hosts'}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mock data for fallback
const mockPodcasts = [
  {
    podcast_id: "1",
    podcast_title: "Newton Community Voices",
    podcast_hosts: ["Jane Smith", "John Doe"],
    podcast_image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&h=500&fit=crop",
    podcast_desc: "A podcast featuring voices from the Newton community discussing local issues",
    podcast_type: "audio_podcast" as const,
    podcast_format: "mp3" as const,
    topic_tags: [],
    create_datetime: new Date(),
    subscription_type: "free",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    podcast_id: "2",
    podcast_title: "Massachusetts Education Matters",
    podcast_hosts: ["Dr. Emily Johnson", "Prof. Michael Brown"],
    podcast_image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500&h=500&fit=crop",
    podcast_desc: "Discussions about education policy and reform in Massachusetts",
    podcast_type: "audio_podcast" as const,
    podcast_format: "mp3" as const,
    topic_tags: [],
    create_datetime: new Date(),
    subscription_type: "premium",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    podcast_id: "3",
    podcast_title: "Policy Insights with Senator Warren",
    podcast_hosts: ["Sarah Williams", "Senator Elizabeth Warren"],
    podcast_image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=500&fit=crop",
    podcast_desc: "Deep dives into policy issues with Senator Elizabeth Warren",
    podcast_type: "audio_podcast" as const,
    podcast_format: "mp3" as const,
    topic_tags: [],
    create_datetime: new Date(),
    subscription_type: "premium",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    podcast_id: "4",
    podcast_title: "Newton High School Sports Report",
    podcast_hosts: ["David Green", "Lisa Park"],
    podcast_image: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=500&h=500&fit=crop",
    podcast_desc: "Coverage of Newton High School sports teams and events",
    podcast_type: "audio_podcast" as const,
    podcast_format: "mp3" as const,
    topic_tags: [],
    create_datetime: new Date(),
    subscription_type: "free",
    created_at: new Date(),
    updated_at: new Date()
  }
];