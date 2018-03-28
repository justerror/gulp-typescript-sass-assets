# gulp-typescript-sass-assets

This Gulp.js setup provides a well-configurable basic workflow for building and watching TypeScript and Sass files and copying assets, allowing use of multiple environments. It does not bundle the source files but keeps the source directory structure.

## Features

* Compile TypeScript and Sass
* Watch and recompile files on change
* Minification
* Source maps (both inline and external)
* Copy assets
* Clean files
* Well-configurable through config file

## Explanation

Full explanation is available at [tyftler.com/using-gulp-js-for-typescript-sass-and-copying-assets](https://www.tyftler.com/using-gulp-js-for-typescript-sass-and-copying-assets/).

## Installation & Usage

### Using the Example

1.  `npm install -g gulp`
2.  `npm install`
3.  `gulp build` or `gulp watch`

To get a demonstration of source maps, open the page in Google Chrome and click on the button labeled "console.error()". Open the developer console and click on the link that points to the origin of that error. Now you should see the correct line in the original TypeScript file although your browser runs the compiled JavaScript. That also works with CSS rules.

### Use it for Your Own Project

The necessary files are `package.json`, `gulpfile.js`, `config.json` and `tsconfig.json`.

1.  `npm install -g gulp`
2.  `npm install`
3.  Setup environments in `config.json`
4.  `gulp build`
5.  `gulp watch`

### Configuration

#### TypeScript & Sass

For both TypeScript and Sass provide the following settings. Note that the source directory, output directory and source map settings of the `tsconfig.json` will be ignored.

| Property                     | Type    | Description                                                                                                    |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| src                          | string  | Pattern for source files, e.g. `ts/**/*.ts` for all TypeScript files in all subdirectories of `ts/`.           |
| outDir                       | string  | Directory where to put the compiled files.                                                                     |
| outExt                       | string  | Extension of the compiled files, e.g. `.js` or `.min.js`.                                                      |
| minify                       | boolean | Minify compiled files?                                                                                         |
| sourceMaps.use               | boolean | Generate source maps?                                                                                          |
| sourceMaps.external          | boolean | Generate inline source maps or external files? External source maps can be kept private in a protected folder. |
| sourceMaps.externalRelDir    | string  | Directory to store source maps, relative to `outDir`.                                                          |
| sourceMaps.externalURLPrefix | string  | URL to prepend to external source maps’ paths, e.g. if copied to another domain.                               |

#### Assets

Third-party libraries like jQuery or Font Awesome can be comfortably managed through NPM and then be copied as asset. Provide an array of asset files to be copied, each of them with source and output directory. If the expected files are not found an error is thrown.

| Property | Type   | Description                 |
| -------- | ------ | --------------------------- |
| src      | string | Pattern of files to copy.   |
| outDir   | string | Directory to copy files to. |

#### Clean

When building your project it can be useful so automatically clean some files from directories. Provide an array with patterns of files to delete.

### Available Commands

You can get a list of the available commands running `gulp help`. Use the param `--env ENVIRONMENT` to choose the environment from `config.json`. If it is omitted then the first defined environment will be used. Note that `gulp watch` has trouble running while creating/deleting watched subdirectories.

    Usage: gulp [TASK] [--env ENVIRONMENT]
    Tasks:
        build         Clean files, compile TypeScript and Sass and copy assets
        watch         Watch and recompile TypeScript and Sass and run live server
        ts            Compile TypeScript
        sass          Compile Sass
        assets        Copy assets
        html          Copy html files
        browser-sync  Run live server
        clean         Clean files
