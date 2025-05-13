// src/utils/accessibility.ts
/**
 * Accessibility utility functions for enhancing user experience
 */

export interface FocusTrapOptions {
    onEscape?: () => void;
    initialFocusElement?: HTMLElement | null;
    returnFocusElement?: HTMLElement | null;
    autoFocus?: boolean;
}

/**
 * Trap focus within a specified element (for modals, dialogs, etc.)
 *
 * @param containerElement The element to trap focus within
 * @param options Focus trap options
 * @returns A function to release the focus trap
 */
export function trapFocus(
    containerElement: HTMLElement | null,
    options: FocusTrapOptions = {}
): () => void {
    if (!containerElement) return () => { };

    const {
        onEscape,
        initialFocusElement,
        returnFocusElement = document.activeElement as HTMLElement,
        autoFocus = true,
    } = options;

    // Store the element to return focus to when trap is released
    const previousActiveElement = returnFocusElement;

    // Find all focusable elements within the container
    const focusableElements = getFocusableElements(containerElement);

    if (focusableElements.length === 0) {
        console.warn('No focusable elements found within the focus trap container');
        return () => { };
    }

    // Determine initial focus element
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Set initial focus
    if (autoFocus) {
        const elementToFocus = initialFocusElement || firstFocusableElement;
        setTimeout(() => elementToFocus.focus(), 0);
    }

    // Handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
        // Handle Escape key
        if (event.key === 'Escape' && onEscape) {
            onEscape();
            return;
        }

        // Handle Tab key for cycling through focusable elements
        if (event.key === 'Tab') {
            // If Shift+Tab on first element, move to last element
            if (event.shiftKey && document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
                return;
            }

            // If Tab on last element, move to first element
            if (!event.shiftKey && document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus();
                return;
            }
        }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Return function to release the focus trap
    return () => {
        document.removeEventListener('keydown', handleKeyDown);

        // Return focus to original element if it still exists in the DOM
        if (previousActiveElement && document.body.contains(previousActiveElement)) {
            previousActiveElement.focus();
        }
    };
}

/**
 * Get all focusable elements within a container
 *
 * @param container Container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        'summary',
        'a[role="button"]',
        '[role="button"]',
    ].join(',');

    return Array.from(container.querySelectorAll(selector)).filter(
        (el) => !isHidden(el as HTMLElement)
    ) as HTMLElement[];
}

/**
 * Check if an element is hidden (not visible or off-screen)
 *
 * @param element Element to check
 * @returns Whether the element is hidden
 */
export function isHidden(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0' ||
        element.hasAttribute('hidden') ||
        (style.position === 'absolute' &&
            (style.left === '-9999px' || style.top === '-9999px'))
    );
}

/**
 * Announce a message to screen readers using ARIA live region
 *
 * @param message Message to announce
 * @param priority Priority level (polite or assertive)
 */
export function announceToScreenReader(
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
): void {
    if (typeof document === 'undefined') return;

    // Create live region if it doesn't exist
    let liveRegion = document.getElementById(`a11y-announcer-${priority}`);

    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = `a11y-announcer-${priority}`;
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.setAttribute('aria-relevant', 'additions text');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    // Update the message
    liveRegion.textContent = '';

    // Force a DOM reflow to ensure the change is announced
    setTimeout(() => {
        liveRegion!.textContent = message;
    }, 50);
}

/**
 * Creates screen reader only text for accessibility
 *
 * @param text Text to be read by screen readers
 * @returns String with the HTML for screen reader text
 */
export function screenReaderText(text: string): string {
    return `<span class="sr-only">${text}</span>`;
}

/**
 * Interface for keyboard navigation state management
 */
interface KeyboardNavManager {
    getValue: () => boolean;
    setValue: (value: boolean) => void;
    subscribe: (callback: (value: boolean) => void) => () => void;
}

/**
 * Extend Window interface to include our keyboard navigation property
 */
interface WindowWithKeyboardNav extends Window {
    __a11y_keyboard_nav?: KeyboardNavManager;
}

/**
 * Check keyboard navigation status
 *
 * @returns Whether the user is navigating with keyboard
 */
export function useKeyboardNavigation(): {
    isNavigatingWithKeyboard: boolean;
    setIsNavigatingWithKeyboard: (value: boolean) => void;
} {
    // Singleton pattern to share state across component instances
    if (typeof window !== 'undefined') {
        const win = window as WindowWithKeyboardNav;
        if (!win.__a11y_keyboard_nav) {
            let isKeyboard = false;
            const listeners = new Set<(value: boolean) => void>();

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    setKeyboardNav(true);
                }
            };

            const handleMouseDown = () => {
                setKeyboardNav(false);
            };

            function setKeyboardNav(value: boolean) {
                if (value !== isKeyboard) {
                    isKeyboard = value;
                    document.body.classList.toggle('keyboard-nav', isKeyboard);

                    // Notify all listeners
                    listeners.forEach(listener => listener(isKeyboard));
                }
            }

            // Set up global listeners
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleMouseDown);

            win.__a11y_keyboard_nav = {
                getValue: () => isKeyboard,
                setValue: setKeyboardNav,
                subscribe: (callback: (value: boolean) => void) => {
                    listeners.add(callback);
                    return () => {
                        listeners.delete(callback);
                    };
                }
            };
        }
    }

    const win = (typeof window !== 'undefined' ? window : {}) as WindowWithKeyboardNav;
    const keyboardNav = win.__a11y_keyboard_nav || {
        getValue: () => false,
        setValue: () => { },
        subscribe: () => () => { }
    };

    return {
        isNavigatingWithKeyboard: keyboardNav.getValue(),
        setIsNavigatingWithKeyboard: keyboardNav.setValue
    };
}

/**
 * Add keyboard-only focus styles
 * Use this in global CSS:
 * .keyboard-nav :focus:not(:focus-visible) {
 *   outline: none;
 *   box-shadow: none;
 * }
 * .keyboard-nav :focus-visible {
 *   outline: 2px solid var(--color-primary);
 *   outline-offset: 2px;
 * }
 */
export function initKeyboardFocusStyles(): void {
    if (typeof window !== 'undefined') {
        // Don't use the hook directly in a regular function
        const win = window as WindowWithKeyboardNav;
        const keyboardNav = win.__a11y_keyboard_nav;

        if (keyboardNav && keyboardNav.getValue()) {
            document.body.classList.add('keyboard-nav');
        }
    }
}

/**
 * Convert milliseconds to a time string for aria-valuetext
 *
 * @param milliseconds Time in milliseconds
 * @returns Formatted time string
 */
export function millisecondsToA11yString(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }

    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}