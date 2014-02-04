npmm
====

easy npm registry management

## installation

`npm install -g npmm`

## why

you decide when to use your private registry, the official registry, a mirror,
etc.

## how to use it

simply add a key to your `package.json` like so:

```js
{
  "dependencies@http://myawesome.npm": {
    "private-module": "~1.2.3"
  }
}
```

...and then...

`npmm i`

anything in the standard `dependencies` object will be installed from the
default registry (or the one designated in your `.npmrc` if applicable)

## notes

any other commands you throw at npmm will just get proxied to the real npm

## wip

* make it easy to add dependencies to `package.json`
(`npmm i --save@http://my.npm modulename`)

## todo

* add configuration for naming registries?

## license

MIT
