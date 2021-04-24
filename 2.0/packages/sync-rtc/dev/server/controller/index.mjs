const clients = []

export default function (ctx) {
    if (ctx.request.method === 'GET') {
        ctx.response.body = JSON.stringify(clients)
    } else if (ctx.request.method === 'POST') {
        console.log(ctx.request.body)
        ctx.response.body = JSON.stringify(clients)
    } else if (ctx.request.method === 'PUT') {
        ctx.response.body = JSON.stringify(clients)
    }
}
