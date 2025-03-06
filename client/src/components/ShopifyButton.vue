<template>
  <button type="button" @click="$emit('show-popup')" class="shopify-btn">Shopify Access</button>
</template>

<script>
export default {
  name: 'ShopifyButton',
  emits: ['show-popup'],
}
</script>


<style scoped>
.shopify-btn {
  background: rgba(0, 128, 96, 1);
  color: #fff;
}
.shopify-btn:hover {
  border-color: #494949;
}
</style>
