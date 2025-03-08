export type PodcastType = 'summary' | 'audio_podcast' | 'video_podcast';
export type PodcastFormat = 'html' | 'mp3' | 'mp4';

export interface Podcast {
  podcast_id: string;
  podcast_title: string;
  podcast_image: string;
  podcast_desc: string;
  podcast_type: PodcastType;
  podcast_hosts: string[];
  podcast_format: PodcastFormat;
  topic_tags: string[];
  prompt_id?: string;
  followers?: string[];
  create_datetime: Date;
  subscription_type: string;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Podcast type
export function convertToPodcast(data: any): Podcast {
  return {
    podcast_id: data.id || data.podcast_id,
    podcast_title: data.podcast_title,
    podcast_image: data.podcast_image,
    podcast_desc: data.podcast_desc,
    podcast_type: data.podcast_type,
    podcast_hosts: data.podcast_hosts,
    podcast_format: data.podcast_format,
    topic_tags: data.topic_tags,
    prompt_id: data.prompt_id,
    followers: data.followers,
    create_datetime: data.create_datetime?.toDate(),
    subscription_type: data.subscription_type,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}