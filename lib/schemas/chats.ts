export interface Chat {
  chat_id: string;
  user_id: string;
  chat_text: string;
  is_user: boolean;
  delete_datetime?: Date;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

// Helper function to convert Firestore data to Chat type
export function convertToChat(data: any): Chat {
  return {
    chat_id: data.chat_id = crypto.randomUUID(),
    user_id: data.user_id,
    chat_text: data.chat_text,
    is_user: data.is_user,
    delete_datetime: data.delete_datetime?.toDate(),
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate(),
    is_deleted: data.is_deleted = false
  };
}