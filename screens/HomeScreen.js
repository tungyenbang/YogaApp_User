import React, { useEffect, useState } from "react";
import {FlatList, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { onValue, ref } from "firebase/database";
import { database } from "../firebaseConfig";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const [classes, setClasses] = useState([]);
  const [displayedClasses, setDisplayedClasses] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [showAllClasses, setShowAllClasses] = useState(false);

  

  useEffect(() => {
    const classesRef = ref(database, "class/");
    onValue(classesRef, (snapshot) => {
      const data = snapshot.val();
      const classList = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setClasses(classList);
      setDisplayedClasses(classList.slice(0, itemsToShow));
    });
  }, [itemsToShow]);

  
  
  return (
    <View style={styles.container}>
      
      <FlatList
        data={displayedClasses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Detail", { classId: item.id })} // Ensure correct navigation
            style={styles.classItem}
          >
            <Text style={styles.teacherText}>Teacher: {item.teacher}</Text>
            <Text style={styles.dateText}>Date: {item.date}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() =>
          classes.length > 5 ? (
            <TouchableOpacity  style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>{showAllClasses ? "Back" : "Load More"}</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  
  classItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    backgroundColor: "#f5f5f5",
  },
  classText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  teacherText: {
    fontSize: 14,
    color: "#555",
  },
  dateText: {
    fontSize: 14,
    color: "#555",
  },
  loadMoreButton: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  loadMoreText: {
    fontSize: 16,
    color: "#333",
  },
});


