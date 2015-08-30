import { Parent } from '../consts/ActionTypes';

export function addChild(child) {
	return {
		type: Parent.addChild,
		payload: {
			child: child
		}
	}
}