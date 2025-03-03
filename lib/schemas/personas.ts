export type PersonaType = 'resident' | 'student' | 'official' | 'lobbyst' | 'politician';

export interface Persona {
  persona_id: string;
  persona_name: string;
  persona_type: PersonaType;
  persona_description?: string;
  persona_image?: string;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Persona type
export function convertToPersona(data: any): Persona {
  return {
    persona_id: data.id || data.persona_id,
    persona_name: data.persona_name,
    persona_type: data.persona_type,
    persona_description: data.persona_description,
    persona_image: data.persona_image,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}