<template>
  <SearchComponent />
  <div class="w-full h-screen flex flex-col items-center">
    <div v-if="loading" class="flex h-[70vh] w-full items-center justify-center text-xl font-semibold">
      Loading...
    </div>
    <div v-else-if="!loading && searchResults.length"
      class="bg-white backdrop-blur-md w-10/12 flex flex-col items-center rounded-2xl">
      <table class="w-full">
        <thead class="w-full">
          <tr>
            <th>
              <div class="border-b py-3 text-left px-4 w-full flex">
                Avatar Url
                <button class="ml-auto" @click="initiateSort('avatar_url')">
                  <SortIcon />
                </button>
              </div>
            </th>
            <th>
              <div class="border-b py-3 text-left px-4 w-full flex">
                Login
                <button class="ml-auto" @click="initiateSort('login')">
                  <SortIcon />
                </button>
              </div>
            </th>
            <th>
              <div class="border-b py-3 text-left px-4 w-full flex">
                Type
                <button class="ml-auto" @click="initiateSort('type')">
                  <SortIcon />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in searchResults" :key="index" class="hover:bg-[#f5f5f5] hover:cursor-pointer"
            @click="rowClick(index)">
            <td>
              <div class="border-b py-4 text-left px-4">{{ data.avatar_url }}</div>
            </td>
            <td>
              <div class="border-b py-4 text-left px-4">{{ data.login }}</div>
            </td>
            <td>
              <div class="border-b py-4 text-left px-4">{{ data.type }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <PaginationComponent :perPage="9" :totalItems="totalItems" />
    </div>
    <div v-else class="flex h-[50vh] w-full items-center justify-center text-xl">No results yet.</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser } from '@/services/SearchRequests'
import SearchComponent from '@/components/SearchComponent.vue'
import SortIcon from '@/assets/SortIcon.vue';
import { sortTable } from '@/components/composables/sorting';
import PaginationComponent from '@/components/PaginationComponent.vue';

interface SearchResults {
  avatar_url: string
  login: string
  type: string
}

const $route = useRoute()
const $router = useRouter()
const loading = ref(false)
const sortInAscOrder = ref(false)
const searchInput = computed(() => `${$route.query.search || ''}`)
const page = computed(() => Number($route.query.page) || 1)
const searchResults = ref<SearchResults[]>([])
const totalItems = ref(0)

const rowClick = (index: number) => {
  console.log('selected item', searchResults.value[index])
  console.log('All items', searchResults.value)
  $router.push({
    name: 'details',
    query: $route.query
  })
}
const initiateSort = (criteria: string) => {
  sortTable(searchResults.value, criteria, sortInAscOrder.value)
  sortInAscOrder.value = !sortInAscOrder.value
}
watch(
  () => $route.query,
  async (q) => {
    await $router.isReady()
    if (!q) return
    loading.value = true
    getUser(searchInput.value, page.value)
      .then((res) => {
        if (res) {
          totalItems.value = res.total_count
          console.log(res)
          searchResults.value = res.items
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        loading.value = false
      })
  },
  { immediate: true }
)
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
