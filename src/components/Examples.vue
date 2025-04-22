<script setup>
import { useMainStore } from "@/stores/main";
import { ref, computed } from "vue";
import { VueHiCode } from "vue-hi-code";

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);
const isMobile = computed(() => store.screenWidth < 800);

const config = computed(() => {
    return {
        backgroundColor: isDarkMode.value ? '#2A2A2A' : '#FAFAFA',
        baseTextColor: isDarkMode.value ? '#CCCCCC' : '#3A3A3A',
        colorTitle: isDarkMode.value ? '#CCCCCC' : '#3A3A3A',
        colorFunction: isDarkMode.value ? '#DCDCAA' : '#A0A000',
        colorPunctuation: isDarkMode.value ? '#E1E5E8' : '#3A3A3A',
        withCopy: false,
        fontSize: isMobile.value ? '0.8rem' : '1rem',
        lineHeight: isMobile.value ? '1.2rem' : '1.4rem'
    }
})

const example_js = `function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    let pivot = arr[0];
    let left = [];
    let right = [];

    for (let i = 1; i < arr.length; i += 1) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
};
`;
const example_css = `
body { 
  font-family: 'Helvetica';
  text-align: center; 
}

.main-box{ 
  display: flex;
  flex-wrap: wrap;
}
.one, .two, .three, .four { 
  flex-basis: 40%;
}
kbd {
  text-align: left; 
  display:inline-block;
  line-height:1.5;
}

div { 
  border: 1px lightgrey dotted;
  margin: 30px;
}

h1, h2 { 
  color: purple;
}

li + li { 
  color: pink;
}

h3 ~ p { 
  font-size: 40px;
}

section div { 
  color: blue;
}
`;
const example_html = `<html>
    <head>
        <title>My First HTML Page</title>
    </head>
    <body>
        <!-- This is a comment -->
        <h1>My First HTML Page</h1>
        <p> Hello World!</p>
    </body>
</html>
`;
const example_error = `TypeError: Cannot read properties of undefined (reading 'map')
    at Rc.fn (Versions-8mkIA2e5.js:1:10925)
    at ys (index-8FEo4Yvg.js:10:3233)
    at get value (index-8FEo4Yvg.js:10:14545)
    at Rc.fn (Versions-8mkIA2e5.js:1:11281)
    at ys (index-8FEo4Yvg.js:10:3233)
    at get value (index-8FEo4Yvg.js:10:14545)
    at Proxy.<anonymous> (Versions-8mkIA2e5.js:1:14793)
    at Pr (index-8FEo4Yvg.js:14:36606)
    at gs.G [as fn] (index-8FEo4Yvg.js:14:28877)
    at gs.run (index-8FEo4Yvg.js:10:1808)`;

const example_ts = `type MyType = {
      attr1: 'str',
      attr2: 99
}

const arr: Array<Omit<MyType, 'attr1'>> = [{ attr2: 120 }];
`

const examples = ref([
    { content: example_js, language: 'javascript', title: 'JS - with language="javascript"' },
    { content: example_ts, language: 'typescript', title: 'TS - with language="typescript"' },
    { content: example_css, language: 'css', title: 'CSS - with language="css"' },
    { content: example_html, language: 'html', title: 'HTML - with language="html"' },
    { content: example_error, language: 'error', title: 'ERROR - with language="error"' },
])

</script>

<template>
    <div class="w-full">
        <h2>Examples</h2>
        <VueHiCode
            v-for="example in examples"
            v-bind="{ ...example, ...config }"
            style="margin: 1rem 0"
        />
    </div>
</template>