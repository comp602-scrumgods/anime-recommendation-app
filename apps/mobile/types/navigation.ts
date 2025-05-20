import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  index: undefined;
  search: undefined;
  details: { id: string };
  explore: undefined;
  favourites: undefined;
  auth: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: {
    navigate: <K extends keyof RootStackParamList>(
      ...args: K extends keyof RootStackParamList &
        keyof NavigatorScreenParams<RootStackParamList>
        ? [K, RootStackParamList[K]]
        : [K]
    ) => void;
  };
  route: {
    params: RootStackParamList[T];
  };
};
