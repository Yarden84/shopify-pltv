<template>
    <div class="popup-container" ref="popupContainer" @click="closePopup">
        <div class="popup">
            <h3>Please enter store name</h3>
            <input type="text" placeholder="Store Name" class="store-input" v-model="storeDomain">
            <button  @click="submitStore" class="submit-btn">Submit</button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ShopifyStoreInput',
  emits: ['hide-popup'],
  setup(_, { emit }) {
    const storeDomain = ref('');
    const popupContainer = ref(null);
    const randomString = generateRandomString();
    
    function generateRandomString(length = 16) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString;
    }

    function submitStore() {
      const storeLink = `https://${storeDomain.value}.myshopify.com/admin/oauth/authorize?client_id=${import.meta.env.VITE_API_KEY}&scope=${import.meta.env.VITE_SCOPES}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&state=${randomString}`;
      
      window.open(storeLink, '_blank');
      
      emit('hide-popup');
    }

    function closePopup(event) {
        if (event.target === popupContainer.value) {
            emit('hide-popup');
        }
    }

    return {
        storeDomain,
        popupContainer,
        submitStore,
        closePopup,
    }
  }
}
</script>

<style scoped>
    .popup-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup {
        width: 20%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        background: white;
        padding: 30px;
        border-radius: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
    }

    .popup h3 {
        margin-right: auto;
    }

    .store-input {
        width: 100%;
        height: 50px;
        border: 1px solid #ccc;
        border-radius: 7px;
        padding: 10px;
        box-sizing: border-box;
    }

    .submit-btn {
        margin-top: 20px;
        background: rgba(174, 233, 209, 1);
    }
    
    .submit-btn:hover {
        border-color: #494949;
    }
</style>
