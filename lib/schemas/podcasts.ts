export type PodcastType = 'summary' | 'audio_podcast' | 'video_podcast';
export type PodcastFormat = 'html' | 'mp3' | 'mp4';

export interface Podcast {
  id: string; // Firestore Document ID
  podcast_id: string; // Podcast ID
  podcast_title: string; // Podcast Title
  podcast_hosts: string[]; // Podcast Hosts
  podcast_image: string; // Podcast Image
  podcast_desc: string; // Podcast Description
  podcast_type: 'audio_podcast'; // Podcast Type
  podcast_format: 'mp3'; // Podcast Format
  followed_by_users?: string[]; // Followed By Users
  topic_tags: string[]; // Topic Tags
  subscription_type: 'free' | 'premium'; // Subscription Type
  created_at: Date; // Created Date and Time
  updated_at: Date; // Updated Date and Time
  is_active: boolean; // Is Active
  is_deleted: boolean; // Is Deleted
}


// Helper function to convert Firestore data to Podcast type
export function convertToPodcast(data: any): Podcast {
  return {
    id: data.id,
    podcast_id: data.podcast_id = crypto.randomUUID(),
    podcast_title: data.podcast_title,
    podcast_image: data.podcast_image,
    podcast_desc: data.podcast_desc,
    podcast_type: data.podcast_type,
    podcast_hosts: data.podcast_hosts,
    podcast_format: data.podcast_format,
    topic_tags: data.topic_tags,
    subscription_type: data.subscription_type,
    followed_by_users: data.followed_by_users,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate(),
    is_active: data.is_active = true,
    is_deleted: data.is_deleted = false
  };
}