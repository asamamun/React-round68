# Hacker Stories App - Complete Architecture & Workflow Guide

## Overview
This is a React application that fetches and displays stories from the Hacker News API using **styled-components**, **hooks**, and **state management**. It demonstrates modern React patterns including reducers, callbacks, custom hooks, and persistent storage.

---

## 1. STYLED COMPONENTS

### What are Styled Components?
Styled-components is a library that allows you to write CSS directly in JavaScript. Each styled component is a React component with attached styles.

### Styled Components Used in This App

```javascript
const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;
```

**Key Benefits:**
- ✅ Scoped styles (no global CSS conflicts)
- ✅ Dynamic styling using props: `width: ${(props) => props.width};`
- ✅ Easier to maintain and delete (styles move with component)
- ✅ No need for separate CSS files

### All Styled Components in App:

| Component | Purpose |
|-----------|---------|
| `StyledContainer` | Main wrapper with gradient background |
| `StyledHeadlinePrimary` | Large heading (h1) |
| `StyledItem` | List item styling (flexbox layout) |
| `StyledColumn` | Individual columns in list (responsive width) |
| `StyledButton` | Base button with hover effects |
| `StyledButtonSmall` | Small button variant |
| `StyledButtonLarge` | Large button variant |
| `StyledSearchForm` | Search form layout |
| `StyledLabel` | Label styling |
| `StyledInput` | Input field styling |

### Example: Dynamic Styling with Props
```javascript
const StyledColumn = styled.span`
  width: ${(props) => props.width};  // Width comes from props!
`;

// Usage:
<StyledColumn width="40%">...</StyledColumn>
```

---

## 2. STATE MANAGEMENT WITH REDUCER

### What is a Reducer?
A reducer is a function that takes current state and an action, then returns new state. It's like a state machine for complex state logic.

### The `storiesReducer` Function

```javascript
const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    
    case 'STORIES_FETCH_SUCCESS':
      return { ...state, isLoading: false, data: action.payload };
    
    case 'STORIES_FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    
    case 'REMOVE_STORY':
      return { ...state, data: state.data.filter(story => 
        action.payload.objectID !== story.objectID) };
    
    default:
      throw new Error();
  }
};
```

### How Reducer is Used
```javascript
const [stories, dispatchStories] = React.useReducer(
  storiesReducer,
  { data: [], isLoading: false, isError: false }
);
```

**Parameters:**
- `storiesReducer`: The reducer function
- `{ data: [], isLoading: false, isError: false }`: Initial state

**Returns:**
- `stories`: Current state object
- `dispatchStories`: Function to trigger actions

### State Flow Diagram
```
Action Dispatched
      ↓
storiesReducer (receives state + action)
      ↓
Returns new state
      ↓
Component re-renders with new state
```

### Actions Breakdown

**1. STORIES_FETCH_INIT** - When fetch starts
```javascript
dispatchStories({ type: 'STORIES_FETCH_INIT' });
// Sets isLoading: true to show "Loading..." message
```

**2. STORIES_FETCH_SUCCESS** - When fetch succeeds
```javascript
dispatchStories({ type: 'STORIES_FETCH_SUCCESS', payload: result.data.hits });
// Stores fetched stories in state.data
```

**3. STORIES_FETCH_FAILURE** - When fetch fails
```javascript
dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
// Sets isError: true to show error message
```

**4. REMOVE_STORY** - When user dismisses a story
```javascript
dispatchStories({ type: 'REMOVE_STORY', payload: item });
// Removes story from list using filter
```

---

## 3. CUSTOM HOOK: useStorageState

### What is a Custom Hook?
A custom hook is a reusable function that uses other hooks to extract component logic.

### The `useStorageState` Hook

```javascript
const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};
```

### How It Works

1. **Initialize State**: Looks for saved value in localStorage, uses initialState as fallback
2. **Persist to Storage**: Every time value changes, it automatically saves to localStorage
3. **Return Interface**: Like useState, returns [value, setValue]

### Usage in App
```javascript
const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
```

**Benefits:**
- ✅ User's search term is preserved even after page refresh
- ✅ Reusable across any component
- ✅ Clean, readable code

---

## 4. CALLBACKS & PERFORMANCE OPTIMIZATION

### What is `useCallback`?
`useCallback` memoizes a function so it only recreates when dependencies change. Prevents unnecessary re-renders of child components.

### The `handleFetchStories` Callback

```javascript
const handleFetchStories = React.useCallback(async () => {
  dispatchStories({ type: 'STORIES_FETCH_INIT' });

  try {
    const result = await axios.get(url);
    dispatchStories({
      type: 'STORIES_FETCH_SUCCESS',
      payload: result.data.hits,
    });
  } catch {
    dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
  }
}, [url]);  // Only recreate if 'url' changes
```

**What it does:**
1. Sets loading state
2. Makes HTTP request to Hacker News API
3. Updates state with fetched data on success
4. Sets error state on failure

**Dependency:** Only recreates when `url` changes

---

## 5. COMPLETE WORKFLOW

### Data Flow in the App

```
┌─────────────────────────────────────────────┐
│ Component Renders (App)                     │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
   Initial State            useEffect Hook
   created                   (runs on mount)
        │                         │
        └────────────┬────────────┘
                     ↓
            handleFetchStories()
                     │
        ├────────────┼────────────┤
        ↓            ↓            ↓
   Dispatch     Fetch from    Dispatch
   INIT action  API          SUCCESS/FAILURE
        │            │            │
        └────────────┴────────────┘
                     ↓
            storiesReducer updates
                     │
                     ↓
            Component re-renders
            with new data
```

### Step-by-Step Execution

#### Step 1: App Component Mounts
```javascript
const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  // searchTerm = 'React' (from localStorage or default)
  
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  // url = 'https://hn.algolia.com/api/v1/search?query=React'
  
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {...});
  // stories = { data: [], isLoading: false, isError: false }
```

#### Step 2: useEffect Triggers Fetch
```javascript
React.useEffect(() => {
  handleFetchStories();  // Called on mount and when url changes
}, [handleFetchStories]);
```

#### Step 3: Fetch Begins
```javascript
handleFetchStories = async () => {
  dispatchStories({ type: 'STORIES_FETCH_INIT' });
  // NOW: stories.isLoading = true, isError = false
  // UI shows: "Loading ..."
```

#### Step 4: HTTP Request
```javascript
const result = await axios.get(url);
// Makes request to Hacker News API
// Waits for response...
```

#### Step 5: Success or Failure
```javascript
// SUCCESS:
dispatchStories({
  type: 'STORIES_FETCH_SUCCESS',
  payload: result.data.hits  // Array of stories
});
// NOW: stories.data = [story1, story2, ...]
//      stories.isLoading = false

// or FAILURE:
dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
// NOW: stories.isError = true
//      UI shows: "Something went wrong ..."
```

#### Step 6: Render Stories
```javascript
<List list={stories.data} onRemoveItem={handleRemoveStory} />
// Displays each story in a list
```

---

## 6. USER INTERACTIONS

### Search Action
```javascript
const handleSearchInput = (event) => {
  setSearchTerm(event.target.value);  // Update search term
};

const searchAction = () => {
  setUrl(`${API_ENDPOINT}${searchTerm}`);  // Update URL
  // This triggers useEffect → handleFetchStories → new data
};
```

**Flow:**
User types → setSearchTerm → searchAction → setUrl → useEffect → fetch → render

### Remove Story Action
```javascript
const handleRemoveStory = (item) => {
  dispatchStories({
    type: 'REMOVE_STORY',
    payload: item,
  });
};
```

**Reducer handles it:**
```javascript
case 'REMOVE_STORY':
  return {
    ...state,
    data: state.data.filter(story => 
      action.payload.objectID !== story.objectID  // Keep all except this one
    ),
  };
```

---

## 7. COMPONENT HIERARCHY

```
App (Main Component)
├── StyledHeadlinePrimary (Title)
├── SearchForm (Search Input)
│   └── InputWithLabel (Reusable Input)
├── List (Stories List)
│   └── Item (Individual Story)
│       └── StyledColumn × 5 (Story Data)
└── Conditional Rendering
    ├── Error Message (if isError)
    ├── Loading Message (if isLoading)
    └── List (if loaded)
```

### Component Details

#### SearchForm Component
- Props: `searchTerm`, `onSearchInput`, `searchAction`
- Displays input field and submit button
- Calls `onSearchInput` on input change
- Calls `searchAction` on submit

#### InputWithLabel Component
- Props: `id`, `value`, `type`, `onInputChange`, `isFocused`, `children`
- Uses `useRef` to focus input if `isFocused=true`
- Uses `useEffect` to trigger focus

#### List Component
- Props: `list` (array of stories), `onRemoveItem`
- Maps through stories to render Item components

#### Item Component
- Props: `item` (story object), `onRemoveItem`
- Displays: title, author, comments, points, dismiss button
- Styled columns with different widths (40%, 30%, 10%, 10%, 10%)

---

## 8. KEY REACT CONCEPTS USED

| Concept | Used For | How |
|---------|----------|-----|
| **useState** | Search term storage | `useStorageState` custom hook |
| **useReducer** | Complex stories state | Managing loading/error/data |
| **useEffect** | Side effects | Fetching data, saving to storage |
| **useCallback** | Memoization | Preventing unnecessary re-renders |
| **useRef** | DOM access | Focusing input element |
| **Custom Hook** | Reusability | `useStorageState` logic separation |
| **Conditional Rendering** | Conditional UI | Showing loading/error/data |
| **Props** | Component communication | Passing data and callbacks down |

---

## 9. DATA FLOW SUMMARY

```
User searches for term
        ↓
setSearchTerm updates
        ↓
searchAction() called
        ↓
setUrl updates
        ↓
useEffect detects url change
        ↓
handleFetchStories executes
        ↓
Dispatch INIT (loading = true)
        ↓
Axios fetches from API
        ↓
Dispatch SUCCESS/FAILURE
        ↓
Reducer updates stories state
        ↓
Component re-renders
        ↓
User sees stories or error/loading message
```

---

## 10. PRACTICAL LEARNING POINTS FOR STUDENTS

1. **Styled Components benefit**: CSS with JS logic, no naming conflicts
2. **Reducer pattern**: Great for complex state with multiple related values
3. **Custom hooks**: Encapsulate logic that can be reused
4. **useCallback**: Optimize performance, especially with lists
5. **localStorage**: Persist user preferences across sessions
6. **Error handling**: Try-catch for API calls, state for error display
7. **Async/await**: Modern way to handle promises
8. **Component composition**: Build complex UIs from simple pieces

---

## API Response Structure

Example from Hacker News API:
```javascript
{
  hits: [
    {
      objectID: "123456",
      title: "React Best Practices",
      url: "https://example.com",
      author: "john_doe",
      points: 250,
      num_comments: 45
    },
    // More stories...
  ]
}
```

---

## Summary

This application demonstrates **professional React development** by combining:
- **Styling**: styled-components for scoped CSS
- **State**: useReducer for complex state management
- **Hooks**: Custom hooks for reusable logic
- **Performance**: useCallback for optimization
- **Persistence**: localStorage via custom hook
- **Async**: axios + async/await for API calls
- **Architecture**: Component hierarchy with clear separation of concerns

Students will understand not just "how to code React," but "how to architect scalable React applications."
