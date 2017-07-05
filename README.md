# Docbuilder

Docbuilder is a Metalsmith wrapper for quick out of the box generation of document sites.
Just place your Markdown pages in the `doc/` folder and `docbuilder` will create a static site in the `_build` folder.

# Usage
```
  docbuilder
```

# Special dirs

** TODO **

# Command line options

## Customize the source folder

Choose the `--src` option to override the location of your Markdown files and assets.
Default is `doc/`

## Customize the destination folder

Choose the `--dest` option to override the destination folder for the generated site.
Default is `_build/`

## Live update

Use the `--watch` option to have the content generated as you update the source.
While the command is running, any change made in the markdown file will be automatically pushed to the destination directory.

## Web preview

Use the `--serve` option to preview in browser the generated site. You can optionnally specify the port nummber.

```
docbuilder --serve 8080
```

This command will generate in th `_build` folder the content of the `doc` folder and serve the `_build` directory at http://localhost/ .





