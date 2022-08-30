export * from '@ally-ui/core-dialog';
export {
	default as DialogClose,
	type DialogCloseProps,
} from './DialogClose.svelte';
export {
	default as DialogContent,
	type DialogContentProps,
} from './DialogContent.svelte';
export {
	default as DialogDescription,
	type DialogDescriptionProps,
} from './DialogDescription.svelte';
export {default as DialogRoot, type DialogRootProps} from './DialogRoot.svelte';
export {
	default as DialogTitle,
	type DialogTitleProps,
} from './DialogTitle.svelte';
export {
	default as DialogTrigger,
	type DialogTriggerProps,
} from './DialogTrigger.svelte';

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
