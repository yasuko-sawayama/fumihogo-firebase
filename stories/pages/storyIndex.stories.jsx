import StoriesIndex from '../../pages/stories'

export default {
  title: 'Pages/StoriesIndex',
  component: StoriesIndex,
}

const Template = (args) => <StoriesIndex {...args} />

export const NoStory = Template.bind({})

NoStory.args = {
  stories: [],
}
