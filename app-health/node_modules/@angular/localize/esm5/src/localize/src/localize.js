/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Tag a template literal string for localization.
 *
 * For example:
 *
 * ```ts
 * $localize `some string to localize`
 * ```
 *
 * **Providing meaning, description and id**
 *
 * You can optionally specify one or more of `meaning`, `description` and `id` for a localized
 * string by pre-pending it with a colon delimited block of the form:
 *
 * ```ts
 * $localize`:meaning|description@@id:source message text`;
 *
 * $localize`:meaning|:source message text`;
 * $localize`:description:source message text`;
 * $localize`:@@id:source message text`;
 * ```
 *
 * This format is the same as that used for `i18n` markers in Angular templates. See the
 * [Angular 18n guide](guide/i18n#template-translations).
 *
 * **Naming placeholders**
 *
 * If the template literal string contains expressions, then the expressions will be automatically
 * associated with placeholder names for you.
 *
 * For example:
 *
 * ```ts
 * $localize `Hi ${name}! There are ${items.length} items.`;
 * ```
 *
 * will generate a message-source of `Hi {$PH}! There are {$PH_1} items`.
 *
 * The recommended practice is to name the placeholder associated with each expression though.
 *
 * Do this by providing the placeholder name wrapped in `:` characters directly after the
 * expression. These placeholder names are stripped out of the rendered localized string.
 *
 * For example, to name the `items.length` expression placeholder `itemCount` you write:
 *
 * ```ts
 * $localize `There are ${items.length}:itemCount: items`;
 * ```
 *
 * **Escaping colon markers**
 *
 * If you need to use a `:` character directly at the start of a tagged string that has no
 * metadata block, or directly after a substitution expression that has no name you must escape
 * the `:` by preceding it with a backslash:
 *
 * For example:
 *
 * ```ts
 * // message has a metadata block so no need to escape colon
 * $localize `:some description::this message starts with a colon (:)`;
 * // no metadata block so the colon must be escaped
 * $localize `\:this message starts with a colon (:)`;
 * ```
 *
 * ```ts
 * // named substitution so no need to escape colon
 * $localize `${label}:label:: ${}`
 * // anonymous substitution so colon must be escaped
 * $localize `${label}\: ${}`
 * ```
 *
 * **Processing localized strings:**
 *
 * There are three scenarios:
 *
 * * **compile-time inlining**: the `$localize` tag is transformed at compile time by a
 * transpiler, removing the tag and replacing the template literal string with a translated
 * literal string from a collection of translations provided to the transpilation tool.
 *
 * * **run-time evaluation**: the `$localize` tag is a run-time function that replaces and
 * reorders the parts (static strings and expressions) of the template literal string with strings
 * from a collection of translations loaded at run-time.
 *
 * * **pass-through evaluation**: the `$localize` tag is a run-time function that simply evaluates
 * the original template literal string without applying any translations to the parts. This
 * version is used during development or where there is no need to translate the localized
 * template literals.
 * @param messageParts a collection of the static parts of the template string.
 * @param expressions a collection of the values of each placeholder in the template string.
 * @returns the translated string, with the `messageParts` and `expressions` interleaved together.
 */
export var $localize = function (messageParts) {
    var expressions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        expressions[_i - 1] = arguments[_i];
    }
    if ($localize.translate) {
        // Don't use array expansion here to avoid the compiler adding `__read()` helper unnecessarily.
        var translation = $localize.translate(messageParts, expressions);
        messageParts = translation[0];
        expressions = translation[1];
    }
    var message = stripBlock(messageParts[0], messageParts.raw[0]);
    for (var i = 1; i < messageParts.length; i++) {
        message += expressions[i - 1] + stripBlock(messageParts[i], messageParts.raw[i]);
    }
    return message;
};
var BLOCK_MARKER = ':';
/**
 * Strip a delimited "block" from the start of the `messagePart`, if it is found.
 *
 * If a marker character (:) actually appears in the content at the start of a tagged string or
 * after a substitution expression, where a block has not been provided the character must be
 * escaped with a backslash, `\:`. This function checks for this by looking at the `raw`
 * messagePart, which should still contain the backslash.
 *
 * @param messagePart The cooked message part to process.
 * @param rawMessagePart The raw message part to check.
 * @returns the message part with the placeholder name stripped, if found.
 * @throws an error if the block is unterminated
 */
function stripBlock(messagePart, rawMessagePart) {
    return rawMessagePart.charAt(0) === BLOCK_MARKER ?
        messagePart.substring(findEndOfBlock(messagePart, rawMessagePart) + 1) :
        messagePart;
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
function findEndOfBlock(cooked, raw) {
    /***********************************************************************************************
     * This function is repeated in `src/utils/messages.ts` and the two should be kept in sync.
     * The reason is that this file is marked as having side-effects, and if we import `messages.ts`
     * into it, the whole of `src/utils` will be included in this bundle and none of the functions
     * will be tree shaken.
     ***********************************************************************************************/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sb2NhbGl6ZS9zcmMvbG9jYWxpemUvc3JjL2xvY2FsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQXVDSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEZHO0FBQ0gsTUFBTSxDQUFDLElBQU0sU0FBUyxHQUFlLFVBQ2pDLFlBQWtDO0lBQUUscUJBQThCO1NBQTlCLFVBQThCLEVBQTlCLHFCQUE4QixFQUE5QixJQUE4QjtRQUE5QixvQ0FBOEI7O0lBQ3BFLElBQUksU0FBUyxDQUFDLFNBQVMsRUFBRTtRQUN2QiwrRkFBK0Y7UUFDL0YsSUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbkUsWUFBWSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlCO0lBQ0QsSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDNUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEY7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRixJQUFNLFlBQVksR0FBRyxHQUFHLENBQUM7QUFFekI7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsU0FBUyxVQUFVLENBQUMsV0FBbUIsRUFBRSxjQUFzQjtJQUM3RCxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLENBQUM7UUFDOUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsV0FBVyxDQUFDO0FBQ2xCLENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILFNBQVMsY0FBYyxDQUFDLE1BQWMsRUFBRSxHQUFXO0lBQ2pEOzs7OztxR0FLaUc7SUFDakcsS0FBSyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRTtRQUM5RixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDMUIsUUFBUSxFQUFFLENBQUM7U0FDWjthQUFNLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLFlBQVksRUFBRTtZQUMvQyxPQUFPLFdBQVcsQ0FBQztTQUNwQjtLQUNGO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBNkMsR0FBRyxRQUFJLENBQUMsQ0FBQztBQUN4RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsaXplRm4ge1xuICAobWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSwgLi4uZXhwcmVzc2lvbnM6IHJlYWRvbmx5IGFueVtdKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYW4gaW5wdXQgXCJtZXNzYWdlIHdpdGggZXhwcmVzc2lvbnNcIiBpbnRvIGEgdHJhbnNsYXRlZCBcIm1lc3NhZ2Ugd2l0aFxuICAgKiBleHByZXNzaW9uc1wiLlxuICAgKlxuICAgKiBUaGUgY29udmVyc2lvbiBtYXkgYmUgZG9uZSBpbiBwbGFjZSwgbW9kaWZ5aW5nIHRoZSBhcnJheSBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uLCBzb1xuICAgKiBkb24ndCBhc3N1bWUgdGhhdCB0aGlzIGhhcyBubyBzaWRlLWVmZmVjdHMuXG4gICAqXG4gICAqIFRoZSBleHByZXNzaW9ucyBtdXN0IGJlIHBhc3NlZCBpbiBzaW5jZSBpdCBtaWdodCBiZSB0aGV5IG5lZWQgdG8gYmUgcmVvcmRlcmVkIGZvclxuICAgKiBkaWZmZXJlbnQgdHJhbnNsYXRpb25zLlxuICAgKi9cbiAgdHJhbnNsYXRlPzogVHJhbnNsYXRlRm47XG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCBsb2NhbGUgb2YgdGhlIHRyYW5zbGF0ZWQgbWVzc2FnZXMuXG4gICAqXG4gICAqIFRoZSBjb21waWxlLXRpbWUgdHJhbnNsYXRpb24gaW5saW5lciBpcyBhYmxlIHRvIHJlcGxhY2UgdGhlIGZvbGxvd2luZyBjb2RlOlxuICAgKlxuICAgKiBgYGBcbiAgICogdHlwZW9mICRsb2NhbGl6ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAkbG9jYWxpemUubG9jYWxlXG4gICAqIGBgYFxuICAgKlxuICAgKiB3aXRoIGEgc3RyaW5nIGxpdGVyYWwgb2YgdGhlIGN1cnJlbnQgbG9jYWxlLiBFLmcuXG4gICAqXG4gICAqIGBgYFxuICAgKiBcImZyXCJcbiAgICogYGBgXG4gICAqL1xuICBsb2NhbGU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNsYXRlRm4ge1xuICAobWVzc2FnZVBhcnRzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSxcbiAgIGV4cHJlc3Npb25zOiByZWFkb25seSBhbnlbXSk6IFtUZW1wbGF0ZVN0cmluZ3NBcnJheSwgcmVhZG9ubHkgYW55W11dO1xufVxuXG4vKipcbiAqIFRhZyBhIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIGZvciBsb2NhbGl6YXRpb24uXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgc29tZSBzdHJpbmcgdG8gbG9jYWxpemVgXG4gKiBgYGBcbiAqXG4gKiAqKlByb3ZpZGluZyBtZWFuaW5nLCBkZXNjcmlwdGlvbiBhbmQgaWQqKlxuICpcbiAqIFlvdSBjYW4gb3B0aW9uYWxseSBzcGVjaWZ5IG9uZSBvciBtb3JlIG9mIGBtZWFuaW5nYCwgYGRlc2NyaXB0aW9uYCBhbmQgYGlkYCBmb3IgYSBsb2NhbGl6ZWRcbiAqIHN0cmluZyBieSBwcmUtcGVuZGluZyBpdCB3aXRoIGEgY29sb24gZGVsaW1pdGVkIGJsb2NrIG9mIHRoZSBmb3JtOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemVgOm1lYW5pbmd8ZGVzY3JpcHRpb25AQGlkOnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICpcbiAqICRsb2NhbGl6ZWA6bWVhbmluZ3w6c291cmNlIG1lc3NhZ2UgdGV4dGA7XG4gKiAkbG9jYWxpemVgOmRlc2NyaXB0aW9uOnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICogJGxvY2FsaXplYDpAQGlkOnNvdXJjZSBtZXNzYWdlIHRleHRgO1xuICogYGBgXG4gKlxuICogVGhpcyBmb3JtYXQgaXMgdGhlIHNhbWUgYXMgdGhhdCB1c2VkIGZvciBgaTE4bmAgbWFya2VycyBpbiBBbmd1bGFyIHRlbXBsYXRlcy4gU2VlIHRoZVxuICogW0FuZ3VsYXIgMThuIGd1aWRlXShndWlkZS9pMThuI3RlbXBsYXRlLXRyYW5zbGF0aW9ucykuXG4gKlxuICogKipOYW1pbmcgcGxhY2Vob2xkZXJzKipcbiAqXG4gKiBJZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgY29udGFpbnMgZXhwcmVzc2lvbnMsIHRoZW4gdGhlIGV4cHJlc3Npb25zIHdpbGwgYmUgYXV0b21hdGljYWxseVxuICogYXNzb2NpYXRlZCB3aXRoIHBsYWNlaG9sZGVyIG5hbWVzIGZvciB5b3UuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgSGkgJHtuYW1lfSEgVGhlcmUgYXJlICR7aXRlbXMubGVuZ3RofSBpdGVtcy5gO1xuICogYGBgXG4gKlxuICogd2lsbCBnZW5lcmF0ZSBhIG1lc3NhZ2Utc291cmNlIG9mIGBIaSB7JFBIfSEgVGhlcmUgYXJlIHskUEhfMX0gaXRlbXNgLlxuICpcbiAqIFRoZSByZWNvbW1lbmRlZCBwcmFjdGljZSBpcyB0byBuYW1lIHRoZSBwbGFjZWhvbGRlciBhc3NvY2lhdGVkIHdpdGggZWFjaCBleHByZXNzaW9uIHRob3VnaC5cbiAqXG4gKiBEbyB0aGlzIGJ5IHByb3ZpZGluZyB0aGUgcGxhY2Vob2xkZXIgbmFtZSB3cmFwcGVkIGluIGA6YCBjaGFyYWN0ZXJzIGRpcmVjdGx5IGFmdGVyIHRoZVxuICogZXhwcmVzc2lvbi4gVGhlc2UgcGxhY2Vob2xkZXIgbmFtZXMgYXJlIHN0cmlwcGVkIG91dCBvZiB0aGUgcmVuZGVyZWQgbG9jYWxpemVkIHN0cmluZy5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdG8gbmFtZSB0aGUgYGl0ZW1zLmxlbmd0aGAgZXhwcmVzc2lvbiBwbGFjZWhvbGRlciBgaXRlbUNvdW50YCB5b3Ugd3JpdGU6XG4gKlxuICogYGBgdHNcbiAqICRsb2NhbGl6ZSBgVGhlcmUgYXJlICR7aXRlbXMubGVuZ3RofTppdGVtQ291bnQ6IGl0ZW1zYDtcbiAqIGBgYFxuICpcbiAqICoqRXNjYXBpbmcgY29sb24gbWFya2VycyoqXG4gKlxuICogSWYgeW91IG5lZWQgdG8gdXNlIGEgYDpgIGNoYXJhY3RlciBkaXJlY3RseSBhdCB0aGUgc3RhcnQgb2YgYSB0YWdnZWQgc3RyaW5nIHRoYXQgaGFzIG5vXG4gKiBtZXRhZGF0YSBibG9jaywgb3IgZGlyZWN0bHkgYWZ0ZXIgYSBzdWJzdGl0dXRpb24gZXhwcmVzc2lvbiB0aGF0IGhhcyBubyBuYW1lIHlvdSBtdXN0IGVzY2FwZVxuICogdGhlIGA6YCBieSBwcmVjZWRpbmcgaXQgd2l0aCBhIGJhY2tzbGFzaDpcbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogLy8gbWVzc2FnZSBoYXMgYSBtZXRhZGF0YSBibG9jayBzbyBubyBuZWVkIHRvIGVzY2FwZSBjb2xvblxuICogJGxvY2FsaXplIGA6c29tZSBkZXNjcmlwdGlvbjo6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAqIC8vIG5vIG1ldGFkYXRhIGJsb2NrIHNvIHRoZSBjb2xvbiBtdXN0IGJlIGVzY2FwZWRcbiAqICRsb2NhbGl6ZSBgXFw6dGhpcyBtZXNzYWdlIHN0YXJ0cyB3aXRoIGEgY29sb24gKDopYDtcbiAqIGBgYFxuICpcbiAqIGBgYHRzXG4gKiAvLyBuYW1lZCBzdWJzdGl0dXRpb24gc28gbm8gbmVlZCB0byBlc2NhcGUgY29sb25cbiAqICRsb2NhbGl6ZSBgJHtsYWJlbH06bGFiZWw6OiAke31gXG4gKiAvLyBhbm9ueW1vdXMgc3Vic3RpdHV0aW9uIHNvIGNvbG9uIG11c3QgYmUgZXNjYXBlZFxuICogJGxvY2FsaXplIGAke2xhYmVsfVxcOiAke31gXG4gKiBgYGBcbiAqXG4gKiAqKlByb2Nlc3NpbmcgbG9jYWxpemVkIHN0cmluZ3M6KipcbiAqXG4gKiBUaGVyZSBhcmUgdGhyZWUgc2NlbmFyaW9zOlxuICpcbiAqICogKipjb21waWxlLXRpbWUgaW5saW5pbmcqKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyB0cmFuc2Zvcm1lZCBhdCBjb21waWxlIHRpbWUgYnkgYVxuICogdHJhbnNwaWxlciwgcmVtb3ZpbmcgdGhlIHRhZyBhbmQgcmVwbGFjaW5nIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHN0cmluZyB3aXRoIGEgdHJhbnNsYXRlZFxuICogbGl0ZXJhbCBzdHJpbmcgZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIHByb3ZpZGVkIHRvIHRoZSB0cmFuc3BpbGF0aW9uIHRvb2wuXG4gKlxuICogKiAqKnJ1bi10aW1lIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgcmVwbGFjZXMgYW5kXG4gKiByZW9yZGVycyB0aGUgcGFydHMgKHN0YXRpYyBzdHJpbmdzIGFuZCBleHByZXNzaW9ucykgb2YgdGhlIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGggc3RyaW5nc1xuICogZnJvbSBhIGNvbGxlY3Rpb24gb2YgdHJhbnNsYXRpb25zIGxvYWRlZCBhdCBydW4tdGltZS5cbiAqXG4gKiAqICoqcGFzcy10aHJvdWdoIGV2YWx1YXRpb24qKjogdGhlIGAkbG9jYWxpemVgIHRhZyBpcyBhIHJ1bi10aW1lIGZ1bmN0aW9uIHRoYXQgc2ltcGx5IGV2YWx1YXRlc1xuICogdGhlIG9yaWdpbmFsIHRlbXBsYXRlIGxpdGVyYWwgc3RyaW5nIHdpdGhvdXQgYXBwbHlpbmcgYW55IHRyYW5zbGF0aW9ucyB0byB0aGUgcGFydHMuIFRoaXNcbiAqIHZlcnNpb24gaXMgdXNlZCBkdXJpbmcgZGV2ZWxvcG1lbnQgb3Igd2hlcmUgdGhlcmUgaXMgbm8gbmVlZCB0byB0cmFuc2xhdGUgdGhlIGxvY2FsaXplZFxuICogdGVtcGxhdGUgbGl0ZXJhbHMuXG4gKiBAcGFyYW0gbWVzc2FnZVBhcnRzIGEgY29sbGVjdGlvbiBvZiB0aGUgc3RhdGljIHBhcnRzIG9mIHRoZSB0ZW1wbGF0ZSBzdHJpbmcuXG4gKiBAcGFyYW0gZXhwcmVzc2lvbnMgYSBjb2xsZWN0aW9uIG9mIHRoZSB2YWx1ZXMgb2YgZWFjaCBwbGFjZWhvbGRlciBpbiB0aGUgdGVtcGxhdGUgc3RyaW5nLlxuICogQHJldHVybnMgdGhlIHRyYW5zbGF0ZWQgc3RyaW5nLCB3aXRoIHRoZSBgbWVzc2FnZVBhcnRzYCBhbmQgYGV4cHJlc3Npb25zYCBpbnRlcmxlYXZlZCB0b2dldGhlci5cbiAqL1xuZXhwb3J0IGNvbnN0ICRsb2NhbGl6ZTogTG9jYWxpemVGbiA9IGZ1bmN0aW9uKFxuICAgIG1lc3NhZ2VQYXJ0czogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLmV4cHJlc3Npb25zOiByZWFkb25seSBhbnlbXSkge1xuICBpZiAoJGxvY2FsaXplLnRyYW5zbGF0ZSkge1xuICAgIC8vIERvbid0IHVzZSBhcnJheSBleHBhbnNpb24gaGVyZSB0byBhdm9pZCB0aGUgY29tcGlsZXIgYWRkaW5nIGBfX3JlYWQoKWAgaGVscGVyIHVubmVjZXNzYXJpbHkuXG4gICAgY29uc3QgdHJhbnNsYXRpb24gPSAkbG9jYWxpemUudHJhbnNsYXRlKG1lc3NhZ2VQYXJ0cywgZXhwcmVzc2lvbnMpO1xuICAgIG1lc3NhZ2VQYXJ0cyA9IHRyYW5zbGF0aW9uWzBdO1xuICAgIGV4cHJlc3Npb25zID0gdHJhbnNsYXRpb25bMV07XG4gIH1cbiAgbGV0IG1lc3NhZ2UgPSBzdHJpcEJsb2NrKG1lc3NhZ2VQYXJ0c1swXSwgbWVzc2FnZVBhcnRzLnJhd1swXSk7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWVzc2FnZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWVzc2FnZSArPSBleHByZXNzaW9uc1tpIC0gMV0gKyBzdHJpcEJsb2NrKG1lc3NhZ2VQYXJ0c1tpXSwgbWVzc2FnZVBhcnRzLnJhd1tpXSk7XG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2U7XG59O1xuXG5jb25zdCBCTE9DS19NQVJLRVIgPSAnOic7XG5cbi8qKlxuICogU3RyaXAgYSBkZWxpbWl0ZWQgXCJibG9ja1wiIGZyb20gdGhlIHN0YXJ0IG9mIHRoZSBgbWVzc2FnZVBhcnRgLCBpZiBpdCBpcyBmb3VuZC5cbiAqXG4gKiBJZiBhIG1hcmtlciBjaGFyYWN0ZXIgKDopIGFjdHVhbGx5IGFwcGVhcnMgaW4gdGhlIGNvbnRlbnQgYXQgdGhlIHN0YXJ0IG9mIGEgdGFnZ2VkIHN0cmluZyBvclxuICogYWZ0ZXIgYSBzdWJzdGl0dXRpb24gZXhwcmVzc2lvbiwgd2hlcmUgYSBibG9jayBoYXMgbm90IGJlZW4gcHJvdmlkZWQgdGhlIGNoYXJhY3RlciBtdXN0IGJlXG4gKiBlc2NhcGVkIHdpdGggYSBiYWNrc2xhc2gsIGBcXDpgLiBUaGlzIGZ1bmN0aW9uIGNoZWNrcyBmb3IgdGhpcyBieSBsb29raW5nIGF0IHRoZSBgcmF3YFxuICogbWVzc2FnZVBhcnQsIHdoaWNoIHNob3VsZCBzdGlsbCBjb250YWluIHRoZSBiYWNrc2xhc2guXG4gKlxuICogQHBhcmFtIG1lc3NhZ2VQYXJ0IFRoZSBjb29rZWQgbWVzc2FnZSBwYXJ0IHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0gcmF3TWVzc2FnZVBhcnQgVGhlIHJhdyBtZXNzYWdlIHBhcnQgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB0aGUgbWVzc2FnZSBwYXJ0IHdpdGggdGhlIHBsYWNlaG9sZGVyIG5hbWUgc3RyaXBwZWQsIGlmIGZvdW5kLlxuICogQHRocm93cyBhbiBlcnJvciBpZiB0aGUgYmxvY2sgaXMgdW50ZXJtaW5hdGVkXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQmxvY2sobWVzc2FnZVBhcnQ6IHN0cmluZywgcmF3TWVzc2FnZVBhcnQ6IHN0cmluZykge1xuICByZXR1cm4gcmF3TWVzc2FnZVBhcnQuY2hhckF0KDApID09PSBCTE9DS19NQVJLRVIgP1xuICAgICAgbWVzc2FnZVBhcnQuc3Vic3RyaW5nKGZpbmRFbmRPZkJsb2NrKG1lc3NhZ2VQYXJ0LCByYXdNZXNzYWdlUGFydCkgKyAxKSA6XG4gICAgICBtZXNzYWdlUGFydDtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBlbmQgb2YgYSBcIm1hcmtlZCBibG9ja1wiIGluZGljYXRlZCBieSB0aGUgZmlyc3Qgbm9uLWVzY2FwZWQgY29sb24uXG4gKlxuICogQHBhcmFtIGNvb2tlZCBUaGUgY29va2VkIHN0cmluZyAod2hlcmUgZXNjYXBlZCBjaGFycyBoYXZlIGJlZW4gcHJvY2Vzc2VkKVxuICogQHBhcmFtIHJhdyBUaGUgcmF3IHN0cmluZyAod2hlcmUgZXNjYXBlIHNlcXVlbmNlcyBhcmUgc3RpbGwgaW4gcGxhY2UpXG4gKlxuICogQHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBlbmQgb2YgYmxvY2sgbWFya2VyXG4gKiBAdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBibG9jayBpcyB1bnRlcm1pbmF0ZWRcbiAqL1xuZnVuY3Rpb24gZmluZEVuZE9mQmxvY2soY29va2VkOiBzdHJpbmcsIHJhdzogc3RyaW5nKTogbnVtYmVyIHtcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgcmVwZWF0ZWQgaW4gYHNyYy91dGlscy9tZXNzYWdlcy50c2AgYW5kIHRoZSB0d28gc2hvdWxkIGJlIGtlcHQgaW4gc3luYy5cbiAgICogVGhlIHJlYXNvbiBpcyB0aGF0IHRoaXMgZmlsZSBpcyBtYXJrZWQgYXMgaGF2aW5nIHNpZGUtZWZmZWN0cywgYW5kIGlmIHdlIGltcG9ydCBgbWVzc2FnZXMudHNgXG4gICAqIGludG8gaXQsIHRoZSB3aG9sZSBvZiBgc3JjL3V0aWxzYCB3aWxsIGJlIGluY2x1ZGVkIGluIHRoaXMgYnVuZGxlIGFuZCBub25lIG9mIHRoZSBmdW5jdGlvbnNcbiAgICogd2lsbCBiZSB0cmVlIHNoYWtlbi5cbiAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICBmb3IgKGxldCBjb29rZWRJbmRleCA9IDEsIHJhd0luZGV4ID0gMTsgY29va2VkSW5kZXggPCBjb29rZWQubGVuZ3RoOyBjb29rZWRJbmRleCsrLCByYXdJbmRleCsrKSB7XG4gICAgaWYgKHJhd1tyYXdJbmRleF0gPT09ICdcXFxcJykge1xuICAgICAgcmF3SW5kZXgrKztcbiAgICB9IGVsc2UgaWYgKGNvb2tlZFtjb29rZWRJbmRleF0gPT09IEJMT0NLX01BUktFUikge1xuICAgICAgcmV0dXJuIGNvb2tlZEluZGV4O1xuICAgIH1cbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYFVudGVybWluYXRlZCAkbG9jYWxpemUgbWV0YWRhdGEgYmxvY2sgaW4gXCIke3Jhd31cIi5gKTtcbn0iXX0=