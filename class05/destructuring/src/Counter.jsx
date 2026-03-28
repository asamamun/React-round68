import {useState, useEffect} from 'react';
const Counter = () => {
    const [count, setCount] = useState(localStorage.getItem('count') || 0);
    useEffect(() => {
    setTimeout(() => {
      setCount((count) => parseInt(count) + 1);
      localStorage.setItem('count', count.toString());
      console.log(count);
    }, 1000);
  },[count]);
  //reset count
  const resetCount = () => {
    setCount(0);
    localStorage.setItem('count', '0');
  };
  return (
    <>
    <h1>I have been rendered {count} times</h1>
    <button onClick={resetCount}>Reset Count</button>
    </>
  )

};
export default Counter;
