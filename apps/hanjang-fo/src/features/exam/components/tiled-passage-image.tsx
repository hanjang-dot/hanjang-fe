import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { tileCountFor, visibleTileRange } from "../visible-tile-range";
import { instrument } from "@/shared/instrumentation";

const TILE_HEIGHT = 512;
const FALLBACK_HEIGHT = 400;

interface TiledPassageImageProps {
  imageUrl?: string;
  imageHeight?: number;
  scrollY?: number;
  viewportHeight?: number;
  tileHeight?: number;
}

const Tile = ({ top, height }: { top: number; height: number }) => {
  useEffect(() => {
    instrument.tileDecodes += 1;
  }, []);
  return <View style={styles.tile(top, height)} />;
};

const TiledPassageImage = ({
  imageUrl,
  imageHeight = 0,
  scrollY = 0,
  viewportHeight = 0,
  tileHeight = TILE_HEIGHT,
}: TiledPassageImageProps) => {
  const [offsetY, setOffsetY] = useState(0);
  const [aspect, setAspect] = useState<number | null>(null);
  useEffect(() => {
    if (!imageUrl) return;
    Image.getSize(
      imageUrl,
      (width, height) => setAspect(height > 0 ? width / height : null),
      () => setAspect(null),
    );
  }, [imageUrl]);
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        resizeMode="contain"
        style={styles.image(aspect, FALLBACK_HEIGHT)}
      />
    );
  }
  const count = tileCountFor(imageHeight, tileHeight);
  const { start, end } = visibleTileRange(
    scrollY - offsetY,
    viewportHeight,
    tileHeight,
    count,
  );
  const tiles = [];
  for (let index = start; index < end; index += 1) {
    const height = Math.min(tileHeight, imageHeight - index * tileHeight);
    tiles.push(
      <Tile key={index} top={index * tileHeight} height={height} />,
    );
  }
  return (
    <View
      style={styles.canvas(imageHeight)}
      onLayout={(event) => setOffsetY(event.nativeEvent.layout.y)}
    >
      {tiles}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  image: (aspect: number | null, fallbackHeight: number) => ({
    width: "100%",
    height: undefined,
    aspectRatio: aspect ?? undefined,
    ...(aspect === null ? { height: fallbackHeight } : {}),
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
  canvas: (height: number) => ({
    position: "relative",
    width: "100%",
    height,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  }),
  tile: (top: number, height: number) => ({
    position: "absolute",
    top,
    left: 0,
    right: 0,
    height,
    backgroundColor: theme.colors.surface2,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  }),
}));

export default TiledPassageImage;
