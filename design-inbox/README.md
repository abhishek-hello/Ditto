# design-inbox/

Drop zone for design data that comes out of Figma by hand. Everything here except this file is gitignored.

One folder per screen, named after the route with the slashes and brackets removed:

```
design-inbox/
  design-language/        # first pass only: 2–3 frames that define the look
    sign-in-light.html
    sign-in-dark.html
    home.html
    sign-in-light.png
    sign-in-dark.png
  auth-sign-in/           # (auth)/sign-in
    code.html             # Figma to Code plugin output (Tailwind or HTML)
    empty.png             # one PNG per state, exported at 2x
    filled.png
    error.png
    locked.png
    dark.png
```

## How to fill a folder

1. In Figma select the screen frame. Run the community plugin **Figma to Code** (by Bernardo Ferrari), choose **Tailwind** or **HTML**, copy the output, and save it as `code.html`. Free, no Dev Mode needed.
2. With the same frame selected, **Export** at **2x PNG**. One file per state if the frame has variants.
3. Run `/figma-screen <route> [node]`. The command reads this folder automatically.

When `FIGMA_TOKEN` is set the REST script pulls exact values and renders by node ID, so the PNGs are optional. The plugin code stays useful because it carries the layout structure.
