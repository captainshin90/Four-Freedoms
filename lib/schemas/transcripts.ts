export type TranscriptType = 'interview' | 'meeting' | 'article' | 'petition';

export interface Transcript {
  id: string; // Firestore Document ID
  transcript_id: string; // Transcript ID
  transcript_type: TranscriptType; // Transcript Type
  topic_tags: string[]; // Topic Tags
  modified_datetime?: Date; // Modified Date and Time
  delete_datetime?: Date; // Delete Date and Time
  transcript_model: string; // Transcript Model
  transcript_text: string; // Transcript Text
  created_at: Date; // Created Date and Time
  updated_at: Date; // Updated Date and Time
  is_active: boolean; // Is Active
  is_deleted: boolean; // Is Deleted
}

// Helper function to convert Firestore data to Transcript type
export function convertToTranscript(data: any): Transcript {
  return {
    id: data.id,
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