(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics", ["require", "exports", "typescript", "@angular/compiler-cli/src/ngtsc/util/src/typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("typescript");
    var typescript_1 = require("@angular/compiler-cli/src/ngtsc/util/src/typescript");
    /**
     * Translates a `ParseSpan` into an `AbsoluteSpan` by incorporating the location information that
     * the `ParseSourceSpan` represents.
     */
    function toAbsoluteSpan(span, sourceSpan) {
        var offset = sourceSpan.start.offset;
        return { start: span.start + offset, end: span.end + offset };
    }
    exports.toAbsoluteSpan = toAbsoluteSpan;
    /**
     * Wraps the node in parenthesis such that inserted span comments become attached to the proper
     * node. This is an alias for `ts.createParen` with the benefit that it signifies that the
     * inserted parenthesis are for diagnostic purposes, not for correctness of the rendered TCB code.
     *
     * Note that it is important that nodes and its attached comment are not wrapped into parenthesis
     * by default, as it prevents correct translation of e.g. diagnostics produced for incorrect method
     * arguments. Such diagnostics would then be produced for the parenthesised node whereas the
     * positional comment would be located within that node, resulting in a mismatch.
     */
    function wrapForDiagnostics(expr) {
        return ts.createParen(expr);
    }
    exports.wrapForDiagnostics = wrapForDiagnostics;
    /**
     * Adds a synthetic comment to the expression that represents the parse span of the provided node.
     * This comment can later be retrieved as trivia of a node to recover original source locations.
     */
    function addParseSpanInfo(node, span) {
        var commentText;
        if (isAbsoluteSpan(span)) {
            commentText = span.start + "," + span.end;
        }
        else {
            commentText = span.start.offset + "," + span.end.offset;
        }
        ts.addSyntheticTrailingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, commentText, 
        /* hasTrailingNewLine */ false);
    }
    exports.addParseSpanInfo = addParseSpanInfo;
    function isAbsoluteSpan(span) {
        return typeof span.start === 'number';
    }
    /**
     * Adds a synthetic comment to the function declaration that contains the source location
     * of the class declaration.
     */
    function addSourceReferenceName(tcb, source) {
        var commentText = getSourceReferenceName(source);
        ts.addSyntheticLeadingComment(tcb, ts.SyntaxKind.MultiLineCommentTrivia, commentText, true);
    }
    exports.addSourceReferenceName = addSourceReferenceName;
    function getSourceReferenceName(source) {
        var fileName = typescript_1.getSourceFile(source).fileName;
        return fileName + "#" + source.name.text;
    }
    exports.getSourceReferenceName = getSourceReferenceName;
    /**
     * Determines if the diagnostic should be reported. Some diagnostics are produced because of the
     * way TCBs are generated; those diagnostics should not be reported as type check errors of the
     * template.
     */
    function shouldReportDiagnostic(diagnostic) {
        var code = diagnostic.code;
        if (code === 6133 /* $var is declared but its value is never read. */) {
            return false;
        }
        else if (code === 6199 /* All variables are unused. */) {
            return false;
        }
        else if (code === 2695 /* Left side of comma operator is unused and has no side effects. */) {
            return false;
        }
        return true;
    }
    exports.shouldReportDiagnostic = shouldReportDiagnostic;
    /**
     * Attempts to translate a TypeScript diagnostic produced during template type-checking to their
     * location of origin, based on the comments that are emitted in the TCB code.
     *
     * If the diagnostic could not be translated, `null` is returned to indicate that the diagnostic
     * should not be reported at all. This prevents diagnostics from non-TCB code in a user's source
     * file from being reported as type-check errors.
     */
    function translateDiagnostic(diagnostic, resolveParseSource) {
        if (diagnostic.file === undefined || diagnostic.start === undefined) {
            return null;
        }
        // Locate the node that the diagnostic is reported on and determine its location in the source.
        var node = typescript_1.getTokenAtPosition(diagnostic.file, diagnostic.start);
        var sourceLocation = findSourceLocation(node, diagnostic.file);
        if (sourceLocation === null) {
            return null;
        }
        // Now use the external resolver to obtain the full `ParseSourceFile` of the template.
        var span = resolveParseSource(sourceLocation);
        if (span === null) {
            return null;
        }
        var messageText;
        if (typeof diagnostic.messageText === 'string') {
            messageText = diagnostic.messageText;
        }
        else {
            messageText = diagnostic.messageText.messageText;
        }
        return {
            source: 'angular',
            code: diagnostic.code,
            category: diagnostic.category, messageText: messageText, span: span,
        };
    }
    exports.translateDiagnostic = translateDiagnostic;
    function findSourceLocation(node, sourceFile) {
        // Search for comments until the TCB's function declaration is encountered.
        while (node !== undefined && !ts.isFunctionDeclaration(node)) {
            var parseSpan = ts.forEachTrailingCommentRange(sourceFile.text, node.getEnd(), function (pos, end, kind) {
                if (kind !== ts.SyntaxKind.MultiLineCommentTrivia) {
                    return null;
                }
                var commentText = sourceFile.text.substring(pos, end);
                return parseParseSpanComment(commentText);
            }) || null;
            if (parseSpan !== null) {
                // Once the positional information has been extracted, search further up the TCB to extract
                // the file information that is attached with the TCB's function declaration.
                return toSourceLocation(parseSpan, node, sourceFile);
            }
            node = node.parent;
        }
        return null;
    }
    function toSourceLocation(parseSpan, node, sourceFile) {
        // Walk up to the function declaration of the TCB, the file information is attached there.
        var tcb = node;
        while (!ts.isFunctionDeclaration(tcb)) {
            tcb = tcb.parent;
            // Bail once we have reached the root.
            if (tcb === undefined) {
                return null;
            }
        }
        var sourceReference = ts.forEachLeadingCommentRange(sourceFile.text, tcb.getFullStart(), function (pos, end, kind) {
            if (kind !== ts.SyntaxKind.MultiLineCommentTrivia) {
                return null;
            }
            var commentText = sourceFile.text.substring(pos, end);
            return commentText.substring(2, commentText.length - 2);
        }) || null;
        if (sourceReference === null) {
            return null;
        }
        return {
            sourceReference: sourceReference,
            start: parseSpan.start,
            end: parseSpan.end,
        };
    }
    var parseSpanComment = /^\/\*(\d+),(\d+)\*\/$/;
    function parseParseSpanComment(commentText) {
        var match = commentText.match(parseSpanComment);
        if (match === null) {
            return null;
        }
        return { start: +match[1], end: +match[2] };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3R5cGVjaGVjay9zcmMvZGlhZ25vc3RpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFRQSwrQkFBaUM7SUFHakMsa0ZBQTRFO0lBdUM1RTs7O09BR0c7SUFDSCxTQUFnQixjQUFjLENBQUMsSUFBZSxFQUFFLFVBQTJCO1FBQ3pFLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3ZDLE9BQXFCLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sRUFBQyxDQUFDO0lBQzVFLENBQUM7SUFIRCx3Q0FHQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILFNBQWdCLGtCQUFrQixDQUFDLElBQW1CO1FBQ3BELE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRkQsZ0RBRUM7SUFFRDs7O09BR0c7SUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxJQUFhLEVBQUUsSUFBb0M7UUFDbEYsSUFBSSxXQUFtQixDQUFDO1FBQ3hCLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hCLFdBQVcsR0FBTSxJQUFJLENBQUMsS0FBSyxTQUFJLElBQUksQ0FBQyxHQUFLLENBQUM7U0FDM0M7YUFBTTtZQUNMLFdBQVcsR0FBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQVEsQ0FBQztTQUN6RDtRQUNELEVBQUUsQ0FBQywyQkFBMkIsQ0FDMUIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUUsV0FBVztRQUN2RCx3QkFBd0Is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LHNCQUFzQixFQUFFO2dCQUNqRCxPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDZixJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU87WUFDTCxlQUFlLGlCQUFBO1lBQ2YsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLO1lBQ3RCLEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRztTQUNuQixDQUFDO0lBQ0osQ0FBQztJQUVELElBQU0sZ0JBQWdCLEdBQUcsdUJBQXVCLENBQUM7SUFFakQsU0FBUyxxQkFBcUIsQ0FBQyxXQUFtQjtRQUNoRCxJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbEQsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO0lBQzVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1BhcnNlU291cmNlU3BhbiwgUGFyc2VTcGFuLCBQb3NpdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Q2xhc3NEZWNsYXJhdGlvbn0gZnJvbSAnLi4vLi4vcmVmbGVjdGlvbic7XG5pbXBvcnQge2dldFNvdXJjZUZpbGUsIGdldFRva2VuQXRQb3NpdGlvbn0gZnJvbSAnLi4vLi4vdXRpbC9zcmMvdHlwZXNjcmlwdCc7XG5cbi8qKlxuICogRklYTUU6IFRha2VuIGZyb20gcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvYXBpLnRzIHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwLFxuICogIG1vZGlmaWVkIHRvIGFjY291bnQgZm9yIG5ldyBzcGFuIG5vdGF0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERpYWdub3N0aWNNZXNzYWdlQ2hhaW4ge1xuICBtZXNzYWdlVGV4dDogc3RyaW5nO1xuICBwb3NpdGlvbj86IFBvc2l0aW9uO1xuICBuZXh0PzogRGlhZ25vc3RpY01lc3NhZ2VDaGFpbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEaWFnbm9zdGljIHtcbiAgbWVzc2FnZVRleHQ6IHN0cmluZztcbiAgc3Bhbj86IFBhcnNlU291cmNlU3BhbjtcbiAgcG9zaXRpb24/OiBQb3NpdGlvbjtcbiAgY2hhaW4/OiBEaWFnbm9zdGljTWVzc2FnZUNoYWluO1xuICBjYXRlZ29yeTogdHMuRGlhZ25vc3RpY0NhdGVnb3J5O1xuICBjb2RlOiBudW1iZXI7XG4gIHNvdXJjZTogJ2FuZ3VsYXInO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZUxvY2F0aW9uIHtcbiAgc291cmNlUmVmZXJlbmNlOiBzdHJpbmc7XG4gIHN0YXJ0OiBudW1iZXI7XG4gIGVuZDogbnVtYmVyO1xufVxuXG4vKipcbiAqIEFuIGBBYnNvbHV0ZVNwYW5gIGlzIHRoZSByZXN1bHQgb2YgdHJhbnNsYXRpbmcgdGhlIGBQYXJzZVNwYW5gIG9mIGBBU1RgIHRlbXBsYXRlIGV4cHJlc3Npb24gbm9kZXNcbiAqIHRvIHRoZWlyIGFic29sdXRlIHBvc2l0aW9ucywgYXMgdGhlIGBQYXJzZVNwYW5gIGlzIGFsd2F5cyByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhlXG4gKiBleHByZXNzaW9uLCBub3QgdGhlIGZ1bGwgdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJzb2x1dGVTcGFuIHtcbiAgX19icmFuZF9fOiAnQWJzb2x1dGVTcGFuJztcbiAgc3RhcnQ6IG51bWJlcjtcbiAgZW5kOiBudW1iZXI7XG59XG5cbi8qKlxuICogVHJhbnNsYXRlcyBhIGBQYXJzZVNwYW5gIGludG8gYW4gYEFic29sdXRlU3BhbmAgYnkgaW5jb3Jwb3JhdGluZyB0aGUgbG9jYXRpb24gaW5mb3JtYXRpb24gdGhhdFxuICogdGhlIGBQYXJzZVNvdXJjZVNwYW5gIHJlcHJlc2VudHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0Fic29sdXRlU3BhbihzcGFuOiBQYXJzZVNwYW4sIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbik6IEFic29sdXRlU3BhbiB7XG4gIGNvbnN0IG9mZnNldCA9IHNvdXJjZVNwYW4uc3RhcnQub2Zmc2V0O1xuICByZXR1cm4gPEFic29sdXRlU3Bhbj57c3RhcnQ6IHNwYW4uc3RhcnQgKyBvZmZzZXQsIGVuZDogc3Bhbi5lbmQgKyBvZmZzZXR9O1xufVxuXG4vKipcbiAqIFdyYXBzIHRoZSBub2RlIGluIHBhcmVudGhlc2lzIHN1Y2ggdGhhdCBpbnNlcnRlZCBzcGFuIGNvbW1lbnRzIGJlY29tZSBhdHRhY2hlZCB0byB0aGUgcHJvcGVyXG4gKiBub2RlLiBUaGlzIGlzIGFuIGFsaWFzIGZvciBgdHMuY3JlYXRlUGFyZW5gIHdpdGggdGhlIGJlbmVmaXQgdGhhdCBpdCBzaWduaWZpZXMgdGhhdCB0aGVcbiAqIGluc2VydGVkIHBhcmVudGhlc2lzIGFyZSBmb3IgZGlhZ25vc3RpYyBwdXJwb3Nlcywgbm90IGZvciBjb3JyZWN0bmVzcyBvZiB0aGUgcmVuZGVyZWQgVENCIGNvZGUuXG4gKlxuICogTm90ZSB0aGF0IGl0IGlzIGltcG9ydGFudCB0aGF0IG5vZGVzIGFuZCBpdHMgYXR0YWNoZWQgY29tbWVudCBhcmUgbm90IHdyYXBwZWQgaW50byBwYXJlbnRoZXNpc1xuICogYnkgZGVmYXVsdCwgYXMgaXQgcHJldmVudHMgY29ycmVjdCB0cmFuc2xhdGlvbiBvZiBlLmcuIGRpYWdub3N0aWNzIHByb2R1Y2VkIGZvciBpbmNvcnJlY3QgbWV0aG9kXG4gKiBhcmd1bWVudHMuIFN1Y2ggZGlhZ25vc3RpY3Mgd291bGQgdGhlbiBiZSBwcm9kdWNlZCBmb3IgdGhlIHBhcmVudGhlc2lzZWQgbm9kZSB3aGVyZWFzIHRoZVxuICogcG9zaXRpb25hbCBjb21tZW50IHdvdWxkIGJlIGxvY2F0ZWQgd2l0aGluIHRoYXQgbm9kZSwgcmVzdWx0aW5nIGluIGEgbWlzbWF0Y2guXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cmFwRm9yRGlhZ25vc3RpY3MoZXhwcjogdHMuRXhwcmVzc2lvbik6IHRzLkV4cHJlc3Npb24ge1xuICByZXR1cm4gdHMuY3JlYXRlUGFyZW4oZXhwcik7XG59XG5cbi8qKlxuICogQWRkcyBhIHN5bnRoZXRpYyBjb21tZW50IHRvIHRoZSBleHByZXNzaW9uIHRoYXQgcmVwcmVzZW50cyB0aGUgcGFyc2Ugc3BhbiBvZiB0aGUgcHJvdmlkZWQgbm9kZS5cbiAqIFRoaXMgY29tbWVudCBjYW4gbGF0ZXIgYmUgcmV0cmlldmVkIGFzIHRyaXZpYSBvZiBhIG5vZGUgdG8gcmVjb3ZlciBvcmlnaW5hbCBzb3VyY2UgbG9jYXRpb25zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkUGFyc2VTcGFuSW5mbyhub2RlOiB0cy5Ob2RlLCBzcGFuOiBBYnNvbHV0ZVNwYW4gfCBQYXJzZVNvdXJjZVNwYW4pOiB2b2lkIHtcbiAgbGV0IGNvbW1lbnRUZXh0OiBzdHJpbmc7XG4gIGlmIChpc0Fic29sdXRlU3BhbihzcGFuKSkge1xuICAgIGNvbW1lbnRUZXh0ID0gYCR7c3Bhbi5zdGFydH0sJHtzcGFuLmVuZH1gO1xuICB9IGVsc2Uge1xuICAgIGNvbW1lbnRUZXh0ID0gYCR7c3Bhbi5zdGFydC5vZmZzZXR9LCR7c3Bhbi5lbmQub2Zmc2V0fWA7XG4gIH1cbiAgdHMuYWRkU3ludGhldGljVHJhaWxpbmdDb21tZW50KFxuICAgICAgbm9kZSwgdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLCBjb21tZW50VGV4dCxcbiAgICAgIC8qIGhhc1RyYWlsaW5nTmV3TGluZSAqLyBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGlzQWJzb2x1dGVTcGFuKHNwYW46IEFic29sdXRlU3BhbiB8IFBhcnNlU291cmNlU3Bhbik6IHNwYW4gaXMgQWJzb2x1dGVTcGFuIHtcbiAgcmV0dXJuIHR5cGVvZiBzcGFuLnN0YXJ0ID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBBZGRzIGEgc3ludGhldGljIGNvbW1lbnQgdG8gdGhlIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIHRoYXQgY29udGFpbnMgdGhlIHNvdXJjZSBsb2NhdGlvblxuICogb2YgdGhlIGNsYXNzIGRlY2xhcmF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkU291cmNlUmVmZXJlbmNlTmFtZShcbiAgICB0Y2I6IHRzLkZ1bmN0aW9uRGVjbGFyYXRpb24sIHNvdXJjZTogQ2xhc3NEZWNsYXJhdGlvbik6IHZvaWQge1xuICBjb25zdCBjb21tZW50VGV4dCA9IGdldFNvdXJjZVJlZmVyZW5jZU5hbWUoc291cmNlKTtcbiAgdHMuYWRkU3ludGhldGljTGVhZGluZ0NvbW1lbnQodGNiLCB0cy5TeW50YXhLaW5kLk11bHRpTGluZUNvbW1lbnRUcml2aWEsIGNvbW1lbnRUZXh0LCB0cnVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvdXJjZVJlZmVyZW5jZU5hbWUoc291cmNlOiBDbGFzc0RlY2xhcmF0aW9uKTogc3RyaW5nIHtcbiAgY29uc3QgZmlsZU5hbWUgPSBnZXRTb3VyY2VGaWxlKHNvdXJjZSkuZmlsZU5hbWU7XG4gIHJldHVybiBgJHtmaWxlTmFtZX0jJHtzb3VyY2UubmFtZS50ZXh0fWA7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiB0aGUgZGlhZ25vc3RpYyBzaG91bGQgYmUgcmVwb3J0ZWQuIFNvbWUgZGlhZ25vc3RpY3MgYXJlIHByb2R1Y2VkIGJlY2F1c2Ugb2YgdGhlXG4gKiB3YXkgVENCcyBhcmUgZ2VuZXJhdGVkOyB0aG9zZSBkaWFnbm9zdGljcyBzaG91bGQgbm90IGJlIHJlcG9ydGVkIGFzIHR5cGUgY2hlY2sgZXJyb3JzIG9mIHRoZVxuICogdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRSZXBvcnREaWFnbm9zdGljKGRpYWdub3N0aWM6IHRzLkRpYWdub3N0aWMpOiBib29sZWFuIHtcbiAgY29uc3Qge2NvZGV9ID0gZGlhZ25vc3RpYztcbiAgaWYgKGNvZGUgPT09IDYxMzMgLyogJHZhciBpcyBkZWNsYXJlZCBidXQgaXRzIHZhbHVlIGlzIG5ldmVyIHJlYWQuICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKGNvZGUgPT09IDYxOTkgLyogQWxsIHZhcmlhYmxlcyBhcmUgdW51c2VkLiAqLykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChjb2RlID09PSAyNjk1IC8qIExlZnQgc2lkZSBvZiBjb21tYSBvcGVyYXRvciBpcyB1bnVzZWQgYW5kIGhhcyBubyBzaWRlIGVmZmVjdHMuICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIHRyYW5zbGF0ZSBhIFR5cGVTY3JpcHQgZGlhZ25vc3RpYyBwcm9kdWNlZCBkdXJpbmcgdGVtcGxhdGUgdHlwZS1jaGVja2luZyB0byB0aGVpclxuICogbG9jYXRpb24gb2Ygb3JpZ2luLCBiYXNlZCBvbiB0aGUgY29tbWVudHMgdGhhdCBhcmUgZW1pdHRlZCBpbiB0aGUgVENCIGNvZGUuXG4gKlxuICogSWYgdGhlIGRpYWdub3N0aWMgY291bGQgbm90IGJlIHRyYW5zbGF0ZWQsIGBudWxsYCBpcyByZXR1cm5lZCB0byBpbmRpY2F0ZSB0aGF0IHRoZSBkaWFnbm9zdGljXG4gKiBzaG91bGQgbm90IGJlIHJlcG9ydGVkIGF0IGFsbC4gVGhpcyBwcmV2ZW50cyBkaWFnbm9zdGljcyBmcm9tIG5vbi1UQ0IgY29kZSBpbiBhIHVzZXIncyBzb3VyY2VcbiAqIGZpbGUgZnJvbSBiZWluZyByZXBvcnRlZCBhcyB0eXBlLWNoZWNrIGVycm9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZURpYWdub3N0aWMoXG4gICAgZGlhZ25vc3RpYzogdHMuRGlhZ25vc3RpYywgcmVzb2x2ZVBhcnNlU291cmNlOiAoc291cmNlTG9jYXRpb246IFNvdXJjZUxvY2F0aW9uKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXJzZVNvdXJjZVNwYW4gfCBudWxsKTogRGlhZ25vc3RpY3xudWxsIHtcbiAgaWYgKGRpYWdub3N0aWMuZmlsZSA9PT0gdW5kZWZpbmVkIHx8IGRpYWdub3N0aWMuc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gTG9jYXRlIHRoZSBub2RlIHRoYXQgdGhlIGRpYWdub3N0aWMgaXMgcmVwb3J0ZWQgb24gYW5kIGRldGVybWluZSBpdHMgbG9jYXRpb24gaW4gdGhlIHNvdXJjZS5cbiAgY29uc3Qgbm9kZSA9IGdldFRva2VuQXRQb3NpdGlvbihkaWFnbm9zdGljLmZpbGUsIGRpYWdub3N0aWMuc3RhcnQpO1xuICBjb25zdCBzb3VyY2VMb2NhdGlvbiA9IGZpbmRTb3VyY2VMb2NhdGlvbihub2RlLCBkaWFnbm9zdGljLmZpbGUpO1xuICBpZiAoc291cmNlTG9jYXRpb24gPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIE5vdyB1c2UgdGhlIGV4dGVybmFsIHJlc29sdmVyIHRvIG9idGFpbiB0aGUgZnVsbCBgUGFyc2VTb3VyY2VGaWxlYCBvZiB0aGUgdGVtcGxhdGUuXG4gIGNvbnN0IHNwYW4gPSByZXNvbHZlUGFyc2VTb3VyY2Uoc291cmNlTG9jYXRpb24pO1xuICBpZiAoc3BhbiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IG1lc3NhZ2VUZXh0OiBzdHJpbmc7XG4gIGlmICh0eXBlb2YgZGlhZ25vc3RpYy5tZXNzYWdlVGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICBtZXNzYWdlVGV4dCA9IGRpYWdub3N0aWMubWVzc2FnZVRleHQ7XG4gIH0gZWxzZSB7XG4gICAgbWVzc2FnZVRleHQgPSBkaWFnbm9zdGljLm1lc3NhZ2VUZXh0Lm1lc3NhZ2VUZXh0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzb3VyY2U6ICdhbmd1bGFyJyxcbiAgICBjb2RlOiBkaWFnbm9zdGljLmNvZGUsXG4gICAgY2F0ZWdvcnk6IGRpYWdub3N0aWMuY2F0ZWdvcnksIG1lc3NhZ2VUZXh0LCBzcGFuLFxuICB9O1xufVxuXG5mdW5jdGlvbiBmaW5kU291cmNlTG9jYXRpb24obm9kZTogdHMuTm9kZSwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IFNvdXJjZUxvY2F0aW9ufG51bGwge1xuICAvLyBTZWFyY2ggZm9yIGNvbW1lbnRzIHVudGlsIHRoZSBUQ0IncyBmdW5jdGlvbiBkZWNsYXJhdGlvbiBpcyBlbmNvdW50ZXJlZC5cbiAgd2hpbGUgKG5vZGUgIT09IHVuZGVmaW5lZCAmJiAhdHMuaXNGdW5jdGlvbkRlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgY29uc3QgcGFyc2VTcGFuID1cbiAgICAgICAgdHMuZm9yRWFjaFRyYWlsaW5nQ29tbWVudFJhbmdlKHNvdXJjZUZpbGUudGV4dCwgbm9kZS5nZXRFbmQoKSwgKHBvcywgZW5kLCBraW5kKSA9PiB7XG4gICAgICAgICAgaWYgKGtpbmQgIT09IHRzLlN5bnRheEtpbmQuTXVsdGlMaW5lQ29tbWVudFRyaXZpYSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGNvbW1lbnRUZXh0ID0gc291cmNlRmlsZS50ZXh0LnN1YnN0cmluZyhwb3MsIGVuZCk7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlUGFyc2VTcGFuQ29tbWVudChjb21tZW50VGV4dCk7XG4gICAgICAgIH0pIHx8IG51bGw7XG4gICAgaWYgKHBhcnNlU3BhbiAhPT0gbnVsbCkge1xuICAgICAgLy8gT25jZSB0aGUgcG9zaXRpb25hbCBpbmZvcm1hdGlvbiBoYXMgYmVlbiBleHRyYWN0ZWQsIHNlYXJjaCBmdXJ0aGVyIHVwIHRoZSBUQ0IgdG8gZXh0cmFjdFxuICAgICAgLy8gdGhlIGZpbGUgaW5mb3JtYXRpb24gdGhhdCBpcyBhdHRhY2hlZCB3aXRoIHRoZSBUQ0IncyBmdW5jdGlvbiBkZWNsYXJhdGlvbi5cbiAgICAgIHJldHVybiB0b1NvdXJjZUxvY2F0aW9uKHBhcnNlU3Bhbiwgbm9kZSwgc291cmNlRmlsZSk7XG4gICAgfVxuXG4gICAgbm9kZSA9IG5vZGUucGFyZW50O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHRvU291cmNlTG9jYXRpb24oXG4gICAgcGFyc2VTcGFuOiBQYXJzZVNwYW4sIG5vZGU6IHRzLk5vZGUsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiBTb3VyY2VMb2NhdGlvbnxudWxsIHtcbiAgLy8gV2FsayB1cCB0byB0aGUgZnVuY3Rpb24gZGVjbGFyYXRpb24gb2YgdGhlIFRDQiwgdGhlIGZpbGUgaW5mb3JtYXRpb24gaXMgYXR0YWNoZWQgdGhlcmUuXG4gIGxldCB0Y2IgPSBub2RlO1xuICB3aGlsZSAoIXRzLmlzRnVuY3Rpb25EZWNsYXJhdGlvbih0Y2IpKSB7XG4gICAgdGNiID0gdGNiLnBhcmVudDtcblxuICAgIC8vIEJhaWwgb25jZSB3ZSBoYXZlIHJlYWNoZWQgdGhlIHJvb3QuXG4gICAgaWYgKHRjYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzb3VyY2VSZWZlcmVuY2UgPVxuICAgICAgdHMuZm9yRWFjaExlYWRpbmdDb21tZW50UmFuZ2Uoc291cmNlRmlsZS50ZXh0LCB0Y2IuZ2V0RnVsbFN0YXJ0KCksIChwb3MsIGVuZCwga2luZCkgPT4ge1xuICAgICAgICBpZiAoa2luZCAhPT0gdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tbWVudFRleHQgPSBzb3VyY2VGaWxlLnRleHQuc3Vic3RyaW5nKHBvcywgZW5kKTtcbiAgICAgICAgcmV0dXJuIGNvbW1lbnRUZXh0LnN1YnN0cmluZygyLCBjb21tZW50VGV4dC5sZW5ndGggLSAyKTtcbiAgICAgIH0pIHx8IG51bGw7XG4gIGlmIChzb3VyY2VSZWZlcmVuY2UgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc291cmNlUmVmZXJlbmNlLFxuICAgIHN0YXJ0OiBwYXJzZVNwYW4uc3RhcnQsXG4gICAgZW5kOiBwYXJzZVNwYW4uZW5kLFxuICB9O1xufVxuXG5jb25zdCBwYXJzZVNwYW5Db21tZW50ID0gL15cXC9cXCooXFxkKyksKFxcZCspXFwqXFwvJC87XG5cbmZ1bmN0aW9uIHBhcnNlUGFyc2VTcGFuQ29tbWVudChjb21tZW50VGV4dDogc3RyaW5nKTogUGFyc2VTcGFufG51bGwge1xuICBjb25zdCBtYXRjaCA9IGNvbW1lbnRUZXh0Lm1hdGNoKHBhcnNlU3BhbkNvbW1lbnQpO1xuICBpZiAobWF0Y2ggPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7c3RhcnQ6ICttYXRjaFsxXSwgZW5kOiArbWF0Y2hbMl19O1xufVxuIl19