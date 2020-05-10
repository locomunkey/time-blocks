import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const SettingsScreenRenderer = ({ onSignOut }) => (
  <View style={styles.container}>
    <Text style={styles.screenTitle}>Settings</Text>
    <View style={styles.settingItem}>
      <View style={styles.centeredSetting}>
        <TouchableOpacity onPress={onSignOut}>
          <View><Text style={styles.text}>Sign out</Text></View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 267
  },
  screenTitle: {
    color: "rgb(204, 204, 204)",
    fontSize: 30,
    textAlign: "center",
    marginVertical: 15,
    marginHorizontal: 40,
    fontWeight: "bold"
  },
  centeredSetting: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row"
  },
  text: {
    color: "white"
  }
});
