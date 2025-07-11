<template>
    <div class="contact-container mt-4">
      <div class="contacts-list">
        <div v-for="contact in contacts" :key="contact.id" class="contact-item">
          <img :src="peopleIconPath" class="contact-avatar" alt="Contact" />
          <div class="contact-details">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-info">{{ contact.info }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Button95 from "@/components/ui/Button95.vue";
  
  export default {
    components: { Button95 },
    data() {
      return {
        contacts: [
          
          {
            id: 1,
            name: "Dr. Martin",
            info: "Cabinet médical - Rendez-vous annulé",
          },
          { id: 2, name: "Numéro inconnu", info: "3 appels manqués" },
         
          { id: 3, name: "Hôpital Central", info: "Urgence" },
          
          { id: 4, name: "SYSTÈME", info: "Contact système - Ne pas supprimer" },
          {
            id: 5,
            name: "Moi",
            info: "Notes personnelles",
          },
          {
            id: 6,
            name: "A. Laurent",
            info: "Thérapeute - Prochain RDV: SUPPRIMÉ",
          },
        ],
         peopleIconPath: `${import.meta.env.BASE_URL}icons/people.png`
      };
    }
  }
  </script>
  
  <style scoped>
  .contact-container {
    background-color: #f0f0f0;
    border: 1px solid #808080;
    border-radius: 1px;
    overflow: hidden;
  }
  
  .contact-header {
    padding: 5px 10px;
    background: linear-gradient(to right, #000080, #1084d0);
    color: white;
  }
  
  .contact-title {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .contact-tabs {
    display: flex;
    margin-top: 4px;
  }
  
  .contact-tab {
    padding: 2px 8px;
    background-color: #d4d0c8;
    color: #000;
    font-size: 12px;
    margin-right: 1px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  
  .contact-tab.active {
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  .contact-search {
    display: flex;
    align-items: center;
    padding: 8px;
    background-color: #d4d0c8;
    border-bottom: 1px solid #808080;
  }
  
  .search-input {
    margin-left: 8px;
    padding: 2px 4px;
    border: 1px solid #808080;
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2);
    width: 180px;
    font-size: 12px;
  }
  
  .contacts-list {
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
    border: 1px inset #d4d0c8;
    margin: 8px;
  }
  
  .contact-item {
    display: flex;
    padding: 6px 8px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
  }
  
  .contact-item:hover {
    background-color: #e0e0e0;
  }
  
  .contact-avatar {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  
  .contact-details {
    flex: 1;
  }
  
  .contact-name {
    font-weight: bold;
    font-size: 14px;
  }
  
  .contact-info {
    font-size: 12px;
    color: #444;
  }
  
  .contact-actions {
    display: flex;
    justify-content: flex-end;
    padding: 8px;
    gap: 8px;
    border-top: 1px solid #c0c0c0;
    background-color: #d4d0c8;
  }
  </style>