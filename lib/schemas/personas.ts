export type PersonaType = 'resident' | 'student' | 'official' | 'lobbyst' | 'politician';

export interface Persona {
  persona_id: string;
  persona_name: string;
  persona_type: PersonaType;
  persona_description?: string;
  persona_image?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_deleted: boolean;
}

// Helper function to convert Firestore data to Persona type
export function convertToPersona(data: any): Persona {
  return {
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