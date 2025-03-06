<template>
  <div>
    <ShopifyButton @show-popup="togglePopup"  />
    <ShopifyStoreInput v-if="isPopupVisible" @hide-popup="togglePopup" />
  </div>
</template>

<script>
import { computed, onMounted  } from 'vue';
import { json2csv } from 'json-2-csv';
import ShopifyButton from './components/ShopifyButton.vue'
import ShopifyStoreInput from './components/ShopifyStoreInput.vue'

export default {
  components: {
    ShopifyButton,
    ShopifyStoreInput,
  },
  data() {
    return {
      isPopupVisible: false,
    };
  },
  methods: {
    togglePopup() {
      this.isPopupVisible = !this.isPopupVisible;
    },
  },
  setup() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const queryParams = new URLSearchParams(window.location.search);
    const code = computed(() => queryParams.get('code'));
    const storeUrl = computed(() => queryParams.get('shop'));
    const storeName = storeUrl.value?.split('.')[0];
    
    const getOrders = async () => {
      if (!storeName) return;
      
      const data = {
        storeName: storeName,
        code: code.value,
      };

      try {
        const tokenResponse = await fetch(`${API_BASE_URL}/get-shopify-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({...data}),
        });

        const tokenJson = await tokenResponse.json(); 

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


    onMounted(async () => {
      const ordersData = await getOrders();
      
      if (ordersData) {
        const csv = json2csv(ordersData);
        const uploadOrders = await uploadCSV(csv)
      }
    });
  }
};
</script>
