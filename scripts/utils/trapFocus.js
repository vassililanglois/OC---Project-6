// Gestion du trap focus pour la naviguation au clavier dans un container comme
//  la modale ou la lightbox

export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstEl = focusableElements[0];
  const lastEl = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  container.addEventListener("keydown", handleKeyDown);

  // Permet de retirer le piège au focus lors de la fermeture
  container._removeFocusTrap = () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}
