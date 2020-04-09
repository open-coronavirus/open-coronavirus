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
export var BLOCK_MARKER = ':';
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
export var MEANING_SEPARATOR = '|';
/**
 * The marker used to separate a message's custom "id" from its "description" in a metadata block.
 *
 * For example:
 *
 * ```ts
 * $localize `:A welcome message on the home page@@myApp-homepage-welcome: Welcome!`;
 * ```
 */
export var ID_SEPARATOR = '@@';
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
export var LEGACY_ID_INDICATOR = '\u241F';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbG9jYWxpemUvc3JjL3V0aWxzL3NyYy9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLENBQUMsSUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBRWhDOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sQ0FBQyxJQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUVyQzs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sQ0FBQyxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUM7QUFFakM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLENBQUMsSUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogVGhlIGNoYXJhY3RlciB1c2VkIHRvIG1hcmsgdGhlIHN0YXJ0IGFuZCBlbmQgb2YgYSBcImJsb2NrXCIgaW4gYSBgJGxvY2FsaXplYCB0YWdnZWQgc3RyaW5nLlxuICogQSBibG9jayBjYW4gaW5kaWNhdGUgbWV0YWRhdGEgYWJvdXQgdGhlIG1lc3NhZ2Ugb3Igc3BlY2lmeSBhIG5hbWUgb2YgYSBwbGFjZWhvbGRlciBmb3IgYVxuICogc3Vic3RpdHV0aW9uIGV4cHJlc3Npb25zLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemVgSGVsbG8sICR7dGl0bGV9OnRpdGxlOiFgO1xuICogJGxvY2FsaXplYDptZWFuaW5nfGRlc2NyaXB0aW9uQEBpZDpzb3VyY2UgbWVzc2FnZSB0ZXh0YDtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgQkxPQ0tfTUFSS0VSID0gJzonO1xuXG4vKipcbiAqIFRoZSBtYXJrZXIgdXNlZCB0byBzZXBhcmF0ZSBhIG1lc3NhZ2UncyBcIm1lYW5pbmdcIiBmcm9tIGl0cyBcImRlc2NyaXB0aW9uXCIgaW4gYSBtZXRhZGF0YSBibG9jay5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGA6Y29ycmVjdHxJbmRpY2F0ZXMgdGhhdCB0aGUgdXNlciBnb3QgdGhlIGFuc3dlciBjb3JyZWN0OiBSaWdodCFgO1xuICogJGxvY2FsaXplIGA6bW92ZW1lbnR8QnV0dG9uIGxhYmVsIGZvciBtb3ZpbmcgdG8gdGhlIHJpZ2h0OiBSaWdodCFgO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBNRUFOSU5HX1NFUEFSQVRPUiA9ICd8JztcblxuLyoqXG4gKiBUaGUgbWFya2VyIHVzZWQgdG8gc2VwYXJhdGUgYSBtZXNzYWdlJ3MgY3VzdG9tIFwiaWRcIiBmcm9tIGl0cyBcImRlc2NyaXB0aW9uXCIgaW4gYSBtZXRhZGF0YSBibG9jay5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogJGxvY2FsaXplIGA6QSB3ZWxjb21lIG1lc3NhZ2Ugb24gdGhlIGhvbWUgcGFnZUBAbXlBcHAtaG9tZXBhZ2Utd2VsY29tZTogV2VsY29tZSFgO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBJRF9TRVBBUkFUT1IgPSAnQEAnO1xuXG4vKipcbiAqIFRoZSBtYXJrZXIgdXNlZCB0byBzZXBhcmF0ZSBsZWdhY3kgbWVzc2FnZSBpZHMgZnJvbSB0aGUgcmVzdCBvZiBhIG1ldGFkYXRhIGJsb2NrLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAkbG9jYWxpemUgYDpAQGN1c3RvbS1pZOKQnzJkZjY0NzY3Y2Q4OTVhOGZhYmUzZTE4Yjk0YjViNmI2ZjllMmUzZjA6IFdlbGNvbWUhYDtcbiAqIGBgYFxuICpcbiAqIE5vdGUgdGhhdCB0aGlzIGNoYXJhY3RlciBpcyB0aGUgXCJzeW1ib2wgZm9yIHRoZSB1bml0IHNlcGFyYXRvclwiICjikJ8pIG5vdCB0aGUgXCJ1bml0IHNlcGFyYXRvclxuICogY2hhcmFjdGVyXCIgaXRzZWxmLCBzaW5jZSB0aGF0IGhhcyBubyB2aXN1YWwgcmVwcmVzZW50YXRpb24uIFNlZSBodHRwczovL2dyYXBoZW1pY2EuY29tLyVFMiU5MCU5Ri5cbiAqXG4gKiBIZXJlIGlzIHNvbWUgYmFja2dyb3VuZCBmb3IgdGhlIG9yaWdpbmFsIFwidW5pdCBzZXBhcmF0b3IgY2hhcmFjdGVyXCI6XG4gKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy84Njk1MTE4L3doYXRzLXRoZS1maWxlLWdyb3VwLXJlY29yZC11bml0LXNlcGFyYXRvci1jb250cm9sLWNoYXJhY3RlcnMtYW5kLWl0cy11c2FnZVxuICovXG5leHBvcnQgY29uc3QgTEVHQUNZX0lEX0lORElDQVRPUiA9ICdcXHUyNDFGJztcbiJdfQ==