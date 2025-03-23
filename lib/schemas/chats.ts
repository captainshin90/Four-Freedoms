export interface Chat {
  id: string; // Firestore Document ID
  chat_id: string; // Chat ID
  user_id: string; // User ID
  sender: string; // Sender
  chat_text: string; // Chat Text
  // created_at: Date | null;  // updated by the database service
  // updated_at: Date;         // no need for this field as chat is not updated
  // deleted_at: Date | null;  // updated by the database service
  is_deleted: boolean | false; // Is Deleted
  conversation_id: string | null; // Conversation ID
}

// Helper function to convert Firestore data to Chat type
export function convertToChat(data: any): Chat {
  return {
    id: data.id,
    chat_id: data.chat_id,
    user_id: data.user_id,
    sender: data.sender,
    chat_text: data.chat_text,
    // deleted_at: data.deleted_at?.toDate() || null, // updated by the database service
    // created_at: data.timestamp?.toDate() || null,  // updated by the database service
    // updated_at: data.timestamp?.toDate() || null,  // updated by the database service
    is_deleted: data.is_deleted || false,
    conversation_id: data.conversation_id || null
  };
}