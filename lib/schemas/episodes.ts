export interface Episode {
  episode_id: string;
  podcast_id: string;
  episode_title: string;
  episode_desc: string;
  topic_tags: string[];
  views: number;
  likes: number;
  dislikes: number;
  create_datetime: Date;
  publish_datetime: Date;
  expire_datetime?: Date;
  content_duration: number; // in seconds
  content_url: string;
  content_image: string;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Episode type
export function convertToEpisode(data: any): Episode {
  return {
    episode_id: data.id || data.episode_id,
    podcast_id: data.podcast_id,
    episode_title: data.episode_title,
    episode_desc: data.episode_desc,
    topic_tags: data.topic_tags,
    views: data.views,
    likes: data.likes,
    dislikes: data.dislikes,
    create_datetime: data.create_datetime?.toDate(),
    publish_datetime: data.publish_datetime?.toDate(),
    expire_datetime: data.expire_datetime?.toDate(),
    content_duration: data.content_duration,
    content_url: data.content_url,
    content_image: data.content_image,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}