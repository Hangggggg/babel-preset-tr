const { createAttributeExpression, createChildrenExpression, createHExpression, createImportTrDeclaration } = require('./AST_OP/create.js');

const config = {
  autoInjection: true
}

module.exports = function({ types }) {
  return {
    pre(state) {
      typeof state?.autoInjection === 'boolean' && (config.autoInjection = state.autoInjection);
    },
    visitor: {
      JSXElement: {
        exit(path) { // attributes 和 children 一定为一个数组
          const { node: { openingElement: { name, attributes }, children } } = path;
          const attributeExpression = attributes.length ? createAttributeExpression(types, attributes) : types.nullLiteral();
          const childrenExpression = children.length ? createChildrenExpression(types, children) : types.nullLiteral();
          path.replaceWith(createHExpression(types, name.name, attributeExpression, childrenExpression));
        }
      }, 
      Program: {
        enter(path) {
          if (config.autoInjection && !path.scope.hasOwnBinding('Tr')) {
            path.node.body.unshift(createImportTrDeclaration(types));
          }
        }
      }
    }
  };
};

