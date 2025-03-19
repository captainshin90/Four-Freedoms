export type TranscriptType = 'interview' | 'meeting' | 'article' | 'petition';

export interface Transcript {
  transcript_id: string;
  transcript_type: TranscriptType;
  topic_tags: string[];
  modified_datetime?: Date;
  delete_datetime?: Date;
  transcript_model: string;
  transcript_text: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_deleted: boolean;
}

// Helper function to convert Firestore data to Transcript type
export function convertToTranscript(data: any): Transcript {
  return {
    transcript_id: data.transcript_id = crypto.randomUUID(),
    transcript_type: data.transcript_type,
    topic_tags: data.topic_tags,
    modified_datetime: data.modified_datetime?.toDate(),
    delete_datetime: data.delete_datetime?.toDate(),
    transcript_model: data.transcript_model,
    transcript_text: data.transcript_text,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate(),
    is_active: data.is_active = true,
    is_deleted: data.is_deleted = false
  };
}