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
// import { db } from "@/lib/firebase";
// import { useDebugValue } from "react";

//if (!(db instanceof Firestore)) {
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
class DatabaseService {
  // Create a new document with a specific ID
  async createWithId(db: Firestore, collection: string, id: string, data: any): Promise<void> {
    try {
      if (db instanceof Firestore && collection && id) {
        const docRef = doc(db, collection, id);
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
  async create(db: Firestore, collectionName: string, data: any): Promise<string | null> {
    if (db instanceof Firestore && collectionName) {
      try {
        const collectionRef = collection(db, collectionName);
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
  async getById(db: Firestore, collectionName: string, id: string): Promise<DocumentData | null> {
    if (db instanceof Firestore && collectionName && id) {
      try {
          const docRef = doc(db, collectionName, id);
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
  async update(db: Firestore, collectionName: string, id: string, data: any): Promise<void> {
    if (db instanceof Firestore && collectionName && id) {
      try {
        const docRef = doc(db, collectionName, id);
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
  async delete(db: Firestore, collectionName: string, id: string): Promise<void> {
    if (db instanceof Firestore && collectionName && id) {
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      } catch (error) {
        console.error(`Error deleting document from ${collectionName} with ID ${id}:`, error);
        this.handleFirestoreError(error as FirestoreError);
        throw error;
      }
    } else return;
  }

  // Get all documents from a collection
  async getAll(db: Firestore, collectionName: string): Promise<DocumentData[] | null> {
      if (db instanceof Firestore && collectionName) {
        try {
        const collectionRef = collection(db, collectionName);
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
  async query(db: Firestore, 
    collectionName: string, 
    conditions: { field: string; operator: string; value: any }[],
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number
  ): Promise<DocumentData[] | null> {

    if (db instanceof Firestore && collectionName) {
      try {
        const collectionRef = collection(db, collectionName);
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

export const databaseService = new DatabaseService();

// Specific services for each collection
export const usersService = {
  async createUser(db: Firestore, userId: string, userData: any): Promise<void> {
    return databaseService.createWithId(db, 'users', userId, userData);
  },
  
  async getUserById(db: Firestore, userId: string): Promise<DocumentData | null> {
    return databaseService.getById(db, 'users', userId);
  },
  
  async updateUser(db: Firestore, userId: string, userData: any): Promise<void> {
    return databaseService.update(db, 'users', userId, userData);
  },
  
  async getUserByEmail(db: Firestore, email: string): Promise<DocumentData | null> {
    const users = await databaseService.query(db, 'users', [
      { field: 'email1', operator: '==', value: email }
    ]);
    if (users)
      return users.length > 0 ? users[0] : null;
    else return null;
  },

  async getAllUsers(db: Firestore): Promise<DocumentData[] | null> {
    return databaseService.getAll(db, 'users');
  }
};

export const subscriptionsService = {
  async getAllSubscriptions(db: Firestore): Promise<DocumentData[] | null> {
    return databaseService.getAll(db, 'subscriptions');
  },
  
  async getSubscriptionById(db: Firestore, subscriptionId: string): Promise<DocumentData | null> {
    return databaseService.getById(db, 'subscriptions', subscriptionId);
  },
  
  async createSubscription(db: Firestore, subscriptionData: any): Promise<string | null> {
    return databaseService.create(db, 'subscriptions', subscriptionData);
  },
  
  async updateSubscription(db: Firestore, subscriptionId: string, subscriptionData: any): Promise<void> {
    return databaseService.update(db, 'subscriptions', subscriptionId, subscriptionData);
  },
  
  async getActiveSubscriptions(db: Firestore ): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'subscriptions', [
      { field: 'is_active', operator: '==', value: true }
    ]);
  }
};

export const personasService = {
  async getAllPersonas(db: Firestore, ): Promise<DocumentData[] | null> {
    return databaseService.getAll(db, 'personas');
  },
  
  async getPersonaById(db: Firestore, personaId: string): Promise<DocumentData | null> {
    return databaseService.getById(db, 'personas', personaId);
  },
  
  async createPersona(db: Firestore, personaData: any): Promise<string | null> {
    return databaseService.create(db, 'personas', personaData);
  },
  
  async getPersonasByType(db: Firestore, type: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'personas', [
      { field: 'persona_type', operator: '==', value: type }
    ]);
  }
};

export const documentsService = {
  async getAllDocuments(db: Firestore, ): Promise<DocumentData[] | null> {
    return databaseService.getAll(db, 'documents');
  },
  
  async getDocumentById(db: Firestore, docId: string): Promise<DocumentData | null> {
    return databaseService.getById(db, 'documents', docId);
  },
  
  async createDocument(db: Firestore, documentData: any): Promise<string | null> {
    return databaseService.create(db, 'documents', documentData);
  },
  
  async updateDocument(db: Firestore, docId: string, documentData: any): Promise<void> {
    return databaseService.update(db, 'documents', docId, documentData);
  },
  
  async getDocumentsByTopic(db: Firestore, topicTag: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'documents', [
      { field: 'topic_tags', operator: 'array-contains', value: topicTag }
    ]);
  }
};

export const topicsService = {
  async getAllTopics(db: Firestore, ): Promise<DocumentData[] | null> {
    return databaseService.getAll(db, 'topics');
  },
  
  async getTopicById(db: Firestore, topicId: string): Promise<DocumentData | null> {
    return databaseService.getById(db, 'topics', topicId);
  },
  
  async createTopic(db: Firestore, topicData: any): Promise<string | null> {
    return databaseService.create(db, 'topics', topicData);
  },
  
  async updateTopic(db: Firestore, topicId: string, topicData: any): Promise<void> {
    return databaseService.update(db, 'topics', topicId, topicData);
  },
  
  async getTopicsByType(db: Firestore, type: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'topics', [
      { field: 'topic_type', operator: '==', value: type }
    ]);
  },
  
  async getPublicTopics(db: Firestore ): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'topics', [
      { field: 'is_private', operator: '==', value: false }
    ]);
  }
};

export const transcriptsService = {
  async getAllTranscripts(db: Firestore): Promise<DocumentData[] | null> {
    return databaseService.getAll(db, 'transcripts');
  },
  
  async getTranscriptById(db: Firestore, transcriptId: string): Promise<DocumentData | null> {
    return databaseService.getById(db, 'transcripts', transcriptId);
  },
  
  async createTranscript(db: Firestore, transcriptData: any): Promise<string | null> {
    return databaseService.create(db, 'transcripts', transcriptData);
  },
  
  async updateTranscript(db: Firestore, transcriptId: string, transcriptData: any): Promise<void> {
    return databaseService.update(db, 'transcripts', transcriptId, transcriptData);
  },
  
  async getTranscriptsByType(db: Firestore, type: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'transcripts', [
      { field: 'transcript_type', operator: '==', value: type }
    ]);
  },
  
  async getTranscriptsByTopic(db: Firestore, topicTag: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'transcripts', [
      { field: 'topic_tags', operator: 'array-contains', value: topicTag }
    ]);
  }
};

export const promptsService = {
  async getAllPrompts(db: Firestore): Promise<DocumentData[] | null> {
    return databaseService.getAll(db, 'prompts');
  },
  
  async getPromptById(db: Firestore, promptId: string): Promise<DocumentData | null> {
    return databaseService.getById(db, 'prompts', promptId);
  },
  
  async createPrompt(db: Firestore, promptData: any): Promise<string | null> {
    return databaseService.create(db, 'prompts', promptData);
  },
  
  async updatePrompt(db: Firestore, promptId: string, promptData: any): Promise<void> {
    return databaseService.update(db, 'prompts', promptId, promptData);
  },
  
  async getActivePrompts(db: Firestore): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'prompts', [
      { field: 'is_active', operator: '==', value: true }
    ]);
  },
  
  async getPromptsByPersona(db: Firestore, personaId: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'prompts', [
      { field: 'target_persona', operator: '==', value: personaId }
    ]);
  }
};

export const podcastsService = {
  async getAllPodcasts(db: Firestore): Promise<DocumentData[] | null> {
    return databaseService.getAll(db, 'podcasts');
  },
  
  async getPodcastById(db: Firestore, podcastId: string): Promise<DocumentData | null> {
    return databaseService.getById(db, 'podcasts', podcastId);
  },
  
  async createPodcast(db: Firestore, podcastData: any): Promise<string | null> {
    return databaseService.create(db, 'podcasts', podcastData);
  },
  
  async updatePodcast(db: Firestore, podcastId: string, podcastData: any): Promise<void> {
    return databaseService.update(db, 'podcasts', podcastId, podcastData);
  },
  
  async getPodcastsByType(db: Firestore, type: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'podcasts', [
      { field: 'podcast_type', operator: '==', value: type }
    ]);
  },
  
  async getPodcastsByTopic(db: Firestore, topicTag: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'podcasts', [
      { field: 'topic_tags', operator: 'array-contains', value: topicTag }
    ]);
  },
  
  async getPodcastsBySubscriptionType(db: Firestore, subscriptionType: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'podcasts', [
      { field: 'subscription_type', operator: '==', value: subscriptionType }
    ]);
  }
};

export const episodesService = {
  async getAllEpisodes(db: Firestore, podcastId: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'episodes', [
      { field: 'podcast_id', operator: '==', value: podcastId }
    ]);
  },
  
  async getEpisodeById(db: Firestore, podcastId: string, episodeId: string): Promise<DocumentData | null> {
    const episodes = await databaseService.query(db, 'episodes', [
      { field: 'podcast_id', operator: '==', value: podcastId },
      { field: 'episode_id', operator: '==', value: episodeId }
    ]);
    if (episodes)
      return episodes.length > 0 ? episodes[0] : null;
    else return null;
  },
  
  async createEpisode(db: Firestore, episodeData: any): Promise<string | null> {
    return databaseService.create(db, 'episodes', episodeData);
  },
  
  async updateEpisode(db: Firestore, episodeId: string, episodeData: any): Promise<void> {
    return databaseService.update(db, 'episodes', episodeId, episodeData);
  },
  
  async getEpisodesByTopic(db: Firestore, topicTag: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'episodes', [
      { field: 'topic_tags', operator: 'array-contains', value: topicTag }
    ]);
  },
  
  async getRecentEpisodes(db: Firestore, limit: number = 10): Promise<DocumentData[] | null> {
    return databaseService.query(db, 
      'episodes', 
      [], 
      'publish_datetime', 
      'desc', 
      limit
    );
  },
  
  async getPopularEpisodes(db: Firestore, limit: number = 10): Promise<DocumentData[] | null> {
    return databaseService.query(db, 
      'episodes', 
      [], 
      'views', 
      'desc', 
      limit
    );
  }
};

export const questionsService = {
  async getAllQuestions(db: Firestore, podcastId?: string): Promise<DocumentData[] | null> {
    if (podcastId) {
      return databaseService.query(db, 'questions', [
        { field: 'podcast_id', operator: '==', value: podcastId }
      ]);
    }
    return databaseService.getAll(db, 'questions');
  },
  
  async createQuestion(db: Firestore, questionData: any): Promise<string | null> {
    return databaseService.create(db, 'questions', questionData);
  },
  
  async getPopularQuestions(db: Firestore, podcastId: string, limit: number = 10): Promise<DocumentData[] | null> {
    return databaseService.query(db, 
      'questions',
      [{ field: 'podcast_id', operator: '==', value: podcastId }],
      'clicks',
      'desc',
      limit
    );
  },
  
  async getUserQuestions(db: Firestore, userId: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 'questions', [
      { field: 'user_id', operator: '==', value: userId }
    ]);
  }
};

export const chatsService = {
  async getChatHistory(db: Firestore, userId: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 
      'chats',
      [{ field: 'user_id', operator: '==', value: userId }],
      'create_datetime',
      'asc'
    );
  },
  
  async createChatMessage(db: Firestore, chatData: any): Promise<string | null> {
    return databaseService.create(db, 'chats', chatData);
  },
  
  async deleteChatMessage(db: Firestore, chatId: string): Promise<void> {
    return databaseService.update(db, 'chats', chatId, {
      delete_datetime: Timestamp.now()
    });
  },
  
  async getActiveChatHistory(db: Firestore, userId: string): Promise<DocumentData[] | null> {
    return databaseService.query(db, 
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