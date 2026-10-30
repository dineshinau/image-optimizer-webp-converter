import gulp from "gulp"
import webp from "gulp-webp"

gulp.task("optimize", async () => {
  const { default: imagemin, gifsicle, mozjpeg, optipng, svgo } = await import("gulp-imagemin")
  const { default: pngquant } = await import("imagemin-pngquant")

  return gulp
    .src("src/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF,svg,SVG}", { encoding: false })
    .pipe(
      imagemin([
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 75, progressive: true }),
        pngquant({ quality: [0.6, 0.8] }),
        optipng({ optimizationLevel: 5 }),
        svgo({
          plugins: [
            {
              name: "removeViewBox",
              active: true
            },
            {
              name: "cleanupIDs",
              active: false
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("dist"))
})

gulp.task("optimize:webp", () => {
  return gulp
    .src("src/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF}", { encoding: false })
    .pipe(webp({ quality: 75 }))
    .pipe(gulp.dest("dist"))
})

gulp.task("watch", () => {
  gulp.watch("src/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF,svg,SVG}", gulp.parallel("optimize", "optimize:webp"))
})

gulp.task("default", gulp.series(gulp.parallel("optimize", "optimize:webp"), "watch"))
