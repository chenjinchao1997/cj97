export default function (ctx) {
    const data = {
        msg: 'text'
    }
    ctx.response.body = JSON.stringify(data)
    // console.log(ctx)
}
