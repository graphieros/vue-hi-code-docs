<script setup lang="ts">
import GithubStats from '@/components/GithubStats.vue';
import { useMainStore } from '@/stores/main';
import { computed, ref } from 'vue';
import { VueHiCode } from "vue-hi-code";
import { VueUiIcon } from "vue-data-ui";
// @ts-ignore
import ConfirmCopy from "@/components/ConfirmCopy.vue";
import "vue-hi-code/style.css";
// @ts-ignore
import Examples from '@/components/Examples.vue';
import { onMounted } from 'vue';
import { onBeforeUnmount } from 'vue';
// @ts-ignore
import colorBridge from "color-bridge";

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);
const { utils } = colorBridge();
const { textColorForBackground } = utils(); 

const installContent = ref(`npm i vue-hi-code`);
const setupContent = ref(`import { VueHiCode } from "vue-hi-code";
import "vue-hi-code/style.css";

`);

const setupScript = ref(`const config = ref({
  content: '', // Your code snippet
  title: 'src/main.ts',
  language: 'javascript', // or css or html
  // ...other props
});

// An emit is available to capture a copy action
function copy(copyContent) {
  console.log('Code was copied successfully!');
  // content is returned
  console.log({copyContent});
}
`);

const templateContent = ref(`<template>
  <VueHiCode v-bind="config" @copy="copy"/>
</template>

`);

const availableProps = ref([
  ['content', 'string', 'yes', '-'],
  ['language', '"javascript" | "css" | "html" | "error"', 'yes', '-'],
  ['title', 'string', 'no', '-'],
  ['withLineNumbers', 'boolean', 'no', 'false'],
  ['lineHeight', 'string', 'no', '1.4rem'],
  ['colorLineNumber', 'string', 'no', ' #8A8A8A', textColorForBackground('#E46962')],
  ['withCopy', 'boolean', 'no', 'true'],
  ['copyIconColor', 'string', 'no', '#CCCCCC', textColorForBackground('#CCCCCC')],
  ['copyIconSize', 'number', 'no', '20'],
  ['copyIconStrokeWidth', 'number', 'no', '1.5'],
  ['borderRadius', 'string', 'no', '0.3rem'],
  ['padding', 'string', 'no', '1rem'],
  ['fontFamily', 'string', 'no', "'Fira Code', monospace"],
  ['fontSize', 'string', 'no', '1rem'],
  ['titleFontSize', 'string', 'no', '1rem'],
  ['titleFontFamily', 'string', 'no', 'Verdana, sans-serif'],
  ['colorTitle', 'string', 'no', '#E1E5E8', textColorForBackground('#E1E5E8')],
  ['backgroundColor', 'string', 'no', '#2A2A2A', textColorForBackground('#2A2A2A')],
  ['baseTextColor', 'string', 'no', '#CCCCCC', textColorForBackground('#CCCCCC')],
  ['colorKeywords', 'string', 'no', '#B37BAE', textColorForBackground('#B37BAE')],
  ['colorVariableKeyword', 'string', 'no', '#559AD3', textColorForBackground('#559AD3')],
  ['colorFunction', 'string', 'no', '#DCDCAA', textColorForBackground('#DCDCAA')],
  ['colorNumber', 'string', 'no', '#AEC6A1', textColorForBackground('#AEC6A1')],
  ['colorString', 'string', 'no', '#CD9077', textColorForBackground('#CD9077')],
  ['colorParenthesis', 'string', 'no', '#8A8A8A', textColorForBackground('#8A8A8A')],
  ['colorPunctuation', 'string', 'no', '#E1E5E8', textColorForBackground('#E1E5E8')],
  ['colorBrackets', 'string', 'no', '#559AD3', textColorForBackground('#559AD3')],
  ['colorComment', 'string', 'no', '#8A8A8A', textColorForBackground('#8A8A8A')],
  ['colorHtmlTag', 'string', 'no', '#559AD3', textColorForBackground('#559AD3')],
  ['colorCssSelector', 'string', 'no', '#D7BA7D', textColorForBackground('#D7BA7D')],
  ['colorError', 'string', 'no', '#E46962', textColorForBackground('#E46962')],
]);

const config = computed(() => {
  return {
    backgroundColor: isDarkMode.value ? '#2A2A2A' : '#FAFAFA',
    baseTextColor: isDarkMode.value ? '#CCCCCC' : '#3A3A3A',
    colorTitle: isDarkMode.value ? '#CCCCCC' : '#3A3A3A',
    colorFunction: isDarkMode.value ? '#DCDCAA' : '#A0A000',
    colorPunctuation: isDarkMode.value ? '#E1E5E8' : '#3A3A3A',
    fontSize: isMobile.value ? '0.8rem' : '1rem',
    lineHeight: isMobile.value ? '1.2rem' : '1.4rem'
  }
});

const screenWidth = computed(() => store.screenWidth);
const isMobile = computed(() => screenWidth.value < 800);

</script>

<template>
  <main class="flex w-full justify-center py-18">
    <div class="w-full max-w-[1200px] flex flex-col place-items-center gap-12 px-5">
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-24 place-items-center">
        <h1 class="text-[34px] lg:text-[48px] leading-12 lg:leading-16 text-center lg:text-right" :style="{ maxWidth: '22ch'}">
          A light Vue 3 <span class="text-[#559AD3]">code highlighter</span> component to display<br> <span :style="{ color: isDarkMode ? '#CD9077' : '#CD9077' }">JS, CSS and HTML</span> snippets
        </h1>
        <div class="w-full max-w-[220px]">
          <VueHiCode
            :content="installContent"
            language="javascript"
            v-bind="config"
            copy-icon-color="#559AD3"
            @copy="store.copy()"
          />
        </div>
      </div>

      <div class="flex flex-col w-full gap-4">
        <div class="shadow-md">
          <VueHiCode
            :content="setupContent"
            language="javascript"
            title="1. Import the component in the script tag"
            v-bind="config"
            copy-icon-color="#CD9077"
            @copy="store.copy()"
          />
        </div>
  
        <div class="shadow-md">
          <VueHiCode
            :content="setupScript"
            language="javascript"
            title="2. Setup the props"
            v-bind="config"
            copy-icon-color="#CD9077"
            @copy="store.copy()"
          />
        </div>
  
        <div class="shadow-md">
          <VueHiCode
            :content="templateContent"
            language="html"
            title="3. Template usage"
            v-bind="config"
            copy-icon-color="#CD9077"
            @copy="store.copy()"
          />
        </div>
      </div>

      <div v-if="isMobile" class="flex flex-col gap-2">
        <h2>Available props</h2>
        <div v-for="p in availableProps" class="rounded shadow flex flex-col p-4" :style="{
          background: isDarkMode ? '#2A2A2A' : '#FAFAFA'
        }">
          <span class="flex flex-row gap-2"><span>Name:</span> <code :style="{ color: isDarkMode ? '#559AD3' : '#1A1A1A'}">{{ p[0] }}</code></span>
          <span class="flex flex-row gap-2"><span>Type:</span> <code>{{ p[1] }}</code></span>
          <span class="flex flex-row gap-2"><span>Required:</span> <code>{{ p[2] }}</code></span>
          <span class="flex flex-row gap-2"><span>Default:</span><div v-if="p[3].includes('#')" :style="{ background: p[3], height: '24px', color: p[4] }" class="rounded-full px-2 shadow"><code>{{ p[3] }}</code></div><code v-else>{{ p[3] }}</code></span>
        </div>
      </div>

      <table v-else class="schema table-auto border-collapse border border-slate-500 w-full" :style="{
        background: isDarkMode ? '#2A2A2A' : '#FAFAFA'
      }">
        <caption class="caption-top py-4 text-left">
            Available props
        </caption>
        <thead>
                <tr class="bg-[#FFFFFF80] dark:bg-[#FFFFFF05]" style="font-weight: bold">
                    <th class="border border-slate-600 p-2">Name</th>
                    <th class="border border-slate-600 p-2">Type</th>
                    <th class="border border-slate-600 p-2">Required</th>
                    <th class="border border-slate-600 p-2">Default</th>
                </tr>

            </thead>
            <tbody>
                <tr class="bg-[#FFFFFF60] dark:bg-[#FFFFFF10]" v-for="tr in availableProps">
                  <template v-for="(td, i) in tr">
                    <td v-if="i < 4" class="p-2 border border-slate-600 text-right" >
                      <div class="flex flex-row gap-2 justify-end">
                        <code>{{ td }}</code>
                        <div v-if="td.includes('#')" :style="{ background: td, height: '24px', width:'24px' }" class="rounded-full"/>
                      </div>
                    </td>
                  </template>
                </tr>
            </tbody>
      </table>

      <Examples />
    </div>
  </main>

  <footer class="w-full py-12 flex flex-col">
    <GithubStats />
    <div class="flex flex-row gap-2 place-items-center justify-center pt-6">
      <VueUiIcon name="copyLeft" :stroke="isDarkMode ? '#CD9077' : '#1A1A1A'"/>
      <span><span style="font-weight:bold">vue-hi-code</span> {{ new Date().getFullYear() }}</span>
    </div>
    <div class="flex flex-row justify-center gap-1">All charts are composed with <a href="https://vue-data-ui.graphieros.com/" class="underline" target="_blank" :style="{ color: isDarkMode ? '#CD9077' : '#1A1A1A' }">Vue Data UI</a></div>
  </footer>

  <ConfirmCopy />

</template>
