const useStore = create(set => ({
    cells: {},
    history: [],
    setCell: (id, value) => set(state => {
      const newHistory = [...state.history, { [id]: state.cells[id] }];
      return {
        cells: { ...state.cells, [id]: value },
        history: newHistory,
      };
    }),
    undo: () => set(state => {
      const lastChange = state.history.pop();
      return { cells: { ...state.cells, ...lastChange }, history: state.history };
    }),
    redo: () => { /* Implement redo logic here */ },
  }));
  