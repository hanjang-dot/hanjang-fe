import {
  Bookmark,
  ChartColumnBig,
  Check,
  ChevronLeft,
  CircleAlert,
  DoorOpen,
  Highlighter,
  House,
  Inbox,
  Library,
  LoaderCircle,
  LogOut,
  Play,
  RotateCcwClock,
  Star,
  Timer,
  User,
  X,
} from "lucide-react-native";
import { useUnistyles } from "react-native-unistyles";

const ICONS = {
  home: House,
  library: Library,
  bookmark: Bookmark,
  history: RotateCcwClock,
  user: User,
  play: Play,
  highlighter: Highlighter,
  timer: Timer,
  check: Check,
  x: X,
  barChart: ChartColumnBig,
  logout: LogOut,
  star: Star,
  chevronLeft: ChevronLeft,
  doorOpen: DoorOpen,
  inbox: Inbox,
  alert: CircleAlert,
  loader: LoaderCircle,
} as const;

export type IconName = keyof typeof ICONS;

export type IconSize = 16 | 20 | 24;

const STROKE_WIDTH: Record<IconSize, number> = {
  16: 1.5,
  20: 1.75,
  24: 2,
};

interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
}

const Icon = ({ name, size = 24, color }: IconProps) => {
  const { theme } = useUnistyles();
  const Glyph = ICONS[name];
  return (
    <Glyph
      size={size}
      color={color ?? theme.colors.text}
      strokeWidth={STROKE_WIDTH[size]}
    />
  );
};

export default Icon;
