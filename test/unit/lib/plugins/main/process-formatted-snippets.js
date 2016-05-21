/* eslint-env mocha */
const fs = require('fs')
const path = require('path')
const assert = require('chai').assert
const shell = require('shelljs')
const processFormattedSnippets = require('../../../../../lib/plugins/main/process-formatted-snippets.js')

describe('lib/plugins/main/process-formatted-snippets', function () {
  beforeEach(function () {
    shell.exec('rm -rf ./reacterminator')
  })

  it('should generate a file', function () {
    const formattedFileSnippet = `\
import ComponentB from './components/ComponentB.jsx';

class ComponentA extends React.Component {
  render() {
    return <ComponentB></ComponentB>
  }
}

export default ComponentA;`

    const components = {
      ComponentA: {
        componentName: 'ComponentA',
        formattedFileSnippet,
        removedComments: [],
        removedScriptTags: []
      }
    }

    processFormattedSnippets({
      components,
      options: {
        generateFiles: true,
        outputPath: path.resolve('./reacterminator')
      }
    })

    assert.deepEqual(
      fs.readFileSync(process.cwd() + '/reacterminator/readonly-components/ComponentA.jsx', 'utf-8'),
      formattedFileSnippet
    )
  })

  it('should report removed codes', function () {
    const formattedFileSnippet = `\
class ComponentA extends React.Component {
  render() {
    return <div></div>
  }
}`

    processFormattedSnippets({
      components: {
        ComponentA: {
          componentName: 'ComponentA',
          formattedFileSnippet: formattedFileSnippet,
          removedComments: ['<!-- -->'],
          removedScriptTags: ['<script></script>'],
          removedStyleTags: ['<style></style>']
        }
      },
      options: {
        generateFiles: true,
        outputPath: path.resolve('./reacterminator')
      }
    })

    assert.deepEqual(
      fs.readFileSync(process.cwd() + '/reacterminator/readonly-components/ComponentA.jsx', 'utf-8'),
      formattedFileSnippet
    )
  })
})
