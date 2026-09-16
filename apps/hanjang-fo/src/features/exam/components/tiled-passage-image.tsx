import { useEffect, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { tileCountFor, visibleTileRange } from "../visible-tile-range";
import { instrument } from "@/shared/instrumentation";

const TILE_HEIGHT = 512;

interface TiledPassageImageProps {
  imageHeight: number;
  scrollY: number;
  viewportHeight: number;
  tileHeight?: number;
}

const Tile = ({ top, height }: { top: number; height: number }) => {
  useEffect(() => {
    instrument.tileDecodes += 1;
  }, []);
  return <View style={styles.tile(top, height)} />;
};

const TiledPassageImage = ({
  imageHeight,
  scrollY,
  viewportHeight,
  tileHeight = TILE_HEIGHT,
}: TiledPassageImageProps) => {
  const [offsetY, setOffsetY] = useState(0);
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
