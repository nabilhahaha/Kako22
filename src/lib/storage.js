const KEYS = {
  INVENTORY: 'nearExpiry_inventory',
  REQUESTS: 'nearExpiry_requests',
};

export const loadInventory = () => {
  try {
    const data = localStorage.getItem(KEYS.INVENTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveInventory = (data) =>
  localStorage.setItem(KEYS.INVENTORY, JSON.stringify(data));

export const loadRequests = () => {
  try {
    const data = localStorage.getItem(KEYS.REQUESTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRequests = (requests) =>
  localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
