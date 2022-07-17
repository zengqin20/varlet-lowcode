import App from './App.vue'
import { usePlugins } from './plugins'
import { createApp } from 'vue'
import { schemaManager, assetsManager, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import '@varlet/touch-emulator'

usePlugins()

const countdownId = schemaManager.generateId()
const childRenderId = schemaManager.generateId()
const childRender = schemaManager.createRenderBinding(
  [
    {
      id: schemaManager.generateId(),
      name: 'Card',
      library: 'Varlet',
      slots: {
        title: {
          children: [
            {
              id: schemaManager.generateId(),
              name: BuiltInSchemaNodeNames.TEXT,
              textContent: schemaManager.createExpressionBinding(`$renderArgs['${childRenderId}'][0].title`),
            },
          ],
        },
        subtitle: {
          children: [
            {
              id: countdownId,
              name: 'Countdown',
              library: 'Varlet',
              props: {
                time: 30000,
              },
              slots: {
                default: {
                  children: [
                    {
                      id: schemaManager.generateId(),
                      name: 'Button',
                      library: 'Varlet',
                      props: {
                        type: 'success',
                      },
                      slots: {
                        default: {
                          children: [
                            {
                              id: schemaManager.generateId(),
                              name: BuiltInSchemaNodeNames.TEXT,
                              textContent: schemaManager.createExpressionBinding(
                                `$slotProps['${countdownId}'].seconds`
                              ),
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  ],
  childRenderId
)

const parentRenderId = schemaManager.generateId()
const parentRender = schemaManager.createRenderBinding(
  [
    {
      id: schemaManager.generateId(),
      name: 'NButton',
      library: 'naive',
      props: {
        style: {
          marginBottom: '10px',
        },
        type: 'primary',
        onClick: schemaManager.createExpressionBinding('() => { count.value++; }'),
      },
      slots: {
        default: {
          children: [
            {
              id: schemaManager.generateId(),
              name: BuiltInSchemaNodeNames.TEXT,
              textContent: schemaManager.createExpressionBinding(`$renderArgs['${parentRenderId}'][0].title`),
            },
          ],
        },
      },
    },
    {
      id: schemaManager.generateId(),
      name: 'NDataTable',
      library: 'naive',
      props: {
        columns: [
          {
            title: 'No',
            key: 'no',
          },
          {
            title: 'Title',
            key: 'title',
          },
          {
            title: 'Action',
            key: 'actions',
            render: childRender,
          },
        ],
        data: [
          { no: 100, title: '套一下' },
          { no: 200, title: '套两下' },
          { no: 300, title: '套三下' },
        ],
      },
    },
  ],
  parentRenderId
)

schemaManager.importSchema({
  id: schemaManager.generateId(),
  name: BuiltInSchemaNodeNames.PAGE,
  code: `\
function setup() {
  const count = ref(1)
  const doubleCount = computed(() => count.value * 2)

  return {
    count,
    doubleCount,
  }
}
`,
  css: 'body {\n  padding: 20px\n}',
  slots: {
    default: {
      children: [
        {
          id: schemaManager.generateId(),
          name: 'NDataTable',
          library: 'naive',
          props: {
            columns: [
              {
                title: 'No',
                key: 'no',
              },
              {
                title: 'Title',
                key: 'title',
              },
              {
                title: 'Action',
                key: 'actions',
                render: parentRender,
              },
            ],
            data: [
              { no: 3, title: '搞一下' },
              { no: 4, title: '搞两下' },
              { no: 12, title: '搞三下' },
            ],
          },
        },
      ],
    },
  },
})

assetsManager.importAssets([
  {
    profileLibrary: 'VarletLowcodeProfile',
    profileResource: './varlet-lowcode-profile.umd.js',
    additionResources: [
      'https://cdn.jsdelivr.net/npm/@varlet/ui/umd/varlet.js',
      'https://cdn.jsdelivr.net/npm/@varlet/touch-emulator/iife.js',
    ],
  },
  {
    additionResources: ['https://cdn.bootcdn.net/ajax/libs/normalize/8.0.1/normalize.css'],
  },
  {
    profileLibrary: 'VueUseLowcodeProfile',
    profileResource: './vue-use-lowcode-profile.js',
    additionResources: ['https://unpkg.com/@vueuse/shared', 'https://unpkg.com/@vueuse/core'],
  },
  {
    profileLibrary: 'NaiveLowcodeProfile',
    profileResource: './naive-lowcode-profile.js',
    additionResources: ['https://unpkg.com/naive-ui'],
  },
])

const app = createApp(App)

app.mount('#app')
