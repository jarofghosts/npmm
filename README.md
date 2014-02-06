npmm
====

[![Build Status](https://travis-ci.org/jarofghosts/npmm.png?branch=master)](https://travis-ci.org/jarofghosts/npmm)

easy npm registry management

## installation

`npm install -g npmm`

## why

you decide when to use your private registry, the official registry, a mirror,
etc.

## how to use it

save dependencies to your `package.json` automatically using
`npmm install --save@http://myprivate.npm secret-module`

or manually add a key to your `package.json` like so:

```js
{
  "dependencies@http://myprivate.npm": {
    "secret-module": "~1.2.3"
  }
}
```

...and then...

`npmm install`

anything in the standard `dependencies` object will be installed from the
default registry (or the one designated in your `.npmrc` if applicable) and
any packages in a `dependencies@npm-registry-location` key will be installed
from `npm-registry-location`.

alternatively:

`npmm install --skipdefaults`

which will only install dependencies outside of the standard `dependencies`,
useful for using npmm as a dependency and adding a postinstall script to call
it

## config options

optionally, if you would like to curate a config file, you can create
`~/.npmm.json` or `project_dir/.npmm.json`. the local config options will
always beat the global config options. what kind of options can you set? well
here are some:

```js
{
  "npm": "/usr/local/bin/npm",
  "quiet": true,
  "registries": {
    "name": "http://location.of.npm"
  }
}
```

* `npm` sets the location to the npm you want use (default "`npm`")
* `quiet` will suppress npmm output, **not** npm output (default `false`)
* `registries` can point names at locations, these are blank by default. this
will allow for things like `--save@work-npm` on the command line, or
`dependencies@my-npm` in your `package.json`.

## notes

any other commands you throw at npmm will just get proxied to the real npm

## license

MIT
