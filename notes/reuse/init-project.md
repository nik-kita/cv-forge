- script for generate and update api from swagger:
  ```json
  "api:types": "curl http://localhost:3000/openapi.json > openapi.api.json && npx openapi-typescript ./openapi.api.json -o ./src/api/openapi.d.ts && npm run format && npm run lint"
  ```

* tailwindcss, primevue

  ```bash
  npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p --ts && npm install primevue
  ```

  - `tailwind.config.ts`

    ```ts
    import type {Config} from 'tailwindcss'

    export default {
      content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    } satisfies Config
    ```

  - `postcss.config.js`

    ```js
    import type {Config} from 'tailwindcss'

    export default {
      content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    } satisfies Config

    ```

  - `src/assets/base.css`

    ```css
    @layer tailwind-base, primevue, tailwind-utilities;

    @layer tailwind-base {
      @tailwind base;
    }

    @layer tailwind-utilities {
      @tailwind components;
      @tailwind utilities;
    }
    ```
  - `src/main.ts`
    ```ts
    import './assets/main.css'
    // ----------------------------------------------
    ```
