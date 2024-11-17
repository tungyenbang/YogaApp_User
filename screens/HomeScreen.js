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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  

  useEffect(() => {
    const classesRef = ref(database, "class/");
    onValue(classesRef, (snapshot) => {
      const data = snapshot.val();
      const classList = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setClasses(classList);
      setDisplayedClasses(classList.slice(0, itemsToShow));
    });
  }, [itemsToShow]);

  useEffect(() => {
    // Tạo setInterval để thay đổi hình ảnh sau mỗi 3 giây
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % yogaImages.length); // Lặp lại qua các hình ảnh
    }, 3000); // 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị tháo gỡ
  }, []);

  const toggleShowAll = () => {
    if (showAllClasses) {
      setDisplayedClasses(classes.slice(0, 5));
      setShowAllClasses(false);
    } else {
      setDisplayedClasses(classes);
      setShowAllClasses(true);
    }
  };
  const yogaImages = [
    { id: '1', uri: 'https://images.pexels.com/photos/3822356/pexels-photo-3822356.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: '2', uri: 'https://images.pexels.com/photos/3822140/pexels-photo-3822140.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: '3', uri: 'https://images.pexels.com/photos/3822861/pexels-photo-3822861.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <FlatList
          data={[yogaImages[currentImageIndex]]} // Hiển thị hình ảnh hiện tại
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.image} />
          )}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />
      </View>
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
            <TouchableOpacity onPress={toggleShowAll} style={styles.loadMoreButton}>
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
  image: {
    width: 340,
    height: 170, 
    margin: 10,
    borderRadius: 20,
  },
  imageContainer: {
    height: 180, // Điều chỉnh chiều cao cho FlatList của hình ảnh
    marginBottom: 10, // Khoảng cách giữa ảnh và danh sách lớp học
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


