'use babel';

export default {
  codeforcesHandle: {
    title: 'Codeforces Handle',
    order: 1,
    type: 'string',
    default: 'blue_edge'
  },

  programmingLanguage: {
    title: 'Programming Language',
    order: 2,
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
    order: 3,
    description: 'Refresh interval of standings and submission',
    type: 'integer',
    default: 5
  },

  workingDirectory: {
    title: 'Working directory',
    order: 4,
    description: 'Where your source files will be stored during contest',
    type: 'string',
    default: '/'
  },

  beautifyboolean: {
    title: 'Beautify log error',
    order: 5,
    description: 'Enable to display nice and concise log error',
    type: 'boolean',
    default: true
  }
}
