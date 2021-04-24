import Koa from 'koa'
import KoaDirRouter from '@cj97/koa-dir-router/index.mjs'
import KoaBodyParser from 'koa-bodyparser'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = new Koa()

app
    .use(
        KoaDirRouter({
            dir: path.join(__dirname, './controller')
        })
    )
    .use(KoaBodyParser())

app.listen(8000)
