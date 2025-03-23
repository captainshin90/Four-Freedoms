export type PersonaType = 'resident' | 'student' | 'official' | 'lobbyst' | 'politician';

export interface Persona {
  id: string; // Firestore Document ID
  persona_id: string; // Persona ID
  persona_name: string; // Persona Name
  persona_type: PersonaType; // Persona Type
  persona_description?: string; // Persona Description
  persona_image?: string; // Persona Image
  created_at: Date; // Created Date and Time
  updated_at: Date; // Updated Date and Time
  is_active: boolean; // Is Active
  is_deleted: boolean; // Is Deleted
}

// Helper function to convert Firestore data to Persona type
export function convertToPersona(data: any): Persona {
  return {
    id: data.id,
    persona_id: data.persona_id = crypto.randomUUID(),
    persona_name: data.persona_name,
    persona_type: data.persona_type,
    persona_description: data.persona_description,
    persona_image: data.persona_image,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate(),
    is_active: data.is_active = true,
    is_deleted: data.is_deleted = false
  };
}