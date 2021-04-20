# v-bem

## rules

``` javascript
export default {
    name: 'app'
}
```

``` html
<div v-bem:root>
    <div v-bem:first,second v-bem:first&disabled="true" v-bem:empty_element,square.block>
        <div v-bem:content>
        </div>
    </div>
</div>
```

compile to

``` html
<div class="app__root">
    <div class="app__root__first app__root__second app__root__first--disabled empty__element square">
        <div class="app__root__first__content app__root__second__content">
        </div>
    </div>
</div>
```
