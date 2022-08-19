# Why are the test cases in seperate files?

For whatever reason, when we have multiple test cases in the same file that use `@testing-library/svelte` to mount and unmount components to JSDOM, event listeners get detached or corrupted (I'm not sure).

## Things I've tried

- Mounting the components manually with the Svelte [client-side component API](https://svelte.dev/docs#run-time-client-side-component-api-creating-a-component).
- Removing the custom `createEventForwarder` calls.
- Upgrading Node versions

## Time I've spent

I've spent ~~2~~ ~~10~~ 12 hours trying to fix this issue.
