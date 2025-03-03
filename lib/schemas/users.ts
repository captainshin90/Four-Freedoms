export interface User {
  user_id: string;
  login_id: string;
  password?: string; // Not stored in Firestore, only used for registration
  first_name: string;
  last_name: string;
  email1: string;
  email2?: string;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  preferences?: UserPreferences;
  personas?: string[]; // Array of persona_ids
  following_topics?: string[]; // Array of topic_ids
  following_users?: string[]; // Array of user_ids
  followed_by_users?: string[]; // Array of user_ids
  subscription_type?: string;
  subscription_startdate?: Date;
  subscription_enddate?: Date;
  last_payment_date?: Date;
  next_payment_date?: Date;
  payment_method?: string;
  card_name?: string;
  card_number?: string; // Should be encrypted or tokenized in production
  card_expire?: string;
  card_cvv?: string; // Should not be stored in production
  card_city?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  address_type: string; // home, work, etc.
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_primary: boolean;
}

export interface UserPreferences {
  theme: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  language: string;
  timezone: string;
  content_filters?: {
    explicit_content: boolean;
    content_categories?: string[];
  };
}

// Helper function to convert Firestore data to User type
export function convertToUser(data: any): User {
  return {
    user_id: data.id || data.user_id,
    login_id: data.login_id,
    first_name: data.first_name,
    last_name: data.last_name,
    email1: data.email1,
    email2: data.email2,
    phone: data.phone,
    avatar: data.avatar,
    addresses: data.addresses,
    preferences: data.preferences,
    personas: data.personas,
    following_topics: data.following_topics,
    following_users: data.following_users,
    followed_by_users: data.followed_by_users,
    subscription_type: data.subscription_type,
    subscription_startdate: data.subscription_startdate?.toDate(),
    subscription_enddate: data.subscription_enddate?.toDate(),
    last_payment_date: data.last_payment_date?.toDate(),
    next_payment_date: data.next_payment_date?.toDate(),
    payment_method: data.payment_method,
    card_name: data.card_name,
    card_number: data.card_number,
    card_expire: data.card_expire,
    card_cvv: data.card_cvv,
    card_city: data.card_city,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}