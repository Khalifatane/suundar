import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'o85ja9mx'
const dataset = process.env.VITE_SANITY_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
