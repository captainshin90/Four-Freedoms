export interface Prompt {
  prompt_id: string;
  prompt_name: string;
  prompt_desc: string;
  created_by: string;
  modified_datetime?: Date;
  delete_datetime?: Date;
  is_active: boolean;
  is_deleted: boolean;
  target_persona: string;
  prompt_text: string;
  prompt_audio?: string;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Prompt type
export function convertToPrompt(data: any): Prompt {
  return {
    prompt_id: data.prompt_id = crypto.randomUUID(),
    prompt_name: data.prompt_name,
    prompt_desc: data.prompt_desc,
    created_by: data.created_by,
    modified_datetime: data.modified_datetime?.toDate(),
    delete_datetime: data.delete_datetime?.toDate(),
    is_active: data.is_active = true,
    is_deleted: data.is_deleted = false,
    target_persona: data.target_persona,
    prompt_text: data.prompt_text,
    prompt_audio: data.prompt_audio,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}