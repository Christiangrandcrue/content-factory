import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Content Factory /// Hybrid</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style>
          {`
            body { font-family: 'Inter', sans-serif; }
            h1, h2, h3, .font-mono { font-family: 'Space Mono', monospace; }
          `}
        </style>
      </head>
      <body class="bg-white text-black antialiased dark:bg-black dark:text-white transition-colors duration-300">{children}</body>
    </html>
  )
})
