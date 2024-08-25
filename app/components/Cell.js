const Cell = ({ id }) => {
    const { cells, setCell } = useStore();
    const handleChange = (e) => {
      setCell(id, e.target.innerText);
    };
  
    return (
      <div
        className="border p-2 min-h-[40px]"
        contentEditable
        onInput={handleChange}
      >
        {cells[id] || ''}
      </div>
    );
  };
  