import React, { useState, useRef } from "react";
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { scanFood } from "../api/nutritionAPI";
import { theme } from "../constants/theme";


export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef(null);

  const handleScan = async (imageUri) => {
    setScanning(true);
    try {
      const result = await scanFood(imageUri);
      navigation.navigate("Result", { result, imageUri });
    } catch (e) {
      Alert.alert(
        "Couldn't detect food",
        e.message || "Try again with a clearer photo.",
        [{ text: "OK" }]
      );
    } finally {
      setScanning(false);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || scanning) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    await handleScan(photo.uri);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) await handleScan(result.assets[0].uri);
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permContainer}>
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permSub}>
          We need your camera to scan food and get nutrition info.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Allow camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <CameraView style={styles.camera} ref={cameraRef} facing="back">

        <View style={styles.topBar}>
          <Text style={styles.appName}>NutriScan (beta)</Text>
        </View>

        <View style={styles.finderArea}>
          <View style={styles.finder}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.hint}>
            {scanning ? "analysing..." : ""}
          </Text>
        </View>

        <View style={styles.controls}>
            <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery} disabled={scanning}>
                <Ionicons name="images-outline" size={28} color="#fff" />
            </TouchableOpacity>

          <TouchableOpacity
            style={styles.shutter}
            onPress={takePhoto}
            disabled={scanning}
            activeOpacity={0.8}
          >
            {scanning
              ? <ActivityIndicator color="#ffffff" size="small" />
              : <View style={styles.shutterInner} />
            }
          </TouchableOpacity>

          <View style={{ width: 64 }} />
        </View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  appName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    opacity: 0.9,
  },
  finderArea: {
    alignItems: "center",
    gap: 16,
  },
  finder: {
    width: 220,
    height: 220,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: 2.5, borderLeftWidth: 2.5,
    borderColor: "#fff",
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: 2.5, borderRightWidth: 2.5,
    borderColor: "#fff",
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: 2.5, borderLeftWidth: 2.5,
    borderColor: "#fff",
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: 2.5, borderRightWidth: 2.5,
    borderColor: "#fff",
    borderBottomRightRadius: 10,
  },
  hint: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  galleryBtn: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  
  shutter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
  },
  permContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  permTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  permSub: {
    fontSize: 14,
    color: theme.colors.subtext,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  permBtn: {
    backgroundColor: theme.colors.text,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
  },
  permBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});