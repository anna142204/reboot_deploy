<!-- Component pour le bouton avec un style Windows 95 -->
<!-- Utilisé pour les choix génériques-->
 
<template>
    <button
      class="px-3 py-1 bg-gray-200 border border-t-white border-l-white border-b-gray-600 border-r-gray-600 shadow-inner text-sm cursor-pointer text-center transition active:border-b-white active:border-r-white active:border-t-gray-600 active:border-l-gray-600"
      @click="$emit('click')"
    >
      <slot></slot>
    </button>
  </template>
  
  <style scoped>
  button {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    min-width: 80px;
    box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #00000044;
  }
  </style>