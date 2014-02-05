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

## notes

any other commands you throw at npmm will just get proxied to the real npm

## todo

* add configuration for naming registries?

## license

MIT
