<!-- Component pour l'affichage des icônes d'application -->
 
<template>
    <div 
      class="flex flex-col items-center justify-center cursor-pointer p-2 rounded hover:bg-blue-100/50"
      @click="$emit('click')"
    >
      <div class="app-icon mb-1 flex items-center justify-center text-3xl">
        <img v-if="iconSrc" :src="iconSrc" :alt="alt" class="icon-img">
      <span v-else class="text-3xl">
        <slot name="icon">📄</slot>
      </span>
      </div>
      <div class="app-label text-center text-sm">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
 export default {
  name: 'AppIcon',
  props: {
    iconSrc: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: 'Icon'
    }
  },
  emits: ['click']
}
  </script>
  
  <style scoped>
  .app-icon {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.app-label {
  max-width: 80px;
  color: #000;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.7);
}
  </style>