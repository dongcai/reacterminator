module.exports = function createActionCreatorsIndex(
  { type, pathName, importsString, constantsString }
) {
  const isRoot = pathName === type;

  const relativePath = isRoot ? '' : '../';
  const customPath = `${relativePath}../../custom/index`;
  const storePath = `${relativePath}../store`;

  const customKeyRelativePath = isRoot ? '' : `/${pathName}`;
  const customKeyName = `${type}${customKeyRelativePath}/index`;

  return `\
${importsString}
import custom from '${customPath}';
import store from '${storePath}';

const actionCreators = {
  ${constantsString}
};

const customize = custom['${customKeyName}'] || ((x) => x)

export default customize(actionCreators, { store });
`;
};