export interface Subscription {
  subscription_id: string;
  subscription_type: string;
  subscription_name: string;
  subscription_desc: string;
  subscription_price: number;
  subscription_period: string; // monthly, yearly, etc.
  is_active: boolean;
  features?: string[];
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore data to Subscription type
export function convertToSubscription(data: any): Subscription {
  return {
    subscription_id: data.id || data.subscription_id,
    subscription_type: data.subscription_type,
    subscription_name: data.subscription_name,
    subscription_desc: data.subscription_desc,
    subscription_price: data.subscription_price,
    subscription_period: data.subscription_period,
    is_active: data.is_active,
    features: data.features,
    created_at: data.created_at?.toDate(),
    updated_at: data.updated_at?.toDate()
  };
}