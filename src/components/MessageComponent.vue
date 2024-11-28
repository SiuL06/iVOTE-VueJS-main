<template>
    <div :class="`message ${messageType}`" v-if="isVisible">
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'MessageComponent',
    props: {
      message: {
        type: String,
        required: true,
      },
      messageType: {
        type: String,
        default: 'success', // Default type can be success or error
      },
    },
    data() {
      return {
        isVisible: true,
      };
    },
    mounted() {
      // Automatically hide the message after 3 seconds
      setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    },
  };
  </script>
  
  <style scoped>
  .message {
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    text-align: center;
    transition: opacity 0.5s ease;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
  }
  </style>
  