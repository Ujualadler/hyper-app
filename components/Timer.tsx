// import React, { useEffect, useRef } from "react";
// import { Text, StyleSheet, View, Animated, Easing } from "react-native";
// import Svg, { Circle } from "react-native-svg";

// // Wrap the SVG Circle with Animated.createAnimatedComponent
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// const Timer = ({
//   timer,
//   initialTime,
//   questionKey,
//   showTimer,
// }: {
//   timer: number;
//   initialTime: number;
//   questionKey: string; // Unique key for each question
//   showTimer: boolean; // New prop to control visibility
// }) => {
//   const animatedProgress = useRef(new Animated.Value(1)).current; // Persistent animation value
//   const circleRadius = 40; // Radius of the progress circle
//   const circumference = 2 * Math.PI * circleRadius; // Circle circumference for stroke calculation
//   const colors = ["green", "yellow", "orange", "red"]; // Green, Yellow, Orange, Red

//   // Reset progress and start animation when `timer` or `initialTime` changes

//   useEffect(() => {
//     if (timer === initialTime) {
//         animatedProgress.setValue(1);
//       }
//     if (showTimer) {
//       const progressValue = timer / initialTime;

//       // Animate the progress
//       Animated.timing(animatedProgress, {
//         toValue: progressValue,
//         duration: 1000,
//         easing: Easing.linear,
//         useNativeDriver: false,
//       }).start();
//     }

//     // Reset progress to full when `initialTime` changes
//     if (timer === initialTime) {
//       animatedProgress.setValue(1);
//     }
//   }, [timer, initialTime, showTimer]);

//   const getColor = (progress: number) => {
//     if (progress > 0.75) return colors[0]; // Green
//     if (progress > 0.5) return colors[1]; // Yellow
//     if (progress > 0.25) return colors[2]; // Orange
//     return colors[3]; // Red
//   };

//   const strokeDashoffset = animatedProgress.interpolate({
//     inputRange: [0, 1],
//     outputRange: [circumference, 0], // Proper clockwise animation
//   });

//   const animatedColor = animatedProgress.interpolate({
//     inputRange: [0, 1],
//     outputRange: [colors[3], colors[0]], // Red to Green dynamically interpolated
//   });

//   return (
//     <>
//       {showTimer && (
//         <View style={styles.timerContainer}>
//           {/* Circular Progress */}
//           <Svg height="100" width="100">
//             <Circle
//               cx="50"
//               cy="50"
//               r={circleRadius}
//               stroke="#ddd"
//               strokeWidth="10"
//               fill="none"
//             />
//             <AnimatedCircle
//               cx="50"
//               cy="50"
//               r={circleRadius}
//               stroke={animatedColor} // Use animated color
//               strokeWidth="10"
//               strokeDasharray={`${circumference}, ${circumference}`}
//               strokeDashoffset={strokeDashoffset}
//               fill="none"
//               rotation="-90"
//               origin="50, 50"
//             />
//           </Svg>
//           {/* Timer Text */}
//           <View style={styles.innerCircle}>
//             <Text style={styles.timerText}>{timer}s</Text>
//           </View>
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   timerContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   innerCircle: {
//     position: "absolute",
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "transparent",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timerText: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "Black",
//   },
// });

// export default Timer;

import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const Timer = ({
  timer,
  initialTime,
  questionKey,
  showTimer,
}: {
  timer: number;
  initialTime: number;
  questionKey: string; // Unique key for each question
  showTimer: boolean; // New prop to control visibility
}) => {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    setRemainingTime(initialTime); // Reset remaining time whenever timer changes
  }, [timer]);

  return (
    <>
      {showTimer && (
        <CountdownCircleTimer
          key={questionKey} // Reset the timer when the question changes
          isPlaying={timer > 0} // Timer runs only when remainingTime > 0
          duration={initialTime} // Total duration of the timer
          initialRemainingTime={remainingTime} // Set the current remaining time
          colors={["#00FF00", "#FFFF00", "#FFA500", "#FF0000"]} // Color transitions
          colorsTime={[initialTime, initialTime * 0.75, initialTime * 0.5, 0]} // Thresholds for color changes
          size={80} // Timer size
          strokeWidth={10} // Circle stroke width
          onComplete={() => {
            console.log("Timer completed");
          }}
        >
          {({ remainingTime }) => (
            <Text style={styles.timerText}>{remainingTime}s</Text>
          )}
        </CountdownCircleTimer>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
});

export default Timer;


