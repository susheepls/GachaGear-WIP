# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# Steps Taken
1. Set up app.tsx and app.css by removing what was there earlier
2. install react-router-dom to set up routes in app.tsx
3. clear index.css
4. setup useNavigate so when button is press, it redirects to '/login' page
5. create loginForm component where I will be putting the form to login and such
6. finish simple login component using 'Controlled component' . learned about using setstate to change objects; created a loginType
7. installed npm i --save-dev @types/node to get process.env to work after downloading the dotenv package
8. copy and pasted from prideland viteconfig in order to get process.env working... gotta look up whats up with that
9. turns out for vite... to access env u must do import.meta.env so none of it matter; make sure the env variable is VITE_asdfasdfasdf
10. create an api folder and make login.ts, and add a function called login fetch
11. usual stuff like headers:{'Content-Type' : 'application/json'} and make the js object im sending to a json string by using JSON.stringify.
12. make a new type for the data received from the login which would be a {message:string}. result.json() <- got to change it back to readable js object
13. decide it was time to test login by adding some more stuff in the login page. I will set state here in the login page that is the returned message
14. if the message is login sucess, we would redirect you the index. if not, whatever. I will pass the setstate to the login component
15. because i am passing props, I had to set types. Dispatch<SetStateAction<string | null>> and React.FC<Props>; dont forget to set interface for that.
16. whenever the submit form has been pressed, we set the state of the message.
