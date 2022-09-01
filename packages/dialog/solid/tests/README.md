# Why are some test cases in seperate files?

For whatever reason, when we have multiple test cases in the same file that use `solid-testing-library` to mount and unmount components to JSDOM, event listeners get detached or corrupted (I'm not sure).

This seems to be the same issue faced when testing Svelte interactivity.

## Time I've spent

I've spent ~~2~~ ~~10~~ 12 hours trying to fix this issue.
