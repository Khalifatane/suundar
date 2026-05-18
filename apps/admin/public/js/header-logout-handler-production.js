/**
 * Production-Grade Header Logout Handler
 * Handles user logout with proper state management and UI updates
 * Integrates with Supabase authentication service
 */

console.log('🔐 Loading navbar logout handler (production)...');

// Store logout handler setup
let logoutSetupAttempted = false;
let logoutSetupSucceeded = false;

/**
 * Setup logout button click handler with retry logic
 * Retries every 500ms if logout button not found initially
 */
function setupLogoutHandler() {
  if (logoutSetupAttempted && logoutSetupSucceeded) {
    console.log('✅ Logout handler already setup successfully');
    return;
  }

  const logoutBtn = document.getElementById('hs-pro-logout-btn');
  
  if (logoutBtn) {
    console.log('✅ Found logout button, attaching listener');
    logoutSetupAttempted = true;
    logoutSetupSucceeded = true;
    
    logoutBtn.addEventListener('click', performLogout);
  } else {
    logoutSetupAttempted = true;
    console.log('⏳ Logout button not found, will retry...');
    
    // Retry after 500ms
    setTimeout(setupLogoutHandler, 500);
  }
}

/**
 * Perform logout operation
 * Shows loading state, clears storage, signs out from Supabase
 */
async function performLogout(e) {
  e.preventDefault();
  
  const logoutBtn = document.getElementById('hs-pro-logout-btn');
  
  console.log('🔄 Starting logout process...');
  
  // Show loading state
  if (logoutBtn) {
    const originalText = logoutBtn.textContent;
    logoutBtn.disabled = true;
    logoutBtn.textContent = 'Logging out...';
    console.log('⏳ Button disabled, showing loading state');
  }
  
  try {
    // Clear all storage - localStorage, sessionStorage, and cookies
    clearAllStorage();
    console.log('✅ Storage cleared');
    
    // Sign out from Supabase
    if (window.supabase && window.supabase.auth) {
      console.log('🔐 Calling Supabase.auth.signOut()');
      await window.supabase.auth.signOut();
      console.log('✅ Supabase signOut completed');
    } else {
      console.warn('⚠️ Supabase not available, continuing with logout');
    }
    
    // Complete logout and redirect
    completeLogout();
    
  } catch (error) {
    console.error('❌ Error during logout:', error);
    completeLogout(); // Complete logout even on error
  }
}

/**
 * Clear all storage mechanisms
 */
function clearAllStorage() {
  console.log('🗑️ Clearing storage...');
  
  // Clear localStorage
  try {
    localStorage.clear();
    console.log('✅ localStorage cleared');
  } catch (e) {
    console.warn('⚠️ Could not clear localStorage:', e);
  }
  
  // Clear sessionStorage
  try {
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
  } catch (e) {
    console.warn('⚠️ Could not clear sessionStorage:', e);
  }
  
  // Clear cookies (basic approach)
  try {
    document.cookie.split(";").forEach(c => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    console.log('✅ Cookies cleared');
  } catch (e) {
    console.warn('⚠️ Could not clear cookies:', e);
  }
  
  // Stop token refresh interval if exists
  if (window.tokenRefreshInterval) {
    clearInterval(window.tokenRefreshInterval);
    console.log('✅ Token refresh interval stopped');
  }
}

/**
 * Complete logout operation
 * Updates UI state and redirects to home page
 */
function completeLogout() {
  console.log('🎉 Completing logout...');
  
  // Hide account dropdown
  const accountDropdown = document.getElementById('hs-pro-account-dropdown');
  if (accountDropdown) {
    accountDropdown.style.display = 'none';
    console.log('✅ Account dropdown hidden');
  }
  
  // Show login card
  const loginCards = document.getElementsByClassName('i0yn8');
  for (let card of loginCards) {
    card.style.display = 'flex';
    console.log('✅ Login card displayed');
  }
  
  // Redirect to home after short delay
  console.log('🔄 Redirecting to home page in 1.5 seconds...');
  setTimeout(() => {
    console.log('📄 Redirecting to /index.html');
    window.location.href = '/index.html';
  }, 1500);
}

/**
 * Initialize logout handler on document ready
 */
function initLogoutHandler() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLogoutHandler);
  } else {
    setupLogoutHandler();
  }
}

// Try multiple initialization approaches
console.log('🚀 Initializing logout handler with multiple attempts...');

// Attempt 1: Immediate setup
initLogoutHandler();

// Attempt 2: Window load event
window.addEventListener('load', setupLogoutHandler);

// Attempt 3: Fallback timeout
setTimeout(setupLogoutHandler, 1000);

// Expose test utilities
window.logoutTest = {
  triggerLogout: () => {
    const btn = document.getElementById('hs-pro-logout-btn');
    if (btn) {
      btn.click();
      console.log('✅ Logout triggered');
    } else {
      console.error('❌ Logout button not found');
    }
  },
  clearStorage: clearAllStorage,
  checkButton: () => {
    const btn = document.getElementById('hs-pro-logout-btn');
    console.log('🔍 Logout button:', btn ? 'FOUND' : 'NOT FOUND');
    return !!btn;
  }
};

// Global test function
window.testLogout = function() {
  console.log('🧪 Running logout test...');
  window.logoutTest.triggerLogout();
};

console.log('✅ Navbar logout handler loaded');
