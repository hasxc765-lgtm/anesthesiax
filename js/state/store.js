export const store = {
  state: {
    currentView: 'dashboard', // 'dashboard' | 'drugCenter' | 'airway'
    patientWeight: 0,
    patientAge: '',
    patientGender: 'male',
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

  setAge(age) {
    this.state.patientAge = age;
  },

  setGender(gender) {
    this.state.patientGender = gender;
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
