const Grid = () => {
    const rows = 50; // example row count
    const cols = 20; // example column count
  
    return (
      <div className="grid grid-cols-20 gap-1">
        {Array.from({ length: rows * cols }).map((_, index) => (
          <div
            key={index}
            className="border p-2 min-h-[40px]"
            contentEditable
          >
          </div>
        ))}
      </div>
    );
  };
  
  export default Grid;
  