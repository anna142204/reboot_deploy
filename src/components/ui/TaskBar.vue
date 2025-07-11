<!-- Bar de tâches en bas de l'écran-->
 
<template>
    <div class="h-8 bg-gray-300 border-t border-gray-500 flex items-center justify-between px-4">
      <div class="flex gap-2 items-center">
        <button class="px-2 py-0.5 bg-white border border-gray-400 text-sm font-semibold shadow-inner">
          Démarrer
        </button>
        <div v-for="app in openApps" :key="app" class="px-2 py-0.5 bg-white border border-gray-400 text-sm shadow-inner">
          {{ app }}
        </div>
      </div>
      <span class="text-sm font-medium text-gray-700">{{ time }}</span>
    </div>
  </template>
  
  <script>
  export default {
    props: ['openApps'],
    data() {
      return {
        time: new Date().toLocaleTimeString()
      };
    },
    mounted() {
      setInterval(() => {
        this.time = new Date().toLocaleTimeString();
      }, 1000);
    }
  };
  </script>
  
  <style scoped>
  button {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  </style>