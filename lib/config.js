'use babel';

export default {
  codeforcesHandle: {
    title: 'Codeforces Handle (required)',
    order: 1,
    type: 'string',
    default: 'blue_edge'
  },

  codeforcesPassword: {
    title: 'Account password (optional)',
    order: 2,
    description: 'If you wish to login from the plugin itself',
    type: 'string',
    default: 'thisIsAstringPassword'
  },

  programmingLanguage: {
    title: 'Programming Language',
    order: 3,
    description: 'The chosen language will only be used for submitting a source file.',
    type: 'integer',
    default: 31,
    enum: [{
        value: 43,
        description: 'GNU GCC C11 5.1.0'
      },
      {
        value: 54,
        description: 'GNU G++17 7.3.0'
      },
      {
        value: 31,
        description: 'Python 3.7.2'
      },
      {
        value: 41,
        description: 'PyPy 3.6 (7.2.0)'
      }
    ]
  },

  refreshinterval: {
    title: 'Autorefresh interval',
    order: 4,
    description: 'Refresh interval of standings and submission',
    type: 'integer',
    default: 5
  },

  workingDirectory: {
    title: 'Working directory',
    order: 5,
    description: 'Where your source files will be stored during contest',
    type: 'string',
    default: '/'
  },

  beautifyboolean: {
    title: 'Beautify log error',
    order: 6,
    description: 'Enable to display nice and concise log error',
    type: 'boolean',
    default: true
  },

  friends: {
    title: 'Codeforces friends for live standings',
    order: 7,
    description: 'Add their codeforces id',
    type: 'array',
    default: ['blue_edge','eugalt','manish.17','anishde85','kim123','sujal123'],
    items:{
      type: "string"
    }
  }
}
