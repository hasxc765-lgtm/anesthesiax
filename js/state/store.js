export const store = {
  state: {
    currentView: 'dashboard', // 'dashboard' | 'drugCenter'
    patientWeight: 0,
    searchQuery: '',
    currentCategory: 'All',
    selectedConcentrations: {},
    customConcentrations: {},
    selectedIndications: {}
  },

  setView(viewName) {
    this.state.currentView = viewName;
  },

  setWeight(weight) {
    this.state.patientWeight = weight;
  },

  setSearchQuery(query) {
    this.state.searchQuery = query;
  },

  setCategory(cat) {
    this.state.currentCategory = cat;
  },

  setSelectedIndication(drugId, indId) {
    this.state.selectedIndications[drugId] = indId;
  },

  setSelectedConcentration(drugId, concVal) {
    this.state.selectedConcentrations[drugId] = concVal;
  },

  setCustomConcentration(drugId, val) {
    if (val && val > 0) {
      this.state.customConcentrations[drugId] = val;
    } else {
      delete this.state.customConcentrations[drugId];
    }
  }
};
