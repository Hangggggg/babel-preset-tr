/*
* createAttributeExpression
* 创建一个对象表达式，保存 attributes
* 支持 JSXAttribute 和 JSXSpreadAttribute
* JSXAttribute：
* key 只支持 JSXIdentifier
* value 支持 JSXExpressionContainer 、string 、null
* 例子：
* JSXExpressionContainer：<a name={name} ></a>
* string：<a name="Hang" ></a>
* null：<a name ></a>  name value 为 true
* JSXSpreadAttribute：
* 例子：
* <a {...{name: 'Hang'}} ></a>
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
  return types.objectExpression(properties);
}

/* 
* createChildrenExpression
* 创建一个表达式或数组表达式，保存 children
* 支持 JSXExpressionContainer、JSXText
* 例子：
* JSXExpressionContainer：<a>{content}</a>
* JSXText：<a>click</a>
*/
function createChildrenExpression(types, children) {
  const arr = [];
  children.forEach(item => {
    const child = createChildExpression(types, item);
    child && arr.push(child); 
  })
  return arr.length ? arr.length === 1 ? arr[0] : types.arrayExpression(arr) : types.nullLiteral();
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
    return item.expression
  } else {
    return item // item 一定是 h 函数
  }
}

/*
* createHExpression
* 创建 Tr.h 函数
* 如果 tagName 为大写字母开头，当做组件名；相反，当做标签字符串
* 例子：
* <A></A> -> Tr.h(A)
* <a></a> -> Tr.h('a')
*/
function createHExpression(types, tagName, attributeExpression, childrenExpression) {
  return types.callExpression(
    types.identifier('Tr.h'), 
    [/^[A-Z]/.test(tagName) ? types.identifier(tagName) : types.stringLiteral(tagName), attributeExpression, childrenExpression, 
    types.objectExpression([types.objectProperty(types.identifier('tagName'), types.stringLiteral(tagName))])
  ]
  )
}

/*
* createImportTrDeclaration
* 创建 import Tr from "@hangteam/Tr" 声明
*/
function createImportTrDeclaration(types) {
  return types.importDeclaration([types.importDefaultSpecifier(types.identifier('Tr'))], types.stringLiteral('@hangteam/Tr'))
}

module.exports = {
  createAttributeExpression,
  createChildrenExpression,
  createHExpression,
  createImportTrDeclaration
};