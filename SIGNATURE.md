# Using your exact signature in the loading animation

To use the **exact** signature from your reference (white calligraphic signature on black), you need to give the site an **SVG path** that describes that shape.

## What we need from you

**One of these:**

1. **The path `d` value**  
   A single string that looks like:  
   `d="M 10 20 C 30 40, 50 60, ..."`  
   Paste everything inside the quotes into the `<path>` in `index.html` (replace the current `d="..."`), and keep `pathLength="100"` and `id="signature-path"` as they are.

2. **An SVG file** of only the signature (one path, no extra graphics).  
   We’ll take the `d="..."` from that path and put it into `index.html` as above.

## How you can get that path

- **Illustrator:** Draw or trace the signature, select it, then: Object → Expand (if needed), copy, paste into a new document, Save As SVG. Open the SVG in a text editor and copy the value of the `d` attribute from the `<path>`.
- **Figma:** Trace or place the signature, select it, right‑click → Copy/Paste as SVG (or export as SVG), then open the SVG and copy the path’s `d` value.
- **Online:** Use a site like [vectorizer.io](https://www.vectorizer.io/) or similar “image to SVG” tool on your reference image, then open the SVG and copy the path’s `d` attribute.

## Where it goes in the code

In `index.html`, find:

```html
<path id="signature-path" pathLength="100" d="M 20 45 C 20 22, ..."/>
```

Replace **only** the part after `d="` and before `"` with your full path string. Do **not** remove `pathLength="100"` or `id="signature-path"`.

The draw animation will work with any valid path. The signature will stay centered and visible; the loader background is fixed black and the stroke is white so it always shows.
