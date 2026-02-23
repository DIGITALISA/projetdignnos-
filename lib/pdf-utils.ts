
export const sanitizeForHtml2Canvas = (clonedDoc: Document) => {
    // 1. Define targeted cleanup regex
    const colorRegex = /(oklch|oklab|lab|lch|hwb|color-mix|color)\([^)]*\)/g;
    const safeColor = '#000000';
    const nuke = (text: string) => text.replace(colorRegex, safeColor);

    // 2. Clean Style Tags surgically (Don't remove them, just clean content)
    const styles = Array.from(clonedDoc.getElementsByTagName('style'));
    styles.forEach(style => {
        if (style.innerHTML && style.innerHTML.match(colorRegex)) {
            style.innerHTML = nuke(style.innerHTML);
        }
    });

    // 3. Clean all elements: attributes, inline styles AND computed styles
    const allElements = Array.from(clonedDoc.getElementsByTagName('*'));
    
    allElements.forEach((node) => {
        const el = node as HTMLElement;
        
        // A. Attribute cleanup (fill, stroke, style)
        ['style', 'fill', 'stroke', 'stop-color'].forEach(attr => {
            const val = el.getAttribute(attr);
            if (val && colorRegex.test(val)) {
                el.setAttribute(attr, val.replace(colorRegex, safeColor));
            }
        });

        // B. Computed style cleanup (Catch colors coming from external CSS)
        // This is the most robust way to stop the "lab" error
        const computed = window.getComputedStyle(el);
        const propertiesToFix: (keyof CSSStyleDeclaration)[] = [
            'color', 'backgroundColor', 'borderColor', 'outlineColor', 'textDecorationColor', 'columnRuleColor'
        ];

        propertiesToFix.forEach(prop => {
            const val = computed[prop] as string;
            if (val && colorRegex.test(val)) {
                // Force a safe color directly on the element's style to override CSS
                try {
                    // Convert camelCase to kebab-case for setProperty
                    const kebab = (prop as string).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
                    el.style.setProperty(kebab, safeColor, 'important');
                } catch {
                    // Fallback for non-standard properties
                    (el.style as unknown as Record<string, string>)[prop as string] = safeColor;
                }
            }
        });

        // D. External Asset cleanup (CRITICAL: Prevents CORS/UNKNOWN type errors)
        const bgi = computed.backgroundImage;
        if (bgi && bgi.includes('url(')) {
            if (bgi.includes('http://') || bgi.includes('https://')) {
                el.style.setProperty('background-image', 'none', 'important');
            }
        }

        if (el.tagName.toLowerCase() === 'img') {
            const src = (el as HTMLImageElement).src;
            if (src && (src.startsWith('http') && !src.includes(window.location.host))) {
                el.style.display = 'none'; // Hide external images that cause taint
            }
        }

        // C. GLOBAL ENGINE SAFETY: Nuke ALL artifacts
        el.style.setProperty('transition', 'none', 'important');
        el.style.setProperty('animation', 'none', 'important');
        el.style.setProperty('backdrop-filter', 'none', 'important');
        el.style.setProperty('filter', 'none', 'important');
        el.style.setProperty('box-shadow', 'none', 'important');
        el.style.setProperty('text-shadow', 'none', 'important');
        
        // Remove 'blue/grey' decorative lines that turn solid blue in PDF
        if (el.classList.contains('border-slate-200') || 
            el.classList.contains('border-double') || 
            computed.borderStyle === 'double' ||
            (computed.borderWidth !== '0px' && !el.id.includes('stamp'))) {
            el.style.setProperty('border', 'none', 'important');
        }

        // Fix transparent/blur backgrounds that smear black in PDF
        const bg = computed.backgroundColor;
        const hasTransparancy = bg.includes('rgba') && !bg.includes('rgba(0, 0, 0, 0)');
        
        if (hasTransparancy || el.classList.contains('bg-white/50') || el.classList.contains('backdrop-blur')) {
            el.style.setProperty('background-color', '#ffffff', 'important');
            el.style.setProperty('backdrop-filter', 'none', 'important');
        }

        // 1. SURGICAL STAMP & SIGNATURE FIX
        const content = el.innerHTML || '';
        if (content.includes('Sté MA') || el.id === 'company-stamp-container') {
            el.style.setProperty('background-color', '#ffffff', 'important');
            el.style.setProperty('border', '2px solid #1e40af', 'important');
            el.style.setProperty('color', '#1e40af', 'important');
            el.style.setProperty('opacity', '1', 'important');
        }

        // 2. WATERMARK - Keep it barely visible
        if (el.classList.contains('opacity-[0.03]') || el.closest('.opacity-\\[0\\.03\\]')) {
            el.style.setProperty('opacity', '0.02', 'important');
        }

        // 3. LAYOUT FIX: Force headers to stay horizontal
        if (el.classList.contains('flex-col') && el.classList.contains('md:flex-row')) {
            el.style.setProperty('display', 'flex', 'important');
            el.style.setProperty('flex-direction', 'row', 'important');
            el.style.setProperty('justify-content', 'space-between', 'important');
        }
    });
    
    // NOTE: We used to remove link tags here, which destroyed the fonts. 
    // We now KEEP them to preserve the branding and Arabic typography.
};
