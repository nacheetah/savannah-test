<template>
    <div class="w-10/12 flex pb-5">
        <input type="text" class="border outline-none py-2 px-3 rounded-lg" v-model="searchInput" />
        <button :class="{'cursor-no-drop': inputIsDiabled}" class="ml-2 border-gray-300 border py-2 px-3 bg-[#f5f2f2] rounded-lg" :disabled="inputIsDiabled" @click="checkout">Submit</button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router';

const $router = useRouter()
const searchInput = ref('')
const inputIsDiabled = computed(() => searchInput.value ? false : true)
const checkout = () => {
    $router.push(
        {
            path: '/',
            query: { search: searchInput.value, page: 1 }
        });
    console.log('clicked')
   
}
</script>

<style lang="scss" scoped></style>