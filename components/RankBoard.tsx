import { BASE_URL } from '@/constants/config';
import LottieView from 'lottie-react-native';
import React from 'react'
import { Image } from 'react-native';
import { Text } from 'react-native-paper';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

function RankBoard({ data }: any) {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#242439",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: 700,
            fontSize: 18,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          HYPER STANDINGS
        </Text>
        <View
          style={{
            width: 210,
            height: 120,
            flexDirection: "row",
            position: "relative",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              gap: 1,
              width: 70,
              position: "absolute",
              left: 0,
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{
                  uri: data[1]?.image ? `${BASE_URL}/quiz/${data[1]?.image}` : "",
                }}
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 50,
                  backgroundColor: "white",
                  borderWidth: 1.5,
                  borderColor: "#9D85FF",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  backgroundColor: "#8BD379",
                  bottom: -15,
                  left: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 10 }}>2nd</Text>
              </View>
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                marginTop: 20,
                fontSize: 12,
              }}
            >
              {data[1]?.userName}
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#FF9921",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {data[1]?.combinedSortField.toFixed(1)}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              gap: 1,
              width: 90,
              position: "absolute",
              left: 60,
              zIndex: 5,
              top: -40,
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{
                  uri: data[0]?.image ? `${BASE_URL}/quiz/${data[0]?.image}` : "",
                }}
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 50,
                  backgroundColor: "white",
                  borderWidth: 1.5,
                  borderColor: "#9D85FF",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 80,
                  height: 80,
                  borderRadius: 50,
                  // backgroundColor: "#EEB64D",
                  bottom: -40,
                  left: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ position: "relative" }}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      position: "absolute",
                      backgroundColor: "#EEB64D",
                      height: 30,
                      width: 30,
                      borderRadius: 50,
                      top: 25,
                      left: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                      }}
                    >
                      1st
                    </Text>
                  </View>
  
                  <LottieView
                    source={require("../../assets/images/first.json")}
                    autoPlay
                    style={{ width: 80, height: 80 }}
                    loop
                  />
                </View>
              </View>
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                marginTop: 25,
                fontSize: 12,
              }}
            >
              {data[0]?.userName}
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#FF9921",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {data[0]?.combinedSortField.toFixed(1)}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              gap: 1,
              width: 70,
              position: "absolute",
              left: 140,
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{
                  uri: data[2]?.image ? `${BASE_URL}/quiz/${data[2]?.image}` : "",
                }}
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 50,
                  backgroundColor: "white",
                  borderWidth: 1.5,
                  borderColor: "#9D85FF",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  backgroundColor: "#B5A3FD",
                  bottom: -15,
                  left: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 10 }}>3rd</Text>
              </View>
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                marginTop: 20,
                fontSize: 12,
              }}
            >
              {data[2]?.userName}
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#FF9921",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {data[2]?.combinedSortField % 1 === 0
                ? data[2]?.combinedSortField.toFixed(0)
                : data[2]?.combinedSortField.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

export default RankBoard