<template>
    <div class="mail-container">
      <div class="mail-header">
        <div class="mail-header-row">
          <span class="mail-header-label">De:</span>
          <span class="mail-header-value">Emma</span>
        </div>
        <div class="mail-header-row">
          <span class="mail-header-label">Objet:</span>
          <span class="mail-header-value font-bold">Re: Informations importantes</span>
        </div>
        <div class="mail-header-row">
          <span class="mail-header-label">Date:</span>
          <span class="mail-header-value">{{ getCurrentDate()}}</span>
        </div>
      </div>
      
      <div class="mail-body">
        <p v-for="(paragraph, index) in contentParagraphs" :key="index" class="mail-paragraph">
          {{ paragraph }}
        </p>
      </div>

    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    content: {
      type: String,
      default: "Tu as reçu une réponse automatique d'Emma"
    },
    showActions: {
      type: Boolean,
      default: false
    }
  });
  
  const contentParagraphs = computed(() => {
    return props.content.split('\n\n');
  });
  
  function getCurrentDate() {
    const now = new Date();
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return now.toLocaleDateString('fr-FR', options).replace(',', '');
  }
  
  defineEmits(['reply', 'delete']);
  </script>
  
  <style scoped>
  .mail-container {
    font-family: 'MS Sans Serif', Arial, sans-serif;
    background-color: #ffffff;
    border: 2px solid;
    border-color: #dfdfdf #808080 #808080 #dfdfdf;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
    width: 100%;
  }
  
  .mail-header {
    background-color: #eaeaea;
    padding: 8px;
    border-bottom: 1px solid #c0c0c0;
  }
  
  .mail-header-row {
    display: flex;
    margin-bottom: 4px;
  }
  
  .mail-header-label {
    width: 50px;
    font-weight: bold;
    color: #000080;
  }
  
  .mail-header-value {
    flex: 1;
  }
  
  .mail-body {
    padding: 12px;
    background-color: white;
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .mail-paragraph {
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  
  
  .win95-button {
    display: flex;
    align-items: center;
    background-color: #c0c0c0;
    border: 2px solid;
    border-color: #ffffff #808080 #808080 #ffffff;
    padding: 4px 8px;
    font-family: 'MS Sans Serif', Arial, sans-serif;
    font-size: 0.9rem;
  }
  
  .win95-button:active {
    border-color: #808080 #ffffff #ffffff #808080;
  }
  
  .button-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  </style>