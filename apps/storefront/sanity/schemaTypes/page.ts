export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 10,
    },
    {
      name: 'blocks',
      title: 'Blocks',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
