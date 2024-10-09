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
17. add username state to login page that will pass that info to the home page after a sucessful login
18. in order to pass info to another page, use useNavigate('/pathname', {state: {key : value} })
19. in the home page, useState for the username passed from login, by using variable = useLocation(); variable.state.key
20. set a ternary operator for the div being displayed, log out button if logged in
21. log out button sets username to null and localeDtorage.removeItem('authToken') <- for future; navigate back to index
22. npm i js-cookies after adding jwt protected path in the backend; npm i --save-dev @types/js-cookie
23. dont forget to add the token string type to the accountloginmessage type
24. add a new route in app.tsx to that is called /inventory and add a button on home page if user is logged in that leads there.
25. make the inventory component that displays all items as a div
26. change loginform so if the token exists, set it as a cookie
27. ``Cookies.set('token', loginMessage.accessToken, { secure: true, sameSite: 'strict'} );``
28. make a new api folder for inventory; i get the token from the cookie using cookies.get and the key name
29. i fetch adding this as headers ``const headers = { 'Authorization' : `Bearer ${token}` }``; error handling with redirection
30. and then do ''await fetch(endpoint + 'profile/', {headers: headers})''; dont forget to await.json() the response
31. make a new type for the response to know exactly what i am getting
32. realize that in the home page, if there is a cookie, display a page; but now i cannot log out
33. need to redirect if someone tries to access path without logged in or having an invalid token
34. so in order to do that i have to pass the navigate function into the api since the api is not a component
35. and there i use the navigate back to the home screen if they try to access that part of the website
36. wanted to add more personality so i changed the route in app.tsx to take in a param called username :username/inventory
37. change loginform to set username once a valid token is made;
38. in home page make sure the button navigates to ```navigate(`${username}/inventory`);```
39. update route and inventory api and inventoryType to reflect the backend changes.
40. when user logs in to, we pass the username to the inventory (This need to be changed later though)
41. after using uselocation in Inventory page, we pass the username into the api so it reaches matches the endpoint
42. the problem, is the token exists, but after closing tab the state is reset, so user is still logged in