import { computed, ref } from 'vue';
import { storyStore } from '@/stores/storyStore';

const pendingRequests = {};

export function useStory(storyId) {

  if (pendingRequests[storyId]) {
    console.log(`Une requête pour l'histoire #${storyId} est déjà en cours`);
    return {
      story: storyStore.story,
      loading: storyStore.loading,
      error: storyStore.error,
      refresh: () => storyStore.fetchStory(storyId)
    };
  }
  
  if (storyStore.isInitialized.value && 
      storyStore.story.value && 
      storyStore.story.value.id === storyId) {
    return {
      story: storyStore.story,
      loading: storyStore.loading,
      error: storyStore.error,
      refresh: () => storyStore.fetchStory(storyId)
    };
  }
  
  pendingRequests[storyId] = true;
  
  storyStore.fetchStory(storyId)
    .finally(() => {
      delete pendingRequests[storyId];
    });
  
  return {
    story: storyStore.story,
    loading: storyStore.loading,
    error: storyStore.error,
    refresh: () => storyStore.fetchStory(storyId)
  };
}