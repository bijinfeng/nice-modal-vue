import { useModal } from "./hooks";
import { Provider } from "./provider";
import {
	antdDrawer,
	antdModal,
	create,
	elementDialog,
	elementDrawer,
	hide,
	register,
	remove,
	show,
	unregister,
} from "./utils";

export default {
	Provider,
	useModal,
	create,
	hide,
	register,
	remove,
	show,
	unregister,
	antdModal,
	antdDrawer,
	elementDialog,
	elementDrawer,
};

export type { NiceModalAction, NiceModalState, NiceModalStore } from "./store";
