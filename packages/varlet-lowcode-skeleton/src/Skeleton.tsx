import type { ComputedRef, DefineComponent, Ref } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { AppBar, Icon, Space, Skeleton, Ripple } from '@varlet/ui'
import { pluginsManager, SkeletonLayouts, SkeletonPlugin } from '@varlet/lowcode-core'
import '@varlet/ui/es/app-bar/style/index.js'
import '@varlet/ui/es/icon/style/index.js'
import '@varlet/ui/es/space/style/index.js'
import '@varlet/ui/es/skeleton/style/index.js'
import '@varlet/ui/es/ripple/style/index'
import './skeleton.less'
import { useLoading } from './useLoading'

export default defineComponent({
  name: 'Skeleton',
  directives: { ripple: Ripple },
  setup() {
    const plugins = pluginsManager.exportSkeletonPlugins()
    const sidebarPinned = ref(false)
    const sidebarComponentName: Ref<string | undefined> = ref()
    const { loading } = useLoading()

    watch(
      () => loading.value,
      (newVal) => {
        if (newVal) {
          sidebarComponentName.value = undefined
        }
      }
    )

    const toggleSidebarComponent = (name: string) => {
      sidebarComponentName.value = name === sidebarComponentName.value ? undefined : name
    }

    const sidebarComponent: ComputedRef<JSX.Element | null> = computed(() => {
      if (!sidebarComponentName.value) return null

      const _plugin = plugins.find((plugin) => plugin.name === sidebarComponentName.value)
      const RenderPlugin = _plugin!.component as DefineComponent

      const RenderLabel: () => JSX.Element = () => {
        return (
          <Space justify="space-between">
            {_plugin?.label && <div>{_plugin?.label}</div>}
            <Icon
              onClick={() => {
                sidebarPinned.value = !sidebarPinned.value
              }}
              name="pin-outline"
            ></Icon>
          </Space>
        )
      }

      return (
        <div class={`skeleton__sidebar-component ${sidebarPinned.value ? 'skeleton__sidebar-component--pinned' : ''}`}>
          {RenderLabel()}
          <RenderPlugin />
        </div>
      )
    })

    const pickerComponents = (layout: SkeletonLayouts) => {
      const _plugins: SkeletonPlugin[] = plugins.filter((plugin) => plugin.layout === layout)

      let rows = 10
      let rowsWidth = ['100%']

      if (!_plugins || _plugins.length === 0) {
        throw new Error(`${layout} is not a valid layout`)
      }

      if (layout.includes('sidebar')) {
        return (
          <div class="skeleton__sidebar--container">
            {_plugins.map(({ icon: iconName, name, label }: SkeletonPlugin) => {
              return (
                <div>
                  <Skeleton v-show={Boolean(loading.value)} loading={Boolean(loading.value)} avatar rows="0" />
                  <div
                    v-ripple
                    v-show={Boolean(!loading.value)}
                    class={`skeleton__sidebar--item ${
                      name === sidebarComponentName.value ? 'skeleton__sidebar--item-selected' : ''
                    }`}
                    onClick={() => toggleSidebarComponent(name)}
                  >
                    {typeof iconName === 'string' ? (
                      <Icon name={iconName} class="skeleton__sidebar--icon" />
                    ) : (
                      <iconName />
                    )}
                    {label ? <div class="skeleton__sidebar--tooltip">{label}</div> : null}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      if (layout.includes('header')) {
        rows = 1
        rowsWidth = ['30vw']
      }

      if (layout.includes('setters')) {
        rows = 20
        rowsWidth = ['200px']
      }

      return (
        <div>
          <Skeleton v-show={Boolean(loading.value)} loading={Boolean(loading.value)} {...{ rows, rowsWidth }} />

          <Space v-show={Boolean(!loading.value)}>
            {_plugins.map((_plugin) => {
              const Component = _plugin!.component as DefineComponent
              return <Component />
            })}
          </Space>
        </div>
      )
    }

    const RenderHeader: () => JSX.Element = () => {
      const Left = pickerComponents(SkeletonLayouts.HEADER_LEFT)
      const Center = pickerComponents(SkeletonLayouts.HEADER_CENTER)
      const Right = pickerComponents(SkeletonLayouts.HEADER_RIGHT)

      return (
        <AppBar class="skeleton__header" title-position="center">
          {{
            left: () => Left,
            default: () => Center,
            right: () => Right,
          }}
        </AppBar>
      )
    }

    const RenderSideBar: () => JSX.Element = () => {
      const Top = pickerComponents(SkeletonLayouts.SIDEBAR_TOP)
      const Bottom = pickerComponents(SkeletonLayouts.SIDEBAR_BOTTOM)

      return (
        <div class="skeleton__sidebar">
          <div class="skeleton__sidebar--tools">
            {Top}
            {Bottom}
          </div>
          {sidebarComponent.value}
        </div>
      )
    }

    const RenderDesigner: () => JSX.Element = () => {
      const Designer = pickerComponents(SkeletonLayouts.DESIGNER)

      return <div class="skeleton__designer">{Designer}</div>
    }

    const RenderSetters: () => JSX.Element = () => {
      const Setters = pickerComponents(SkeletonLayouts.SETTERS)

      return <div class="skeleton__setters">{Setters}</div>
    }

    const RenderContent: () => JSX.Element = () => {
      return (
        <div class="skeleton__content">
          {RenderSideBar()}
          {RenderDesigner()}
          {RenderSetters()}
        </div>
      )
    }

    return () => {
      return (
        <div class="main">
          <div class="skeleton">
            {RenderHeader()}
            {RenderContent()}
          </div>
        </div>
      )
    }
  },
})
