<!-- Visuel pour les fenêtres (NarrativeApp)  -->
<template>
    <div class="border border-gray-600 bg-gray-100 shadow-lg w-full rounded-sm overflow-hidden">
      <div class="bg-blue-600 text-white flex justify-between items-center px-2 py-1 text-sm font-bold">
        <span>{{ title }}</span>
        <button class="bg-red-600 px-2 text-white" @click="$emit('close')">X</button>
      </div>
      <div class="p-3 bg-white text-sm text-gray-800">
        <slot ></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['title']
  };
  </script>
  