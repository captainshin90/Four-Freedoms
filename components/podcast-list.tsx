"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { podcastsService } from "@/lib/services/database-service";
import { Podcast } from "@/lib/schemas/podcasts";
import { Episode, PlayerEpisode, convertToPlayerEpisode } from "@/lib/schemas/episodes";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { episodesService } from "@/lib/services/database-service";
import { topicsService } from "@/lib/services/database-service";
import { usersService } from "@/lib/services/database-service";

///////////////////////////////////////////////////////////////////////////////
// PodcastList component
///////////////////////////////////////////////////////////////////////////////
interface PodcastListProps {
  topicId?: string;
  searchQuery?: string;
  onSelectPodcast: (episodeData: PlayerEpisode) => void;
  onAddPodcast?: (podcast: Podcast) => void;
}

export function PodcastList({ topicId, searchQuery, onSelectPodcast, onAddPodcast }: PodcastListProps) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPodcasts, setLikedPodcasts] = useState<Record<string, boolean>>({});
  const [dislikedPodcasts, setDislikedPodcasts] = useState<Record<string, boolean>>({});
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  ///////////////////////////////////////////////////////////////////////////////
  // Function to fetch default podcasts
  ///////////////////////////////////////////////////////////////////////////////
  const fetchDefaultPodcasts = async () => {
    try {
      setLoading(true);
      const podcastData = await podcastsService.getActivePodcasts();
      const validPodcasts = (podcastData as Podcast[]).filter(podcast => podcast.id);
      setPodcasts(validPodcasts);
    } catch (error) {
      console.error("Error fetching default podcasts:", error);
      setPodcasts(mockPodcasts);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Add fetch podcasts by topicId effect
  ///////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        let podcastData;
        
        // when is topicId set? Should it be topicName?
        if (topicId) {
          podcastData = await podcastsService.getPodcastsByTopic(topicId);
        } else {
          podcastData = await podcastsService.getActivePodcasts();
        }
        
        const validPodcasts = (podcastData as Podcast[]).filter(podcast => podcast.id);
        setPodcasts(validPodcasts);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        setPodcasts(mockPodcasts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPodcasts();
  }, [topicId]);

  ///////////////////////////////////////////////////////////////////////////////
  // Add search effect
  ///////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const searchPodcasts = async () => {
      if (!searchQuery) {
        setShowEmptyMessage(false);
        fetchDefaultPodcasts();
        return;
      }

      try {
        setLoading(true);
        setShowEmptyMessage(false);
        
        // Get all podcasts and their episodes
        const [podcastData, allEpisodes] = await Promise.all([
          podcastsService.getActivePodcasts(),
          Promise.all((await podcastsService.getActivePodcasts() || []).map(
            podcast => episodesService.getActiveEpisodes(podcast.id)
          ))
        ]);

        if (!podcastData) {
          setPodcasts([]);
          setShowEmptyMessage(true);
          // Show default podcasts after 3 seconds
          setTimeout(() => {
            setShowEmptyMessage(false);
            fetchDefaultPodcasts();
          }, 3000);
          return;
        }

        // Flatten episodes array
        const episodes = allEpisodes.flat().filter(Boolean);

        // Search through podcasts and their episodes
        const searchResults = (podcastData as Podcast[]).filter(podcast => {
          const matchInPodcast = 
            podcast.podcast_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            podcast.podcast_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            podcast.podcast_hosts.some(host => 
              host.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            podcast.topic_tags.some(tag => 
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            );

          const matchInEpisodes = episodes
            .filter(episode => episode && episode.podcast_id === podcast.id)
            .some(episode => episode && (
              episode.episode_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              episode.episode_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
              episode.topic_tags.some((tag: string) => 
                tag.toLowerCase().includes(searchQuery.toLowerCase())
              )
            ));

          return matchInPodcast || matchInEpisodes;
        });

        if (searchResults.length === 0) {
          setShowEmptyMessage(true);
          setTimeout(() => {
            setShowEmptyMessage(false);
            fetchDefaultPodcasts();
          }, 3000);
        }
        setPodcasts(searchResults);
      } catch (error) {
        console.error("Error searching podcasts:", error);
        toast({
          title: "Search Error",
          description: "Failed to search podcasts. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      searchPodcasts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, toast]);

  ///////////////////////////////////////////////////////////////////////////////
  // Add handlePlayPodcast 
  ///////////////////////////////////////////////////////////////////////////////
  const handlePlayPodcast = async (podcast: Podcast) => {
    // Check if premium content is accessible
    if (podcast.subscription_type === 'premium' && (!user || userProfile?.subscription_type !== 'premium')) {
      toast({
        title: "Premium Content",
        description: "This is premium content. Please subscribe to access.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Get the first episode for this podcast
      // QUESTION: what if there are no episodes?
      const episodes = await episodesService.getActiveEpisodes(podcast.id);
      if (!episodes || episodes.length === 0) {
        toast({
          title: "Error",
          description: "No episodes available for this podcast.",
          variant: "destructive"
        });
        return;
      }

      // Convert the first episode to a PlayerEpisode
      const firstEpisode = episodes[0] as Episode;
      const episodeData = convertToPlayerEpisode(firstEpisode);
      
      // Call the onSelectPodcast callback with the episode data
      onSelectPodcast(episodeData);  // defined in Page.tsx as handleSelectPodcast() function
    } catch (error) {
      console.error("Error fetching episode:", error);
      toast({
        title: "Error",
        description: "Failed to load the podcast episode. Please try again.",
        variant: "destructive"
      });
    }
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Add handleAddToTopics 
  ///////////////////////////////////////////////////////////////////////////////
  const handleAddToTopics = async (podcast: Podcast) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add podcasts to your topics.",
        variant: "default"
      });
      return;
    }

    try {
      // Get the podcast's topic tags
      const topicTags = podcast.topic_tags || [];
      if (topicTags.length === 0) {
        toast({
          title: "No Topics Available",
          description: "This podcast doesn't have any associated topics.",
          variant: "destructive"
        });
        return;
      }

      // Get the user's current profile
      const currentProfile = userProfile;
      if (!currentProfile) {
        toast({
          title: "Error",
          description: "Could not find your user profile.",
          variant: "destructive"
        });
        return;
      }

      // Get all topics
      const allTopics = await topicsService.getActiveTopics();
      if (!allTopics) {
        toast({
          title: "Error",
          description: "Could not fetch available topics.",
          variant: "destructive"
        });
        return;
      }

      // Find matching topics from the podcast's tags
      const matchingTopics = allTopics.filter(topic => 
        topic.related_topic_tags?.some((tag: string) => topicTags.includes(tag))
      );

      if (matchingTopics.length === 0) {
        toast({
          title: "No Matching Topics",
          description: "No matching topics found for this podcast.",
          variant: "destructive"
        });
        return;
      }

      // Update user's following_topics array with new topic IDs
      const updatedFollowingTopics = [...(currentProfile.following_topics || [])];
      let newTopicsAdded = false;

      matchingTopics.forEach(topic => {
        if (!updatedFollowingTopics.includes(topic.topic_id)) {
          updatedFollowingTopics.push(topic.topic_id);
          newTopicsAdded = true;
        }
      });

      if (!newTopicsAdded) {
        toast({
          title: "Already Following",
          description: "You are already following all topics for this podcast.",
          variant: "default"
        });
        return;
      }

      // Update the user's profile in the database
      await usersService.updateUser(user.uid, {
        following_topics: updatedFollowingTopics
        // updated_at: new Date() // no need for this field
      });

      toast({
        title: "Topics Added",
        description: `Added ${matchingTopics.length} new topic${matchingTopics.length > 1 ? 's' : ''} to your following list.`
      });
    } catch (error) {
      console.error("Error adding podcast to topics:", error);
      toast({
        title: "Error",
        description: "Failed to add podcast to your topics. Please try again.",
        variant: "destructive"
      });
    }
  };

  ///////////////////////////////////////////////////////////////////////////////
  // Add handleLike
  ///////////////////////////////////////////////////////////////////////////////
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
    
    const podcastId = podcast.id;
    
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

  ///////////////////////////////////////////////////////////////////////////////
  // Add handleDislike
  ///////////////////////////////////////////////////////////////////////////////
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
    
    const podcastId = podcast.id; 
    
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
          <Card key={`loading-${i}`} className="overflow-hidden">
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

  if (showEmptyMessage) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-lg font-semibold mb-2">No podcasts found</div>
        <p className="text-muted-foreground mb-4">
          We could not find any podcasts matching your search.
          <br />
          Showing you our recommended podcasts in a moment...
        </p>
      </div>
    );
  }

  // If no podcasts from database, use mock data
  const displayPodcasts = podcasts && podcasts.length > 0 ? podcasts : mockPodcasts;
  
  ///////////////////////////////////////////////////////////////////////////////
  // Render the podcast list
  ///////////////////////////////////////////////////////////////////////////////
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {displayPodcasts.map((podcast) => (
        <Card 
          key={`podcast-${podcast.id || `fallback-${Math.random()}`}`}
          className="cursor-pointer hover:shadow-lg transition-shadow group"
          onClick={() => handlePlayPodcast(podcast)}
        >
          <CardContent className="p-0">
            <div className="relative aspect-video group">
              <Image
                src={podcast.podcast_image || '/placeholder-podcast.jpg'}
                alt={podcast.podcast_title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-all"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full h-8 w-8 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPodcast(podcast);
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddPodcast && user) {
                        onAddPodcast(podcast);
                    } else if (!user) {
                      toast({
                        title: "Sign in required",
                        description: "Please sign in to add podcasts to your list.",
                        variant: "default"
                      });
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {podcast.subscription_type === 'premium' && (
                <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                  Premium
                </div>
              )}
            </div>
            <div className="p-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm truncate">{podcast.podcast_title}</h3>
                <div className="flex space-x-0.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 ${likedPodcasts[podcast.id] ? 'text-green-500' : ''}`}
                    onClick={(e) => handleLike(podcast, e)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 ${dislikedPodcasts[podcast.id] ? 'text-red-500' : ''}`}
                    onClick={(e) => handleDislike(podcast, e)}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">
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
const mockPodcasts: Podcast[] = [
  {
    id: "mock-1",
    podcast_title: "Newton Community Voices",
    podcast_slug: "newton-community-voices",
    podcast_tagline: "A podcast featuring voices from the Newton community discussing local issues",
    podcast_language: "en",
    podcast_hosts: ["Jane Smith", "John Doe"],
    podcast_image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&h=500&fit=crop",
    podcast_desc: "A podcast featuring voices from the Newton community discussing local issues",
    podcast_type: "audio_podcast",
    podcast_format: "mp3",
    topic_tags: [],
    subscription_type: "free" as const,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "mock-2",
    podcast_title: "Massachusetts Education Matters",
    podcast_slug: "massachusetts-education-matters",
    podcast_tagline: "Discussions about education policy and reform in Massachusetts",
    podcast_language: "en",
    podcast_hosts: ["Dr. Emily Johnson", "Prof. Michael Brown"],
    podcast_image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500&h=500&fit=crop",
    podcast_desc: "Debug: Discussions about education policy and reform in Massachusetts",
    podcast_type: "audio_podcast",
    podcast_format: "mp3",
    topic_tags: [],
    subscription_type: "premium" as const,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "mock-3",
    podcast_title: "Policy Insights with Senator Warren",
    podcast_slug: "policy-insights-warren",
    podcast_tagline: "Deep dives into policy issues with Senator Elizabeth Warren",
    podcast_language: "en",
    podcast_hosts: ["Sarah Williams", "Senator Elizabeth Warren"],
    podcast_image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500&h=500&fit=crop",
    podcast_desc: "Debug: Deep dives into policy issues with Senator Elizabeth Warren",
    podcast_type: "audio_podcast",
    podcast_format: "mp3",
    topic_tags: [],
    subscription_type: "premium" as const,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "mock-4",
    podcast_title: "Newton High School Sports Report",
    podcast_slug: "newton-high-sports",
    podcast_tagline: "Coverage of Newton High School sports teams and events",
    podcast_language: "en",
    podcast_hosts: ["David Green", "Lisa Park"],
    podcast_image: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=500&h=500&fit=crop",
    podcast_desc: "Coverage of Newton High School sports teams and events",
    podcast_type: "audio_podcast",
    podcast_format: "mp3",
    topic_tags: [],
    subscription_type: "free" as const,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date(),
  }
];