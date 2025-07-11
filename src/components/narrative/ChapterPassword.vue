<template>
    <div class="password-container mt-4">
      <p class="instructions text-sm mb-2">Mot de passe requis :</p>
  
      <div class="password-field-container">
        <input
          type="password"
          v-model="localPasswordInput"
          class="password-field"
          placeholder="Entrez le mot de passe"
          @keypress.enter="validatePassword"
        />
      </div>
  
      <div class="password-buttons mt-3">
        <Button95 @click="validatePassword" class="mr-2">Valider</Button95>
        <Button95 @click="$emit('cancel')">Annuler</Button95>
      </div>
  
      <p v-if="showError" class="password-error mt-2">
        Mot de passe incorrect. Veuillez réessayer.
      </p>
    </div>
  </template>
  
  <script>
  import Button95 from "@/components/ui/Button95.vue";
  
  export default {
    components: { Button95 },
    props: {
      correctPassword: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        localPasswordInput: "",
        showError: false,
        isProcessing: false
      };
    },
    methods: {
      validatePassword() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        try {
          if (this.localPasswordInput.toLowerCase() === this.correctPassword.toLowerCase()) {
            this.$emit('success', this.localPasswordInput);
          } else {
            this.showError = true;
            this.$emit('error');
          }
        } finally {
          setTimeout(() => {
            this.isProcessing = false;
          }, 100);
        }
      },
      
    }
  }
  </script>
  
  <style scoped>
  .password-container {
  background-color: #f0f0f0;
  border: 1px solid #808080;
  border-radius: 2px;
  padding: 16px;
  box-shadow: inset 1px 1px 0px #ffffff, inset -1px -1px 0px #707070;
}

.password-field-container {
  padding: 2px;
  background-color: white;
  border: 1px solid #7b7b7b;
  border-radius: 0;
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.password-field {
  width: 100%;
  height: 24px;
  padding: 0 8px;
  font-family: "Segoe UI", sans-serif;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
}

.password-buttons {
  display: flex;
  justify-content: center;
}

.password-error {
  color: #cc0000;
  font-size: 12px;
  text-align: center;
}

.instructions {
  color: #333;
}
  </style>