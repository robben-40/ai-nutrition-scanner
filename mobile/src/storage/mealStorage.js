import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "meal_history";

export const saveMeal = async (meal) => {
  const existing = await getMeals();
  const updated = [
    { ...meal, id: Date.now(), timestamp: new Date().toISOString() },
    ...existing,
  ];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
};

export const getMeals = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const getTodayMeals = async () => {
  const all = await getMeals();
  const today = new Date().toDateString();
  return all.filter(m => new Date(m.timestamp).toDateString() === today);
};

export const deleteMeal = async (id) => {
  const existing = await getMeals();
  const updated = existing.filter(m => m.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
};