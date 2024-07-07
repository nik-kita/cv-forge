import MockContent from '@/storybook/MockContent.fixture.vue'
import type {
  Meta,
  StoryObj,
} from '@storybook/vue3'
import { h } from 'vue'
import AppLayout from './AppLayout.vue'

const meta: Meta<
  typeof AppLayout
> = {
  component: AppLayout,
}

export default meta
type Story = StoryObj<
  typeof AppLayout
>

export const Default: Story =
  {
    render: args => ({
      components: {
        AppLayout,
      },
      setup() {
        return () =>
          h(
            AppLayout,
            {
              ...args,
            },
            h(
              MockContent,
              {},
            ),
          )
      },
    }),
  }
