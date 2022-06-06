/*
* createAttributeExpression
* 创建一个对象表达式，保存 attributes ，支持 JSXAttribute 和 JSXSpreadAttribute
*   JSXAttribute：key 只支持 JSXIdentifier ，value 支持 JSXExpressionContainer 、string 、null
*     JSXExpressionContainer：<a name={name} ></a>
*     string：<a name="Hang" ></a>
*     null：<a name ></a>  name value 为 true
*   JSXSpreadAttribute：
*     <a {...{name: 'Hang'}} ></a>
*/
function createAttributeExpression(types, attributes) {
  const properties = [];
  for (let item of attributes) {
    if (item.type === 'JSXAttribute') {
      let { name, value } = item;
      properties.push(types.objectProperty(
        types.identifier(name.name), 
        value?.type === 'JSXExpressionContainer' ? value.expression
          : value?.type === 'StringLiteral' ? types.stringLiteral(value.value) : types.booleanLiteral(true) // 如果为 null ，设置 true
      ))
    } else {  // JSXSpreadAttribute
      properties.push(...item.argument.properties);
    } 
  }
  return properties.length ? types.objectExpression(properties) : null;
}

/* 
* createChildrenExpression
* 创建一个表达式或数组表达式，保存 children ，支持 JSXExpressionContainer、JSXText
*   JSXExpressionContainer：<a>{content}</a>
*   JSXText：<a>click</a>
*/
function createChildrenExpression(types, children) {
  const arr = [];
  children.forEach(item => {
    const child = createChildExpression(types, item);
    child && arr.push(child); 
  });
  return arr.length ? arr.length === 1 ? arr[0] : types.arrayExpression(arr) : null;
}

/*
* createChildExpression
* 辅助 createChildrenExpression
*/
function createChildExpression(types, item) {
  if (item?.type === 'JSXText') {
    const str = item.value.trim(); 
    return str && types.stringLiteral(str); // 如果 str 为 '' ，则不会作为 child
  } else if (item?.type === 'JSXExpressionContainer') {
    return item.expression;
  } else {
    return item; // item 一定是 h 函数
  }
}

/*
* createHExpression
* 创建 Tr.createElement 函数
* 当 type 为 JSXIdentifier ，如果 tagName 为大写字母开头，当做组件；相反，当做原生标签
*   <A></A> -> Tr.createElement(A)
*   <a></a> -> Tr.createElement('a')
* 当 type 为 JSXMemberExpression ，当做组件
*   <a.c /> -> Tr.createElement(a.c)
*/
function createHExpression(types, name, attributeExpression, childrenExpression) {
  const args = [];
  if (name.type === 'JSXIdentifier') {
    args.push(/^[A-Z]/.test(name.name) ? types.identifier(name.name) : types.stringLiteral(name.name));
  } else if (name.type === 'JSXMemberExpression') {
    const memberExpressionStr = require('./tool.js').getMemberExpressionStr(name);
    args.push(types.identifier(memberExpressionStr));
  } else {
    throw Error('Incorrect syntax from babel-preset-tr');
  }
  attributeExpression && args.push(attributeExpression);
  childrenExpression && args.push(childrenExpression);
  return types.callExpression(types.identifier('Tr.createElement'), args);
}

/*
* createImportTrDeclaration
* 创建 import * as Tr from "@hangteam/tr" 声明
*/
function createImportTrDeclaration(types, from) {
  return types.importDeclaration([types.importNamespaceSpecifier(types.identifier('Tr'))], types.stringLiteral(from));
}

module.exports = {
  createAttributeExpression,
  createChildrenExpression,
  createHExpression,
  createImportTrDeclaration
};