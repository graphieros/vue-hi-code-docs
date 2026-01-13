<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMainStore } from './stores/main';
import { computed, onMounted } from 'vue';
import { VueUiIcon } from 'vue-data-ui';
import pack from "../package.json"
import { BrandGithubFilledIcon, MoonIcon, StarFilledIcon, SunIcon } from 'vue-tabler-icons';
import { onBeforeUnmount } from 'vue';

const store = useMainStore();

const isDarkMode = computed(() => store.isDarkMode);

onMounted(() => {
  if(!localStorage.theme) {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add("dark");
    store.isDarkMode = true;
  } else {
    document.documentElement.classList.add(localStorage.theme);
  }
})

function changeTheme() {
    if (localStorage.theme === "dark") {
        localStorage.theme = "light";
        document.documentElement.classList.remove("dark");
        store.isDarkMode = false;
    } else {
        localStorage.theme = "dark";
        document.documentElement.classList.add("dark");
        store.isDarkMode = true;
    }
}

function resize() {
  store.screenWidth = window.innerWidth;
}

onMounted(() => {
  store.screenWidth = window.innerWidth;
  window.addEventListener('resize', resize)
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
})

</script>

<template>
  <header class="sticky top-0 left-0 py-2 card w-full flex justify-center shadow px-5 z-100">
    <div class="w-full max-w-300 flex flew-row place-items-center justify-between">
      <div class="text-2xl flex flex-row place-items-center gap-2">
        <VueUiIcon name="binary" :size="24" :stroke="isDarkMode ? '#FFFFFF' : '#9A9A9A'"/>
        <span style="font-weight: bold" :style="{ color: isDarkMode ? '#559AD3' : '#3A3A3A' }">
          vue-hi-code
        </span>
        <code class="text-xs text-[#CD9077]">v{{ pack.dependencies["vue-hi-code"].replace('^', '') }}</code>
      </div>
      <div class="flex flex-row gap-6 place-items-center pr-6">
        <button @click="changeTheme" class="cursor-pointer">
          <SunIcon v-if="isDarkMode"/>
          <MoonIcon v-else/>
        </button>
        <button class="cursor-pointer relative">
          <a href="https://github.com/graphieros/vue-hi-code" target="_blank">
            <BrandGithubFilledIcon :style="{ color: isDarkMode ? '#CCCCCC' : '#1A1A1A'}"/>
            <div class="absolute -top-3 left-full flex flex-row text-right place-items-center tabular-nums gap-0.5">
              <StarFilledIcon :size="12" class="text-orange-300"/>
              <span>
                {{ store.stars || '' }}
              </span>
            </div>
          </a>
        </button>
      </div>
    </div>
  </header>
  <RouterView />
</template>