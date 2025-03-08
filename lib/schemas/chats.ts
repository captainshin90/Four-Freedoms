export interface Chat {
  chat_id: string;
  user_id: string;
  chat_text: string;
  create_datetime: Date;
  is_user: boolean;
  delete_datetime?: Date;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Chat type
export function convertToChat(data: any): Chat {
  return {
    chat_id: data.id || data.chat_id,
    user_id: data.user_id,
    chat_text: data.chat_text,
    create_datetime: data.create_datetime?.toDate(),
    is_user: data.is_user,
    delete_datetime: data.delete_datetime?.toDate(),
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}