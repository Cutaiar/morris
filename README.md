# morris

[![Netlify Status](https://api.netlify.com/api/v1/badges/1c2d36df-6241-4a45-a3cb-ea10ec3b210a/deploy-status)](https://app.netlify.com/sites/morris-cutaiar/deploys)

The goal here is to create n-men morris just for fun using typescript and react. Some goals:

- have multiplayer
- have a bot play perfectly against you
- extend into unprecedented n's
- extend into 3 dimensions

The experience is live [here](https://morris-cutaiar.netlify.app/).

## Development

Currently, the app is split into two packages:

- `morris-frontend`
- `morris-socket-server`

Each have their own development process, but both can be run `concurrently` using `npm start` from the root here.
