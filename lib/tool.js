/*
* getMemberExpressionStr
* 将 MemberExpression 或 JSXMemberExpression 转为 对应的字符串形式
*/
function getMemberExpressionStr(memberExpression) {
  if (memberExpression.object.type.endsWith('Identifier')) {
    return memberExpression.object.name + '.' + memberExpression.property.name;
  } 
  return getMemberExpressionStr(memberExpression.object) + '.' + memberExpression.property.name;
}

module.exports = {
  getMemberExpressionStr
}