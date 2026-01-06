import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  delay: number;
}

interface StarFieldProps {
  starCount?: number;
}

export const StarField: React.FC<StarFieldProps> = ({ starCount = 50 }) => {
  const stars = useRef<Star[]>([]);
  
  useEffect(() => {
    // 生成星星
    stars.current = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
      delay: Math.random() * 2000,
    }));
    
    // 为每个星星创建闪烁动画
    stars.current.forEach(star => {
      const twinkle = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => twinkle());
      };
      
      setTimeout(twinkle, star.delay);
    });
  }, [starCount]);
  
  return (
    <View style={styles.container} pointerEvents="none">
      {stars.current.map(star => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 100,
  },
});

export default StarField;

