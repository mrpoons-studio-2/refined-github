import React from 'dom-chef';
import {$} from 'select-dom/strict.js';
import * as pageDetect from 'github-url-detection';
import {stringToBase64} from 'uint8array-extras';

import features from '../feature-manager.js';
import looseParseInt from '../helpers/loose-parse-int.js';
import {assertNodeContent} from '../helpers/dom-utils.js';
import observe from '../helpers/selector-observer.js';

const itemsPerNotificationsPage = 25;

function linkify(nextButton: HTMLAnchorElement): void {
	const totalNotificationsNode = $('.js-notifications-list-paginator-counts').lastChild!;
	assertNodeContent(totalNotificationsNode, /^of \d+$/);
	const totalNotificationsNumber = looseParseInt(totalNotificationsNode);
	const lastCursor = Math.floor((totalNotificationsNumber - 1) / itemsPerNotificationsPage) * itemsPerNotificationsPage;
	const nextButtonSearch = new URLSearchParams(nextButton.search);
	nextButtonSearch.set('after', stringToBase64(`cursor:${lastCursor}`));
	totalNotificationsNode.replaceWith(
		' of ',
		<a href={'?' + String(nextButtonSearch)}>
			{totalNotificationsNumber}
		</a>,
	);
}

function init(signal: AbortSignal): void {
	// When there's no "next page", this element becomes `<button disabled>`
	observe('a[aria-label="Next"]', linkify, {signal});
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isNotifications,
	],
	init,
});

/*

Test URLs:

https://github.com/notifications

*/
