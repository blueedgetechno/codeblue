'use babel';

export default {
  codeforcesHandle: {
      title: 'Codeforces Handle',
      order: 1,
      type: 'string',
      default: 'blueedgetechno'
  },

  programmingLanguage: {
      title: 'Programming Language',
      order: 2,
      description: 'The chosen language will only be used for submitting a source file.',
      type: 'integer',
      default: 31,
      enum: [
          { value: 43, description: 'GNU GCC C11 5.1.0' },
          { value: 61, description: 'GNU G++17 9.2.0 (64 bit, msys 2)' },
          { value: 54, description: 'GNU G++17 7.3.0' },
          { value: 31, description: 'Python 3.7.2' },
          { value: 41, description: 'PyPy 3.6 (7.2.0)' },
          { value: 34, description: 'JavaScript V8 4.8.0' },
          { value: 55, description: 'Node.js 9.4.0' }
      ]
  },

  compilationCommand: {
      title: 'Compilation Command',
      order: 3,
      description: 'Remember to also adjust the executable file name in the file structure settings if necessary.',
      type: 'string',
      default: 'python'
  },

  workingDirectory: {
      title: 'Working directory',
      order: 4,
      description: 'Where your source files will be stored during contest',
      type: 'string',
      default: 'C:/Users/'
  }
}
