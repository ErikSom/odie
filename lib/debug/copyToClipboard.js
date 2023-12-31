/**
 * attempts to copy a string to the users Clipboard
 * this is really only build for debugging purposes
 * not tested for production!
 *
 * @param stringToCopy - the string to attempt to copy to the clipboard
 */
export function copyToClipboard(stringToCopy) {
    // Create new element
    const el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = stringToCopy;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}
