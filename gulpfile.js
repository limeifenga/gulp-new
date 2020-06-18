const gulp = require('gulp')

const less = require('gulp-less')

// 给文件加版本号
const assetRev = require('gulp-asset-rev')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')

// 压缩css
const minifyCss = require('gulp-minify-css')

// js 压缩
const uglify = require('gulp-uglify');      

const pump = require('pump');
// es6 编译成 es5
const babel = require('gulp-babel')

// 图片压缩
const tinypngNokey = require('gulp-tinypng-nokey')

// 压缩图片2 需要有KEY并且每个月只有500张
// const tinypng = require('gulp-tinypng-compress'),       

// 路径定义
const cssSrc = './app/css/*.css',
    jsSrc = './app/js/*.js',
    compileCss = './app/compile/css/*.css',
    compileJs = './app/compile/js/*.js';


// 编译less
gulp.task('less', function() {
  return gulp.src('./app/less/*.less')
  .pipe(less())
  .pipe(gulp.dest('./app/compile/css'))
})

// es6转es5
gulp.task('es6',  function () {
  return gulp.src(jsSrc)
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('./app/compile/js'));
});


//压缩图片
gulp.task('tinypngNokey', function() {
  return gulp.src('./app/images/*.{png,jpg,jpeg,gif,ico}')
      .pipe(tinypngNokey())
      .pipe(gulp.dest('./dist/images'));
})

// css文件压缩
gulp.task('minifyCss', function (cb) {
  gulp.src(compileCss) // 要压缩的css文件
  .pipe(minifyCss()) //压缩css
  .pipe(gulp.dest('./dist/css'));
  cb();
});


// js 文件压缩
gulp.task('uglifyJs', function(cb){
  // return gulp.src(compileJs)
      // .pipe(concat('main.min.js'))
      // .pipe(uglify())
      // .pipe(gulp.dest('dist/js'));

      // 使用pump代替pipe
      pump([
        gulp.src(compileJs),
        // concat('main.min.js'),
        uglify(),
        gulp.dest('./dist/js')
      ],cb)
});

/*—加版本号——————————————————————————————————————————————————————————————————*/
// 为css中引入的图片/字体等添加hash编码
gulp.task('assetRev', function(){
  return gulp.src(compileCss)  //该任务针对的文件
   .pipe(assetRev()) //该任务调用的模块
   .pipe(gulp.dest('./app/compile/css')); //编译后的路径
});

// CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
  return gulp.src(compileCss)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('./app/compile/rev/css'));
});

// js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){
  return gulp.src(compileJs)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('./app/compile/rev/js'));
});

// Html替换css、js文件版本
gulp.task('revHtml', function () {
  return gulp.src(['./app/compile/rev/**/*.json', './app/view/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('./app/view'))
    .pipe(gulp.dest('./dist/view'));
});
/*—加版本号end——————————————————————————————————————————————————————————————————*/

// gulp.parallel() // 同时执行
// gulp.series() // 顺序执行


/** 生产环境
 * less      less编译成css   output > css
 * assetRev  为css中引入的图片/字体等添加hash编码   output > css
 * es6       es6 转 es5     output > dist
 * gulp.parallel('revCss', 'revJs')  加版本号     output > rev
 * minifyCss 压缩CSS        output > dist
 * uglifyJs  压缩JS         output > dist
 * revHtml   Html替换css、js文件版本    output > dist
 */
gulp.task('prod', gulp.series('less', 'assetRev', 'es6',  'minifyCss', 'uglifyJs', gulp.parallel('revCss', 'revJs'), 
'revHtml','tinypngNokey')); 


// 设置自动监听
gulp.task('auto', function () {
  return gulp.watch('app/less/*less', gulp.series('less'))
})

// 设置默认运行模块
gulp.task('default', gulp.series('auto'))
