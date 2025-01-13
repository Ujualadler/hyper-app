import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  Alert,
  Platform,
  ActionSheetIOS,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconButton, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthContext";
import { getProfile, postProfile } from "@/Services/userService";
import { BASE_URL } from "@/constants/config";
import { Share } from "react-native";

export default function TabTwoScreen() {
  const router = useRouter();

  const { userName, profile, setProfile } = useAuth();

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string>("");
  const [profileData, setProfileData] = React.useState<any>({});
  const [change, setChange] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await getProfile();
        if (result.data) {
          setProfileData(result.data);
          // await SecureStore.setItemAsync("profile", result.data.image);
          setName(result.data.userName);
          setProfile(result.data.image);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [change]);

  const openImagePicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancel",
            "Take Photo",
            "Choose from Gallery",
            "Remove Current Picture",
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openGallery();
          } else if (buttonIndex === 3) {
            setSelectedImage("");
          }
        }
      );
    } else {
      Alert.alert(
        "Select an option",
        "",
        [
          { text: "Take Photo", onPress: openCamera },
          { text: "Choose from Gallery", onPress: openGallery },
          {
            text: "Remove Current Picture",
            onPress: handleDeleteImage,
          },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };
  const uriToFile = async (uri: any) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    // Get the file extension
    const fileExtension = uri.split(".").pop();
    const fileName = `profile.${fileExtension}`;

    // Create a file-like object
    return {
      uri: uri,
      name: fileName,
      type: blob.type || "image/jpeg", // Default to 'image/jpeg' if type is not available
    };
  };

  const handleDeleteImage = async () => {
    try {
      const formData = new FormData();

      formData.append("type", "remove");
      formData.append("image", null as any);
      const response = await postProfile(formData);

      if (response.message === "success") {
        setChange(!change);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileChange = async (uri: any) => {
    const file = await uriToFile(uri);

    // Prepare FormData with the file as
    const formData = new FormData();
    formData.append("image", file as any);
    formData.append("type", "add");

    try {
      const response = await postProfile(formData);

      if (response.message === "success") {
        setChange(!change);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      handleProfileChange(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      handleProfileChange(result.assets[0].uri);
    }
  };

  const handleProfileNameChange = async () => {
    try {
      if (!name.trim()) {
        Alert.prompt("Name can not be empty");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {/* <ThemedView style={styles.titleContainer}>
          <IconButton
            icon="chevron-left"
            size={20}
            onPress={() => router.push("/" as any)}
          />
          <ThemedText type="subtitle" style={{ color: "#027bad" }}>
            Profile
          </ThemedText>
        </ThemedView> */}

      <ThemedView style={styles.profileContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: profileData?.image
                ? `${BASE_URL}/quiz/${profileData?.image}`
                : "https://static.vecteezy.com/system/resources/thumbnails/036/280/650/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
            }}
            style={styles.profileImage}
          />
          <IconButton
            icon="pencil"
            size={20}
            iconColor="white"
            style={styles.editButton}
            onPress={openImagePicker}
          />
        </View>
        <View
          style={{
            flex: 1,
            padding: 16,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextInput
              mode="outlined"
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            {name !== profileData.userName && (
              <IconButton
                icon="check"
                size={20}
                iconColor="white"
                style={styles.successButton}
                onPress={handleProfileNameChange}
              />
            )}
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

function ProfileHeading({ title }: any) {
  return (
    <View
      style={{
        backgroundColor: "#ffbc38",
        padding: 12,
        paddingLeft: 20,
        marginVertical: 10,
      }}
    >
      <Text style={{ color: "#111", fontWeight: 700 }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  input: {
    // marginBottom: 16,
    width: "100%",
    backgroundColor: "white",
  },
  successButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#027bad",
    color: "white",
  },
  titleContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, // Offset the shadow to create a bottom shadow effect
    },
    shadowOpacity: 0.3, // Adjust the shadow transparency
    shadowRadius: 4.65, // Adjust the shadow blur
    elevation: 8, // Required for shadow on Android
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  imageWrapper: {
    position: "relative",
    width: 130,
    height: 130,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    gap: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 65, // Half of the width/height to make it a circle
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#027bad",
    color: "white",
  },
});
