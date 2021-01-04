# worker-routine

multi-threads manager tool, using limited number of workers to exec any async function.

## Usage

``` javascript
const run = coroutine(async () => {
    let url = `https://api.github.com/users/${username}`;
    let res = await fetch(url);
    let profile = await res.json();
    return profile;
});

await run('developit');
```
