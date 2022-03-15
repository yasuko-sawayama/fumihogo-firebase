import { ComponentMeta, ComponentStory } from '@storybook/react'
import StoriesIndex from '../../pages/stories'

export default {
  title: 'Pages/StoriesIndex',
  component: StoriesIndex,
} as ComponentMeta<typeof StoriesIndex>

const Template: ComponentStory<typeof StoriesIndex> = (args) => (
  <StoriesIndex {...args} />
)

export const NoStory = Template.bind({})

NoStory.args = {
  stories: [],
}
