import { ref, readonly } from 'vue';

const story = ref(null);
const loading = ref(false);
const error = ref(null);
const isInitialized = ref(false);

async function fetchStory(storyId) {
  if (isInitialized.value && story.value && story.value.id === storyId) {
    return; 
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/story.json`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.story || !data.chapters || !data.choices) {
      throw new Error("Structure de données invalide");
    }
    
    // Associer les choix aux chapitres
    const chaptersWithChoices = data.chapters.map(chapter => ({
      ...chapter,
      choices: data.choices.filter(choice => choice.chapter_id === chapter.id)
    }));
    
    const transformedStory = {
      id: data.story.id || storyId,
      title: data.story.title,
      summary: data.story.summary,
      chapters: chaptersWithChoices
    };
    
    story.value = transformedStory;
    isInitialized.value = true;
    
    console.log('Histoire chargée:', transformedStory);
    
  } catch (err) {
    console.error("Erreur lors du chargement de l'histoire:", err);
    error.value = err.message || "Erreur lors du chargement de l'histoire";
    story.value = null;
  } finally {
    loading.value = false;
  }
}

function resetStore() {
  story.value = null;
  loading.value = false;
  error.value = null;
  isInitialized.value = false;
}

export const storyStore = {
  story: readonly(story),
  loading: readonly(loading),
  error: readonly(error),
  isInitialized: readonly(isInitialized),
  
  fetchStory,
  resetStore
};