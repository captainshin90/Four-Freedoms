export interface Question {
  question_id: string;
  podcast_id: string;
  question_text: string;
  question_audio?: string;
  clicks: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_deleted: boolean;
}

// Helper function to convert Firestore data to Question type
export function convertToQuestion(data: any): Question {
  return {
    question_id: data.question_id = crypto.randomUUID(),
    podcast_id: data.podcast_id,
    question_text: data.question_text,
    question_audio: data.question_audio,
    clicks: data.clicks,
    user_id: data.user_id,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate(),
    is_active: data.is_active = true,
    is_deleted: data.is_deleted = false
  };
}