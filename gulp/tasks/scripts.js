import browserSync from 'browser-sync';
import webpackStream from 'webpack-stream';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import path from 'path';
import {glob} from 'glob';

export const scripts = () => {
  const entries = glob.sync(app.paths.srcModulesJs);

  return app.gulp.src(app.paths.srcModulesJs)
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpackStream({
      mode: app.isProd ? 'production' : 'development',
      entry: entries.reduce((acc, file) => {
        const name = path.basename(file, path.extname(file));
        acc[name] = path.normalize(file);
        return acc;
      }, {}),
      output: {
        filename: '[name].js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "> 0.25%, not dead", // Задаем поддержку браузеров
                  useBuiltIns: "usage", // Полифилы по необходимости
                  corejs: 3 // Используем core-js версии 3
                }]
              ]
            }
          }
        }]
      },
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              name(module) {
                module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `vendor`;
              },
            },
          },
        },
      },
      devtool: !app.isProd ? 'source-map' : false,
      resolve: {
        preferRelative: true,
      },
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(app.gulp.dest(app.paths.buildJsFolder))
    .pipe(browserSync.stream());
}
