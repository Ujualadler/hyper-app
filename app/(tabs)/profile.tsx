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
import { Button, Divider, IconButton, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthContext";
import { getProfile, postProfile } from "@/Services/userService";
import { BASE_URL } from "@/constants/config";
import * as Sharing from "expo-sharing";
import { Share } from "react-native";
import * as SecureStore from "expo-secure-store";

const settingsOptions = [
  {
    title: "Change Password",
    icon: <Ionicons name="lock-closed-outline" style={{color:'#6846f3'}} size={24} color="black" />,
    url: "/changePassword",
  },
  {
    title: "Leaderboard",
    icon: <Ionicons name="language-outline" style={{color:'#6846f3'}} size={24} color="black" />,
    url: "/overallRank",
  },
];

const informationOption = [
  {
    title: "About App",
    icon: <MaterialIcons name="info-outline" style={{color:'#6846f3'}} size={24} color="black" />,
    url: "/handleLogin",
  },
  {
    title: "Terms & Conditions",
    icon: <FontAwesome name="file-text-o" style={{color:'#6846f3'}} size={24} color="black" />,
    url: "/terms-and-conditions",
  },
  {
    title: "Privacy Policy",
    icon: <Ionicons name="shield-checkmark-outline" style={{color:'#6846f3'}} size={24} color="black" />,
    url: "/privacy-policy",
  },
  {
    title: "Share This App",
    icon: <Ionicons name="share-social-outline" style={{color:'#6846f3'}} size={24} color="black" />,
    url: "/share",
  },
];

export default function TabTwoScreen() {
  const router = useRouter();

  const { userName, profile, setProfile, logout } = useAuth();

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [profileData, setProfileData] = React.useState<any>({});
  const [change, setChange] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await getProfile();
        if (result.data) {
          setProfileData(result.data);
          // await SecureStore.setItemAsync("profile", result.data.image);
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

  const shareAppLink = async () => {
    const url = "https://expo.dev/@ujual.k/quizz"; 

    try {
      const result = await Share.share({
        message: `Check out this app: ${url}`, // You can customize the message
        url: url, // This is optional, but you can include the URL here
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log("Shared with activity type:", result.activityType);
        } else {
          // Shared
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing the app:", error); // Log any errors that occur
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1A1A24", marginTop: 0 }}>
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
      <View style={{ marginBottom: 55 }}>
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
          <Text
            style={{ textAlign: "center", fontWeight: 700,color:'white' }}
            variant="bodyLarge"
          >
            {profileData?.userName}
          </Text>
          <Text
            style={{ textAlign: "center", color: "grey" }}
            variant="bodyMedium"
          >
            {profileData?.class}
          </Text>
        </ThemedView>
        <ProfileHeading title="Genaral Settings" />
        {settingsOptions.map((data: any, index: any) => (
          <TouchableOpacity onPress={() => router.push(data.url as any)}>
            <View
              key={index}
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 5,
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  display: "flex",
                  gap: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {data.icon}
                <Text variant="bodyMedium" style={{color:'white'}}>{data.title}</Text>
              </View>
              <IconButton iconColor="white" icon="chevron-right"  size={24} />
            </View>
          </TouchableOpacity>
        ))}

        <ProfileHeading title="Information" />

        {informationOption.map((data: any, index: any) => (
          <TouchableOpacity
            onPress={
              data.title === "Share This App"
                ? shareAppLink
                : () => router.push(data.url as any)
            }
          >
            <View
              key={index}
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 5,
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  display: "flex",
                  gap: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {data.icon}
                <Text variant="bodyMedium" style={{color:'white'}}>{data.title}</Text>
              </View>
              <IconButton iconColor="white" icon="chevron-right" size={24} />
            </View>
          </TouchableOpacity>
        ))}
        <Divider />
        <TouchableOpacity onPress={logout}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginVertical: 5,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                gap: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="logout" size={24} color="red" />{" "}
              <Text variant="bodyLarge" style={{ color: "red" }}>
                Logout
              </Text>
            </View>
            <IconButton icon="chevron-right" size={24} iconColor="red" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function ProfileHeading({ title }: any) {
  return (
    <View
      style={{
        backgroundColor: "#6846f3",
        padding: 12,
        paddingLeft: 20,
        marginVertical: 10,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: 600 }}>{title}</Text>
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
    marginTop: 30,
    backgroundColor:'#1A1A24'
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
  button: {
    width: "100%", // Full width
    justifyContent: "flex-start", // Align text to the left
  },
  buttonContent: {
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Center vertically
  },
  buttonLabel: {
    marginLeft: 8, // Space between icon and text
  },
  icon: {
    marginRight: 8, // Space between icon and text
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
