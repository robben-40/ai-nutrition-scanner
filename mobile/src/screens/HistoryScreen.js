import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, SectionList, Image, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMeals, deleteMeal } from "../storage/mealStorage";
import { theme } from "../constants/theme";

export default function HistoryScreen() {
  const [sections, setSections] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const allMeals = await getMeals();
    
    const grouped = allMeals.reduce((acc, meal) => {
      const dateStr = new Date(meal.timestamp).toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(meal);
      return acc;
    }, {});

    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const formattedSections = Object.keys(grouped).map(dateStr => {
      let title = "";
      if (dateStr === todayStr) {
        title = "TODAY";
      } else if (dateStr === yesterdayStr) {
        title = "YESTERDAY";
      } else {
        const d = new Date(dateStr);
        title = d.toLocaleDateString("en-US", { month: "long", day: "numeric" }).toUpperCase();
      }

      return {
        title,
        data: grouped[dateStr],
      };
    });

    setSections(formattedSections);
  };

  const handleDelete = (mealId, foodName) => {
    Alert.alert(
      "Delete Meal",
      `Are you sure you want to remove ${foodName} from your history?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            await deleteMeal(mealId);
            loadHistory(); 
          } 
        }
      ]
    );
  };

  const renderMeal = ({ item }) => (
    <TouchableOpacity 
      style={styles.mealItem}
      onLongPress={() => handleDelete(item.id, item.food)}
      delayLongPress={400}
      activeOpacity={0.6}
    >
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.mealImage} />
      ) : (
        <View style={styles.mealImagePlaceholder} />
      )}
      
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.food}</Text>
        <Text style={styles.mealMacros}>
          C {item.carbs}g · P {item.protein}g · F {item.fat}g · S {item.sugar}g 
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.source}</Text>
        </View>
      </View>

      <View style={styles.mealCalories}>
        <Text style={styles.mealCalNum}>{item.calories}</Text>
        <Text style={styles.mealCalText}>kcal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>History</Text>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMeal}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No meals logged yet.</Text>
          }
        />
      </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: -1,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.hint,
    letterSpacing: 1,
    paddingVertical: 12,
    backgroundColor: theme.colors.background, 
    marginTop: 8,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  mealImage: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
  },
  mealImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
  },
  mealInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: "center",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  mealMacros: {
    fontSize: 12,
    color: theme.colors.subtext,
    fontWeight: "500",
    marginBottom: 6,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: theme.colors.subtext,
    textTransform: "uppercase",
  },
  mealCalories: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  mealCalNum: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
  },
  mealCalText: {
    fontSize: 12,
    color: theme.colors.subtext,
    fontWeight: "600",
    marginTop: -2,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.subtext,
    marginTop: 40,
    fontSize: 14,
  },
});