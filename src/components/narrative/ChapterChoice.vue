<template>
    <div class="choices-container mt-4">
      <Button95
        v-for="choice in choices"
        :key="choice.id"
        @click="$emit('select', choice)"
        class="mb-2"
      >
        {{ choice.text }}
      </Button95>
    </div>
  </template>
  
  <script>
  import Button95 from "@/components/ui/Button95.vue";
  
  export default {
    components: { Button95 },
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
  .choices-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  </style>