<template>
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-[#008080] overflow-auto">
      <div class="win95-window max-w-xl w-full mx-4">
        <!-- Barre de titre -->
        <div class="win95-title-bar">
          <div class="win95-title">
            {{ isWin ? 'Mission accomplie' : 'System Error' }}
          </div>
          <div class="win95-controls">
            <button class="win95-button-close" disabled>✕</button>
          </div>
        </div>
        
        <!-- Contenu -->
        <div class="win95-content p-4">
          <div class="flex items-center mb-4">
            <div class="mr-4">
              <img :src="isWin ? '/icons/success.png' : '/icons/error.png'" 
                   :alt="isWin ? 'Success' : 'Error'"
                   class="w-12 h-12">
            </div>
            <div class="text-lg font-bold">
              {{ isWin ? 'Opération réussie' : 'Erreur système fatale' }}
            </div>
          </div>
          
          <div class="bg-white border-inset p-4 mb-4 overflow-auto max-h-[200px] text-left">
            <p v-if="isWin" class="mb-2">
              <b>{{ winTitle }}</b>
            </p>
            <p v-else class="mb-2">
              <b>Erreur:</b>  L'ordinateur s'est auto-détruit.
            </p>
            
            <p class="mb-2">{{ isWin ? winMessage : loseMessage }}</p>
            
            <p v-if="isWin" class="mt-4 text-sm">
              <b>État:</b> Terminé
            </p>
            <p v-else class="mt-4 text-sm text-red-700">
              <b>État:</b> Game Over
            </p>
          </div>
          
          <div class="flex justify-end gap-2">
            <button 
              @click="$emit('restart')" 
              class="win95-button"
            >
              Nouvelle partie
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isWin: {
      type: Boolean,
      default: true
    },
    winMessage: {
      type: String,
      default: ' '
    },
    loseMessage: {
      type: String,
      default: "Tu n'étais pas encore prêt(e) à découvrir la vérité."
    },
      winTitle: {
    type: String,
    default: "Vous avez retrouvé qui vous êtes."
  },
  loseTitle: {
    type: String,
    default: "Le système de protection s'est activé."
  }
  });
  
  defineEmits(['restart', 'continue']);
  

  </script>
  
<style scoped>
  .win95-window {
    background-color: #c0c0c0;
    border: 3px solid;
    border-color: #dfdfdf #000000 #000000 #dfdfdf;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  }
  
  .win95-title-bar {
    background-color: #000080;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 3px 3px;
    font-weight: bold;
    font-size: 0.8rem;
  }
  
  .win95-title {
    font-family: 'Arial', sans-serif;
    padding-left: 3px;
  }
  
  .win95-controls {
    display: flex;
  }
  
  .win95-button-close {
    background-color: #c0c0c0;
    border: 2px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
    width: 16px;
    height: 14px;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
  }
  
  .win95-content {
    padding: 8px;
    font-family: 'MS Sans Serif', Arial, sans-serif;
  }
  
  .border-inset {
    border: 2px solid;
    border-color: #808080 #ffffff #ffffff #808080;
  }
  
  .win95-button {
    background-color: #c0c0c0;
    border: 2px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
    padding: 4px 10px;
    font-family: 'MS Sans Serif', Arial, sans-serif;
    font-size: 0.85rem;
    min-width: 75px;
    text-align: center;
  }
  
  .win95-button:active {
    border-color: #808080 #ffffff #ffffff #808080;
  }
  </style>