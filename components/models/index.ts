import { createCollection } from '../../firebase/clientApp'
import { Story } from '../../types'

export const storiesCol = createCollection<Story>('stories')
