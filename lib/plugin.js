const { createAttributeExpression, createChildrenExpression, createHExpression, createImportTrDeclaration } = require('./create.js');

const config = {
  autoInjection: true,
  from: '@hangteam/tr'
}

module.exports = function({ types }) {
  return {
    pre(state) {
      const options = state.opts.plugins[1].options;
      typeof options.autoInjection === 'boolean' && (config.autoInjection = options.autoInjection);
      typeof options.from === 'string' && (config.from = options.from);
    },
    visitor: {
      JSXElement: {
        exit(path) { // attributes 和 children 为 undefined || {} || []
          const { node: { openingElement: { name, attributes }, children } } = path;
          const attributeExpression = attributes.length ? createAttributeExpression(types, attributes) : types.identifier('undefined');
          const childrenExpression = children.length ? createChildrenExpression(types, children) : types.identifier('undefined');
          path.replaceWith(createHExpression(types, name.name, attributeExpression, childrenExpression));
        }
      }, 
      Program: {
        enter(path) {
          if (config.autoInjection && !path.scope.hasOwnBinding('Tr')) {
            path.node.body.unshift(createImportTrDeclaration(types, config.from));
          }
        }
      }
    }
  };
};

