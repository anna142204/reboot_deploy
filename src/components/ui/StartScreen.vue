<!-- filepath: c:\Users\anna\DevProdMed\reboot-test-2\reboot-test\resources\js\components\ui\StartScreen.vue -->
<template>
  <div class="start-screen">
    <div class="content-container">
      <div class="header">
        <h1>RE:BOOT</h1>
      </div>
      
      <div v-if="loading" class="loading">
        <p>Démarrage du système...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>Erreur: Impossible de charger le système.</p>
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="introChapter" class="chapter-content">
        <p v-html="introChapter.content.replace(/\n/g, '<br>')"></p>
      </div>
      
      <div class="start-button-container">
        <button 
          @click="startGame" 
          class="start-button"
          :disabled="loading || !introChapter"
        >
          Ouvrir l'ordinateur
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useStory } from '@/composables/useStory';

const emit = defineEmits(['start']);

const { story, loading, error } = useStory(1);

const isReady = computed(() => !loading.value && story.value);

const introChapter = computed(() => {
  if (!isReady.value) return null;
  return story.value.chapters.find(chapter => chapter.id === 1);
});

watch(isReady, (ready) => {
  if (ready) {
    //
    console.log('Histoire chargée avec succès, prêt à démarrer');
  }
});

function startGame() {
  if (isReady.value) {
    emit('start');
  }
}
</script>
  
  <style scoped>
  .start-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #008080;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'MS Sans Serif', Arial, sans-serif;
  }
  
  .content-container {
    width: 80%;
    max-width: 600px;
    background-color: #c0c0c0;
    border: 2px solid #fff;
    border-right-color: #848484;
    border-bottom-color: #848484;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    padding: 1rem;
  }
  
  .header {
    background: linear-gradient(to right, #000080, #1084d0);
    color: white;
    padding: 4px 8px;
    margin: -1rem -1rem 1rem -1rem;
  }
  
  h1 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: bold;
  }
  
  .chapter-content {
    background-color: white;
    border: inset 2px #a0a0a0;
    padding: 1rem;
    margin-bottom: 1rem;
    max-height: 60vh;
    overflow-y: auto;
    line-height: 1.5;
  }
  
  .chapter-content p {
    margin-bottom: 1rem;
  }
  
  .loading, .error {
    background-color: white;
    border: inset 2px #a0a0a0;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .error {
    color: #cc0000;
  }
  .auth-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #c0c0c0;
  border: 2px outset #ddd;
  border-right-color: #848484;
  border-bottom-color: #848484;
  padding: 5px 12px;
  font-size: 0.9rem;
  color: #000;
  cursor: pointer;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  z-index: 10000;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}

.auth-icon {
  margin-right: 5px;
  font-size: 1rem;
}

.auth-button:hover {
  background-color: #d0d0d0;
}

.auth-button:active {
  border-style: inset;
  border-color: #a0a0a0;
}
  .start-button-container {
    text-align: center;
  }
  
  .start-button {
    background-color: #c0c0c0;
    border: 2px outset #ddd;
    border-right-color: #848484;
    border-bottom-color: #848484;
    padding: 0.5rem 2rem;
    font-size: 1rem;
    color: #000;
    cursor: pointer;
    font-family: 'MS Sans Serif', Arial, sans-serif;
  }
  
  .start-button:hover:not(:disabled) {
    background-color: #d0d0d0;
  }
  
  .start-button:active:not(:disabled) {
    border-style: inset;
    border-color: #a0a0a0;
  }
  
  .start-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  </style>