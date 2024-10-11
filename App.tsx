import { useCallback } from "react";
import { Dimensions } from "react-native";
import {
  FilamentScene,
  FilamentView,
  DefaultLight,
  Model,
  Camera,
  useCameraManipulator,
  Animator,
  RenderCallback,
  Float3,
} from "react-native-filament";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  SlideInUp,
  useSharedValue,
} from "react-native-reanimated";

const viewHeight = Dimensions.get("window").height;

function SceneView() {
  const rotation = useSharedValue<Float3>([0, 0, 0]);

  // const renderCallback: RenderCallback = useCallback(() => {
  //   "worklet";

  //   // Add a rotation of 1 degree every frame
  //   const newY = rotation.value[1] + 0.01;

  //   // We need to create a new array for the internal listeners to trigger
  //   rotation.value = [0, newY, 0];
  // }, [rotation]);

  const cameraManipulator = useCameraManipulator({
    orbitHomePosition: [0, 0, 3], // "Camera location"
    targetPosition: [0, 1, 0], // "Looking at"
    orbitSpeed: [0.003, 0.003],
  });

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      const yCorrected = viewHeight - event.translationY;
      cameraManipulator?.grabBegin(event.translationX, yCorrected, false); // false means rotation instead of translation
    })
    .onUpdate((event) => {
      const yCorrected = viewHeight - event.translationY;
      cameraManipulator?.grabUpdate(event.translationX, yCorrected);
    })
    .onEnd(() => {
      cameraManipulator?.grabEnd();
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={{ flex: 1 }}>
        <FilamentView style={{ flex: 1 }}>
          {/* 💡 A light source, otherwise the scene will be black */}
          <DefaultLight />

          {/* 📦 A 3D model */}

          <FilamentView
          // renderCallback={(frameInfo) => {
          //   "worklet";
          //   console.log(frameInfo);
          // }}
          >
            <Model
              rotate={rotation.value}
              source={require("./models/ninja.glb")}
            >
              <Animator animationIndex={0} />
            </Model>
          </FilamentView>

          {/* 📹 A camera through which the scene is observed and projected onto the view */}
          <Camera cameraManipulator={cameraManipulator} />
        </FilamentView>
      </Animated.View>
    </GestureDetector>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FilamentScene>
        <SceneView />
      </FilamentScene>
    </GestureHandlerRootView>
  );
}
