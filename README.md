# gulp-new
对gulp4.0.2应用，监听文件改变执行任务，es6编译成es5, less编译成css，css,js合并压缩,图片压缩，加版本号功能

# es6 编译成 es5 
npm install gulp-babel@7.0.1 babel-core babel-preset-env  babel-preset-es2015 --save-dev

在项目根目录创建文件。.babelrc文件  
{
  "presets": [
    "es2015"
  ]
}


# 加版本号
npm install gulp-asset-rev gulp-rev  gulp-rev-collector --save-dev

修改插件

打开 
gulp-rev\index.js
134行：
manifest[originalFile] = revisionedFile; 
更新为：
manifest[originalFile] = originalFile + '?v=' + file.revHash;

打开 
rev-path\index.js  
9行 
return modifyFilename(pth, (filename, ext) => `${filename}-${hash}${ext}`);
更新为：
return modifyFilename(pth, (filename, ext) => `${filename}${ext}`);
17行 
return modifyFilename(pth, (filename, ext) => filename.replace(new RegExp(`-${hash}$`), '') + ext);
更新为： 
return modifyFilename(pth, (filename, ext) => filename + ext);

打开 
gulp-rev-collector\index.js
40行
var cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
更新为：
var cleanReplacement =  path.basename(json[key]).split('?')[0];
173行
regexp: new RegExp( prefixDelim + pattern, 'g' ),
更新为 
regexp: new RegExp( prefixDelim + pattern + '(\\?v=\\w{10})?', 'g' ),


打开 
gulp-assets-rev\index.js
78行
var verStr = (options.verConnecter || "-") + md5
更新为：
var verStr = (options.verConnecter || "") + md5;
80行
src = src.replace(verStr, '').replace(/(\.[^\.]+)$/, verStr + "$1");
更新为：
src=src+"?v="+verStr;

