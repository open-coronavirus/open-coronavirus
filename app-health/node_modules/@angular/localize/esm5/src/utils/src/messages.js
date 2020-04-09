import { __read } from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { computeMsgId } from '@angular/compiler';
import { BLOCK_MARKER, ID_SEPARATOR, LEGACY_ID_INDICATOR, MEANING_SEPARATOR } from './constants';
/**
 * Re-export this helper function so that users of `@angular/localize` don't need to actively import
 * from `@angular/compiler`.
 */
export { computeMsgId } from '@angular/compiler';
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation.
 *
 * See `ParsedMessage` for an example.
 */
export function parseMessage(messageParts, expressions) {
    var substitutions = {};
    var metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
    var cleanedMessageParts = [metadata.text];
    var placeholderNames = [];
    var messageString = metadata.text;
    for (var i = 1; i < messageParts.length; i++) {
        var _a = splitBlock(messageParts[i], messageParts.raw[i]), messagePart = _a.text, _b = _a.block, placeholderName = _b === void 0 ? computePlaceholderName(i) : _b;
        messageString += "{$" + placeholderName + "}" + messagePart;
        if (expressions !== undefined) {
            substitutions[placeholderName] = expressions[i - 1];
        }
        placeholderNames.push(placeholderName);
        cleanedMessageParts.push(messagePart);
    }
    var messageId = metadata.id || computeMsgId(messageString, metadata.meaning || '');
    var legacyIds = metadata.legacyIds.filter(function (id) { return id !== messageId; });
    return {
        messageId: messageId,
        legacyIds: legacyIds,
        substitutions: substitutions,
        messageString: messageString,
        meaning: metadata.meaning || '',
        description: metadata.description || '',
        messageParts: cleanedMessageParts, placeholderNames: placeholderNames,
    };
}
/**
 * Parse the given message part (`cooked` + `raw`) to extract the message metadata from the text.
 *
 * If the message part has a metadata block this function will extract the `meaning`,
 * `description`, `customId` and `legacyId` (if provided) from the block. These metadata properties
 * are serialized in the string delimited by `|`, `@@` and `␟` respectively.
 *
 * (Note that `␟` is the `LEGACY_ID_INDICATOR` - see `constants.ts`.)
 *
 * For example:
 *
 * ```ts
 * `:meaning|description@@custom-id`
 * `:meaning|@@custom-id`
 * `:meaning|description`
 * `description@@custom-id`
 * `meaning|`
 * `description`
 * `@@custom-id`
 * `:meaning|description@@custom-id␟legacy-id-1␟legacy-id-2`
 * ```
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns A object containing any metadata that was parsed from the message part.
 */
export function parseMetadata(cooked, raw) {
    var _a = splitBlock(cooked, raw), text = _a.text, block = _a.block;
    if (block === undefined) {
        return { text: text, meaning: undefined, description: undefined, id: undefined, legacyIds: [] };
    }
    else {
        var _b = __read(block.split(LEGACY_ID_INDICATOR)), meaningDescAndId = _b[0], legacyIds = _b.slice(1);
        var _c = __read(meaningDescAndId.split(ID_SEPARATOR, 2), 2), meaningAndDesc = _c[0], id = _c[1];
        var _d = __read(meaningAndDesc.split(MEANING_SEPARATOR, 2), 2), meaning = _d[0], description = _d[1];
        if (description === undefined) {
            description = meaning;
            meaning = undefined;
        }
        if (description === '') {
            description = undefined;
        }
        return { text: text, meaning: meaning, description: description, id: id, legacyIds: legacyIds };
    }
}
/**
 * Split a message part (`cooked` + `raw`) into an optional delimited "block" off the front and the
 * rest of the text of the message part.
 *
 * Blocks appear at the start of message parts. They are delimited by a colon `:` character at the
 * start and end of the block.
 *
 * If the block is in the first message part then it will be metadata about the whole message:
 * meaning, description, id.  Otherwise it will be metadata about the immediately preceding
 * substitution: placeholder name.
 *
 * Since blocks are optional, it is possible that the content of a message block actually starts
 * with a block marker. In this case the marker must be escaped `\:`.
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns An object containing the `text` of the message part and the text of the `block`, if it
 * exists.
 * @throws an error if the `block` is unterminated
 */
export function splitBlock(cooked, raw) {
    if (raw.charAt(0) !== BLOCK_MARKER) {
        return { text: cooked };
    }
    else {
        var endOfBlock = findEndOfBlock(cooked, raw);
        return {
            block: cooked.substring(1, endOfBlock),
            text: cooked.substring(endOfBlock + 1),
        };
    }
}
function computePlaceholderName(index) {
    return index === 1 ? 'PH' : "PH_" + (index - 1);
}
/**
 * Find the end of a "marked block" indicated by the first non-escaped colon.
 *
 * @param cooked The cooked string (where escaped chars have been processed)
 * @param raw The raw string (where escape sequences are still in place)
 *
 * @returns the index of the end of block marker
 * @throws an error if the block is unterminated
 */
export function findEndOfBlock(cooked, raw) {
    /************************************************************************************************
    * This function is repeated in `src/localize/src/localize.ts` and the two should be kept in sync.
    * (See that file for more explanation of why.)
    ************************************************************************************************/
    for (var cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
        if (raw[rawIndex] === '\\') {
            rawIndex++;
        }
        else if (cooked[cookedIndex] === BLOCK_MARKER) {
            return cookedIndex;
        }
    }
    throw new Error("Unterminated $localize metadata block in \"" + raw + "\".");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvdXRpbHMvc3JjL21lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFL0MsT0FBTyxFQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0Y7OztHQUdHO0FBQ0gsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBdUYvQzs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDeEIsWUFBa0MsRUFBRSxXQUE0QjtJQUNsRSxJQUFNLGFBQWEsR0FBcUMsRUFBRSxDQUFDO0lBQzNELElBQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLElBQU0sbUJBQW1CLEdBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEQsSUFBTSxnQkFBZ0IsR0FBYSxFQUFFLENBQUM7SUFDdEMsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxJQUFBLHFEQUM4QyxFQUQ3QyxxQkFBaUIsRUFBRSxhQUFrRCxFQUFsRCxnRUFDMEIsQ0FBQztRQUNyRCxhQUFhLElBQUksT0FBSyxlQUFlLFNBQUksV0FBYSxDQUFDO1FBQ3ZELElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixhQUFhLENBQUMsZUFBZSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNyRDtRQUNELGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN2QyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDdkM7SUFDRCxJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNyRixJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsS0FBSyxTQUFTLEVBQWhCLENBQWdCLENBQUMsQ0FBQztJQUNwRSxPQUFPO1FBQ0wsU0FBUyxXQUFBO1FBQ1QsU0FBUyxXQUFBO1FBQ1QsYUFBYSxlQUFBO1FBQ2IsYUFBYSxlQUFBO1FBQ2IsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLElBQUksRUFBRTtRQUMvQixXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsSUFBSSxFQUFFO1FBQ3ZDLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0Isa0JBQUE7S0FDcEQsQ0FBQztBQUNKLENBQUM7QUFVRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlCRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQUMsTUFBYyxFQUFFLEdBQVc7SUFDakQsSUFBQSw0QkFBdUMsRUFBdEMsY0FBSSxFQUFFLGdCQUFnQyxDQUFDO0lBQzlDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixPQUFPLEVBQUMsSUFBSSxNQUFBLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBQyxDQUFDO0tBQ3pGO1NBQU07UUFDQyxJQUFBLDZDQUFtRSxFQUFsRSx3QkFBZ0IsRUFBRSx1QkFBZ0QsQ0FBQztRQUNwRSxJQUFBLHVEQUE4RCxFQUE3RCxzQkFBYyxFQUFFLFVBQTZDLENBQUM7UUFDakUsSUFBQSwwREFBMkYsRUFBMUYsZUFBTyxFQUFFLG1CQUFpRixDQUFDO1FBQ2hHLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixXQUFXLEdBQUcsT0FBTyxDQUFDO1lBQ3RCLE9BQU8sR0FBRyxTQUFTLENBQUM7U0FDckI7UUFDRCxJQUFJLFdBQVcsS0FBSyxFQUFFLEVBQUU7WUFDdEIsV0FBVyxHQUFHLFNBQVMsQ0FBQztTQUN6QjtRQUNELE9BQU8sRUFBQyxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxXQUFXLGFBQUEsRUFBRSxFQUFFLElBQUEsRUFBRSxTQUFTLFdBQUEsRUFBQyxDQUFDO0tBQ3BEO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjLEVBQUUsR0FBVztJQUNwRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFO1FBQ2xDLE9BQU8sRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7S0FDdkI7U0FBTTtRQUNMLElBQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsT0FBTztZQUNMLEtBQUssRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUM7WUFDdEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztTQUN2QyxDQUFDO0tBQ0g7QUFDSCxDQUFDO0FBR0QsU0FBUyxzQkFBc0IsQ0FBQyxLQUFhO0lBQzNDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFNLEtBQUssR0FBRyxDQUFDLENBQUUsQ0FBQztBQUNoRCxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQWMsRUFBRSxHQUFXO0lBQ3hEOzs7cUdBR2lHO0lBQ2pHLEtBQUssSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDOUYsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzFCLFFBQVEsRUFBRSxDQUFDO1NBQ1o7YUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxZQUFZLEVBQUU7WUFDL0MsT0FBTyxXQUFXLENBQUM7U0FDcEI7S0FDRjtJQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQTZDLEdBQUcsUUFBSSxDQUFDLENBQUM7QUFDeEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Y29tcHV0ZU1zZ0lkfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmltcG9ydCB7QkxPQ0tfTUFSS0VSLCBJRF9TRVBBUkFUT1IsIExFR0FDWV9JRF9JTkRJQ0FUT1IsIE1FQU5JTkdfU0VQQVJBVE9SfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogUmUtZXhwb3J0IHRoaXMgaGVscGVyIGZ1bmN0aW9uIHNvIHRoYXQgdXNlcnMgb2YgYEBhbmd1bGFyL2xvY2FsaXplYCBkb24ndCBuZWVkIHRvIGFjdGl2ZWx5IGltcG9ydFxuICogZnJvbSBgQGFuZ3VsYXIvY29tcGlsZXJgLlxuICovXG5leHBvcnQge2NvbXB1dGVNc2dJZH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuXG4vKipcbiAqIEEgc3RyaW5nIGNvbnRhaW5pbmcgYSB0cmFuc2xhdGlvbiBzb3VyY2UgbWVzc2FnZS5cbiAqXG4gKiBJLkUuIHRoZSBtZXNzYWdlIHRoYXQgaW5kaWNhdGVzIHdoYXQgd2lsbCBiZSB0cmFuc2xhdGVkIGZyb20uXG4gKlxuICogVXNlcyBgeyRwbGFjZWhvbGRlci1uYW1lfWAgdG8gaW5kaWNhdGUgYSBwbGFjZWhvbGRlci5cbiAqL1xuZXhwb3J0IHR5cGUgU291cmNlTWVzc2FnZSA9IHN0cmluZztcblxuLyoqXG4gKiBBIHN0cmluZyBjb250YWluaW5nIGEgdHJhbnNsYXRpb24gdGFyZ2V0IG1lc3NhZ2UuXG4gKlxuICogSS5FLiB0aGUgbWVzc2FnZSB0aGF0IGluZGljYXRlcyB3aGF0IHdpbGwgYmUgdHJhbnNsYXRlZCB0by5cbiAqXG4gKiBVc2VzIGB7JHBsYWNlaG9sZGVyLW5hbWV9YCB0byBpbmRpY2F0ZSBhIHBsYWNlaG9sZGVyLlxuICovXG5leHBvcnQgdHlwZSBUYXJnZXRNZXNzYWdlID0gc3RyaW5nO1xuXG4vKipcbiAqIEEgc3RyaW5nIHRoYXQgdW5pcXVlbHkgaWRlbnRpZmllcyBhIG1lc3NhZ2UsIHRvIGJlIHVzZWQgZm9yIG1hdGNoaW5nIHRyYW5zbGF0aW9ucy5cbiAqL1xuZXhwb3J0IHR5cGUgTWVzc2FnZUlkID0gc3RyaW5nO1xuXG4vKipcbiAqIEluZm9ybWF0aW9uIHBhcnNlZCBmcm9tIGEgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZyB0aGF0IGlzIHVzZWQgdG8gdHJhbnNsYXRlIGl0LlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogY29uc3QgbmFtZSA9ICdKbyBCbG9nZ3MnO1xuICogJGxvY2FsaXplYEhlbGxvICR7bmFtZX06dGl0bGUhYDtcbiAqIGBgYFxuICpcbiAqIE1heSBiZSBwYXJzZWQgaW50bzpcbiAqXG4gKiBgYGBcbiAqIHtcbiAqICAgbWVzc2FnZUlkOiAnNjk5ODE5NDUwNzU5NzczMDU5MScsXG4gKiAgIHN1YnN0aXR1dGlvbnM6IHsgdGl0bGU6ICdKbyBCbG9nZ3MnIH0sXG4gKiAgIG1lc3NhZ2VTdHJpbmc6ICdIZWxsbyB7JHRpdGxlfSEnLFxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VkTWVzc2FnZSB7XG4gIC8qKlxuICAgKiBUaGUga2V5IHVzZWQgdG8gbG9vayB1cCB0aGUgYXBwcm9wcmlhdGUgdHJhbnNsYXRpb24gdGFyZ2V0LlxuICAgKi9cbiAgbWVzc2FnZUlkOiBNZXNzYWdlSWQ7XG4gIC8qKlxuICAgKiBMZWdhY3kgbWVzc2FnZSBpZHMsIGlmIHByb3ZpZGVkLlxuICAgKlxuICAgKiBJbiBsZWdhY3kgbWVzc2FnZSBmb3JtYXRzIHRoZSBtZXNzYWdlIGlkIGNhbiBvbmx5IGJlIGNvbXB1dGVkIGRpcmVjdGx5IGZyb20gdGhlIG9yaWdpbmFsXG4gICAqIHRlbXBsYXRlIHNvdXJjZS5cbiAgICpcbiAgICogU2luY2UgdGhpcyBpbmZvcm1hdGlvbiBpcyBub3QgYXZhaWxhYmxlIGluIGAkbG9jYWxpemVgIGNhbGxzLCB0aGUgbGVnYWN5IG1lc3NhZ2UgaWRzIG1heSBiZVxuICAgKiBhdHRhY2hlZCBieSB0aGUgY29tcGlsZXIgdG8gdGhlIGAkbG9jYWxpemVgIG1ldGFibG9jayBzbyBpdCBjYW4gYmUgdXNlZCBpZiBuZWVkZWQgYXQgdGhlIHBvaW50XG4gICAqIG9mIHRyYW5zbGF0aW9uIGlmIHRoZSB0cmFuc2xhdGlvbnMgYXJlIGVuY29kZWQgdXNpbmcgdGhlIGxlZ2FjeSBtZXNzYWdlIGlkLlxuICAgKi9cbiAgbGVnYWN5SWRzOiBNZXNzYWdlSWRbXTtcbiAgLyoqXG4gICAqIEEgbWFwcGluZyBvZiBwbGFjZWhvbGRlciBuYW1lcyB0byBzdWJzdGl0dXRpb24gdmFsdWVzLlxuICAgKi9cbiAgc3Vic3RpdHV0aW9uczogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgLyoqXG4gICAqIEEgaHVtYW4gcmVhZGFibGUgcmVuZGVyaW5nIG9mIHRoZSBtZXNzYWdlXG4gICAqL1xuICBtZXNzYWdlU3RyaW5nOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbWVhbmluZyBvZiB0aGUgYG1lc3NhZ2VgLCB1c2VkIHRvIGRpc3Rpbmd1aXNoIGlkZW50aWNhbCBgbWVzc2FnZVN0cmluZ2BzLlxuICAgKi9cbiAgbWVhbmluZzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBgbWVzc2FnZWAsIHVzZWQgdG8gYWlkIHRyYW5zbGF0aW9uLlxuICAgKi9cbiAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBzdGF0aWMgcGFydHMgb2YgdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBtZXNzYWdlUGFydHM6IHN0cmluZ1tdO1xuICAvKipcbiAgICogVGhlIG5hbWVzIG9mIHRoZSBwbGFjZWhvbGRlcnMgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIHdpdGggc3Vic3RpdHV0aW9ucy5cbiAgICovXG4gIHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFBhcnNlIGEgYCRsb2NhbGl6ZWAgdGFnZ2VkIHN0cmluZyBpbnRvIGEgc3RydWN0dXJlIHRoYXQgY2FuIGJlIHVzZWQgZm9yIHRyYW5zbGF0aW9uLlxuICpcbiAqIFNlZSBgUGFyc2VkTWVzc2FnZWAgZm9yIGFuIGV4YW1wbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1lc3NhZ2UoXG4gICAgbWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgZXhwcmVzc2lvbnM/OiByZWFkb25seSBhbnlbXSk6IFBhcnNlZE1lc3NhZ2Uge1xuICBjb25zdCBzdWJzdGl0dXRpb25zOiB7W3BsYWNlaG9sZGVyTmFtZTogc3RyaW5nXTogYW55fSA9IHt9O1xuICBjb25zdCBtZXRhZGF0YSA9IHBhcnNlTWV0YWRhdGEobWVzc2FnZVBhcnRzWzBdLCBtZXNzYWdlUGFydHMucmF3WzBdKTtcbiAgY29uc3QgY2xlYW5lZE1lc3NhZ2VQYXJ0czogc3RyaW5nW10gPSBbbWV0YWRhdGEudGV4dF07XG4gIGNvbnN0IHBsYWNlaG9sZGVyTmFtZXM6IHN0cmluZ1tdID0gW107XG4gIGxldCBtZXNzYWdlU3RyaW5nID0gbWV0YWRhdGEudGV4dDtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBtZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB7dGV4dDogbWVzc2FnZVBhcnQsIGJsb2NrOiBwbGFjZWhvbGRlck5hbWUgPSBjb21wdXRlUGxhY2Vob2xkZXJOYW1lKGkpfSA9XG4gICAgICAgIHNwbGl0QmxvY2sobWVzc2FnZVBhcnRzW2ldLCBtZXNzYWdlUGFydHMucmF3W2ldKTtcbiAgICBtZXNzYWdlU3RyaW5nICs9IGB7JCR7cGxhY2Vob2xkZXJOYW1lfX0ke21lc3NhZ2VQYXJ0fWA7XG4gICAgaWYgKGV4cHJlc3Npb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN1YnN0aXR1dGlvbnNbcGxhY2Vob2xkZXJOYW1lXSA9IGV4cHJlc3Npb25zW2kgLSAxXTtcbiAgICB9XG4gICAgcGxhY2Vob2xkZXJOYW1lcy5wdXNoKHBsYWNlaG9sZGVyTmFtZSk7XG4gICAgY2xlYW5lZE1lc3NhZ2VQYXJ0cy5wdXNoKG1lc3NhZ2VQYXJ0KTtcbiAgfVxuICBjb25zdCBtZXNzYWdlSWQgPSBtZXRhZGF0YS5pZCB8fCBjb21wdXRlTXNnSWQobWVzc2FnZVN0cmluZywgbWV0YWRhdGEubWVhbmluZyB8fCAnJyk7XG4gIGNvbnN0IGxlZ2FjeUlkcyA9IG1ldGFkYXRhLmxlZ2FjeUlkcy5maWx0ZXIoaWQgPT4gaWQgIT09IG1lc3NhZ2VJZCk7XG4gIHJldHVybiB7XG4gICAgbWVzc2FnZUlkLFxuICAgIGxlZ2FjeUlkcyxcbiAgICBzdWJzdGl0dXRpb25zLFxuICAgIG1lc3NhZ2VTdHJpbmcsXG4gICAgbWVhbmluZzogbWV0YWRhdGEubWVhbmluZyB8fCAnJyxcbiAgICBkZXNjcmlwdGlvbjogbWV0YWRhdGEuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgbWVzc2FnZVBhcnRzOiBjbGVhbmVkTWVzc2FnZVBhcnRzLCBwbGFjZWhvbGRlck5hbWVzLFxuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2VNZXRhZGF0YSB7XG4gIHRleHQ6IHN0cmluZztcbiAgbWVhbmluZzogc3RyaW5nfHVuZGVmaW5lZDtcbiAgZGVzY3JpcHRpb246IHN0cmluZ3x1bmRlZmluZWQ7XG4gIGlkOiBzdHJpbmd8dW5kZWZpbmVkO1xuICBsZWdhY3lJZHM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIHRvIGV4dHJhY3QgdGhlIG1lc3NhZ2UgbWV0YWRhdGEgZnJvbSB0aGUgdGV4dC5cbiAqXG4gKiBJZiB0aGUgbWVzc2FnZSBwYXJ0IGhhcyBhIG1ldGFkYXRhIGJsb2NrIHRoaXMgZnVuY3Rpb24gd2lsbCBleHRyYWN0IHRoZSBgbWVhbmluZ2AsXG4gKiBgZGVzY3JpcHRpb25gLCBgY3VzdG9tSWRgIGFuZCBgbGVnYWN5SWRgIChpZiBwcm92aWRlZCkgZnJvbSB0aGUgYmxvY2suIFRoZXNlIG1ldGFkYXRhIHByb3BlcnRpZXNcbiAqIGFyZSBzZXJpYWxpemVkIGluIHRoZSBzdHJpbmcgZGVsaW1pdGVkIGJ5IGB8YCwgYEBAYCBhbmQgYOKQn2AgcmVzcGVjdGl2ZWx5LlxuICpcbiAqIChOb3RlIHRoYXQgYOKQn2AgaXMgdGhlIGBMRUdBQ1lfSURfSU5ESUNBVE9SYCAtIHNlZSBgY29uc3RhbnRzLnRzYC4pXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIGA6bWVhbmluZ3xkZXNjcmlwdGlvbkBAY3VzdG9tLWlkYFxuICogYDptZWFuaW5nfEBAY3VzdG9tLWlkYFxuICogYDptZWFuaW5nfGRlc2NyaXB0aW9uYFxuICogYGRlc2NyaXB0aW9uQEBjdXN0b20taWRgXG4gKiBgbWVhbmluZ3xgXG4gKiBgZGVzY3JpcHRpb25gXG4gKiBgQEBjdXN0b20taWRgXG4gKiBgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGN1c3RvbS1pZOKQn2xlZ2FjeS1pZC0x4pCfbGVnYWN5LWlkLTJgXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY29va2VkIFRoZSBjb29rZWQgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHZlcnNpb24gb2YgdGhlIG1lc3NhZ2UgcGFydCB0byBwYXJzZS5cbiAqIEByZXR1cm5zIEEgb2JqZWN0IGNvbnRhaW5pbmcgYW55IG1ldGFkYXRhIHRoYXQgd2FzIHBhcnNlZCBmcm9tIHRoZSBtZXNzYWdlIHBhcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1ldGFkYXRhKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IE1lc3NhZ2VNZXRhZGF0YSB7XG4gIGNvbnN0IHt0ZXh0LCBibG9ja30gPSBzcGxpdEJsb2NrKGNvb2tlZCwgcmF3KTtcbiAgaWYgKGJsb2NrID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ge3RleHQsIG1lYW5pbmc6IHVuZGVmaW5lZCwgZGVzY3JpcHRpb246IHVuZGVmaW5lZCwgaWQ6IHVuZGVmaW5lZCwgbGVnYWN5SWRzOiBbXX07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgW21lYW5pbmdEZXNjQW5kSWQsIC4uLmxlZ2FjeUlkc10gPSBibG9jay5zcGxpdChMRUdBQ1lfSURfSU5ESUNBVE9SKTtcbiAgICBjb25zdCBbbWVhbmluZ0FuZERlc2MsIGlkXSA9IG1lYW5pbmdEZXNjQW5kSWQuc3BsaXQoSURfU0VQQVJBVE9SLCAyKTtcbiAgICBsZXQgW21lYW5pbmcsIGRlc2NyaXB0aW9uXTogKHN0cmluZyB8IHVuZGVmaW5lZClbXSA9IG1lYW5pbmdBbmREZXNjLnNwbGl0KE1FQU5JTkdfU0VQQVJBVE9SLCAyKTtcbiAgICBpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBtZWFuaW5nO1xuICAgICAgbWVhbmluZyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSAnJykge1xuICAgICAgZGVzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB7dGV4dCwgbWVhbmluZywgZGVzY3JpcHRpb24sIGlkLCBsZWdhY3lJZHN9O1xuICB9XG59XG5cbi8qKlxuICogU3BsaXQgYSBtZXNzYWdlIHBhcnQgKGBjb29rZWRgICsgYHJhd2ApIGludG8gYW4gb3B0aW9uYWwgZGVsaW1pdGVkIFwiYmxvY2tcIiBvZmYgdGhlIGZyb250IGFuZCB0aGVcbiAqIHJlc3Qgb2YgdGhlIHRleHQgb2YgdGhlIG1lc3NhZ2UgcGFydC5cbiAqXG4gKiBCbG9ja3MgYXBwZWFyIGF0IHRoZSBzdGFydCBvZiBtZXNzYWdlIHBhcnRzLiBUaGV5IGFyZSBkZWxpbWl0ZWQgYnkgYSBjb2xvbiBgOmAgY2hhcmFjdGVyIGF0IHRoZVxuICogc3RhcnQgYW5kIGVuZCBvZiB0aGUgYmxvY2suXG4gKlxuICogSWYgdGhlIGJsb2NrIGlzIGluIHRoZSBmaXJzdCBtZXNzYWdlIHBhcnQgdGhlbiBpdCB3aWxsIGJlIG1ldGFkYXRhIGFib3V0IHRoZSB3aG9sZSBtZXNzYWdlOlxuICogbWVhbmluZywgZGVzY3JpcHRpb24sIGlkLiAgT3RoZXJ3aXNlIGl0IHdpbGwgYmUgbWV0YWRhdGEgYWJvdXQgdGhlIGltbWVkaWF0ZWx5IHByZWNlZGluZ1xuICogc3Vic3RpdHV0aW9uOiBwbGFjZWhvbGRlciBuYW1lLlxuICpcbiAqIFNpbmNlIGJsb2NrcyBhcmUgb3B0aW9uYWwsIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGNvbnRlbnQgb2YgYSBtZXNzYWdlIGJsb2NrIGFjdHVhbGx5IHN0YXJ0c1xuICogd2l0aCBhIGJsb2NrIG1hcmtlci4gSW4gdGhpcyBjYXNlIHRoZSBtYXJrZXIgbXVzdCBiZSBlc2NhcGVkIGBcXDpgLlxuICpcbiAqIEBwYXJhbSBjb29rZWQgVGhlIGNvb2tlZCB2ZXJzaW9uIG9mIHRoZSBtZXNzYWdlIHBhcnQgdG8gcGFyc2UuXG4gKiBAcGFyYW0gcmF3IFRoZSByYXcgdmVyc2lvbiBvZiB0aGUgbWVzc2FnZSBwYXJ0IHRvIHBhcnNlLlxuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGB0ZXh0YCBvZiB0aGUgbWVzc2FnZSBwYXJ0IGFuZCB0aGUgdGV4dCBvZiB0aGUgYGJsb2NrYCwgaWYgaXRcbiAqIGV4aXN0cy5cbiAqIEB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGBibG9ja2AgaXMgdW50ZXJtaW5hdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEJsb2NrKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IHt0ZXh0OiBzdHJpbmcsIGJsb2NrPzogc3RyaW5nfSB7XG4gIGlmIChyYXcuY2hhckF0KDApICE9PSBCTE9DS19NQVJLRVIpIHtcbiAgICByZXR1cm4ge3RleHQ6IGNvb2tlZH07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZW5kT2ZCbG9jayA9IGZpbmRFbmRPZkJsb2NrKGNvb2tlZCwgcmF3KTtcbiAgICByZXR1cm4ge1xuICAgICAgYmxvY2s6IGNvb2tlZC5zdWJzdHJpbmcoMSwgZW5kT2ZCbG9jayksXG4gICAgICB0ZXh0OiBjb29rZWQuc3Vic3RyaW5nKGVuZE9mQmxvY2sgKyAxKSxcbiAgICB9O1xuICB9XG59XG5cblxuZnVuY3Rpb24gY29tcHV0ZVBsYWNlaG9sZGVyTmFtZShpbmRleDogbnVtYmVyKSB7XG4gIHJldHVybiBpbmRleCA9PT0gMSA/ICdQSCcgOiBgUEhfJHtpbmRleCAtIDF9YDtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBlbmQgb2YgYSBcIm1hcmtlZCBibG9ja1wiIGluZGljYXRlZCBieSB0aGUgZmlyc3Qgbm9uLWVzY2FwZWQgY29sb24uXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHN0cmluZyAod2hlcmUgZXNjYXBlZCBjaGFycyBoYXZlIGJlZW4gcHJvY2Vzc2VkKVxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHN0cmluZyAod2hlcmUgZXNjYXBlIHNlcXVlbmNlcyBhcmUgc3RpbGwgaW4gcGxhY2UpXG4gKlxuICogQHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBlbmQgb2YgYmxvY2sgbWFya2VyXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBibG9jayBpcyB1bnRlcm1pbmF0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRFbmRPZkJsb2NrKGNvb2tlZDogc3RyaW5nLCByYXc6IHN0cmluZyk6IG51bWJlciB7XG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgKiBUaGlzIGZ1bmN0aW9uIGlzIHJlcGVhdGVkIGluIGBzcmMvbG9jYWxpemUvc3JjL2xvY2FsaXplLnRzYCBhbmQgdGhlIHR3byBzaG91bGQgYmUga2VwdCBpbiBzeW5jLlxuICAqIChTZWUgdGhhdCBmaWxlIGZvciBtb3JlIGV4cGxhbmF0aW9uIG9mIHdoeS4pXG4gICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgZm9yIChsZXQgY29va2VkSW5kZXggPSAxLCByYXdJbmRleCA9IDE7IGNvb2tlZEluZGV4IDwgY29va2VkLmxlbmd0aDsgY29va2VkSW5kZXgrKywgcmF3SW5kZXgrKykge1xuICAgIGlmIChyYXdbcmF3SW5kZXhdID09PSAnXFxcXCcpIHtcbiAgICAgIHJhd0luZGV4Kys7XG4gICAgfSBlbHNlIGlmIChjb29rZWRbY29va2VkSW5kZXhdID09PSBCTE9DS19NQVJLRVIpIHtcbiAgICAgIHJldHVybiBjb29rZWRJbmRleDtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBVbnRlcm1pbmF0ZWQgJGxvY2FsaXplIG1ldGFkYXRhIGJsb2NrIGluIFwiJHtyYXd9XCIuYCk7XG59Il19