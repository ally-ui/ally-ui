export * from '@ally-ui/core-dialog';
export * from './DialogClose';
export {default as DialogClose} from './DialogClose.svelte';
export * from './DialogContent';
export {default as DialogContent} from './DialogContent.svelte';
export * from './DialogDescription';
export {default as DialogDescription} from './DialogDescription.svelte';
export * from './DialogRoot';
export {default as DialogRoot} from './DialogRoot.svelte';
export * from './DialogTitle';
export {default as DialogTitle} from './DialogTitle.svelte';
export * from './DialogTrigger';
export {default as DialogTrigger} from './DialogTrigger.svelte';

import Close from './DialogClose.svelte';
import Content from './DialogContent.svelte';
import Description from './DialogDescription.svelte';
import Root from './DialogRoot.svelte';
import Title from './DialogTitle.svelte';
import Trigger from './DialogTrigger.svelte';
export default {
	Close,
	Content,
	Description,
	Root,
	Title,
	Trigger,
};
