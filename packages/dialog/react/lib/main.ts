import Close from './DialogClose';
import Content from './DialogContent';
import Description from './DialogDescription';
import Root from './DialogRoot';
import Title from './DialogTitle';
import Trigger from './DialogTrigger';
export default {
	Close,
	Content,
	Description,
	Root,
	Title,
	Trigger,
};

export {default as DialogClose} from './DialogClose';
export {default as DialogContent} from './DialogContent';
export {default as DialogDescription} from './DialogDescription';
export {default as DialogRoot} from './DialogRoot';
export {default as DialogTitle} from './DialogTitle';
export {default as DialogTrigger} from './DialogTrigger';
export {
	useDialog,
	type UseDialogOptions,
	type UseDialogValue,
} from './useDialog';
