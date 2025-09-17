import { useModal } from "./hooks";
import { Provider } from "./provider";
import { antdDrawer, antdModal, create, hide, register, remove, show, unregister } from "./utils";

export default {
	useModal,
	Provider,
	create,
	hide,
	register,
	remove,
	show,
	unregister,
	antdModal,
	antdDrawer,
};

export type { NiceModalAction, NiceModalState, NiceModalStore } from "./store";
