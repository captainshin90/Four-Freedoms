import { 
  usersService, 
  subscriptionsService, 
  personasService, 
  topicsService, 
  podcastsService, 
  episodesService,
  promptsService,
  documentsService,
  transcriptsService,
  questionsService,
  chatsService,
  databaseService
} from './services/database-service';
import { Timestamp } from 'firebase/firestore';

// Function to seed initial data into Firestore
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Seed subscriptions
    await seedSubscriptions();
    
    // Seed personas
//    await seedPersonas();
    
    // Seed topics
//    await seedTopics();
    
    // Seed prompts
//    await seedPrompts();
    
    // Seed documents
//    await seedDocuments();
    
    // Seed transcripts
//    await seedTranscripts();
    
    // Seed podcasts and episodes
//    await seedPodcasts();
    
    // Seed questions
//    await seedQuestions();
    
    // Seed sample users
//    await seedUsers();
    
    // Seed sample chats
//    await seedChats();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function seedSubscriptions() {
  console.log('Seeding subscriptions...');
  
  const subscriptions = [
    {
      subscription_type: 'free',
      subscription_name: 'Free',
      subscription_desc: 'Basic access to podcasts and limited features',
      subscription_price: 0,
      subscription_period: 'monthly',
      is_active: true,
      features: ['Basic podcast access', 'Limited chat functionality', 'Ad-supported experience']
    },
    {
      subscription_type: 'premium',
      subscription_name: 'Premium',
      subscription_desc: 'Full access to all podcasts and features',
      subscription_price: 9.99,
      subscription_period: 'monthly',
      is_active: true,
      features: ['Full podcast library', 'Advanced chat features', 'Ad-free experience', 'Personalized recommendations']
    },
    {
      subscription_type: 'enterprise',
      subscription_name: 'Enterprise',
      subscription_desc: 'Team access with advanced features and support',
      subscription_price: 29.99,
      subscription_period: 'monthly',
      is_active: true,
      features: ['Everything in Premium', 'Team collaboration', 'API access', 'Priority support', 'Custom integrations']
    }
  ];
  
  for (const subscription of subscriptions) {
    await databaseService.create('subscriptions', subscription);
  }
}

async function seedPersonas() {
  console.log('Seeding personas...');
  
  const personas = [
    {
      persona_name: 'Local Resident',
      persona_type: 'resident',
      persona_description: 'A local resident interested in community issues',
      persona_image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop'
    },
    {
      persona_name: 'College Student',
      persona_type: 'student',
      persona_description: 'A student interested in educational content',
      persona_image: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=200&h=200&fit=crop'
    },
    {
      persona_name: 'City Official',
      persona_type: 'official',
      persona_description: 'A city official interested in governance',
      persona_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop'
    },
    {
      persona_name: 'Community Advocate',
      persona_type: 'lobbyst',
      persona_description: 'An advocate for community causes',
      persona_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop'
    },
    {
      persona_name: 'Local Politician',
      persona_type: 'politician',
      persona_description: 'A politician interested in policy discussions',
      persona_image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop'
    }
  ];
  
  for (const persona of personas) {
    await databaseService.create('personas', persona);
  }
}

async function seedTopics() {
  console.log('Seeding topics...');
  
  const topics = [
    {
      topic_name: 'Newton, MA',
      topic_image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&h=200&fit=crop',
      topic_type: 'place',
      related_topic_tags: ['Massachusetts', 'Boston suburbs', 'education'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Weston, MA',
      topic_image: 'https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?w=300&h=200&fit=crop',
      topic_type: 'place',
      related_topic_tags: ['Massachusetts', 'Boston suburbs', 'affluent communities'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Massachusetts',
      topic_image: 'https://images.unsplash.com/photo-1572719314664-fb1a81c61e43?w=300&h=200&fit=crop',
      topic_type: 'place',
      related_topic_tags: ['New England', 'Boston', 'education', 'politics'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Elizabeth Warren',
      topic_image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&h=200&fit=crop',
      topic_type: 'person',
      related_topic_tags: ['politics', 'Massachusetts', 'Senate', 'Democrats'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Newton High School',
      topic_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop',
      topic_type: 'school',
      related_topic_tags: ['education', 'Newton MA', 'high school', 'students'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Soccer',
      topic_image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&h=200&fit=crop',
      topic_type: 'sport',
      related_topic_tags: ['sports', 'youth activities', 'recreation', 'fitness'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Local Government',
      topic_image: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=300&h=200&fit=crop',
      topic_type: 'issue',
      related_topic_tags: ['politics', 'governance', 'community'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Education Reform',
      topic_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
      topic_type: 'issue',
      related_topic_tags: ['education', 'schools', 'policy'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Community Development',
      topic_image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop',
      topic_type: 'issue',
      related_topic_tags: ['development', 'community', 'planning'],
      datetime: Timestamp.now(),
      is_private: false
    },
    {
      topic_name: 'Public Health',
      topic_image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      topic_type: 'issue',
      related_topic_tags: ['health', 'wellness', 'policy'],
      datetime: Timestamp.now(),
      is_private: false
    }
  ];
  
  for (const topic of topics) {
    await databaseService.create('topics', topic);
  }
}

async function seedPrompts() {
  console.log('Seeding prompts...');
  
  // Get persona IDs
  const personas = await personasService.getAllPersonas();
  
  if (personas.length === 0) {
    console.error('No personas found for prompts');
    return;
  }
  
  const residentPersona = personas.find(p => p.persona_type === 'resident');
  const studentPersona = personas.find(p => p.persona_type === 'student');
  const officialPersona = personas.find(p => p.persona_type === 'official');
  const lobbystPersona = personas.find(p => p.persona_type === 'lobbyst');
  const politicianPersona = personas.find(p => p.persona_type === 'politician');
  
  const prompts = [
    {
      prompt_name: 'Hard nosed local reporter',
      prompt_desc: 'Hard nosed local reporter',
      target_persona: residentPersona, 
      prompt_text: 'Hard nosed local reporter',       
      is_active: true 
    }
  ]
}