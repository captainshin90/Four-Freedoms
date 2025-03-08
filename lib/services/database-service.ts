import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp, 
  addDoc,
  DocumentReference,
  DocumentData,
  FirestoreError,
  Firestore,
//  enableIndexedDbPersistence,
//  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
// import { Auth, getAuth, User } from "firebase/auth";
import { initFirestore, initAuth } from "@/lib/firebase";
// import { useDebugValue } from "react";





//if (!(this.db)) {
//  throw new Error("Firestore database is not initialized.");
//}


// Enable offline persistence with a larger cache size
//try {
//  enableIndexedDbPersistence(db, {
//    cacheSizeBytes: CACHE_SIZE_UNLIMITED
//  }).catch((err) => {
//    if (err.code === 'failed-precondition') {
//      // Multiple tabs open, persistence can only be enabled in one tab at a time
//      console.warn('Persistence failed: Multiple tabs open');
//    } else if (err.code === 'unimplemented') {
//      // The current browser does not support all of the features required for persistence
//      console.warn('Persistence not supported by this browser');
//    } else {
//      console.error('Persistence error:', err);
//    }
//  });
//} catch (error) {
//  console.error('Error enabling persistence:', error);
//}

// Generic database service for CRUD operations
export class DatabaseService {
  private static instance: DatabaseService;
  public db: Firestore | undefined;

  constructor() {
    this.init();    
  } 

  private async init() {
    try {
        this.db = await initFirestore();
//      const auth = await initAuth();
//      const currentUser = (getAuth(app)).currentUser;          
    } catch (error) {
      console.error("Firestore initialization error:", error);
      throw error;
    }
  }

  // singleton class to hold global state
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Create a new document with a specific ID
  async createWithId(collection: string, id: string, data: any): Promise<void> {
    try {
      if (this.db && collection && id) {
        const docRef = doc(this.db, collection, id);
        await setDoc(docRef, {
          ...data,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now()
        });
      }
    } catch (error) {
      console.error(`Error creating document in ${collection} with ID ${id}:`, error);
      this.handleFirestoreError(error as FirestoreError);
      throw error;
    }
  }

  // Create a new document with auto-generated ID
  async create(collectionName: string, data: any): Promise<string | null> {
    if (this.db && collectionName) {
      try {
        const collectionRef = collection(this.db, collectionName);
        // console.log(`Creating document in ${collectionName}`);
        const docRef = await addDoc(collectionRef, {

          ...data,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now()
        });
        return docRef.id;        
      } catch (error) {
        console.error(`Error creating document in ${collectionName}:`, error);
        this.handleFirestoreError(error as FirestoreError);
        throw error;
      }
    } else return null;
  }

  // Get a document by ID
  async getById(collectionName: string, id: string): Promise<DocumentData | null> {
    if (this.db && collectionName && id) {
      try {
          const docRef = doc(this.db, collectionName, id);
          const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          return null;
        }
      } catch (error) {
        console.error(`Error getting document from ${collectionName} with ID ${id}:`, error);
        this.handleFirestoreError(error as FirestoreError);
        throw error;
      }
    } else return null;
  }

  // Update a document
  async update(collectionName: string, id: string, data: any): Promise<void> {
    if (this.db && collectionName && id) {
      try {
        const docRef = doc(this.db, collectionName, id);
        await updateDoc(docRef, {
          ...data,
          updated_at: Timestamp.now()
      });
      } catch (error) {
        console.error(`Error updating document in ${collectionName} with ID ${id}:`, error);
        this.handleFirestoreError(error as FirestoreError);
        throw error;
      }
    } else return;
  }

  // Delete a document
  async delete(collectionName: string, id: string): Promise<void> {
    if (this.db && collectionName && id) {
      try {
        const docRef = doc(this.db, collectionName, id);
        await deleteDoc(docRef);
      } catch (error) {
        console.error(`Error deleting document from ${collectionName} with ID ${id}:`, error);
        this.handleFirestoreError(error as FirestoreError);
        throw error;
      }
    } else return;
  }

  // Get all documents from a collection
  async getAll(collectionName: string): Promise<DocumentData[] | null> {
      if (this.db && collectionName) {
        try {
        const collectionRef = collection(this.db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error(`Error getting all documents from ${collectionName}:`, error);
        this.handleFirestoreError(error as FirestoreError);
        throw error;
      }
    } else return null;
  }

  // Query documents with filters
  async query(
    collectionName: string, 
    conditions: { field: string; operator: string; value: any }[],
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number
  ): Promise<DocumentData[] | null> {

    if (this.db && collectionName) {
      try {
        const collectionRef = collection(this.db, collectionName);
        let q = query(collectionRef);
        
        // Apply where conditions
        if (conditions && conditions.length > 0) {
          q = query(
            q, 
            ...conditions.map(condition => 
              where(condition.field, condition.operator as any, condition.value)
            )
          );
        }
        
        // Apply orderBy
        if (orderByField) {
          q = query(q, orderBy(orderByField, orderDirection || 'asc'));
        }
        
        // Apply limit
        if (limitCount) {
          q = query(q, limit(limitCount));
        }
        
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error(`Error querying documents from ${collectionName}:`, error);
        this.handleFirestoreError(error as FirestoreError);
        throw error;
      }
    } else return null;
  }

  // Handle Firestore errors with more detailed logging
  private handleFirestoreError(error: FirestoreError): void {
    if (error.code === 'unavailable') {
      console.error('Firebase connection unavailable. Check your internet connection and Firebase project configuration.');
    } else if (error.code === 'permission-denied') {
      console.error('Firebase permission denied. Check your security rules and authentication.');
    } else if (error.code === 'not-found') {
      console.error('Firebase resource not found. Check that the collection or document exists.');
    } else if (error.code === 'resource-exhausted') {
      console.error('Firebase resource exhausted. You may have exceeded your quota or rate limits.');
    }
  }
}

// access singleton object
export let databaseService = DatabaseService.getInstance();

// Specific services for each collection
export const usersService = {
  async createUser(userId: string, userData: any): Promise<void> {
    return databaseService.createWithId('users', userId, userData);
  },
  
  async getUserById(userId: string): Promise<DocumentData | null> {
    return databaseService.getById('users', userId);
  },
  
  async updateUser(userId: string, userData: any): Promise<void> {
    return databaseService.update('users', userId, userData);
  },
  
  async getUserByEmail(email: string): Promise<DocumentData | null> {
    const users = await databaseService.query('users', [
      { field: 'email1', operator: '==', value: email }
    ]);
    if (users)
      return users.length > 0 ? users[0] : null;
    else return null;
  },

  async getAllUsers(): Promise<DocumentData[] | null> {
    return databaseService.getAll('users');
  }
};

export const subscriptionsService = {
  async getAllSubscriptions(): Promise<DocumentData[] | null> {
    return databaseService.getAll('subscriptions');
  },
  
  async getSubscriptionById(subscriptionId: string): Promise<DocumentData | null> {
    return databaseService.getById('subscriptions', subscriptionId);
  },
  
  async createSubscription(subscriptionData: any): Promise<string | null> {
    return databaseService.create('subscriptions', subscriptionData);
  },
  
  async updateSubscription(subscriptionId: string, subscriptionData: any): Promise<void> {
    return databaseService.update('subscriptions', subscriptionId, subscriptionData);
  },
  
  async getActiveSubscriptions( ): Promise<DocumentData[] | null> {
    return databaseService.query('subscriptions', [
      { field: 'is_active', operator: '==', value: true }
    ]);
  }
};

export const personasService = {
  async getAllPersonas(): Promise<DocumentData[] | null> {
    return databaseService.getAll('personas');
  },
  
  async getPersonaById(personaId: string): Promise<DocumentData | null> {
    return databaseService.getById('personas', personaId);
  },
  
  async createPersona(personaData: any): Promise<string | null> {
    return databaseService.create('personas', personaData);
  },
  
  async getPersonasByType(type: string): Promise<DocumentData[] | null> {
    return databaseService.query('personas', [
      { field: 'persona_type', operator: '==', value: type }
    ]);
  }
};

export const documentsService = {
  async getAllDocuments(): Promise<DocumentData[] | null> {
    return databaseService.getAll('documents');
  },
  
  async getDocumentById(docId: string): Promise<DocumentData | null> {
    return databaseService.getById('documents', docId);
  },
  
  async createDocument(documentData: any): Promise<string | null> {
    return databaseService.create('documents', documentData);
  },
  
  async updateDocument(docId: string, documentData: any): Promise<void> {
    return databaseService.update('documents', docId, documentData);
  },
  
  async getDocumentsByTopic(topicTag: string): Promise<DocumentData[] | null> {
    return databaseService.query('documents', [
      { field: 'topic_tags', operator: 'array-contains', value: topicTag }
    ]);
  }
};

export const topicsService = {
  async getAllTopics(): Promise<DocumentData[] | null> {
    return databaseService.getAll('topics');
  },
  
  async getTopicById(topicId: string): Promise<DocumentData | null> {
    return databaseService.getById('topics', topicId);
  },
  
  async createTopic(topicData: any): Promise<string | null> {
    return databaseService.create('topics', topicData);
  },
  
  async updateTopic(topicId: string, topicData: any): Promise<void> {
    return databaseService.update('topics', topicId, topicData);
  },
  
  async getTopicsByType(type: string): Promise<DocumentData[] | null> {
    return databaseService.query('topics', [
      { field: 'topic_type', operator: '==', value: type }
    ]);
  },
  
  async getPublicTopics( ): Promise<DocumentData[] | null> {
    return databaseService.query('topics', [
      { field: 'is_private', operator: '==', value: false }
    ]);
  }
};

export const transcriptsService = {
  async getAllTranscripts(): Promise<DocumentData[] | null> {
    return databaseService.getAll('transcripts');
  },
  
  async getTranscriptById(transcriptId: string): Promise<DocumentData | null> {
    return databaseService.getById('transcripts', transcriptId);
  },
  
  async createTranscript(transcriptData: any): Promise<string | null> {
    return databaseService.create('transcripts', transcriptData);
  },
  
  async updateTranscript(transcriptId: string, transcriptData: any): Promise<void> {
    return databaseService.update('transcripts', transcriptId, transcriptData);
  },
  
  async getTranscriptsByType(type: string): Promise<DocumentData[] | null> {
    return databaseService.query('transcripts', [
      { field: 'transcript_type', operator: '==', value: type }
    ]);
  },
  
  async getTranscriptsByTopic(topicTag: string): Promise<DocumentData[] | null> {
    return databaseService.query('transcripts', [
      { field: 'topic_tags', operator: 'array-contains', value: topicTag }
    ]);
  }
};

export const promptsService = {
  async getAllPrompts(): Promise<DocumentData[] | null> {
    return databaseService.getAll('prompts');
  },
  
  async getPromptById(promptId: string): Promise<DocumentData | null> {
    return databaseService.getById('prompts', promptId);
  },
  
  async createPrompt(promptData: any): Promise<string | null> {
    return databaseService.create('prompts', promptData);
  },
  
  async updatePrompt(promptId: string, promptData: any): Promise<void> {
    return databaseService.update('prompts', promptId, promptData);
  },
  
  async getActivePrompts(): Promise<DocumentData[] | null> {
    return databaseService.query('prompts', [
      { field: 'is_active', operator: '==', value: true }
    ]);
  },
  
  async getPromptsByPersona(personaId: string): Promise<DocumentData[] | null> {
    return databaseService.query('prompts', [
      { field: 'target_persona', operator: '==', value: personaId }
    ]);
  }
};

export const podcastsService = {
  async getAllPodcasts(): Promise<DocumentData[] | null> {
    return databaseService.getAll('podcasts');
  },
  
  async getPodcastById(podcastId: string): Promise<DocumentData | null> {
    return databaseService.getById('podcasts', podcastId);
  },
  
  async createPodcast(podcastData: any): Promise<string | null> {
    return databaseService.create('podcasts', podcastData);
  },
  
  async updatePodcast(podcastId: string, podcastData: any): Promise<void> {
    return databaseService.update('podcasts', podcastId, podcastData);
  },
  
  async getPodcastsByType(type: string): Promise<DocumentData[] | null> {
    return databaseService.query('podcasts', [
      { field: 'podcast_type', operator: '==', value: type }
    ]);
  },
  
  async getPodcastsByTopic(topicTag: string): Promise<DocumentData[] | null> {
    return databaseService.query('podcasts', [
      { field: 'topic_tags', operator: 'array-contains', value: topicTag }
    ]);
  },
  
  async getPodcastsBySubscriptionType(subscriptionType: string): Promise<DocumentData[] | null> {
    return databaseService.query('podcasts', [
      { field: 'subscription_type', operator: '==', value: subscriptionType }
    ]);
  }
};

export const episodesService = {
  async getAllEpisodes(podcastId: string): Promise<DocumentData[] | null> {
    return databaseService.query('episodes', [
      { field: 'podcast_id', operator: '==', value: podcastId }
    ]);
  },
  
  async getEpisodeById(podcastId: string, episodeId: string): Promise<DocumentData | null> {
    const episodes = await databaseService.query('episodes', [
      { field: 'podcast_id', operator: '==', value: podcastId },
      { field: 'episode_id', operator: '==', value: episodeId }
    ]);
    if (episodes)
      return episodes.length > 0 ? episodes[0] : null;
    else return null;
  },
  
  async createEpisode(episodeData: any): Promise<string | null> {
    return databaseService.create('episodes', episodeData);
  },
  
  async updateEpisode(episodeId: string, episodeData: any): Promise<void> {
    return databaseService.update('episodes', episodeId, episodeData);
  },
  
  async getEpisodesByTopic(topicTag: string): Promise<DocumentData[] | null> {
    return databaseService.query('episodes', [
      { field: 'topic_tags', operator: 'array-contains', value: topicTag }
    ]);
  },
  
  async getRecentEpisodes(limit: number = 10): Promise<DocumentData[] | null> {
    return databaseService.query(
      'episodes', 
      [], 
      'publish_datetime', 
      'desc', 
      limit
    );
  },
  
  async getPopularEpisodes(limit: number = 10): Promise<DocumentData[] | null> {
    return databaseService.query(
      'episodes', 
      [], 
      'views', 
      'desc', 
      limit
    );
  }
};

export const questionsService = {
  async getAllQuestions(podcastId?: string): Promise<DocumentData[] | null> {
    if (podcastId) {
      return databaseService.query('questions', [
        { field: 'podcast_id', operator: '==', value: podcastId }
      ]);
    }
    return databaseService.getAll('questions');
  },
  
  async createQuestion(questionData: any): Promise<string | null> {
    return databaseService.create('questions', questionData);
  },
  
  async getPopularQuestions(podcastId: string, limit: number = 10): Promise<DocumentData[] | null> {
    return databaseService.query(
      'questions',
      [{ field: 'podcast_id', operator: '==', value: podcastId }],
      'clicks',
      'desc',
      limit
    );
  },
  
  async getUserQuestions(userId: string): Promise<DocumentData[] | null> {
    return databaseService.query('questions', [
      { field: 'user_id', operator: '==', value: userId }
    ]);
  }
};

export const chatsService = {
  async getChatHistory(userId: string): Promise<DocumentData[] | null> {
    return databaseService.query(
      'chats',
      [{ field: 'user_id', operator: '==', value: userId }],
      'create_datetime',
      'asc'
    );
  },
  
  async createChatMessage(chatData: any): Promise<string | null> {
    return databaseService.create('chats', chatData);
  },
  
  async deleteChatMessage(chatId: string): Promise<void> {
    return databaseService.update('chats', chatId, {
      delete_datetime: Timestamp.now()
    });
  },
  
  async getActiveChatHistory(userId: string): Promise<DocumentData[] | null> {
    return databaseService.query(
      'chats',
      [
        { field: 'user_id', operator: '==', value: userId },
        { field: 'delete_datetime', operator: '==', value: null }
      ],
      'create_datetime',
      'asc'
    );
  }
};