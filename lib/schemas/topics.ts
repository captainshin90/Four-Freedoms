
// export type TopicType = 'place' | 'company' | 'school' | 'club' | 'person' | 'sport' | 'issue';

export interface Topic {
  topic_id: string;
  topic_name: string;
  topic_image?: string;
//  topic_type: TopicType;
  topic_type: string;
  related_topic_tags?: string[];
  datetime: Date;
  followed_by_users?: string[];
  is_private: boolean;
  managed_by?: string[];
  is_active: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Topic type
export function convertToTopic(data: any): Topic {
  return {
    topic_id: data.topic_id = crypto.randomUUID(),
    topic_name: data.topic_name,
    topic_image: data.topic_image,
    topic_type: data.topic_type,
    related_topic_tags: data.related_topic_tags,
    datetime: data.datetime?.toDate(),
    followed_by_users: data.followed_by_users,
    is_private: data.is_private,
    managed_by: data.managed_by,
    is_active: data.is_active = true,
    is_deleted: data.is_deleted = false,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}