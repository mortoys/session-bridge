import fastifyPlugin from 'fastify-plugin'
import { chromium } from "playwright";

async function browserPlugin (fastify, { port = 9222 }) {
  fastify.decorate('browser', await chromium.launch({
      // headless: false,
      // proxy: {
      //   server: 'http://127.0.0.1:1087'
      // },
      args: [
          `--remote-debugging-port=${port}`,
          '--remote-allow-origins=*'
      ]
    })
  )
}

export default fastifyPlugin(browserPlugin)