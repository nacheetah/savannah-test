<template>
  <div class="bg-white backdrop-blur-md w-10/12 rounded-2xl p-7">
    <button class="p-3 rounded-md border w-fit" @click="goBack">
      <BackIcon />
    </button>
    <div class="bg-white shadow p-7 mt-14">
      <div class="flex mb-8 cursor-pointer" @click="toggleRepos">
        <h4 class="text-xl font-medium">Public Repos</h4>
        <div :class="{ 'rotate-180': showRepos }" class="ml-auto">
          <ArrowDown />
        </div>
      </div>
      <ul class="max-h-[500px] overflow-auto" v-if="showRepos">
        <div v-if="loading">Loading...</div>
        <div v-else-if="!loading && publicRepos.length">
          <div v-for="(repo, index) in publicRepos" :key="index">
            <a target="_blank" class="block border-b py-2 px-3 hover:text-blue-700" :href="repo.html_url">{{ index + 1
              }}. {{ repo.name }}</a>
          </div>
        </div>
        <div v-else>No Public Repos Found!</div>
      </ul>
    </div>

    <div class="bg-white shadow p-7 mt-14">
      <div class="flex mb-8 cursor-pointer" @click="toggleCommits">
        <h4 class="text-xl font-medium">Latest Commits</h4>
        <div :class="{ 'rotate-180': showCommits }" class="ml-auto">
          <ArrowDown />
        </div>
      </div>
      {{ recentCommitsList?.[0]?.commit?.message }}
      <ul class="max-h-[500px] overflow-auto" v-if="showCommits">
        <div v-if="loading">Loading...</div>
        <div v-else-if="!loading && recentCommitsList.length">
          <div v-for="(commit, index) in recentCommitsList" :key="index">
            <a target="_blank" class="block border-b py-2 px-3 hover:text-blue-700" :href="commit?.commit?.url">{{ index + 1
              }}. {{ commit?.commit?.message }}</a>
          </div>
        </div>
        <div v-else>No Commits Found!</div>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowDown from '@/assets/ArrowDown.vue'
import BackIcon from '@/assets/BackIcon.vue'
import { getCommitHistories, getPublicRepos, getUser } from '@/services/SearchRequests'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $route = useRoute()
const $router = useRouter()
const showCommits = ref(true)
const showRepos = ref(true)

const publicRepos = ref<Record<string, any>>([])
const recentCommitsList = ref<Record<string, any>[]>([])
const loading = ref(false)
const toggleCommits = () => {
  showCommits.value = !showCommits.value
}
const toggleRepos = () => {
  showRepos.value = !showRepos.value
}

const goBack = () => {
  $router.push({
    name: 'home',
    query: $route.query
  })
}
const fetchPublicRepos = async () => {
  loading.value = true
  try {
    const userDetails = await getUser(`${$route.query.search || ''}`)
    if (userDetails) {
      const reposUrl = userDetails.items[0].repos_url
      const publicReposResponse = await getPublicRepos(reposUrl)
      const allCommits = (publicReposResponse || []).map((commit: any) => {
        let url = commit.commits_url.replace('{/sha}', `?sha=${commit.default_branch}`)
        return getCommitHistories(url)
      })
      const allCommitsPromiseResolved = await Promise.all(allCommits)
      recentCommitsList.value = allCommitsPromiseResolved.flat()
      publicRepos.value = publicReposResponse
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchPublicRepos()
})
</script>

<style lang="scss" scoped></style>
