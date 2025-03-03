export interface Question {
  podcast_id: string;
  question_text: string;
  question_audio?: string;
  clicks: number;
  user_id: string;
  create_datetime: Date;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Question type
export function convertToQuestion(data: any): Question {
  return {
    podcast_id: data.podcast_id,
    question_text: data.question_text,
    question_audio: data.question_audio,
    clicks: data.clicks,
    user_id: data.user_id,
    create_datetime: data.create_datetime?.toDate(),
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}