# Config

## Typings

### Ignore typescript check for storybook build

Storybook uses CRA's config for compilation. Without CRA, typescript check [can be skipped with config](https://storybook.js.org/docs/react/configure/typescript):

```json
typescript: {
  check: false,
}
```

With CRA it's more complicated.

### css prop type

For type information related to css prop types (see: [issue-comment](https://github.com/emotion-js/emotion/issues/1249#issuecomment-828088254) for more), tsconfig has setting:

```json
  "jsxImportSource": "@emotion/react",
```

## Packages

### @headlressui/react

We are using incsider (master) version of headlessui/react, for the `by` property on `Combobox`. Without `by`, selected item logic was difficult to achieve.

Be careful about updating this package.
