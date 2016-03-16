module.exports = addImportAndExport

function addImportAndExport (component) {
  component.fileSnippet =
    getImport(component.dependencies) +
    component.declarationSnippet +
    getExport(component.name)

  return component
}

function getImport (dependencies) {
  if (dependencies.length === 0) {
    return ''
  }

  var dependenciesString = dependencies
    .map(function (componentName) {
      return 'import ' +
        componentName +
        ' from ' +
        "'./" + componentName + "'" +
        ';\n'
    })
    .join('')

  return dependenciesString + '\n'
}

function getExport (componentName) {
  return '\nexport default ' + componentName + ';\n'
}