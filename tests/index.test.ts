import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

import NiceModal from "../src";

test("Provider", () => {
	const wrapper = mount(NiceModal.Provider, {
		slots: {
			default: "<div class='test'>Hello World</div>",
		},
	});
	expect(wrapper.exists()).toBe(true);
	wrapper.unmount();
});
