import React, { useEffect, useState } from "react";

let localItemsList = JSON.parse(localStorage.getItem("items"));
localItemsList = localItemsList ? localItemsList : [];

export default function App() {
  const [items, setItems] = useState(localItemsList);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const [input, setInput] = useState("");
  const [index, setIndex] = useState();

  function handleSubmit(e) {
    e.preventDefault();
    if (isUpdateMode) {
      setItems([...items.map((item, i) => (i === index ? input : item))]);
      setInput("");
      setIsUpdateMode(false);
      return;
    }
    if (items.includes(input)) {
      alert("Item already exists");
    } else {
      setItems([...items, input]);
      setInput("");
    }
  }

  function handleUpdate(e, index) {
    console.log(index);
    if (e.detail === 2) {
      setIsUpdateMode(true);
      setInput(items[index]);
      setIndex(index);
    }
  }

  function handleDelete(index) {
    setItems([...items.filter((item, i) => i !== index)]);
  }

  return (
    <main>
      <div className="container">
        <Header />
        <Form
          isUpdateMode={isUpdateMode}
          setIsUpdateMode={setIsUpdateMode}
          handleSubmit={handleSubmit}
          items={items}
          input={input}
          setInput={setInput}
        />
        {items.length > 0 && (
          <Filter filterInput={filterInput} setFilterInput={setFilterInput} />
        )}
        <ItemsList
          items={items}
          filterInput={filterInput}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        {items.length > 0 && (
          <Button
            onClick={() => window.confirm("Clear All?") && setItems([])}
            customClass={"btn-clear"}
          >
            Clear All
          </Button>
        )}
      </div>
      <footer>Fahed Nassar - 2023</footer>
    </main>
  );
}

function Header() {
  return (
    <header>
      <img src="note.png" alt="note" />
      <h1 id="app-title">Shopping List</h1>
    </header>
  );
}

function Form({
  isUpdateMode,
  setIsUpdateMode,
  handleSubmit,
  items,
  input,
  setInput,
}) {
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  return (
    <form id="item-form" onSubmit={handleSubmit}>
      <div className="form-control">
        <input
          type="text"
          className="form-input"
          id="item-input"
          placeholder="Enter Item"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="form-control">
        {!isUpdateMode && <Button customClass={"btn"}>Add Item</Button>}
        {isUpdateMode && (
          <Button customClass={"btn btn-update"}>Update Item</Button>
        )}
        {isUpdateMode && (
          <Button
            onClick={() => {
              setIsUpdateMode(false);
              setInput("");
            }}
            customClass={"btn"}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function Button({ children, customClass, onClick }) {
  return (
    <button onClick={onClick} type="submit" className={customClass}>
      {children}
    </button>
  );
}

function Filter({ filterInput, setFilterInput }) {
  return (
    <div className="filter">
      <input
        type="text"
        className="form-input-filter"
        id="filter"
        placeholder="Filter Items"
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
      />
    </div>
  );
}

function ItemsList({ items, filterInput, onUpdate, onDelete }) {
  return (
    <ul id="item-list" className="items">
      {items
        .filter((item) => {
          return filterInput === ""
            ? item
            : item.toLowerCase().includes(filterInput);
        })
        .map((item, index) => (
          <li key={index} onClick={(e) => onUpdate(e, index)}>
            {item}
            <button
              onClick={() => onDelete(index)}
              className="remove-item btn-link text-red"
            >
              x
            </button>
          </li>
        ))}
    </ul>
  );
}
