import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { promises } from "fs";
import { resolve } from "path";

const { readFile } = promises;
//   const browserServer = await chromium.launchServer();
//   const wsEndpoint = browserServer.wsEndpoint();
//   const browser = await chromium.connect(wsEndpoint);

export default async function userController(fastify: FastifyInstance) {
  // GET /login

  fastify.get("/detect", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const indexHtmlPath = resolve(__dirname, "../../static/detect.html");
    const indexHtmlContent = await readFile(indexHtmlPath);
    reply
      .header("Content-Type", "text/html; charset=utf-8")
      .send(indexHtmlContent);
  })

  fastify.get("/cast", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const {
      dpr,
      w,
      h,
      ismobile,
      // language,
      // downlink,
      // effectiveType,
      // rtt,
      // saveData,
      userid,
      domain,
      login_url
    } = (request.query as any);
    const userAgent = request.headers['user-agent']

    const browser = (fastify as any).browser;

    const context = await browser.newContext({
      viewport: { width: Math.round(w/dpr), height: Math.round(h/dpr) },
      deviceScaleFactor: +dpr,
      hasTouch: ismobile === 'true',
      isMobile: ismobile === 'true',
      userAgent: userAgent
    });
    console.log('userAgent -> ' , userAgent)
    console.log('ismobile -> ' , ismobile)
    console.log('dpr -> ' , dpr)
    console.log('w -> ' , w)
    console.log('h -> ' , h)
    console.log('viewport -> ' , { width: Math.round(w/dpr), height: Math.round(h/dpr) })

    // 将存储在 auth.json 文件中的 Cookie 添加到当前页面的 cookies 中
    // console.log(auth.cookies)
    // await context.addCookies(auth.cookies);

    const page = await context.newPage();

    const indexHtmlPath = resolve(__dirname, "../../static/cast.html");
    const indexHtmlContent = await readFile(indexHtmlPath);
    reply
      .header("Content-Type", "text/html; charset=utf-8")
      .send(indexHtmlContent);

    console.log('login_url -> ' , login_url)
    await page.goto(login_url)
    // encodeURIComponent('https://www.geetest.com/adaptive-captcha-demo') https%3A%2F%2Fwww.geetest.com%2Fadaptive-captcha-demo
    // http://localhost:3006/login/detect?login_url=https%3A%2F%2Fwww.geetest.com%2Fadaptive-captcha-demo
    // http://localhost:3006/login/detect?login_url=https%3A%2F%2Fwww.geetest.com%2Fadaptive-captcha-demo&domain=geetest.com&userid=111

    page.on('close', async () => {
      console.log('close')
      await page.context().storageState({ path: 'auth.json' });

      const session = await readFile('auth.json');

      console.log(userid, domain)

      const checkQuery = 'SELECT * FROM anyask_session WHERE user_id = $1 AND domain = $2';
      const { rowCount: checkCount } = await fastify.pg.query(checkQuery, [userid, domain]);
  
      if (checkCount > 0) {
        const updateQuery = 'UPDATE anyask_session SET session = $3 WHERE user_id = $1 AND domain = $2';
        await fastify.pg.query(updateQuery, [userid, domain, session]);
      } else {
        const insertQuery = 'INSERT INTO anyask_session (user_id, domain, session) VALUES ($1, $2, $3)';
        await fastify.pg.query(insertQuery, [userid, domain, session]);
      }

    })

    // 这个地方有问题
    if (ismobile === 'true') {
      setInterval(async () => {
        const inputElements = await page.$$('input')
        await page.evaluate(({inputElements, dpr}) => {
            const list = []
            // console.log(inputElements)
            inputElements.forEach((inputElement) => {
              if (!['email','number','file','image','search','password','tel','url','text'].includes(inputElement.type)) return;

              const box = inputElement.getBoundingClientRect()
              if (box.width !== 0 && box.height !== 0) {
                list.push({
                  type: inputElement.type,
                  x: Math.round(box.x / dpr),
                  y: Math.round(box.y / dpr),
                  width: Math.round(box.width / dpr),
                  height: Math.round(box.height / dpr),
                })
              }
            })
            console.log('FIND_INPUT_ELEMENT: ' , JSON.stringify(list))
        }, {inputElements, dpr})
      }, 2000)
    }

    // 防止页面自动关闭
    await new Promise(() => {});
  })
}
