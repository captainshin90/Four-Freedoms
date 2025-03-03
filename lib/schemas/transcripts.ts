export type TranscriptType = 'interview' | 'meeting' | 'article' | 'petition';

export interface Transcript {
  transcript_id: string;
  transcript_type: TranscriptType;
  topic_tags: string[];
  create_datetime: Date;
  modified_datetime?: Date;
  delete_datetime?: Date;
  transcript_model: string;
  transcript_text: string;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Transcript type
export function convertToTranscript(data: any): Transcript {
  return {
    transcript_id: data.id || data.transcript_id,
    transcript_type: data.transcript_type,
    topic_tags: data.topic_tags,
    create_datetime: data.create_datetime?.toDate(),
    modified_datetime: data.modified_datetime?.toDate(),
    delete_datetime: data.delete_datetime?.toDate(),
    transcript_model: data.transcript_model,
    transcript_text: data.transcript_text,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}