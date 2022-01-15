/*
* createAttributeExpression
* 创建一个对象，保存 attributes
* key 只支持 string key（这也是 JSX 的限制）
* value 支持 JSXExpressionContainer 、string 、null
* 例子：
* JSXExpressionContainer：<a name={name} ></a>
* string：<a name="Hang" ></a>
* null：<a name ></a>
*/
function createAttributeExpression(types, attributes) {
  return types.objectExpression(attributes.map(({ name, value }) => {
    return types.objectProperty(types.identifier(name.name), 
      value.type === 'JSXExpressionContainer' ? value.expression
        : value.type === 'StringLiteral' ? types.stringLiteral(value.value) : types.nullLiteral()
    )
  }))
}

/* 
* createChildrenExpression
* 创建一个数组，保存 children
* 支持 JSXExpressionContainer、JSXText
* 例子：
* JSXExpressionContainer：<a>{content}</a>
* JSXText：<a>click</a>
*/
function createChildrenExpression(types, children) {
  return types.arrayExpression(children.map(item => {
    if (item?.type === 'JSXText') {         
      return types.stringLiteral(item.value)
    } else if (item?.type === 'JSXExpressionContainer') {
      return item.expression
    } else {
      return item // item 一定是 h 函数
    }
  }))
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
    [/^[A-Z]/.test(tagName) ? types.identifier(tagName) : types.stringLiteral(tagName), attributeExpression, childrenExpression]
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