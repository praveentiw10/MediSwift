
document.addEventListener('DOMContentLoaded', function() {
    var popup = document.getElementById('translatePopup');
    var btn = document.getElementById('translateButton');
    var span = document.querySelector('.popup-content .close');
    
    if (btn && popup) {
        btn.onclick = function() {
            popup.style.display = 'flex'; // Use flex for center alignment as defined in CSS
            popup.style.animation = 'fadeIn 0.3s ease-out';
        }
        
        span.onclick = function() {
            closePopup();
        }
        
        window.onclick = function(event) {
            if (event.target == popup) {
                closePopup();
            }
        }
    }

    function closePopup() {
        popup.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }

    /* --- Aggressive removal of Google's default "pushed-down" bar --- */
    const removeGoogleBar = () => {
        const bar = document.querySelector('.goog-te-banner-frame');
        if (bar) bar.remove();
        
        const skiptranslate = document.querySelector('.skiptranslate');
        if (skiptranslate && skiptranslate.id !== 'google_translate_element') {
            // Only hide the bar, not our widget if it's there
            if (skiptranslate.tagName === 'IFRAME') skiptranslate.remove();
        }

        document.body.style.top = '0px';
    };

    // Watch for Google bar being added dynamically
    const observer = new MutationObserver(removeGoogleBar);
    observer.observe(document.body, { childList: true, subtree: false });
    
    // Also run periodically just in case
    setInterval(removeGoogleBar, 1000);
});
