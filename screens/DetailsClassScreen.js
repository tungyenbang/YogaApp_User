import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { ref, onValue, push, query, equalTo, orderByChild, get} from "firebase/database";
import { database } from "../firebaseConfig";

export default function DetailsClassScreen({ route, navigation }) {
  const { classId } = route.params;
  const [classDetails, setClassDetails] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching class details for classId:", classId);
        const classRef = ref(database, `class/${classId}`);
        const classSnapshot = await get(classRef);
  
        if (classSnapshot.exists()) {
          const classData = classSnapshot.val();
          
          setClassDetails(classData);
  
          const courseRef = ref(database, `courses/${classData.courseId}`);
          console.log("Fetching course details for courseId:", classData.courseId);
          const courseSnapshot = await get(courseRef);
  
          if (courseSnapshot.exists()) {
            const courseData = courseSnapshot.val();
            
            setCourseDetails(courseData);
          } else {
            
            setCourseDetails(null);
          }
        } else {
          
          setClassDetails(null);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [classId]);
  

  const handleBuy = async () => {
    if (classDetails && courseDetails) {
      try {
        const cartItem = {
          classId: classId,
          teacher: classDetails.teacher,
          date: classDetails.date,
          time: courseDetails.time,
          duration: courseDetails.duration,
          price: courseDetails.price,
          type: courseDetails.type,
          comment: classDetails.comment || "",
        };
  
        push(ref(database, "cart"), cartItem)
          .then(() => {
            Alert.alert("Success", "Đã mua thành công!", [
              {
                text: "OK",
                
              },
            ]);
          })
          .catch((error) => {
            
            Alert.alert("Error", "Có lỗi xảy ra khi mua: " + error.message);
          });
      } catch (error) {
        
        Alert.alert("Error", "Có lỗi xảy ra khi kiểm tra số lượng đăng ký.");
      }
    }
  };
  

  if (!classDetails || !courseDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Teacher:</Text>
      <Text style={styles.value}>{classDetails.teacher}</Text>

      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{classDetails.date}</Text>

      <Text style={styles.label}>Time of Course:</Text>
      <Text style={styles.value}>{courseDetails.time}</Text>

      <Text style={styles.label}>Duration:</Text>
      <Text style={styles.value}>{courseDetails.duration}</Text>

      <Text style={styles.label}>Price per Class:</Text>
      <Text style={styles.value}>{courseDetails.price}</Text>

      <Text style={styles.label}>Type of Class:</Text>
      <Text style={styles.value}>{courseDetails.type}</Text>

      <Text style={styles.label}>Comments:</Text>
      <Text style={styles.value}>{classDetails.comments || "None"}</Text>

      <Button title="Buy"onPress={handleBuy} color="#ff4d4d" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
});
