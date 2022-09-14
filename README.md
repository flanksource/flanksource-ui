# Flanksource Frontend

## Setup

1. install nvm using instructions documented [here](https://github.com/nvm-sh/nvm)
2. after installing nvm run `nvm install` in the root directory of the repo, this will install the nodejs version needed for the front end setup. The version is set in .nvmrc
3. after node install run `npm install` this will install all dependencies
4. then run `npm run dev` to launch the front end application (note: api calls will be proxied to dev environment here).
5. visit [http://localhost:3004](http://localhost:3004) to see front end changes.


## env

Add `NEXT_PUBLIC_WITHOUT_SESSION=true` in `.env.local` to skip auth for local development.

## Svg files

Run them through https://github.com/svg/svgo to make them compatible with react. See: https://stackoverflow.com/questions/59820954/syntaxerror-unknown-namespace-tags-are-not-supported-by-default

## scripts
See [package.json](https://github.com/flanksource/flanksource-ui/blob/chore%2Fdeps-update-cleanup/package.json) scripts.
