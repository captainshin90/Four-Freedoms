export interface Prompt {
  prompt_id: string;
  prompt_name: string;
  prompt_desc: string;
  created_by: string;
  create_datetime: Date;
  modified_datetime?: Date;
  delete_datetime?: Date;
  is_active: boolean;
  target_persona: string;
  prompt_text: string;
  prompt_audio?: string;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Prompt type
export function convertToPrompt(data: any): Prompt {
  return {
    prompt_id: data.id || data.prompt_id,
    prompt_name: data.prompt_name,
    prompt_desc: data.prompt_desc,
    created_by: data.created_by,
    create_datetime: data.create_datetime?.toDate(),
    modified_datetime: data.modified_datetime?.toDate(),
    delete_datetime: data.delete_datetime?.toDate(),
    is_active: data.is_active,
    target_persona: data.target_persona,
    prompt_text: data.prompt_text,
    prompt_audio: data.prompt_audio,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}