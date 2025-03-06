<template>
  <div>
    <ShopifyButton @show-popup="togglePopup"  />
    <ShopifyStoreInput v-if="isPopupVisible" @hide-popup="togglePopup" @submit-store="submitStore" />
  </div>
</template>

<script>
import { ref, computed, onMounted  } from 'vue';
import { json2csv } from 'json-2-csv';
import ShopifyButton from './components/ShopifyButton.vue'
import ShopifyStoreInput from './components/ShopifyStoreInput.vue'

export default {
  components: {
    ShopifyButton,
    ShopifyStoreInput,
  },
  setup() {
    const isPopupVisible = ref(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const queryParams = new URLSearchParams(window.location.search);
    const code = computed(() => queryParams.get('code'));
    const storeUrl = computed(() => queryParams.get('shop'));
    const storeName = storeUrl.value?.split('.')[0];
    
    const getOrders = async (storeName, code) => {
      // if (!storeName) return;
      
      

      try {
        const ordersResponse = await fetch(`${API_BASE_URL}/get-orders?storeName=${storeName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const ordersJson = await ordersResponse.json(); 
        const ordersData = ordersJson.orders.map((order) => {
          return {
            user_id: order.user_id,
            value: order.subtotal_price,
            timestamp: order.updated_at,
            is_activation: order.confirmed,
          }
        });
        
        return ordersData;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const uploadCSV = async (csv) => {
      try {
        const response = await fetch(`${API_BASE_URL}/upload-csv`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ csv }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('CSV uploaded successfully:', result.message);
        } else {
          console.error('Error uploading CSV:', result.error);
        }

        return result;
      } catch (error) {
        console.error('Error:', error);
      }
    }

    function togglePopup() {
      isPopupVisible.value = !isPopupVisible.value;
    }

    function generateRandomString(length = 16) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString;
    }

    const submitStore = async (storeName) => {
      try {
        const checkTokenResponse = await fetch(`${API_BASE_URL}/check-shopify-token?storeName=${storeName}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const checkToken = await checkTokenResponse.json(); 
        const isToken = checkToken.message == 'true';

        if (isToken) {
          const ordersData = await getOrders(storeName);
      
          if (ordersData) {
            const csv = json2csv(ordersData);
            const uploadOrders = await uploadCSV(csv)
          }

          togglePopup();
        } else {
          const randomString = generateRandomString();
  
          const storeLink = `https://${storeName}.myshopify.com/admin/oauth/authorize?client_id=${import.meta.env.VITE_API_KEY}&scope=${import.meta.env.VITE_SCOPES}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&state=${randomString}`;
          
          window.location.href = storeLink;
        } 
      } catch (error) {
        console.error('Error:', error);
      }
      
    }

    onMounted(async () => {
      if (code.value && storeName) {
        const data = {
          storeName: storeName,
          code: code.value,
        };
        const tokenResponse = await fetch(`${API_BASE_URL}/get-shopify-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...data}),
        });
  
        const tokenJson = await tokenResponse.json(); 
        const ordersData = await getOrders(storeName);
        
        if (ordersData) {
          const csv = json2csv(ordersData);
          const uploadOrders = await uploadCSV(csv)
        }
      }
    });

    return {
      isPopupVisible,
      togglePopup,
      submitStore
    }
  }
};
</script>
