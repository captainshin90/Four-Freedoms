"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { PlusCircle, ChevronRight, ChevronLeft, X, MoreHorizontal, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { topicsService, usersService, podcastsService, episodesService } from "@/lib/services/database-service";
import { Topic } from "@/lib/schemas/topics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Podcast } from "@/lib/schemas/podcasts";
import { Episode, PlayerEpisode, convertToPlayerEpisode } from "@/lib/schemas/episodes";

///////////////////////////////////////////////////////////////////////////////
// TopicPanel component
///////////////////////////////////////////////////////////////////////////////
interface TopicPanelProps {
  onSelectTopic?: (topicId: string) => void;
  onSelectPodcast?: (podcast: PlayerEpisode) => void;
  onInitAddPodcast?: (callback: (podcast: Podcast) => void) => void;
}

export function TopicPanel({ onSelectTopic, onSelectPodcast, onInitAddPodcast }: TopicPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [availablePodcasts, setAvailablePodcasts] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<string>("Newton, MA");
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [showAllPodcasts, setShowAllPodcasts] = useState(false);
  const { user, userProfile } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const [activeTab, setActiveTab] = useState("topics");

  ////////////////////////////////////////////////////////////////////////////////
  // Handle mouse enter
  ////////////////////////////////////////////////////////////////////////////////
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
    setIsExpanded(true);
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle mouse leave
  ////////////////////////////////////////////////////////////////////////////////
  const handleMouseLeave = () => {
    if (!isClicked) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
        setIsExpanded(false);
      }, 300); // Small delay before closing
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle panel click
  ////////////////////////////////////////////////////////////////////////////////
  const handlePanelClick = () => {
    setIsClicked(!isClicked);
    setIsExpanded(true);
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle click outside
  ////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById('topic-panel');
      if (panel && !panel.contains(event.target as Node)) {
        setIsClicked(false);
        if (!isHovered) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHovered]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  ////////////////////////////////////////////////////////////////////////////////
  // Fetch topics effect
  ////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        let fetchedTopics: Topic[] = [];
        let userTopics: Topic[] = [];
        
        // Fetch all available public topics
        const publicTopics = await topicsService.getPublicTopics();
        
        if (user && userProfile?.following_topics && userProfile.following_topics.length > 0) {
          // If user is logged in, fetch their followed topics
          userTopics = (await Promise.all(
            userProfile.following_topics.map(async (topicId) => {
              const topic = await topicsService.getTopicById(topicId);
              return topic as Topic;
            })
          )).filter(Boolean);
          fetchedTopics = userTopics;
        } else {
          // Otherwise, fetch public topics
          fetchedTopics = publicTopics as Topic[] || [];
          
          // Filter to include location-based topics first
          if (userLocation && fetchedTopics) {
            fetchedTopics = [
              ...fetchedTopics.filter(t => t.topic_name === userLocation),
              ...fetchedTopics.filter(t => t.topic_name !== userLocation)
            ];
          }
        }
        
        setTopics(fetchedTopics as Topic[]);
        setAvailableTopics(publicTopics as Topic[] || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setTopics(mockTopics);
      }
    };
    
    fetchTopics();
  }, [user, userProfile, userLocation]);

  ////////////////////////////////////////////////////////////////////////////////
  // Fetch podcasts effect
  ////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        let fetchedPodcasts: Podcast[] = [];
        let userPodcasts: Podcast[] = [];
        
        // Fetch all available public podcasts
        const publicPodcasts = await podcastsService.getAllPodcasts();
        
        if (user && userProfile?.following_podcasts && userProfile.following_podcasts.length > 0) {
          // If user is logged in, fetch their followed podcasts
          userPodcasts = (await Promise.all(
            userProfile.following_podcasts.map(async (podcastId: string) => {
              const podcast = await podcastsService.getPodcastById(podcastId);
              return podcast as Podcast;
            })
          )).filter(Boolean);
          fetchedPodcasts = userPodcasts;
        } else {
          // Otherwise, fetch public podcasts
          fetchedPodcasts = publicPodcasts as Podcast[] || [];
        }
        
        setPodcasts(fetchedPodcasts as Podcast[]);
        setAvailablePodcasts(publicPodcasts as Podcast[] || []);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };
    
    fetchPodcasts();
  }, [user, userProfile]);

  ////////////////////////////////////////////////////////////////////////////////
  // Handle toggle expand
  ////////////////////////////////////////////////////////////////////////////////
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSelectedTopic(null);
      setSelectedPodcast(null);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle topic click
  ////////////////////////////////////////////////////////////////////////////////
  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    if (onSelectTopic) {
      onSelectTopic(topic.topic_id);
    }
    
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle podcast click
  ////////////////////////////////////////////////////////////////////////////////
  const handlePodcastClick = async (podcast: Podcast) => {
    try {
      // Get the first episode for this podcast
      const episodes = await episodesService.getAllEpisodes(podcast.podcast_id);
      if (!episodes || episodes.length === 0) {
        console.error("No episodes found for podcast:", podcast.podcast_id);
        return;
      }

      // Convert the first episode to a PlayerEpisode
      const firstEpisode = episodes[0] as Episode;
      const playerEpisode = convertToPlayerEpisode(podcast, firstEpisode);
      
      // Call the onSelectPodcast callback with the episode data
      if (onSelectPodcast) {
        onSelectPodcast(playerEpisode);
      }
    } catch (error) {
      console.error("Error loading podcast episode:", error);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle add topic
  ////////////////////////////////////////////////////////////////////////////////
  const handleAddTopic = async (topic: Topic) => {
    if (!user || !userProfile) return;
    
    try {
      // Check if topic is already being followed
      const isAlreadyFollowing = userProfile.following_topics?.includes(topic.topic_id);
      if (isAlreadyFollowing) {
        console.log("Topic already being followed");
        return;
      }

      // update Topic's followed_by_users with document id
      // Use Set to ensure unique user IDs
      const uniqueFollowers = new Set([...(topic.followed_by_users || []), userProfile.user_id]);
      topic.followed_by_users = Array.from(uniqueFollowers);

      await topicsService.updateTopic(topic.id, {
        followed_by_users: topic.followed_by_users
      });

      // update user's following_topics with document id
      // Use Set to ensure unique topic IDs
      const uniqueTopics = new Set([...(userProfile.following_topics || []), topic.topic_id]);
      userProfile.following_topics = Array.from(uniqueTopics);

      await usersService.updateUser(userProfile.id, {
        following_topics: userProfile.following_topics
      });
      
      // Update local state
      setTopics(prev => {
        // Check if topic already exists in local state
        const topicExists = prev.some(t => t.topic_id === topic.topic_id);
        if (topicExists) return prev;
        return [...prev, topic];
      });
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle delete topic
  ////////////////////////////////////////////////////////////////////////////////
  const handleDeleteTopic = async (topic: Topic) => {
    if (!user || !userProfile) return;
    
    try {
      // const topic = await topicsService.getTopicById(topicId);
      if (topic) {
        const updatedFollowingTopics = (userProfile.following_topics || []).filter(
          (id: string) => id !== topic.topic_id);
        await usersService.updateUser(userProfile.id, {
          following_topics: updatedFollowingTopics
        });
        userProfile.following_topics = updatedFollowingTopics;
      
        const updatedFollowingUsers = (topic.followed_by_users || []).filter(
          (id: string) => id !== userProfile.user_id); 
        await topicsService.updateTopic(topic.id, {
          followed_by_users: updatedFollowingUsers
        })
        topic.followed_by_users = updatedFollowingUsers;
      };

      // Update local state
      setTopics(prev => prev.filter(t => t.topic_id !== topic.topic_id));
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Handle add podcast
  //    Wrapped the handleAddPodcast function in useCallback.
  //    Added the dependencies [user, userProfile] that the function uses from 
  //    outside its scope.
  //    This will ensure the function reference remains stable between renders 
  //    unless user or userProfile changes, which will fix the dependency warning 
  //    in the useEffect hook.
  ////////////////////////////////////////////////////////////////////////////////
  const handleAddPodcast = useCallback(async (podcast: Podcast) => {
    if (!user || !userProfile) return;
    
    try {
      // Check if podcast is already being followed
      const isAlreadyFollowing = userProfile.following_podcasts?.includes(podcast.podcast_id);
      if (isAlreadyFollowing) {
        console.log("Podcast already being followed");
        return;
      }

      // Update podcast's followed_by_users
      const uniqueFollowers = new Set([...(podcast.followed_by_users || []), userProfile.user_id]);
      podcast.followed_by_users = Array.from(uniqueFollowers);

      await podcastsService.updatePodcast(podcast.id, {
        followed_by_users: podcast.followed_by_users
      });

      // Update user's following_podcasts
      const uniquePodcasts = new Set([...(userProfile.following_podcasts || []), podcast.podcast_id]);
      userProfile.following_podcasts = Array.from(uniquePodcasts);

      await usersService.updateUser(userProfile.id, {
        following_podcasts: userProfile.following_podcasts
      });
      
      // Update local state
      setPodcasts(prev => {
        const podcastExists = prev.some(p => p.podcast_id === podcast.podcast_id);
        if (podcastExists) return prev;
        return [...prev, podcast];
      });
    } catch (error) {
      console.error("Error adding podcast:", error);
    }
  }, [user, userProfile]);

  ////////////////////////////////////////////////////////////////////////////////
  // Handle delete podcast
  ////////////////////////////////////////////////////////////////////////////////
  const handleDeletePodcast = async (podcast: Podcast) => {
    if (!user || !userProfile) return;
    
    try {
      if (podcast) {
        const updatedFollowingPodcasts = (userProfile.following_podcasts || []).filter(
          (id: string) => id !== podcast.podcast_id);
        await usersService.updateUser(userProfile.id, {
          following_podcasts: updatedFollowingPodcasts
        });
        userProfile.following_podcasts = updatedFollowingPodcasts;
      
        const updatedFollowingUsers = (podcast.followed_by_users || []).filter(
          (id: string) => id !== userProfile.user_id); 
        await podcastsService.updatePodcast(podcast.id, {
          followed_by_users: updatedFollowingUsers
        });
        podcast.followed_by_users = updatedFollowingUsers;
      }

      // Update local state
      setPodcasts(prev => prev.filter(p => p.podcast_id !== podcast.podcast_id));
    } catch (error) {
      console.error("Error deleting podcast:", error);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  // Initialize handleAddPodcast callback
  ////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (onInitAddPodcast) {
      onInitAddPodcast(handleAddPodcast);
    }
  }, [handleAddPodcast, onInitAddPodcast]);

  ////////////////////////////////////////////////////////////////////////////////
  // Render the topic panel
  ////////////////////////////////////////////////////////////////////////////////
  const displayedTopics = showAllTopics ? topics : topics.slice(0, 10);
  const displayedPodcasts = showAllPodcasts ? podcasts : podcasts.slice(0, 10);

  return (
    <div 
      id="topic-panel"
      className={`border-r bg-card transition-all duration-500 flex flex-col h-full ${
        isExpanded ? "w-1/4" : "w-[15%]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePanelClick}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className={`font-semibold ${isExpanded ? "block" : "hidden"}`}>
          {activeTab === "topics" ? "Topics" : "Podcasts"}
        </h2>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title={`Add ${activeTab === "topics" ? "Topic" : "Podcast"}`} className="h-8 w-8">
                <PlusCircle className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent
              aria-describedby={`add-${activeTab}-description`}
            >
              <DialogHeader>
                <DialogTitle>Add {activeTab === "topics" ? "Topics" : "Podcasts"}</DialogTitle>
                <DialogDescription id={`add-${activeTab}-description`}>
                  {activeTab === "topics" 
                    ? "Select topics you want to follow. You can add multiple topics to customize your content feed."
                    : "Select podcasts you want to follow. You can add multiple podcasts to your collection."
                  }
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[300px] pr-4">
                {activeTab === "topics" ? (
                  availableTopics
                    .filter(topic => !topics.find(t => t.id === topic.id))
                    .map(topic => (
                      <div key={topic.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md overflow-hidden">
                            <Image
                              src={topic.topic_image || '/placeholder-topic.jpg'}
                              width={32}
                              height={32}
                              alt={topic.topic_name}
                              className="object-cover"
                            />
                          </div>
                          <span>{topic.topic_name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleAddTopic(topic)}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                ) : (
                  availablePodcasts
                    .filter(podcast => !podcasts.find(p => p.id === podcast.id))
                    .map(podcast => (
                      <div key={podcast.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md overflow-hidden">
                            <Image
                              src={podcast.podcast_image || '/placeholder-podcast.jpg'}
                              width={32}
                              height={32}
                              alt={podcast.podcast_title}
                              className="object-cover"
                            />
                          </div>
                          <span>{podcast.podcast_title}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleAddPodcast(podcast)}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }} 
            className="md:hidden"
          >
            {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <Tabs defaultValue="topics" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 text-xs">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        </TabsList>
        <TabsContent value="topics" className="flex-1">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {displayedTopics.map((topic) => (
                <div key={topic.topic_id} className="relative" onClick={() => handleTopicClick(topic)}>
                  {isExpanded && selectedTopic?.topic_id === topic.topic_id ? (
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-3">
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTopic(topic);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Image
                            src={topic.topic_image || '/placeholder-topic.jpg'}
                            width={200}
                            height={120}
                            alt={topic.topic_name}
                            sizes="100vw"
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "auto"
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{topic.topic_name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {topic.topic_type.charAt(0).toUpperCase() + topic.topic_type.slice(1)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div 
                      className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                        selectedTopic?.topic_id === topic.topic_id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="h-8 w-8 rounded-md overflow-hidden mr-2">
                        <Image
                          src={topic.topic_image || '/placeholder-topic.jpg'}
                          width={32}
                          height={32}
                          alt={topic.topic_name}
                          className="object-cover"
                          style={{
                            width: "100%",
                            height: "100%"
                          }}
                        />
                      </div>
                      <span className={`truncate font-semibold ${isExpanded ? "block" : "hidden"}`}>{topic.topic_name}</span>
                      {isExpanded && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTopic(topic);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {topics.length > 10 && !showAllTopics && (
                <Button
                  variant="ghost"
                  className="w-full text-center"
                  onClick={() => setShowAllTopics(true)}
                >
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  More...
                </Button>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="podcasts" className="flex-1">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {displayedPodcasts.map((podcast) => (
                <div key={podcast.podcast_id} className="relative" onClick={() => setSelectedPodcast(podcast)}>
                  {isExpanded && selectedPodcast?.podcast_id === podcast.podcast_id ? (
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-3">
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePodcast(podcast);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3 relative group">
                          <Image
                            src={podcast.podcast_image || '/placeholder-podcast.jpg'}
                            width={200}
                            height={120}
                            alt={podcast.podcast_title}
                            sizes="100vw"
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "auto"
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="rounded-full h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePodcastClick(podcast);
                              }}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{podcast.podcast_title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {Array.isArray(podcast.podcast_hosts) 
                              ? podcast.podcast_hosts.join(', ') 
                              : 'Various Hosts'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div 
                      className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                        selectedPodcast?.podcast_id === podcast.podcast_id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="h-8 w-8 rounded-md overflow-hidden mr-2 relative group">
                        <Image
                          src={podcast.podcast_image || '/placeholder-podcast.jpg'}
                          width={32}
                          height={32}
                          alt={podcast.podcast_title}
                          className="object-cover"
                          style={{
                            width: "100%",
                            height: "100%"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="rounded-full h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePodcastClick(podcast);
                            }}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <span className={`truncate font-semibold ${isExpanded ? "block" : "hidden"}`}>{podcast.podcast_title}</span>
                      {isExpanded && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePodcast(podcast);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {podcasts.length > 10 && !showAllPodcasts && (
                <Button
                  variant="ghost"
                  className="w-full text-center"
                  onClick={() => setShowAllPodcasts(true)}
                >
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  More...
                </Button>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  ); 
} // end of TopicPanel component


// Mock data for fallback
const mockTopics = [
  {
    id: "1",
    topic_id: "1",
    topic_name: "Newton, MA",
    topic_image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&h=200&fit=crop",
    topic_type: "place",
    related_topic_tags: ["Massachusetts", "Boston suburbs", "education"],
    datetime: new Date(),
    is_private: false,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "2",
    topic_id: "2",
    topic_name: "Massachusetts",
    topic_image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&h=200&fit=crop",
    topic_type: "place",
    related_topic_tags: ["New England", "Boston", "education", "politics"],
    datetime: new Date(),
    is_private: false,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "3",
    topic_id: "3",
    topic_name: "Education Reform",
    topic_image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop",
    topic_type: "issue",
    related_topic_tags: ["education", "schools", "policy"],
    datetime: new Date(),
    is_private: false,
    is_active: true,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];