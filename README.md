# morris

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c2d36df-6241-4a45-a3cb-ea10ec3b210a/deploy-status)](https://app.netlify.com/sites/morris-cutaiar/deploys)
[![Render Status](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Frender-deploy-status.onrender.com&query=%24.status&style=flat-square&logo=Render&label=Render
)](https://dashboard.render.com/web/srv-cfgrc0pgp3jqehoco6dg)

The goal here is to create n-men morris just for fun using typescript and react. Some goals:

- have multiplayer
- have a bot play perfectly against you
- extend into unprecedented n's
- extend into 3 dimensions

The experience is live [here](https://morris.cutaiar.io/). And it looks like this:

![Morris Demo](./morris-demo-11-8-23.png)

## Development

From a fresh clone, make sure you have `pnpm` and run `pnpm i`, then `pnpm dev`.

The monorepo hosts a number of packages:

- `morris-ai` - Decision making
- `morris-core` - Core game implementation
- `morris-server` - multiplayer node server
- `morris-ui` - react frontend

`core` and `ai` are imported without transpiling and used by `ui` and `server` which each have their own development process. Both can be run `concurrently` using `pnpm dev` from the root here.
