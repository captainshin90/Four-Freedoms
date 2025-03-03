export type DocumentSourceFormat = 'txt' | 'pdf' | 'docx' | 'mp3';

export interface Document {
  doc_id: string;
  doc_name: string;
  doc_desc: string;
  topic_tags: string[];
  doc_source_url: string;
  doc_extracted_text: string;
  extract_tool: string;
  extract_datetime: Date;
  doc_source_format: DocumentSourceFormat;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Document type
export function convertToDocument(data: any): Document {
  return {
    doc_id: data.id || data.doc_id,
    doc_name: data.doc_name,
    doc_desc: data.doc_desc,
    topic_tags: data.topic_tags,
    doc_source_url: data.doc_source_url,
    doc_extracted_text: data.doc_extracted_text,
    extract_tool: data.extract_tool,
    extract_datetime: data.extract_datetime?.toDate(),
    doc_source_format: data.doc_source_format,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}