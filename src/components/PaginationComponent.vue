<template>
    <div v-if="getPaginationNumberList.length" class="flex my-9">
        <button class="rotate-90" @click="prev">
            <ArrowDown />
        </button>
        <div class="" v-for="(item, index) in getPaginationNumberList" :key="index">
            <button :class="{ 'border-orange-800': currentPage === item }"
                class="border border-gray-400 shadow py-1 px-3 mx-2 rounded-md" @click="fetchPage(item)">
                {{ item }}
            </button>
        </div>
        <div v-if="noOfPages > 5" class="flex">
            <div v-if="!getPaginationNumberList.includes(noOfPages - 1)">...</div>
            <button :class="{ 'border-orange-800': currentPage === noOfPages }"
                class="border border-gray-400 shadow py-1 px-3 mx-2 rounded-md" @click="fetchPage(noOfPages)">
                {{ noOfPages }}
            </button>
        </div>
        <button class="-rotate-90" @click="next">
            <ArrowDown />
        </button>
    </div>
</template>

<script setup lang="ts">
import ArrowDown from '@/assets/ArrowDown.vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
    totalItems: number
    perPage: number
}>()

const $route = useRoute()
const $router = useRouter()

const currentPage = ref(Number($route.query.page) || 1)
const pointer = ref(currentPage.value)

const noOfPages = computed(() => {
    if (props.totalItems < props.perPage) {
        return 1
    }
    return Math.round(props.totalItems / props.perPage)
})

const getPaginationNumberList = computed(() => {
    let pages = []
    const possibleToPageNumber = Math.min(pointer.value + 5, noOfPages.value)

    const startPageNumber =
        Math.max(noOfPages.value == possibleToPageNumber ? noOfPages.value - 5 : pointer.value, 1)

    for (let index = startPageNumber; index < possibleToPageNumber; index++) {
        pages.push(index)
    }
    return pages
})

const prev = () => {
    if (pointer.value - 5 < 1) {
        pointer.value = 1
    } else {
        pointer.value -= 5
    }
}

const next = () => {
    if (pointer.value + 5 > noOfPages.value) {
        pointer.value = noOfPages.value
    } else {
        pointer.value += 5
    }
}

const fetchPage = (page: number) => {
    currentPage.value = page
    $router.push({
        path: '/',
        query: { ...$route.query, page: currentPage.value }
    })
}
</script>

<style scoped></style>
