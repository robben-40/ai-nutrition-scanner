import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getTodayMeals } from "../storage/mealStorage";
import {theme} from '../constants/theme';


const MacroCard = ({ label, value, color }) => (
  <View style={styles.macroCard}>
    <Text style={styles.macroLabel}>{label}</Text>
    <Text style={[styles.macroValue, { color }]}>{value}g</Text>
  </View>
);

export default function DashboardScreen() {
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0 });

  useFocusEffect(
    useCallback(() => {
      loadTodayData();
    }, [])
  );

  const loadTodayData = async () => {
    const todayMeals = await getTodayMeals();
    setMeals(todayMeals);

    const newTotals = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      protein: acc.protein + (meal.protein || 0),
      fat: acc.fat + (meal.fat || 0),
      sugar: acc.sugar + (meal.sugar || 0),
    }), { calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0 });

    setTotals(newTotals);
  };

  const dailyGoal = 2000;
  const progressWidth = Math.min((totals.calories / dailyGoal) * 100, 100);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateString = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.dayText}>{dayName}</Text>
          <Text style={styles.dateText}>{dateString} · {meals.length} meals logged</Text>
        </View>

        <View style={styles.calorieSection}>
          <View style={styles.calorieTextRow}>
            <Text style={styles.calorieLarge}>{totals.calories.toLocaleString()}</Text>
            <View style={styles.calorieLabelBox}>
              <Text style={styles.calorieSmall}>of</Text>
              <Text style={styles.calorieSmall}>{dailyGoal.toLocaleString()} kcal</Text>
            </View>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressWidth}%` }]} />
          </View>
        </View>

        <View style={styles.macroGrid}>
          <MacroCard label="CARBS" value={totals.carbs} color={theme.colors.carbs} />
          <MacroCard label="PROTEIN" value={totals.protein} color={theme.colors.protein} />
          <MacroCard label="FAT" value={totals.fat} color={theme.colors.fat} />
          <MacroCard label="SUGAR" value={totals.sugar} color={theme.colors.sugar} />
        </View>


        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>MEALS</Text>
          
          {meals.map((meal) => {
            const timeString = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <View key={meal.id} style={styles.mealItem}>
                {meal.imageUri ? (
                  <Image source={{ uri: meal.imageUri }} style={styles.mealImage} />
                ) : (
                  <View style={styles.mealImagePlaceholder} />
                )}
                
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.food}</Text>
                  <Text style={styles.mealTime}>{timeString}</Text>
                </View>

                <View style={styles.mealCalories}>
                  <Text style={styles.mealCalNum}>{meal.calories}</Text>
                  <Text style={styles.mealCalText}>kcal</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 32,
    paddingTop: 10,
  },
  dayText: {
    fontSize: 32,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: -1,
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
    marginTop: 4,
  },
  calorieSection: {
    marginBottom: 32,
  },
  calorieTextRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  calorieLarge: {
    fontSize: 56,
    fontWeight: "900",
    letterSpacing: -2,
    color: theme.colors.text,
    lineHeight: 60,
  },
  calorieLabelBox: {
    marginLeft: 8,
    paddingBottom: 8,
  },
  calorieSmall: {
    fontSize: 14,
    color: theme.colors.subtext,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.sm,
  },
  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
    gap: 12,
  },
  macroCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  macroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.hint,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  mealsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.hint,
    letterSpacing: 1,
    marginBottom: 16,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  mealImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  mealInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 12,
    color: theme.colors.subtext,
    fontWeight: "500",
  },
  mealCalories: {
    alignItems: "flex-end",
  },
  mealCalNum: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  mealCalText: {
    fontSize: 12,
    color: theme.colors.text, 
    fontWeight: "600",
    marginTop: -2,
  },
});