/* Importar módulos */
var gulp = require('gulp')
  , imagemin = require('gulp-imagemin') // Otimização das imagens
  , clean = require('gulp-clean')    // Deleção de pastas recursivamente
  , concat = require('gulp-concat')   // Concatenação de aquivos
  , uglify = require('gulp-uglify')   // Minificação de arquivos js
  , usemin = require('gulp-usemin')   // Substituição de arquivos html
  , cssmin = require('gulp-cssmin')   // Minificação de arquivos css
  , browserSync = require('browser-sync')  // Server
  , jshint = require('gulp-jshint')   // Verificação de sintaxe js
  , jshintStylish = require('jshint-stylish')// Reporter jshint
  , csslint = require('gulp-csslint')  // Verificação de sintaxe css
  , autoprefixer = require('gulp-autoprefixer') // Prefixação dos atributos css
  , sass = require('gulp-sass') // Pré-procesador css (sass)
  , imageResizer = require('gulp-image-resize') // Redimencionar imagem
  , rename = require('gulp-rename'); //Renomear imagens;



/* Default task*/
gulp.task('default', ['copy'], () => {
  gulp.start('build-img', 'usemin');
});

/* Copy files to dist */
gulp.task('copy', ['clean'], () => {
  return gulp.src('src/**/*')
    .pipe(gulp.dest('dist'));
});

/* Delete folders */
gulp.task('clean', () => {
  return gulp.src('dist')
    .pipe(clean());
});


/* Image optimization */
gulp.task('build-img', () => {
  gulp.src('src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

/* Image resize and optimization */


gulp.task('resize-images', () => {
  let image_dest = 'src/images'; // Destino das imagens
  const image_source =
    gulp.src('src/images/src/**/*.{jpg,png}');

  // Small images
  image_source
    .pipe(imageResizer({
      width: 300,
      height: 300,
      crop: true,
      upscale: false
    }))
    .pipe(rename(function (path) {
      path.basename += '-small'
    }))
    .pipe(gulp.dest(image_dest))
  // Medium images
  image_source
    .pipe(imageResizer({
      width: 500,
      crop: false,
      upscale: false
    }))
    .pipe(rename(function (path) {
      path.basename += '-medium'
    }))
    .pipe(gulp.dest(image_dest))
  //Large images
  image_source
    .pipe(imageResizer({
      width: 800,
      crop: false,
      upscale: false
    }))
    .pipe(rename(function (path) {
      path.basename += '-large'
    }))
    .pipe(gulp.dest(image_dest))
})



gulp.task('build-imgs', () => {
  gulp.start('build-img-small', 'build-img-medium', 'build-img-large');
});

/* Small imagens */
gulp.task('build-img-small', () => {
  gulp.src('src/images/src/**/*.{jpg,png}')
    .pipe(imageResizer({
      width: 300,
      height: 300,
      crop: true,
      upscale: true,
      quality: 0.3
    }))
    .pipe(rename((path) => {
      path.basename += "-small";
    }))
    .pipe(gulp.dest('src/images'));
});

/* Medium imagens */
gulp.task('build-img-medium', () => {
  gulp.src('src/images/src/**/*.{jpg,png}')
    .pipe(imageResizer({
      width: 500,
      crop: false,
      upscale: true,
      quality: 0.3
    }))
    .pipe(rename((path) => {
      path.basename += "-medium";
    }))
    .pipe(gulp.dest('src/images'));
});

/* Large imagens */
gulp.task('build-img-large', () => {
  gulp.src('src/images/src/**/*.{jpg,png}')
    .pipe(imageResizer({
      width: 800,
      crop: false,
      upscale: true,
      quality: 0.3
    }))
    .pipe(rename((path) => {
      path.basename += "-large";
    }))
    .pipe(gulp.dest('src/images'));
});

/*Usemin: replacehtml and minify css and javascript */
gulp.task('usemin', () => {
  gulp.src('dist/**/*.html')
    .pipe(usemin({
      'js': [uglify],
      'css': [autoprefixer, cssmin]
    }))
    .pipe(gulp.dest('dist'));
});

/*Sass */
gulp.task('sass', () => {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'));
});

/*Brosersync */
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  });
  // Verificação de sintaxe para arquivos js
  gulp.watch('src/js/*.js').on('change', (event) => {
    gulp.src(event.path)
      .pipe(jshint())
      .pipe(jshint.reporter(jshintStylish));
  });
  // Compilar arquivos sass
  gulp.watch('src/sass/**/*.scss',['sass']).on('change', (event) => {
    console.log("Compilando o arquivo: " + event.path);
  });

  // Verificação de sintaxe para arquivos css
  gulp.watch('src/css/*.css').on('change', (event) => {
    gulp.src(event.path)
      .pipe(csslint())
      .pipe(csslint.formatter());
  });

  // Recarregar página para as alterações
  gulp.watch('src/**/*').on('change', browserSync.reload);
});
