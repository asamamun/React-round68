import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Students from './Students'
import List from './List'
import Search from './Search'
import Counter from './Counter'


function App() {
  const studs = {
    "batch": 68,
    "tsp": "GNSL",
    "students": [
      {
        "id": 1,"name": "Jahanara","age": 20
      },
      {
        "id": 2,"name": "Patwari","age": 22
      },
      {
        "id": 3,"name": "Sumaiya","age": 21
      },
      {
        "id": 4,"name": "Mithu","age": 20
      },
      {
        "id": 5,"name": "Sadia","age": 21
      }
      ,
      {
        "id": 6,"name": "Mehedi","age": 20
      },
      {
        "id": 7,"name": "Rahman","age": 21
      }
      ,
      {
        "id": 8,"name": "Moin","age": 20
      },
      {
        "id": 9,"name": "Munir","age": 21
      }
    ]
  };
  //List
  const lists = [
        {objectID: 1, Title: 'Learning ReactJS', Author: 'Robin Wieruch', NumComments: 3, Points: 42},
        {objectID: 2, Title: 'Learning JavaScript', Author: 'Robin Wieruch', NumComments: 2, Points: 18},
        {objectID: 3, Title: 'Learning Programming', Author: 'Robin Wieruch', NumComments: 1, Points: 5},
        {objectID: 4, Title: 'Learning PHP', Author: 'Jason Gilmore', NumComments: 10, Points: 50},
        {objectID: 5, Title: 'Learning Python', Author: 'Mark Lutz', NumComments: 10, Points: 50},
    ];
  //for search
  const [search, setSearch] = useState(localStorage.getItem('search') || 'React');
  const handleSearch = (e) => {
    setSearch(e.target.value);
    localStorage.setItem('search', e.target.value);
  };
    //use effect: 
  useEffect(() => {
    localStorage.setItem('search', search);
  }, [search]);
  return (
    <>
      <h1>Nested destructuring example in React using props</h1>
      <Students allstudents={studs} total={studs.students.length}/>
      <hr />
      <h3>List and Item Component</h3>
      <p>Here in list component, we are passing array of objects data (lists) to item component using props. In <code>{`lists.map(({objectID, ...rest},index)`}</code> rest is used as rest operator and in <code>{`<Item key={objectID} {...rest} />`}</code> ...rest is used as spread operator</p>
      <List lists={lists} />
    <hr />
      <h3>Search Component: {search}</h3>
      <Search search={search} handleSearch={handleSearch} />
      <hr />
      <h2>About useEffect Hook</h2>
      <p>The useEffect Hook in React is used to perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.</p>
      <ul>
        <li>useEffect runs after every completed render .
          <pre>{`useEffect(() => {
//Runs on every render
});`} </pre></li>
        <li>You can choose to fire it only when certain values have changed .
          <pre> {`useEffect(() => {
//Runs only if search changes in second parameter array
}, [search]);`} </pre></li>
        <li>This is useful for optimizing performance and preventing memory leaks by cleaning up subscriptions or event listeners . </li>
      </ul>
      <Counter />
    </>
    
  )
    

}

export default App
