<template>
    
    <div class="files-container mt-4">
      <div v-for="choice in choices" :key="choice.id" class="file-icon">
        <AppIcon
          iconSrc="./icons/file.png"
          alt="file"
          @click="$emit('select', choice)"
        >
          <template #icon>📄</template>
          {{ choice.text }}
        </AppIcon>
      </div>
    </div>
  </template>
  
  <script>
  import AppIcon from "@/components/ui/AppIcon.vue";
  
  export default {
    components: { AppIcon },
    props: {
      choices: {
        type: Array,
        required: true
      }
    },
    emits: ['select']
  }
  </script>
  
  <style scoped>
  .files-container {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
    padding: 15px;
    background-color: white;
    border: 1px inset #c0c0c0;
  }
  
  .file-icon {
    margin-bottom: 10px;
  }
  </style>