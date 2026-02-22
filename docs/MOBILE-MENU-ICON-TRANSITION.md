# Mobile Menu Icon Transition Fix

## Issue
On mobile, the header elements and mobile menu were overlapping, causing confusion with multiple close buttons and unclear navigation.

## Solution
Implemented a dynamic hamburger-to-close button transition in the header that:
1. Transforms the hamburger menu icon into a close button when menu opens
2. Keeps the button in the same position (no layout shift)
3. Changes all header elements to black when menu is open
4. Removes the redundant close button from the mobile menu aside
5. Slides the menu from the left side

## Changes Made

### 1. Header Component (`app/components/layout/Header.tsx`)
- Added `X` icon import from lucide-react
- Track mobile menu state using `asideType === 'mobile'`
- Toggle menu open/close with single button
- Added `mobile-menu-open` class to header when menu is active
- Wrapped menu/close icons in a container for smooth transition

```tsx
// Track if mobile menu is open
const isMobileMenuOpen = asideType === 'mobile';

// Toggle function
const handleMobileMenuClick = () => {
  if (isMobileMenuOpen) {
    closeAside();
  } else {
    openAside('mobile');
  }
};

// Button with both icons
<button 
  className={`blacmelo-mobile-menu-btn ${isMobileMenuOpen ? 'menu-open' : ''}`}
  onClick={handleMobileMenuClick}
  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
>
  <span className="menu-icon-wrapper">
    <Menu size={24} className="menu-icon" />
    <X size={24} className="close-icon" />
  </span>
</button>
```

### 2. Header CSS (`app/styles/layout/header.css`)
- Added icon transition animations
- Menu icon rotates out, close icon rotates in
- Smooth 0.3s ease transitions
- Black color for all header elements when mobile menu is open

```css
/* Menu icon wrapper for transition */
.menu-icon-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Default state: show menu icon */
.blacmelo-mobile-menu-btn .menu-icon {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg);
}

.blacmelo-mobile-menu-btn .close-icon {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(90deg);
}

/* Open state: show close icon */
.blacmelo-mobile-menu-btn.menu-open .menu-icon {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(-90deg);
}

.blacmelo-mobile-menu-btn.menu-open .close-icon {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg);
}

/* When mobile menu is open, turn all elements black */
.blacmelo-header.mobile-menu-open .blacmelo-mobile-menu-btn,
.blacmelo-header.mobile-menu-open .blacmelo-header-icon,
.blacmelo-header.mobile-menu-open .blacmelo-cart-icon {
  color: #000000;
}

.blacmelo-header.mobile-menu-open .blacmelo-logo-image {
  filter: none;
}
```

### 3. Aside Component (`app/components/Aside.tsx`)
- Removed close button from mobile menu header
- Keep close button for cart and search asides
- Added separate mobile menu header styling

```tsx
{type !== 'mobile' && (
  <header>
    <h3>{heading}</h3>
    <button className="close reset" onClick={close} aria-label="Close">
      ✕
    </button>
  </header>
)}
{type === 'mobile' && (
  <header className="mobile-menu-header">
    <h3>{heading}</h3>
  </header>
)}
```

### 4. Mobile Menu CSS (`app/styles/components/menus/mobile-menu.css`)
- Added mobile menu header styles without close button
- Proper padding and alignment

```css
.mobile-menu-header {
  padding: 24px 32px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
```

### 5. Overlay CSS (`app/styles/layout/overlay.css`)
- Mobile menu now slides from LEFT instead of right
- Positioned below header (63px on mobile)
- Accounts for announcement bar when visible
- Full-width overlay

```css
.overlay[data-type="mobile"] aside {
  left: 0;
  right: auto;
  top: 63px;
  height: calc(100vh - 63px);
  transform: translateX(-100%); /* Slide from left */
}

/* When announcement bar is visible */
body:has(.announcement-bar:not([hidden])) .overlay[data-type="mobile"] aside {
  top: 99px; /* 36px + 63px */
  height: calc(100vh - 99px);
}
```

## User Experience Flow

1. User taps hamburger menu icon (☰)
2. Menu slides in from the left
3. Hamburger icon smoothly rotates and transforms into close icon (✕)
4. All header elements (logo, icons) turn black for visibility
5. User taps close icon (✕) in the same position
6. Menu slides out to the left
7. Close icon rotates back to hamburger icon
8. Header elements return to white

## Benefits

- Single, consistent close button location
- No overlapping UI elements
- Smooth, professional transitions
- Clear visual feedback
- Matches modern mobile UX patterns
- Header remains accessible and functional
- No layout shift or jumping

## Testing Checklist

- [ ] Hamburger icon transforms to close icon smoothly
- [ ] Menu slides from left side
- [ ] Header elements turn black when menu opens
- [ ] Logo changes from white to black
- [ ] Close button closes the menu
- [ ] Icons rotate smoothly (90-degree rotation)
- [ ] No overlapping elements
- [ ] Works with and without announcement bar
- [ ] Cart and search asides still have their own close buttons
