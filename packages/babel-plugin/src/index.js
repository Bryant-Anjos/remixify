const { declare } = require('@babel/helper-plugin-utils')
const { types: t } = require('@babel/core')

module.exports = declare((api, options) => {
  api.assertVersion(7)

  return {
    visitor: {
      Program(path, state) {
        const { filename } = state

        if (/\.remix\.(js|jsx|tsx)$/.test(filename)) {
          const namedExports = path.get('body').filter(path => {
            return path.isExportNamedDeclaration()
          })
          const defaultExport = path.get('body').find(path => {
            return path.isExportDefaultDeclaration()
          })

          const getObjectMethodFromDefaultExport = () => {
            if (t.isExportDefaultDeclaration(defaultExport)) {
              const { declaration } = defaultExport.node
              if (t.isFunctionDeclaration(declaration)) {
                return t.objectMethod(
                  'method',
                  t.identifier('default'),
                  declaration.params,
                  declaration.body,
                )
              }
            }
            return null
          }

          const getObjectMethodFromNamedExports = () => {
            return namedExports.map(namedExport => {
              const { declaration } = namedExport.node
              if (t.isFunctionDeclaration(declaration)) {
                return t.objectMethod(
                  'method',
                  t.identifier(declaration.id.name),
                  declaration.params,
                  declaration.body,
                  false,
                  declaration.generator,
                  declaration.async,
                )
              }
              return null
            })
          }

          const module = t.objectExpression(
            [
              getObjectMethodFromDefaultExport(),
              ...getObjectMethodFromNamedExports(),
            ].filter(Boolean),
          )

          if (defaultExport) {
            defaultExport.replaceWith(defaultExport.node.declaration)

            const remixifyImport = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('remixify'))],
              t.stringLiteral('@remixify/native'),
            )

            const remixifyDefaultExport = t.exportDefaultDeclaration(
              t.callExpression(t.identifier('remixify'), [module]),
            )

            const lastImportIndex = path.get('body').findIndex(path => {
              return path.isImportDeclaration()
            })

            if (lastImportIndex !== -1) {
              path.get(`body.${lastImportIndex}`).insertAfter(remixifyImport)
            } else {
              path.unshiftContainer('body', remixifyImport)
            }

            path.pushContainer('body', remixifyDefaultExport)
          }
        }
      },
    },
  }
})
