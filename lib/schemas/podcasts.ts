export type PodcastType = 'summary' | 'audio_podcast' | 'video_podcast';
export type PodcastFormat = 'html' | 'mp3' | 'mp4';

export interface Podcast {
  podcast_id: string;
  podcast_title: string;
  podcast_hosts: string[];
  podcast_image: string;
  podcast_desc: string;
  podcast_type: 'audio_podcast';
  podcast_format: 'mp3';
  topic_tags: string[];
  subscription_type: 'free' | 'premium';
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_deleted: boolean;
}

// Helper function to convert Firestore data to Podcast type
export function convertToPodcast(data: any): Podcast {
  return {
    podcast_id: data.podcast_id = crypto.randomUUID(),
    podcast_title: data.podcast_title,
    podcast_image: data.podcast_image,
    podcast_desc: data.podcast_desc,
    podcast_type: data.podcast_type,
    podcast_hosts: data.podcast_hosts,
    podcast_format: data.podcast_format,
    topic_tags: data.topic_tags,
    // prompt_id: data.prompt_id,
    // followers: data.followers,
    subscription_type: data.subscription_type,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate(),
    is_active: data.is_active = true,
    is_deleted: data.is_deleted = false
  };
}