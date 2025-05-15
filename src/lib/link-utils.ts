/**
 * Re-export link utility components from core
 * This creates a more stable import path that won't change if we reorganize components
 */

export {
  LinkContext,
  useLinkContext,
  SafeLink,
  SafeNextLink,
  ActionButton
} from "@/components/core/LinkContext";
