// import dotenv from 'dotenv';
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
  DatabaseService
} from './services/database-service';
import { getApps } from "firebase/app";
import { doc, addDoc, collection, getFirestore, Firestore, Timestamp } from "firebase/firestore";
import { initFirestore, firebaseConfig } from './firebase';

let db: Firestore | null;

// access singleton object
let databaseService = DatabaseService.getInstance();


// PROBLEM: this seed data is not setting prompt_id, podcast_id, etc.


// Function to seed initial data into Firestore
export async function seedDatabase() {
    console.log('Starting database seeding...');

  // Initialize Firebase if not done already   
  try {
      if (!getApps().length) {
      // db = await initFirestore();  // default database
      db = await initFirestore();
    }
    else {
      db = getFirestore(getApps()[0]); 
    }
  } catch (error) {
    console.error("seed-data: Firebase initialization error:", error);
  }

//  await setTestDoc();



   try {
    // Seed subscriptions
    // await seedSubscriptions();    // done
    // Seed personas
    // await seedPersonas();
    // Seed topics
    // await seedTopics();    
    // Seed prompts
    // await seedPrompts();
    // Seed documents
    // await seedDocuments();    
    // Seed transcripts
    // await seedTranscripts();
    // Seed podcasts and episodes
    // await seedPodcasts();    
    // Seed questions
    // await seedQuestions();    
    // Seed sample users
    // await seedUsers();    
    // Seed sample chats
    // await seedChats();
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }

  console.log('Database seeding completed successfully!');

}

/******
// Set the test document data
async function setTestDoc(db: Firestore) {

  //  const testDoc = doc(collection(db, "collection-id"), "document-id");
  //  const testDoc = doc(collection(db, "users"), "GUdioLF9AD8VbqkMo0Xj");
  const testData = {
    last_name: "Doe",
    email1: "john.doe@example.com",
    createdAt: new Date()
    };
  
    try {
      const docRef = await addDoc(collection(db, "users"), testData);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

  } 
*****/

/*****
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
      is_deleted: false,
      features: ['Basic podcast access', 'Limited chat functionality', 'Ad-supported experience']
    },
    {
      subscription_type: 'premium',
      subscription_name: 'Premium',
      subscription_desc: 'Full access to all podcasts and features',
      subscription_price: 9.99,
      subscription_period: 'monthly',
      is_active: true,
      is_deleted: false,
      features: ['Full podcast library', 'Advanced chat features', 'Ad-free experience', 'Personalized recommendations']
    },
    {
      subscription_type: 'enterprise',
      subscription_name: 'Enterprise',
      subscription_desc: 'Team access with advanced features and support',
      subscription_price: 29.99,
      subscription_period: 'monthly',
      is_active: true,
      is_deleted: false,
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
      is_active: true,
      is_deleted: false,
      persona_image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop'
    },
    {
      persona_name: 'College Student',
      persona_type: 'student',
      persona_description: 'A student interested in educational content',
      is_active: true,
      is_deleted: false,
      persona_image: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=200&h=200&fit=crop'
    },
    {
      persona_name: 'City Official',
      persona_type: 'official',
      persona_description: 'A city official interested in governance',
      is_active: true,
      is_deleted: false,
      persona_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop'
    },
    {
      persona_name: 'Community Advocate',
      persona_type: 'lobbyst',
      persona_description: 'An advocate for community causes',
      is_active: true,
      is_deleted: false,
      persona_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop'
    },
    {
      persona_name: 'Local Politician',
      persona_type: 'politician',
      persona_description: 'A politician interested in policy discussions',
      is_active: true,
      is_deleted: false,
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
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Weston, MA',
      topic_image: 'https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?w=300&h=200&fit=crop',
      topic_type: 'place',
      related_topic_tags: ['Massachusetts', 'Boston suburbs', 'affluent communities'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Massachusetts',
      topic_image: 'https://images.unsplash.com/photo-1572719314664-fb1a81c61e43?w=300&h=200&fit=crop',
      topic_type: 'place',
      related_topic_tags: ['New England', 'Boston', 'education', 'politics'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Elizabeth Warren',
      topic_image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&h=200&fit=crop',
      topic_type: 'person',
      related_topic_tags: ['politics', 'Massachusetts', 'Senate', 'Democrats'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Newton High School',
      topic_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop',
      topic_type: 'school',
      related_topic_tags: ['education', 'Newton MA', 'high school', 'students'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Soccer',
      topic_image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&h=200&fit=crop',
      topic_type: 'sport',
      related_topic_tags: ['sports', 'youth activities', 'recreation', 'fitness'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Local Government',
      topic_image: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=300&h=200&fit=crop',
      topic_type: 'issue',
      related_topic_tags: ['politics', 'governance', 'community'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Education Reform',
      topic_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
      topic_type: 'issue',
      related_topic_tags: ['education', 'schools', 'policy'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Community Development',
      topic_image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop',
      topic_type: 'issue',
      related_topic_tags: ['development', 'community', 'planning'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
    },
    {
      topic_name: 'Public Health',
      topic_image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      topic_type: 'issue',
      related_topic_tags: ['health', 'wellness', 'policy'],
      datetime: Timestamp.now(),
      is_private: false,
      is_active: true,
      is_deleted: false
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
  
  if (!personas || personas?.length === 0) {
    console.error('No personas found for prompts');
    return;
  }
  
  const residentPersona = personas?.find(p => p.persona_type === 'resident');
  const studentPersona = personas?.find(p => p.persona_type === 'student');
  const officialPersona = personas?.find(p => p.persona_type === 'official');
  const lobbystPersona = personas?.find(p => p.persona_type === 'lobbyst');
  const politicianPersona = personas?.find(p => p.persona_type === 'politician');
  
  const prompts = [
    {
      prompt_name: 'Community Issues Overview',
      prompt_desc: 'A prompt to discuss local community issues',
      created_by: 'system',
      is_active: true,
      is_deleted: false,
      target_persona: residentPersona?.id || personas[0].id,
      prompt_text: 'What are the most pressing issues facing our community today?'
    },
    {
      prompt_name: 'Education System Analysis',
      prompt_desc: 'A prompt to analyze the education system',
      created_by: 'system',
      is_active: true,
      is_deleted: false,
      target_persona: studentPersona?.id || personas[0].id,
      prompt_text: 'How can we improve the education system to better serve students?'
    },
    {
      prompt_name: 'Governance Challenges',
      prompt_desc: 'A prompt to discuss governance challenges',
      created_by: 'system',
      is_active: true,
      is_deleted: false,
      target_persona: officialPersona?.id || personas[0].id,
      prompt_text: 'What are the biggest challenges in governing a diverse community?'
    },
    {
      prompt_name: 'Newton Development',
      prompt_desc: 'A prompt to discuss Newton development issues',
      created_by: 'system',
      is_active: true,
      is_deleted: false,
      target_persona: lobbystPersona?.id || personas[0].id,
      prompt_text: 'What are the key development priorities for Newton in the next five years?'
    },
    {
      prompt_name: 'Massachusetts Politics',
      prompt_desc: 'A prompt to discuss Massachusetts political landscape',
      created_by: 'system',
      is_active: true,
      is_deleted: false,
      target_persona: politicianPersona?.id || personas[0].id,
      prompt_text: 'How is the political landscape in Massachusetts evolving?'
    },
    {
      prompt_name: 'Youth Sports Importance',
      prompt_desc: 'A prompt to discuss the importance of youth sports',
      created_by: 'system',
      is_active: true,
      is_deleted: false,
      target_persona: residentPersona?.id || personas[0].id,
      prompt_text: 'Why are youth sports programs like soccer important for community development?'
    }
  ];
  
  for (const prompt of prompts) {
    await databaseService.create('prompts', prompt);
  }
}

async function seedDocuments() {
  console.log('Seeding documents...');
  
  // Get topic IDs
  const topics = await topicsService.getAllTopics();
  
  if (!topics || topics?.length === 0) {
    console.error('No topics found for documents');
    return;
  }
  
  const newtonTopic = topics?.find(t => t.topic_name === 'Newton, MA');
  const massTopic = topics?.find(t => t.topic_name === 'Massachusetts');
  const educationTopic = topics?.find(t => t.topic_name === 'Education Reform');
  const soccerTopic = topics?.find(t => t.topic_name === 'Soccer');
  
  const documents = [
    {
      doc_name: 'Newton City Budget 2023',
      doc_desc: 'Annual budget report for the city of Newton',
      topic_tags: [newtonTopic?.id, massTopic?.id].filter(Boolean),
      doc_source_url: 'https://example.com/newton_budget_2023.pdf',
      doc_extracted_text: "The City of Newton's fiscal year 2023 budget allocates $450 million to various departments including education, public works, and public safety...",
      extract_tool: 'PyPDF',
      extract_datetime: Timestamp.now(),
      doc_source_format: 'pdf',
      is_active: true,
      is_deleted: false
    },
    {
      doc_name: 'Massachusetts Education Statistics',
      doc_desc: 'Statistical report on education metrics across Massachusetts',
      topic_tags: [massTopic?.id, educationTopic?.id].filter(Boolean),
      doc_source_url: 'https://example.com/mass_education_stats.pdf',
      doc_extracted_text: "Massachusetts continues to lead the nation in K-12 education outcomes, with 79% of students meeting or exceeding standards in reading and mathematics...",
      extract_tool: 'PyPDF',
      extract_datetime: Timestamp.now(),
      doc_source_format: 'pdf',
      is_active: true,
      is_deleted: false
    },
    {
      doc_name: 'Newton Youth Soccer Program Guide',
      doc_desc: 'Guide for parents and players in the Newton youth soccer program',
      topic_tags: [newtonTopic?.id, soccerTopic?.id].filter(Boolean),
      doc_source_url: 'https://example.com/newton_soccer.docx',
      doc_extracted_text: "The Newton Youth Soccer program offers recreational and competitive leagues for children ages 5-18. Registration begins in August for the fall season...",
      extract_tool: 'DocxParser',
      extract_datetime: Timestamp.now(),
      doc_source_format: 'docx',
      is_active: true,
      is_deleted: false
    },
    {
      doc_name: 'Newton High School Academic Performance',
      doc_desc: 'Report on academic performance metrics for Newton High School',
      topic_tags: [topics.find(t => t.topic_name === 'Newton High School')?.id, educationTopic?.id].filter(Boolean),
      doc_source_url: 'https://example.com/newton_high_performance.txt',
      doc_extracted_text: "Newton High School students achieved an average SAT score of 1320 in 2023, with 94% of graduates continuing to higher education...",
      extract_tool: 'TextExtractor',
      extract_datetime: Timestamp.now(),
      doc_source_format: 'txt',
      is_active: true,
      is_deleted: false
    },
    {
      doc_name: 'Senator Warren Town Hall Recording',
      doc_desc: "Audio recording of Senator Elizabeth Warren's town hall meeting in Newton",
      topic_tags: [topics.find(t => t.topic_name === 'Elizabeth Warren')?.id, newtonTopic?.id].filter(Boolean),
      doc_source_url: 'https://example.com/warren_townhall.mp3',
      doc_extracted_text: "Senator Warren addressed concerns about healthcare, education funding, and environmental policy during the two-hour town hall meeting...",
      extract_tool: 'Whisper',
      extract_datetime: Timestamp.now(),
      doc_source_format: 'mp3',
      is_active: true,
      is_deleted: false
    }
  ];
  
  for (const document of documents) {
    await databaseService.create('documents', document);
  }
}

async function seedTranscripts() {
  console.log('Seeding transcripts...');
  
  // Get topic IDs
  const topics = await topicsService.getAllTopics();
  
  if (!topics || topics?.length === 0) {
    console.error('No topics found for transcripts');
    return;
  }
  
  const newtonTopic = topics?.find(t => t.topic_name === 'Newton, MA');
  const massTopic = topics?.find(t => t.topic_name === 'Massachusetts');
  const warrenTopic = topics?.find(t => t.topic_name === 'Elizabeth Warren');
  const educationTopic = topics?.find(t => t.topic_name === 'Education Reform');
  
  const transcripts = [
    {
      transcript_type: 'interview',
      topic_tags: [newtonTopic?.id, educationTopic?.id].filter(Boolean),
      transcript_model: 'gpt-4',
      transcript_text: 'Interviewer: How would you assess the current state of education in Newton?\n\nSuperintendent: Newton has always prided itself on educational excellence. Our schools consistently rank among the top in Massachusetts. However, we face challenges in addressing achievement gaps and ensuring equitable access to resources...',
      is_active: true,
      is_deleted: false
    },
    {
      transcript_type: 'meeting',
      topic_tags: [newtonTopic?.id].filter(Boolean),
      transcript_model: 'whisper-large',
      transcript_text: "Chair: I call this meeting of the Newton City Council to order. First on our agenda is the proposed zoning change for the Washington Street corridor.\n\nCouncilor Johnson: Thank you, Chair. I'd like to present the planning committee's recommendations...",
      is_active: true,
      is_deleted: false
    },
    {
      transcript_type: 'article',
      topic_tags: [massTopic?.id, warrenTopic?.id].filter(Boolean),
      transcript_model: 'claude-2',
      transcript_text: 'Senator Elizabeth Warren Announces Education Initiative\n\nBoston, MA - Senator Elizabeth Warren today announced a new initiative aimed at addressing student loan debt and expanding access to higher education across Massachusetts...',
      is_active: true,
      is_deleted: false
    },
    {
      transcript_type: 'petition',
      topic_tags: [newtonTopic?.id, topics?.find(t => t.topic_name === 'Community Development')?.id].filter(Boolean),
      transcript_model: 'gpt-3.5-turbo',
      transcript_text: 'Petition for Increased Green Space in Newton City Center\n\nWe, the undersigned residents of Newton, Massachusetts, petition the City Council to allocate funds for the creation and maintenance of additional green spaces in the city center...',
      is_active: true,
      is_deleted: false
    },
    {
      transcript_type: 'interview',
      topic_tags: [topics?.find(t => t.topic_name === 'Soccer')?.id, newtonTopic?.id].filter(Boolean),
      transcript_model: 'whisper-large',
      transcript_text: "Interviewer: How has the Newton Youth Soccer program evolved over the past decade?\n\nProgram Director: When we started, we had about 200 kids participating. Now we're serving over 1,500 young athletes across all age groups. The growth has been phenomenal...",
      is_active: true,
      is_deleted: false
    }
  ];
  
  for (const transcript of transcripts) {
    await databaseService.create('transcripts', transcript);
  }
}

async function seedPodcasts() {
  console.log('Seeding podcasts and episodes...');
  
  // Get topic IDs
  const topics = await topicsService.getAllTopics();
  
  if (!topics || topics?.length === 0) {
    console.error('No topics found for podcasts');
    return;
  }
  
  // Get prompt IDs
  const prompts = await promptsService.getAllPrompts();
  
  const newtonTopic = topics?.find(t => t.topic_name === 'Newton, MA');
  const massTopic = topics?.find(t => t.topic_name === 'Massachusetts');
  const educationTopic = topics?.find(t => t.topic_name === 'Education Reform');
  const warrenTopic = topics?.find(t => t.topic_name === 'Elizabeth Warren');
  const soccerTopic = topics?.find(t => t.topic_name === 'Soccer');
  


  const podcasts = [
    {
      podcast_title: 'Newton Community Voices',
      podcast_image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&h=500&fit=crop',
      podcast_desc: 'A podcast featuring voices from the Newton community discussing local issues',
      podcast_type: 'audio_podcast',
      podcast_hosts: ['Jane Smith', 'John Doe'],
      podcast_format: 'mp3',
      topic_tags: [newtonTopic?.id, topics.find(t => t.topic_name === 'Community Development')?.id].filter(Boolean),
      subscription_type: 'free',
      is_active: true,
      is_deleted: false
    },
    {
      podcast_title: 'Massachusetts Education Matters',
      podcast_image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500&h=500&fit=crop',
      podcast_desc: 'Discussions about education policy and reform in Massachusetts',
      podcast_type: 'audio_podcast',
      podcast_hosts: ['Dr. Emily Johnson', 'Prof. Michael Brown'],
      podcast_format: 'mp3',
      topic_tags: [massTopic?.id, educationTopic?.id].filter(Boolean),
      subscription_type: 'free',
      is_active: true,
      is_deleted: false
    },
    {
      podcast_title: 'Policy Insights with Senator Warren',
      podcast_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=500&fit=crop',
      podcast_desc: 'Deep dives into policy issues with Senator Elizabeth Warren',
      podcast_type: 'audio_podcast',
      podcast_hosts: ['Sarah Williams', 'Senator Elizabeth Warren'],
      podcast_format: 'mp3',
      topic_tags: [warrenTopic?.id, massTopic?.id].filter(Boolean),
      subscription_type: 'premium',
      is_active: true,
      is_deleted: false
    },
    {
      podcast_title: 'Newton High School Sports Report',
      podcast_image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=500&h=500&fit=crop',
      podcast_desc: 'Coverage of Newton High School sports teams and events',
      podcast_type: 'audio_podcast',
      podcast_hosts: ['David Green', 'Lisa Park'],
      podcast_format: 'mp3',
      topic_tags: [topics.find(t => t.topic_name === 'Newton High School')?.id, soccerTopic?.id].filter(Boolean),
      subscription_type: 'free',
      is_active: true,
      is_deleted: false
    },
    {
      podcast_title: 'Lexington High School Sports Report',
      podcast_image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=500&h=500&fit=crop',
      podcast_desc: 'Coverage of Lexington High School sports teams and events',
      podcast_type: 'audio_podcast',
      podcast_hosts: ['Paul Green', 'John Park'],
      podcast_format: 'mp3',
      topic_tags: [topics.find(t => t.topic_name === 'Lexington High School')?.id, soccerTopic?.id].filter(Boolean),
      subscription_type: 'free',
      is_active: true,
      is_deleted: false
    },
    {
      podcast_title: 'Weston & Newton Community Health',
      podcast_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=500&fit=crop',
      podcast_desc: 'Discussions on public health and wellness in Weston and Newton',
      podcast_type: 'audio_podcast',
      podcast_hosts: ['Dr. James Wilson', 'Nurse Maria Garcia'],
      podcast_format: 'mp3',
      topic_tags: [newtonTopic?.id, topics.find(t => t.topic_name === 'Weston, MA')?.id, topics.find(t => t.topic_name === 'Public Health')?.id].filter(Boolean),
      subscription_type: 'premium',
      is_active: true,
      is_deleted: false
    }
  ];
  
  // Create podcasts and episodes
  for (const podcast of podcasts) {
    const podcastId = await databaseService.create('podcasts', podcast);

    // Create episodes for each podcast
    const episodes = [
      {
        podcast_id: podcastId,
        episode_title: 'Episode 1: Introduction',
        episode_desc: 'An introduction to the podcast series',
        topic_tags: podcast.topic_tags,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100),
        dislikes: Math.floor(Math.random() * 10),
        publish_datetime: Timestamp.now(),
        content_duration: 1800, // 30 minutes in seconds
        content_url: 'https://example.com/audio/episode1.mp3',
        content_image: podcast.podcast_image,
        is_active: true,
        is_deleted: false
      },
      {
        podcast_id: podcastId,
        episode_title: 'Episode 2: Deep Dive',
        episode_desc: 'A deeper exploration of the main topics',
        topic_tags: podcast.topic_tags,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100),
        dislikes: Math.floor(Math.random() * 10),
        publish_datetime: Timestamp.now(),
        content_duration: 2400, // 40 minutes in seconds
        content_url: 'https://example.com/audio/episode2.mp3',
        content_image: podcast.podcast_image,
        is_active: true,
        is_deleted: false
      },
      {
        podcast_id: podcastId,
        episode_title: 'Episode 3: Expert Interview',
        episode_desc: 'An interview with an expert in the field',
        topic_tags: podcast.topic_tags,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100),
        dislikes: Math.floor(Math.random() * 10),
        publish_datetime: Timestamp.now(),
        content_duration: 3000, // 50 minutes in seconds
        content_url: 'https://example.com/audio/episode3.mp3',
        content_image: podcast.podcast_image,
        is_active: true,
        is_deleted: false
      }
    ];
    
    for (const episode of episodes) {
      await databaseService.create('episodes', episode);
    }
  }
}

async function seedQuestions() {
  console.log('Seeding questions...');
  
  // Get podcast IDs
  const podcasts = await podcastsService.getAllPodcasts();
  
  if (!podcasts || podcasts?.length === 0) {
    console.error('No podcasts found for questions');
    return;
  }
  
  // Sample user IDs (will be replaced with actual user IDs when users are created)
  const sampleUserIds = ['user1', 'user2', 'user3', 'user4', 'user5'];
  
  // Create questions for each podcast
  for (const podcast of podcasts) {
    const questions = [
      {
        podcast_id: podcast.id,
        question_text: 'What are the key takeaways from this episode?',
        clicks: Math.floor(Math.random() * 50),
        user_id: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)],
        is_active: true,
        is_deleted: false
      },
      {
        podcast_id: podcast.id,
        question_text: 'Can you provide more context on the topic discussed at the 15-minute mark?',
        clicks: Math.floor(Math.random() * 50),
        user_id: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)],
        is_active: true,
        is_deleted: false
      },
      {
        podcast_id: podcast.id,
        question_text: 'What resources were mentioned for further reading?',
        clicks: Math.floor(Math.random() * 50),
        user_id: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)],
        is_active: true,
        is_deleted: false
      }
    ];
    
    for (const question of questions) {
      await databaseService.create('questions', question);
    }
  }
}

async function seedUsers() {
  console.log('Seeding users...');
  
  // Sample user IDs (will be replaced with actual user IDs when users are created)
  const sampleUserIds = ['user1', 'user2', 'user3', 'user4', 'user5'];
  
  // Get subscription types
  const subscriptions = await subscriptionsService.getAllSubscriptions();
  
  const freeSubscription = subscriptions?.find(s => s.subscription_type === 'free');
  const premiumSubscription = subscriptions?.find(s => s.subscription_type === 'premium');
  const enterpriseSubscription = subscriptions?.find(s => s.subscription_type === 'enterprise');
  
  // Get personas
  const personas = await personasService.getAllPersonas();
  
  // Get topics
  const topics = await topicsService.getAllTopics();
  
  const users = [
    {
      user_id: 'user1',
      is_active: true,
      is_deleted: false,
      login_id: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      email1: 'john.doe@example.com',
      phone: '617-555-1234',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
      addresses: [
        {
          address_type: 'home',
          street: '123 Main St',
          city: 'Newton',
          state: 'MA',
          zip: '02458',
          country: 'USA',
          is_primary: true
        }
      ],
      preferences: {
        theme: 'light',
        notifications_enabled: true,
        email_notifications: true,
        push_notifications: false,
        language: 'en',
        timezone: 'America/New_York',
        content_filters: {
          explicit_content: false,
          content_categories: ['politics', 'education', 'local']
        }
      },
      personas: personas?.filter(p => p.persona_type === 'resident').map(p => p.id),
      following_topics: topics?.filter(t => ['Newton, MA', 'Massachusetts', 'Education Reform'].includes(t.topic_name)).map(t => t.id),
      subscription_type: freeSubscription?.subscription_type || 'free',
      subscription_startdate: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
      subscription_enddate: Timestamp.fromDate(new Date(Date.now() + 335 * 24 * 60 * 60 * 1000)), // 335 days from now
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    },
    {
      user_id: 'user2',
      is_active: true,
      is_deleted: false,
      login_id: 'jane.smith@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      email1: 'jane.smith@example.com',
      phone: '617-555-5678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      addresses: [
        {
          address_type: 'home',
          street: '456 Oak Ave',
          city: 'Weston',
          state: 'MA',
          zip: '02493',
          country: 'USA',
          is_primary: true
        }
      ],
      preferences: {
        theme: 'dark',
        notifications_enabled: true,
        email_notifications: false,
        push_notifications: true,
        language: 'en',
        timezone: 'America/New_York',
        content_filters: {
          explicit_content: false,
          content_categories: ['health', 'education', 'sports']
        }
      },
      personas: personas?.filter(p => p.persona_type === 'student').map(p => p.id),
      following_topics: topics?.filter(t => ['Weston, MA', 'Massachusetts', 'Soccer', 'Newton High School'].includes(t.topic_name)).map(t => t.id),
      subscription_type: premiumSubscription?.subscription_type || 'premium',
      subscription_startdate: Timestamp.fromDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)), // 60 days ago
      subscription_enddate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
      last_payment_date: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
      next_payment_date: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
      payment_method: 'credit_card',
      card_name: 'Jane Smith',
      card_number: '************4567',
      card_expire: '05/27',
      card_city: 'Weston',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    },
    {
      user_id: 'user3',
      is_active: true,
      is_deleted: false,
      login_id: 'robert.chen@example.com',
      first_name: 'Robert',
      last_name: 'Chen',
      email1: 'robert.chen@example.com',
      phone: '617-555-9012',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      addresses: [
        {
          address_type: 'work',
          street: '789 City Hall Plaza',
          city: 'Newton',
          state: 'MA',
          zip: '02459',
          country: 'USA',
          is_primary: true
        }
      ],
      preferences: {
        theme: 'system',
        notifications_enabled: true,
        email_notifications: true,
        push_notifications: true,
        language: 'en',
        timezone: 'America/New_York',
        content_filters: {
          explicit_content: false,
          content_categories: ['politics', 'governance', 'community']
        }
      },
      personas: personas?.filter(p => p.persona_type === 'official').map(p => p.id),
      following_topics: topics?.filter(t => ['Newton, MA', 'Local Government', 'Community Development'].includes(t.topic_name)).map(t => t.id),
      subscription_type: enterpriseSubscription?.subscription_type || 'enterprise',
      subscription_startdate: Timestamp.fromDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)), // 90 days ago
      subscription_enddate: Timestamp.fromDate(new Date(Date.now() + 275 * 24 * 60 * 60 * 1000)), // 275 days from now
      last_payment_date: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
      next_payment_date: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
      payment_method: 'credit_card',
      card_name: 'Robert Chen',
      card_number: '************7890',
      card_expire: '12/26',
      card_city: 'Newton',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    }
  ];
  
  for (const user of users) {
    await databaseService.createWithId(,'users', user.user_id, user);
  }
  
  // Update questions with real user IDs
  const questions = await questionsService.getAllQuestions();
  if (questions && questions?.length > 0) {
    for (const question of questions) {
      if (sampleUserIds.includes(question.user_id)) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        await databaseService.update('questions', question.id, {
          user_id: randomUser.user_id});
      }
    }
  }
}

async function seedChats() {
  console.log('Seeding chats...');
  
  // Get users
  const users = await usersService.getAllUsers();
  
  if (!users || users?.length === 0) {
    console.error('No users found for chats');
    return;
  }
  
  // Create chat conversations for each user
  for (const user of users) {
    const chats = [
      {
        user_id: user.id,
        chat_text: 'Hello, I have a question about the latest podcast on education reform.',
        is_user: true,
        is_deleted: false
      },
      {
        user_id: user.id,
        chat_text: 'Of course! I\'d be happy to help with any questions about the education reform podcast. What specific aspect would you like to know more about?',
        is_user: false,
        is_deleted: false
      },
      {
        user_id: user.id,
        chat_text: 'Can you summarize the main points discussed about school funding?',
        is_user: true,
        is_deleted: false
      },
      {
        user_id: user.id,
        chat_text: 'The podcast discussed three main points about school funding: 1) The current formula for distributing state funds to districts, 2) Proposed changes to increase equity across wealthy and less affluent communities, and 3) The impact of property taxes on educational resources. The experts suggested that a more balanced approach combining state and local funding could help address disparities.',
        is_user: false,
        is_deleted: false
      },
      {
        user_id: user.id,
        chat_text: 'Thanks! Are there any upcoming episodes that will continue this discussion?',
        is_user: true,
        is_deleted: false
      },
      {
        user_id: user.id,
        chat_text: 'Yes, the podcast host mentioned that next week\'s episode will feature an interview with the state education secretary to discuss implementation plans for the new funding proposals. It\'s scheduled to be released next Tuesday.',
        is_user: false,
        is_deleted: false
      }
    ];
  
    for (const message of chats) {
      await databaseService.create('chats', message);
    }
  }
}
  ****/
