# React Reducer Tutorial - বাংলায়

## 📚 সূচিপত্র
1. [useState বনাম useReducer](#useState-বনাম-useReducer)
2. [useReducer কি?](#userReducer-কি)
3. [আমাদের উদাহরণ: Student Management System](#আমাদের-উদাহরণ)
4. [ধাপে ধাপে ব্যাখ্যা](#ধাপে-ধাপে-ব্যাখ্যা)
5. [কেন useState যথেষ্ট নয়?](#কেন-useState-যথেষ্ট-নয়)
6. [সম্পূর্ণ কোড উদাহরণ](#সম্পূর্ণ-কোড-উদাহরণ)

---

## useState বনাম useReducer

### কখন useState ব্যবহার করবেন?
```javascript
// ✅ সহজ state - একটি ভেরিয়েবল
const [count, setCount] = useState(0);
const [name, setName] = useState("");
```

### কখন useReducer ব্যবহার করবেন?
```javascript
// ❌ জটিল state - একাধিক ভেরিয়েবল যা একসাথে পরিবর্তিত হয়
const [state, dispatch] = useReducer(reducer, initialState);
```

---

## useReducer কি?

**useReducer** হলো React-এর একটি Hook যা জটিল state management এর জন্য ব্যবহৃত হয়। এটি Redux (state management library) এর মতো কাজ করে কিন্তু ছোট আকারে।

### তিনটি মূল অংশ:

1. **initialState** - শুরুতে state কেমন থাকবে
2. **reducer function** - state কিভাবে পরিবর্তিত হবে
3. **dispatch** - action পাঠানোর মাধ্যম

---

## আমাদের উদাহরণ: Student Management System

আমাদের `App.jsx` ফাইলে একটি শিক্ষার্থী ব্যবস্থাপনা সিস্টেম আছে যেখানে:
- Round number (68)
- Batch name (WDPF)
- Students list (নামের তালিকা)
- Subjects list (বিষয়ের তালিকা)

### সমস্যা:
এই চারটি state আলাদাভাবে `useState` দিয়ে manage করা কঠিন কারণ:
- একসাথে multiple state update করতে হয়
- State গুলো পরস্পর সম্পর্কিত
- Complex logic handle করা প্রয়োজন

---

## ধাপে ধাপে ব্যাখ্যা

### ধাপ ১: initialState তৈরি করা

```javascript
const initialState = { 
    round: 68, 
    batch: "WDPF",
    students: [], 
    subjects: ["HTML","CSS","JS", "PHP", "MYSQL"] 
};
```

**ব্যাখ্যা:**
- `round`: 68 (আমাদের বর্তমান রাউন্ড)
- `batch`: "WDPF" (ব্যাচের নাম)
- `students`: [] (শুরুতে খালি, পরে শিক্ষার্থী যোগ হবে)
- `subjects`: 5টি বিষয় শুরুতেই আছে

> 💡 **মনে রাখবেন:** `initialState` একটি **constant** - এটি কখনো পরিবর্তন হয় না!

---

### ধাপ ২: reducer function তৈরি করা

```javascript
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_STUDENT":
      return { ...state, students: [...state.students, action.payload] };
    
    case "REMOVE_STUDENT":
      return { ...state, students: state.students.filter((student) => student !== action.payload) };
    
    case "ADD_SUBJECT":
      return { ...state, subjects: [...state.subjects, action.payload] };
    
    case "REMOVE_SUBJECT":
      return { ...state, subjects: state.subjects.filter((subject) => subject !== action.payload) };
    
    case "CHANGE_ROUND":  
      return { ...state, round: action.payload };
    
    case "CHANGE_BATCH":  
      return { ...state, batch: action.payload };
    
    default:
      return state;
  }
};
```

**ব্যাখ্যা:**

#### reducer function কি করে?
- এটি **পুরানো state** এবং **action** নেয়
- নতুন state রিটার্ন করে
- **কখনো সরাসরি state পরিবর্তন করে না** (immutable)

#### প্রতিটি case:

1. **ADD_STUDENT**: নতুন শিক্ষার্থী যোগ করে
   ```javascript
   { ...state, students: [...state.students, action.payload] }
   ```
   - `...state` = বাকি সব state অপরিবর্তিত থাকে
   - `students: [...state.students, action.payload]` = নতুন শিক্ষার্থী যুক্ত হয়

2. **REMOVE_STUDENT**: শিক্ষার্থী মুছে ফেলে
   ```javascript
   state.students.filter((student) => student !== action.payload)
   ```
   - `filter()` শুধু সেই শিক্ষার্থীদের রাখে যারা মুছে ফেলার কথা নয়

3. **ADD_SUBJECT**: নতুন বিষয় যোগ করে
4. **REMOVE_SUBJECT**: বিষয় মুছে ফেলে
5. **CHANGE_ROUND**: রাউন্ড নাম্বার পরিবর্তন করে
6. **CHANGE_BATCH**: ব্যাচের নাম পরিবর্তন করে

---

### ধাপ ৩: Component-এ useReducer ব্যবহার করা

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

**ব্যাখ্যা:**
- `state`: বর্তমান state (আপনি এটি render এ ব্যবহার করেন)
- `dispatch`: function যা action পাঠায়
- `reducer`: যে function state পরিবর্তন করে
- `initialState`: শুরুতে state কেমন থাকবে

> ⚠️ **গুরুত্বপূর্ণ:** state সরাসরি পরিবর্তন করা যায় না! শুধুমাত্র dispatch এর মাধ্যমে action পাঠিয়ে পরিবর্তন করা যায়।

---

### ধাপ ৪: Action Dispatch করা

```javascript
const addStudent = (student) => {
  dispatch({ type: "ADD_STUDENT", payload: student });
};
```

**ব্যাখ্যা:**
- `dispatch()` function টি reducer-এ action পাঠায়
- `type`: বলে কোন action নিতে হবে ("ADD_STUDENT")
- `payload`: ডেটা যা পরিবর্তন করতে হবে (student নাম)

#### Button এ ব্যবহার:
```javascript
<button 
  type="button" 
  onClick={() => addStudent(newStudent)}
>
  Add Student
</button>
```

**কাজের ধারা:**
1. User button এ click করল
2. `addStudent(newStudent)` function call হলো
3. `dispatch()` action পাঠাল: `{ type: "ADD_STUDENT", payload: "Rahim" }`
4. `reducer` action পেল এবং নতুন state তৈরি করল
5. React automatically component re-render করল
6. নতুন শিক্ষার্থী লিস্টে দেখা গেল!

---

## কেন useState যথেষ্ট নয়?

### ❌ সমস্যা #১: আলাদা আলাদা useState

```javascript
// খারাপ উপায় - ৪টি আলাদা useState
const [round, setRound] = useState(68);
const [batch, setBatch] = useState("WDPF");
const [students, setStudents] = useState([]);
const [subjects, setSubjects] = useState(["HTML","CSS","JS", "PHP", "MYSQL"]);

// সমস্যা: একসাথে multiple state update করা কঠিন!
```

**সমস্যা:**
- ৪টি different state variables
- ৪টি different setter functions
- একসাথে update করা complicated
- Code readability কমে

---

### ❌ সমস্যা #২: Complex Update Logic

```javascript
// যদি আপনি একসাথে round এবং batch পরিবর্তন করতে চান
setRound(69);
setBatch("WDPF-A");

// অথবা students list এ নতুন শিক্ষার্থী যোগ করতে চান
setStudents([...students, newStudent]);

// সমস্যা: প্রতিবার manually immutable হতে হয়
// ভুল করার সম্ভাবনা বেশি!
```

---

### ✅ সমাধান: useReducer

```javascript
// ভালো উপায় - একটি state object
const [state, dispatch] = useReducer(reducer, initialState);

// যেকোনো জায়গা থেকে access করা যায়
state.round
state.batch
state.students
state.subjects

// যেকোনো update করা যায় একটি action দিয়ে
dispatch({ type: "CHANGE_ROUND", payload: 69 });
dispatch({ type: "ADD_STUDENT", payload: "Rahim" });
```

**সুবিধা:**
- ✅ একটি centralized state management
- ✅ Predictable updates (কোন action নিলে কি হবে তা reducer এ clearly defined)
- ✅ Easy to test (reducer function আলাদাভাবে test করা যায়)
- ✅ Debugging সহজ (কোন action dispatch হয়েছে তা track করা যায়)
- ✅ Complex logic handle করা সহজ

---

## বাস্তব উদাহরণ তুলনা

### useState দিয়ে (জটিল):

```javascript
const [round, setRound] = useState(68);
const [batch, setBatch] = useState("WDPF");
const [students, setStudents] = useState([]);
const [subjects, setSubjects] = useState([]);

// Student add করা
const addStudent = (name) => {
  // আগের students list copy করে নতুন student add করতে হয়
  setStudents([...students, name]);
  // ভুল হওয়ার সম্ভাবনা: students instead of [...students, name]
};

// Multiple updates
const upgradeBatch = () => {
  setRound(round + 1);
  setBatch("WDPF-" + (round + 1));
  // সমস্যা: দুটি আলাদা state update, race condition হতে পারে!
};
```

---

### useReducer দিয়ে (সহজ):

```javascript
const [state, dispatch] = useReducer(reducer, initialState);

// Student add করা - সহজ!
const addStudent = (name) => {
  dispatch({ type: "ADD_STUDENT", payload: name });
  // reducer automatically handle করবে
};

// Multiple updates - একটি action এ!
const upgradeBatch = () => {
  dispatch({ type: "UPGRADE_BATCH", payload: state.round + 1 });
  // reducer একসাথে round এবং batch update করবে
};
```

---

## সম্পূর্ণ কোড উদাহরণ

```javascript
import React, { useReducer, useState } from 'react';

// ১. Initial State - শুরুতে কেমন থাকবে
const initialState = { 
    round: 68, 
    batch: "WDPF",
    students: [], 
    subjects: ["HTML","CSS","JS", "PHP", "MYSQL"] 
};

// ২. Reducer Function - state কিভাবে পরিবর্তিত হবে
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_STUDENT":
      return { ...state, students: [...state.students, action.payload] };
    
    case "REMOVE_STUDENT":
      return { ...state, students: state.students.filter((student) => student !== action.payload) };
    
    case "ADD_SUBJECT":
      return { ...state, subjects: [...state.subjects, action.payload] };
    
    case "REMOVE_SUBJECT":
      return { ...state, subjects: state.subjects.filter((subject) => subject !== action.payload) };
    
    case "CHANGE_ROUND":  
      return { ...state, round: action.payload };
    
    case "CHANGE_BATCH":  
      return { ...state, batch: action.payload };
    
    default:
      return state;
  }
};

// ৩. Component
const App = () => {
  const [newStudent, setNewStudent] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Action creators
  const addStudent = (student) => {
    dispatch({ type: "ADD_STUDENT", payload: student });
  };
  
  const removeStudent = (student) => {
    dispatch({ type: "REMOVE_STUDENT", payload: student });
  };
  
  return (
    <div>
      <h1>Batch Info</h1>
      
      {/* State Display */}
      <ul>
        <li>Round: {state.round}</li>
        <li>Batch: {state.batch}</li>
        <li>Students: {state.students.length}
          <ul>
            {state.students.map((student, index) => (
              <li key={index}>
                {student} 
                <button onClick={() => removeStudent(student)}>×</button>
              </li>
            ))}
          </ul>
        </li>
      </ul>
      
      {/* Add Student Form */}
      <input 
        type="text" 
        placeholder="Enter student name" 
        onChange={(e) => setNewStudent(e.target.value)} 
        value={newStudent} 
      />
      <button onClick={() => addStudent(newStudent)}>Add Student</button>
    </div>
  )
}

export default App
```

---

## 🎯 মূল কথাগুলো

### useReducer ব্যবহার করবেন যখন:

1. ✅ একাধিক related state variables আছে
2. ✅ State updates complex logic প্রয়োজন
3. ✅ একসাথে multiple states update করতে হয়
4. ✅ State transitions predictable হতে হয়
5. ✅ Debugging এবং testing সহজ করতে চান

### useState ব্যবহার করবেন যখন:

1. ✅ Simple, independent state variables
2. ✅ Single value updates
3. ✅ No complex logic involved
4. ✅ Quick prototypes বা ছোট components

---

## 📝 অনুশীলনী

### Task ১:
নতুন action যোগ করুন যা একসাথে একজন শিক্ষার্থী এবং একটি বিষয় যোগ করে:
```javascript
case "ADD_BOTH":
  // আপনার কোড এখানে লিখুন
```

### Task ২:
একটি action তৈরি করুন যা সব শিক্ষার্থী মুছে ফেলে:
```javascript
case "CLEAR_ALL_STUDENTS":
  // আপনার কোড এখানে লিখুন
```

### Task ৩:
একটি action তৈরি করুন যা round 1 বাড়ায়:
```javascript
case "INCREMENT_ROUND":
  // আপনার কোড এখানে লিখুন
```

---

## 🎓 সারসংক্ষেপ

| বিষয় | useState | useReducer |
|-------|----------|------------|
| **Complexity** | সহজ | জটিল |
| **State Variables** | ১টি বা কয়েকটি | একাধিক, related |
| **Update Logic** | সরাসরি | reducer এর মাধ্যমে |
| **Code Organization** | ছড়িয়ে ছিটিয়ে | centralized |
| **Debugging** | কঠিন | সহজ |
| **Testing** | কঠিন | সহজ |
| **Best For** | Simple forms, counters | Complex apps, forms with validation |

---

## 📚 আরও পড়ুন

- [React Official Docs - useReducer](https://react.dev/reference/react/useReducer)
- [React Official Docs - useState](https://react.dev/reference/react/useState)
- [When to use useReducer vs useState](https://react.dev/learn/extracting-state-logic-into-a-reducer)

---

**লেখক:** React Reducer Tutorial  
**তারিখ:** March 31, 2026  
**উদ্দেশ্য:** শিক্ষার্থীদের জটিল state management বোঝানো
