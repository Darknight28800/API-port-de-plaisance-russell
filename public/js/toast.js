/**
 * Petit système de notifications "toast" en verre, sans dépendance.
 * Usage : showToast('Catway supprimé', 'success')
 */
function showToast(message, type = 'success', duration = 3500) {
    let container = document.getElementById('toast-container')

    if (!container) {
        container = document.createElement('div')
        container.id = 'toast-container'
        document.body.appendChild(container)
    }

    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.textContent = message
    container.appendChild(toast)

    requestAnimationFrame(() => toast.classList.add('show'))

    setTimeout(() => {
        toast.classList.remove('show')
        toast.addEventListener('transitionend', () => toast.remove(), { once: true })
    }, duration)
}
