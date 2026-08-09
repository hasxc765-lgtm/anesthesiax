export const store = {
  state: {
    currentView: 'dashboard', // 'dashboard' | 'drugCenter' | 'airway' | 'fluidAbl'
    patientWeight: 0,
    patientAge: '',
    patientGender: 'male',
    fastingHours: 6,
    fluidStrategy: 'eras',
    surgicalTrauma: 'moderate',
    ebvAgeGroup: 'adult_male',
    hbInitial: '',
    hbTarget: '',
    currentBloodLoss: '',
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
