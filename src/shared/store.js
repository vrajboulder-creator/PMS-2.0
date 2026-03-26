/* ═══ SHARED DATA STORE ═══ */
// Module-level refs updated by App on each render so all components can access data
export let _TEAM = [];
export let _CLIENTS = [];
export let _PROJECTS = [];

export const setStore = (team, clients, projects) => {
  _TEAM = team;
  _CLIENTS = clients;
  _PROJECTS = projects;
};

export const gm = id => _TEAM.find(t => t.id === id) || null;
export const gc = id => _CLIENTS.find(c => c.id === id);
