const Koa = require('koa')
const KoaDirRouter = require('@cj97/koa-dir-router')
const path = require('path')

const app = new Koa()

app.use(
    KoaDirRouter({
        dir: path.join(__dirname, './controller')
    })
)

app.listen(8000)
