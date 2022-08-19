import {default as Close} from './DialogClose.svelte';
import {default as Content} from './DialogContent.svelte';
import {default as Description} from './DialogDescription.svelte';
import {default as Root} from './DialogRoot.svelte';
import {default as Title} from './DialogTitle.svelte';
import {default as Trigger} from './DialogTrigger.svelte';

export const Dialog = {
	Close,
	Content,
	Description,
	Root,
	Title,
	Trigger,
};

export {default as createDialog} from './createDialog';
