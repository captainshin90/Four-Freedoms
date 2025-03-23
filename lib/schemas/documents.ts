export type DocumentSourceFormat = 'txt' | 'pdf' | 'docx' | 'mp3';

export interface Document {
  id: string; // Firestore Document ID
  doc_id: string; // Document ID
  doc_name: string; // Document Name
  doc_desc: string; // Document Description
  topic_tags: string[]; // Topic Tags
  doc_source_url: string; // Document Source URL
  doc_extracted_text: string; // Document Extracted Text
  extract_tool: string; // Extract Tool
  extract_datetime: Date; // Extract Date and Time
  doc_source_format: DocumentSourceFormat; // Document Source Format
  created_at: Date; // Created Date and Time
  updated_at: Date; // Updated Date and Time
  is_active: boolean; // Is Active
  is_deleted: boolean; // Is Deleted
}

// Helper function to convert Firestore data to Document type
export function convertToDocument(data: any): Document {
  return {
    id: data.id,
    doc_id: data.doc_id = crypto.randomUUID(), 
    doc_name: data.doc_name,
    doc_desc: data.doc_desc,
    topic_tags: data.topic_tags,
    doc_source_url: data.doc_source_url,
    doc_extracted_text: data.doc_extracted_text,
    extract_tool: data.extract_tool,
    extract_datetime: data.extract_datetime?.toDate(),
    doc_source_format: data.doc_source_format,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate(),
    is_active: data.is_active = true,
    is_deleted: data.is_deleted = false
  };
}