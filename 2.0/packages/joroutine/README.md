# worker-routine

multi-threads manager tool, to exec any function within limited number of workers.

## Usage

``` javascript
const run = joroutine(async (username) => {
    let url = `https://api.github.com/users/${username}`;
    let res = await fetch(url);
    let profile = await res.json();
    return profile;
});

await run('developit');

run.unregister();

await run('developit'); // throw Error
```
