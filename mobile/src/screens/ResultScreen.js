import React, { useState } from "react";
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar, Alert, TextInput} from "react-native";
import { saveMeal } from "../storage/mealStorage";
import { theme } from "../constants/theme";

const MacroBar = ({ label, value, color }) => {
  const width = Math.min((value / 100) * 100, 100);
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{Math.round(value)}g</Text>
      </View>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${width}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

export default function ResultScreen({ route, navigation }) {
  const { result, imageUri } = route.params;
  const [grams, setGrams] = useState(100);
  const [customText, setCustomText] = useState("");
  const [logged, setLogged] = useState(false);

  const scale = grams / 100;
  const n = result.nutrition;

  const scaled = {
    calories: Math.round(n.calories * scale),
    carbs:    Math.round(n.carbs    * scale),
    sugar:    Math.round(n.sugar    * scale),
    protein:  Math.round(n.protein  * scale),
    fat:      Math.round(n.fat      * scale),
  };

  const handleLog = async () => {
    await saveMeal({
      food: result.food_item,
      imageUri,
      source: result.source,
      grams,
      ...scaled,
    });
    setLogged(true);
    setTimeout(() => navigation.navigate("Scan"), 1000);
  };

  const portions = [100, 150, 200, 300];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.hero}>
        {imageUri
          ? <Image source={{ uri: imageUri }} style={styles.heroImg} />
          : <View style={styles.heroPlaceholder} />
        }
        <View style={styles.heroOverlay}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← back</Text>
          </TouchableOpacity>
          <Text style={styles.foodName}>{result.food_item}</Text>
          <View style={styles.confRow}>
            <View style={styles.confDot} />
            <Text style={styles.confText}>
              {Math.round(result.confidence * 100)}% confident · via {result.source}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        <View style={styles.calorieRow}>
          <Text style={styles.calorieNum}>{scaled.calories}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </View>

        <Text style={styles.sectionLabel}>PORTION SIZE</Text>
        <View style={styles.portionRow}>
            {portions.map(p => (
                <TouchableOpacity
                key={p}
                style={[styles.portionBtn, grams === p && styles.portionBtnActive]}
                onPress={() => {
                    setGrams(p);
                    setCustomText("");
                }}
                >
                <Text style={[styles.portionText, grams === p && styles.portionTextActive]}>
                    {p}g
                </Text>
                </TouchableOpacity>
            ))}
            <TextInput
                style={styles.customInput}
                keyboardType="numeric"
                placeholder="Custom"
                placeholderTextColor={theme.colors.subtext}
                value={customText}
                onChangeText={(text) => {
                setCustomText(text);
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                setGrams(isNaN(num) ? 0 : num);
                }}
            />
        </View>

        <Text style={styles.sectionLabel}>MACROS</Text>
        <View style={styles.macrosCard}>
          <MacroBar label="Carbs"   value={scaled.carbs}   color={theme.colors.carbs}   />
          <MacroBar label="Protein" value={scaled.protein} color={theme.colors.protein} />
          <MacroBar label="Fat"     value={scaled.fat}     color={theme.colors.fat}     />
          <MacroBar label="Sugar"   value={scaled.sugar}   color={theme.colors.sugar}   />
        </View>

        <TouchableOpacity
          style={[styles.logBtn, logged && styles.logBtnDone]}
          onPress={handleLog}
          disabled={logged}
        >
          <Text style={styles.logBtnText}>
            {logged ? "logged ✓" : "log meal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanAgain} onPress={() => navigation.goBack()}>
          <Text style={styles.scanAgainText}>scan another</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    width: "100%",
    height: 260,
    position: "relative",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#222",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 56,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  backBtn: {
    position: "absolute",
    top: 52,
    left: 20,
  },
  backText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  foodName: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  confRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  confDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ade80",
  },
  confText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    letterSpacing: 0.2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  calorieNum: {
    fontSize: 52,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: -2,
  },
  calorieUnit: {
    fontSize: 16,
    color: theme.colors.subtext,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.subtext,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  portionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  portionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  portionBtnActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  portionText: {
    fontSize: 12,
    color: theme.colors.subtext,
    fontWeight: "500",
  },
  portionTextActive: {
    color: "#fff",
  },
  macrosCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 24,
    gap: 14,
  },
  macroRow: {
    gap: 4,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 11,
    color: theme.colors.subtext,
    letterSpacing: 0.3,
  },
  macroValue: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.text,
  },
  macroTrack: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: 2,
  },
  logBtn: {
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.lg,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  logBtnDone: {
    backgroundColor: "#4ade80",
  },
  logBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  scanAgain: {
    alignItems: "center",
    padding: 12,
  },
  scanAgainText: {
    color: theme.colors.subtext,
    fontSize: 13,
    letterSpacing: 0.2,
  },

  customInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "500",
    minWidth: 70,
    textAlign: 'center',
  },
});