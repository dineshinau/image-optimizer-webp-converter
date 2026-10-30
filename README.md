# Image Optimizer and WebP Converter

A local, Gulp-based tool for preparing images for websites and blogs. It compresses supported images in their original format and creates WebP versions of PNG and JPEG images. Place your images in `src/`, run the tool, and collect the results from `dist/`. Source files are left unchanged.

## Requirements

- Node.js 18 or newer, as required by the installed dependencies.
- npm, included with Node.js.
- Git, if you want to clone the repository.

Check that Node.js and npm are available:

```sh
node --version
npm --version
```

## Installation

Clone the repository and install its dependencies:

```sh
git clone https://github.com/dineshinau/image-optimizer-webp-converter.git
cd image-optimizer-webp-converter
npm ci
```

Run all commands below from this project directory. Gulp is installed locally with the dependencies; a global Gulp installation is not needed. Include development dependencies when installing, since they contain the image-processing tools.

## Optimize and convert images

1. Place your images directly inside `src/`. The repository includes sample images; move those out of `src/` if you only want to process your own files. Files in nested folders are not processed by the current configuration.
2. Start the tool:

   ```sh
   npm start
   ```

3. Open `dist/` to find the optimized originals and WebP versions. Wait for image processing to finish before using the output.
4. Keep the command running while you work. It watches `src/` and reruns processing when matching files change. Press **Ctrl+C** to stop it.

For example, adding `product.jpg` and `banner.png` produces:

```text
src/
  product.jpg
  banner.png
dist/
  product.jpg      # Optimized JPEG
  product.webp    # WebP version
  banner.png      # Optimized PNG
  banner.webp     # WebP version
```

Both tasks read the source images independently: WebP files are generated from `src/`, rather than from the compressed copies in `dist/`. Compression results depend on the source image; compare file sizes and visual quality before publishing.

### Run once without watching

Optimize images in their original formats:

```sh
npx gulp optimize
```

Create WebP versions only:

```sh
npx gulp optimize:webp
```

Run both tasks once:

```sh
npx gulp optimize optimize:webp
```

To watch for future changes without an initial processing run, use `npx gulp watch`.

## Supported formats

| Source format | Optimize original format | Create WebP |
| --- | --- | --- |
| PNG (`.png`, `.PNG`) | Yes | Yes |
| JPEG (`.jpg`, `.JPG`, `.jpeg`, `.JPEG`) | Yes | Yes |
| GIF (`.gif`, `.GIF`) | Yes | No |
| SVG (`.svg`, `.SVG`) | Configured, but see the compatibility note below | No |
| AVIF, JFIF, TIFF, existing WebP, and other extensions | No | No |

The current file patterns only match the lowercase and uppercase extensions listed above. AVIF files are not processed, even though an AVIF sample is included in the repository. GIF files match the WebP task's input pattern, but the WebP plugin does not convert them.

**SVG compatibility:** the optimization task includes older SVGO plugin names (`cleanupIDs` and `removeViewBox`). These settings may be incompatible with the installed SVGO version and cause SVG processing to fail. If that happens, move SVG files out of `src/` to process your raster images, or update the SVGO configuration before processing SVGs.

## Adjust image quality

Edit `gulpfile.js` to change the compression settings:

| Setting | Default | Purpose |
| --- | --- | --- |
| `webp({ quality: 75 })` | `75` | Quality of generated WebP images |
| `mozjpeg({ quality: 75, progressive: true })` | `75`, progressive enabled | JPEG compression and progressive loading |
| `pngquant({ quality: [0.6, 0.8] })` | `0.6–0.8` | PNG quality range |
| `optipng({ optimizationLevel: 5 })` | `5` | Additional PNG optimization effort |

For example, change `webp({ quality: 75 })` to `webp({ quality: 85 })` for higher WebP quality, usually at the cost of larger files. Restart the command after editing `gulpfile.js`. The current configuration does not resize images.

## Output and troubleshooting

- **No output for an image:** check its extension against the table above and make sure it is directly inside `src/`.
- **The command keeps running:** `npm start` includes watch mode. Use the one-time commands above when you want it to exit after processing.
- **Files overwrite each other:** output uses the source filename. For example, `photo.jpg` and `photo.png` both produce `photo.webp`. Give input images distinct base names to avoid collisions.
- **Old files remain in `dist/`:** the tool does not clean the output folder or remove outputs when a source is deleted. Remove unwanted output files manually before preparing a fresh batch.
- **Installation or image-binary errors:** the dependencies install native image tools. Check the npm error output for download failures or missing build tools. Install dependencies with lifecycle scripts enabled and avoid `--omit=dev` or `--omit=optional`, which can leave required tools unavailable.

## License

See [LICENSE](LICENSE) for the GNU General Public License v3 text.
