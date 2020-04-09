/**
 * @license Angular v9.0.7
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */

import { computeMsgId } from '@angular/compiler';
export { computeMsgId as ɵcomputeMsgId } from '@angular/compiler';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * The character used to mark the start and end of a "block" in a `$localize` tagged string.
 * A block can indicate metadata about the message or specify a name of a placeholder for a
 * substitution expressions.
 *
 * For example:
 *
 * ```ts
 * $localize`Hello, ${title}:title:!`;
 * $localize`:meaning|description@@id:source message text`;
 * ```
 */
const BLOCK_MARKER = ':';
/**
 * The marker used to separate a message's "meaning" from its "description" in a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:correct|Indicates that the user got the answer correct: Right!`;
 * $localize `:movement|Button label for moving to the right: Right!`;
 * ```
 */
const MEANING_SEPARATOR = '|';
/**
 * The marker used to separate a message's custom "id" from its "description" in a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:A welcome message on the home page@@myApp-homepage-welcome: Welcome!`;
 * ```
 */
const ID_SEPARATOR = '@@';
/**
 * The marker used to separate legacy message ids from the rest of a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:@@custom-id␟2df64767cd895a8fabe3e18b94b5b6b6f9e2e3f0: Welcome!`;
 * ```
 *
 * Note that this character is the "symbol for the unit separator" (␟) not the "unit separator
 * character" itself, since that has no visual representation. See https://graphemica.com/%E2%90%9F.
 *
 * Here is some background for the original "unit separator character":
 * https://stackoverflow.com/questions/8695118/whats-the-file-group-record-unit-separator-control-characters-and-its-usage
 */
const LEGACY_ID_INDICATOR = '\u241F';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Parse a `$localize` tagged string into a structure that can be used for translation.
 *
 * See `ParsedMessage` for an example.
 */
function parseMessage(messageParts, expressions) {
    const substitutions = {};
    const metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
    const cleanedMessageParts = [metadata.text];
    const placeholderNames = [];
    let messageString = metadata.text;
    for (let i = 1; i < messageParts.length; i++) {
        const { text: messagePart, block: placeholderName = computePlaceholderName(i) } = splitBlock(messageParts[i], messageParts.raw[i]);
        messageString += `{$${placeholderName}}${messagePart}`;
        if (expressions !== undefined) {
            substitutions[placeholderName] = expressions[i - 1];
        }
        placeholderNames.push(placeholderName);
        cleanedMessageParts.push(messagePart);
    }
    const messageId = metadata.id || computeMsgId(messageString, metadata.meaning || '');
    const legacyIds = metadata.legacyIds.filter(id => id !== messageId);
    return {
        messageId,
        legacyIds,
        substitutions,
        messageString,
        meaning: metadata.meaning || '',
        description: metadata.description || '',
        messageParts: cleanedMessageParts, placeholderNames,
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
function parseMetadata(cooked, raw) {
    const { text, block } = splitBlock(cooked, raw);
    if (block === undefined) {
        return { text, meaning: undefined, description: undefined, id: undefined, legacyIds: [] };
    }
    else {
        const [meaningDescAndId, ...legacyIds] = block.split(LEGACY_ID_INDICATOR);
        const [meaningAndDesc, id] = meaningDescAndId.split(ID_SEPARATOR, 2);
        let [meaning, description] = meaningAndDesc.split(MEANING_SEPARATOR, 2);
        if (description === undefined) {
            description = meaning;
            meaning = undefined;
        }
        if (description === '') {
            description = undefined;
        }
        return { text, meaning, description, id, legacyIds };
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
function splitBlock(cooked, raw) {
    if (raw.charAt(0) !== BLOCK_MARKER) {
        return { text: cooked };
    }
    else {
        const endOfBlock = findEndOfBlock(cooked, raw);
        return {
            block: cooked.substring(1, endOfBlock),
            text: cooked.substring(endOfBlock + 1),
        };
    }
}
function computePlaceholderName(index) {
    return index === 1 ? 'PH' : `PH_${index - 1}`;
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
    /************************************************************************************************
    * This function is repeated in `src/localize/src/localize.ts` and the two should be kept in sync.
    * (See that file for more explanation of why.)
    ************************************************************************************************/
    for (let cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
        if (raw[rawIndex] === '\\') {
            rawIndex++;
        }
        else if (cooked[cookedIndex] === BLOCK_MARKER) {
            return cookedIndex;
        }
    }
    throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class MissingTranslationError extends Error {
    constructor(parsedMessage) {
        super(`No translation found for ${describeMessage(parsedMessage)}.`);
        this.parsedMessage = parsedMessage;
        this.type = 'MissingTranslationError';
    }
}
function isMissingTranslationError(e) {
    return e.type === 'MissingTranslationError';
}
/**
 * Translate the text of the `$localize` tagged-string (i.e. `messageParts` and
 * `substitutions`) using the given `translations`.
 *
 * The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
 * `ParsedTranslation`. If this doesn't match and there are legacy ids then try matching a
 * translation using those.
 *
 * If one is found then it is used to translate the message into a new set of `messageParts` and
 * `substitutions`.
 * The translation may reorder (or remove) substitutions as appropriate.
 *
 * If there is no translation with a matching message id then an error is thrown.
 * If a translation contains a placeholder that is not found in the message being translated then an
 * error is thrown.
 */
function translate(translations, messageParts, substitutions) {
    const message = parseMessage(messageParts, substitutions);
    // Look up the translation using the messageId, and then the legacyId if available.
    let translation = translations[message.messageId];
    // If the messageId did not match a translation, try matching the legacy ids instead
    for (let i = 0; i < message.legacyIds.length && translation === undefined; i++) {
        translation = translations[message.legacyIds[i]];
    }
    if (translation === undefined) {
        throw new MissingTranslationError(message);
    }
    return [
        translation.messageParts, translation.placeholderNames.map(placeholder => {
            if (message.substitutions.hasOwnProperty(placeholder)) {
                return message.substitutions[placeholder];
            }
            else {
                throw new Error(`There is a placeholder name mismatch with the translation provided for the message ${describeMessage(message)}.\n` +
                    `The translation contains a placeholder with name ${placeholder}, which does not exist in the message.`);
            }
        })
    ];
}
/**
 * Parse the `messageParts` and `placeholderNames` out of a target `message`.
 *
 * Used by `loadTranslations()` to convert target message strings into a structure that is more
 * appropriate for doing translation.
 *
 * @param message the message to be parsed.
 */
function parseTranslation(message) {
    const parts = message.split(/{\$([^}]*)}/);
    const messageParts = [parts[0]];
    const placeholderNames = [];
    for (let i = 1; i < parts.length - 1; i += 2) {
        placeholderNames.push(parts[i]);
        messageParts.push(`${parts[i + 1]}`);
    }
    const rawMessageParts = messageParts.map(part => part.charAt(0) === BLOCK_MARKER ? '\\' + part : part);
    return { messageParts: makeTemplateObject(messageParts, rawMessageParts), placeholderNames };
}
/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * @param messageParts The message parts to appear in the ParsedTranslation.
 * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
 */
function makeParsedTranslation(messageParts, placeholderNames = []) {
    return { messageParts: makeTemplateObject(messageParts, messageParts), placeholderNames };
}
/**
 * Create the specialized array that is passed to tagged-string tag functions.
 *
 * @param cooked The message parts with their escape codes processed.
 * @param raw The message parts with their escaped codes as-is.
 */
function makeTemplateObject(cooked, raw) {
    Object.defineProperty(cooked, 'raw', { value: raw });
    return cooked;
}
function describeMessage(message) {
    const meaningString = message.meaning && ` - "${message.meaning}"`;
    return `"${message.messageId}" ("${message.messageString}"${meaningString})`;
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Load translations for `$localize`.
 *
 * The given `translations` are processed and added to a lookup based on their `MessageId`.
 * A new translation will overwrite a previous translation if it has the same `MessageId`.
 *
 * * If a message is generated by the Angular compiler from an `i18n` marker in a template, the
 *   `MessageId` is passed through to the `$localize` call as a custom `MessageId`. The `MessageId`
 *   will match what is extracted into translation files.
 *
 * * If the translation is from a call to `$localize` in application code, and no custom `MessageId`
 *   is provided, then the `MessageId` can be generated by passing the tagged string message-parts
 *   to the `parseMessage()` function (not currently public API).
 *
 * @publicApi
 *
 */
function loadTranslations(translations) {
    // Ensure the translate function exists
    if (!$localize.translate) {
        $localize.translate = translate$1;
    }
    if (!$localize.TRANSLATIONS) {
        $localize.TRANSLATIONS = {};
    }
    Object.keys(translations).forEach(key => {
        $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
    });
}
/**
 * Remove all translations for `$localize`.
 *
 * @publicApi
 */
function clearTranslations() {
    $localize.translate = undefined;
    $localize.TRANSLATIONS = {};
}
/**
 * Translate the text of the given message, using the loaded translations.
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 */
function translate$1(messageParts, substitutions) {
    try {
        return translate($localize.TRANSLATIONS, messageParts, substitutions);
    }
    catch (e) {
        console.warn(e.message);
        return [messageParts, substitutions];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { clearTranslations, loadTranslations, MissingTranslationError as ɵMissingTranslationError, findEndOfBlock as ɵfindEndOfBlock, isMissingTranslationError as ɵisMissingTranslationError, makeParsedTranslation as ɵmakeParsedTranslation, makeTemplateObject as ɵmakeTemplateObject, parseMessage as ɵparseMessage, parseMetadata as ɵparseMetadata, parseTranslation as ɵparseTranslation, splitBlock as ɵsplitBlock, translate as ɵtranslate };
//# sourceMappingURL=localize.js.map
