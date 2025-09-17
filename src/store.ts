import { effectScope, ref } from "vue";

import { ALREADY_MOUNTED, type AnyFn } from "./contants";

export const initialState: NiceModalStore = {};

export interface NiceModalAction {
	type: string;
	payload: {
		modalId: string;
		args?: Record<string, unknown>;
		flags?: Record<string, unknown>;
	};
}

export interface NiceModalState {
	id: string;
	args?: Record<string, unknown>;
	visible?: boolean;
	delayVisible?: boolean;
}

export interface NiceModalStore {
	[key: string]: NiceModalState;
}

export type CreateGlobalStateReturn<Fn extends AnyFn = AnyFn> = Fn;

export function createGlobalState<Fn extends AnyFn>(stateFactory: Fn): CreateGlobalStateReturn<Fn> {
	let initialized = false;
	let state: any;
	const scope = effectScope(true);

	return ((...args: any[]) => {
		if (!initialized) {
			state = scope.run(() => stateFactory(...args))!;
			initialized = true;
		}
		return state;
	}) as Fn;
}

export const useModalContext = createGlobalState(() => {
	const state = ref<NiceModalStore>(initialState);

	const dispatch = (action: NiceModalAction) => {
		const { type, payload } = action;

		switch (type) {
			case "nice-modal/show": {
				const { modalId, args } = payload;
				state.value[modalId] = {
					id: modalId,
					args,
					visible: !!ALREADY_MOUNTED[modalId],
					delayVisible: !ALREADY_MOUNTED[modalId],
				};
				break;
			}
			case "nice-modal/hide": {
				const { modalId } = payload;

				if (state.value[modalId]) {
					state.value[modalId].visible = false;
				}

				break;
			}
			case "nice-modal/remove": {
				const { modalId } = payload;
				delete state.value[modalId];
				break;
			}
			case "nice-modal/set-flags": {
				const { modalId, flags } = payload;

				state.value[modalId] = {
					...state.value[modalId],
					...flags,
				};

				break;
			}
			default:
				return state;
		}
	};

	return { state, dispatch };
});
