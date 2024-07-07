import type {
  Meta,
  StoryObj,
} from '@storybook/vue3'
import { h } from 'vue'
import Button from './Button.vue'

const meta: Meta<
  typeof Button
> = {
  component: Button,
}

export default meta
type Story = StoryObj<
  typeof Button
>

export const Default: Story =
  {
    render: args => ({
      components: { Button },
      setup() {
        return () =>
          h(Button, {
            ...args,
          })
      },
    }),
    args: {},
  }

export const HelloWorld: Story =
  {
    name: 'hello world',
    args: {
      title: 'hello world',
    },
  }
