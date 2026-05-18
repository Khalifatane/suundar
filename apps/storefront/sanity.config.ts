import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'

import {schemaTypes} from './sanity/schemaTypes'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'o85ja9mx'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Incha Alla Studio',
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})
