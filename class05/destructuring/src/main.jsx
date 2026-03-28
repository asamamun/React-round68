import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/* const profile = {
  firstName: 'Robin',
  lastName: 'Wieruch',
};
const address = {
country: 'Germany',
city: 'Berlin',
};
const user = {
...profile,
gender: 'male',
...address,
};
console.log(user); */
/* const user = {
id: '1',
firstName: 'Robin',
lastName: 'Wieruch',
country: 'Germany',
city: 'Berlin',
};
const { id, country, city, ...restofus } = user;
console.log(restofus); */
/* function add(...z) {
  console.log(z);
}
add(1,2,3,4,5,7); */
