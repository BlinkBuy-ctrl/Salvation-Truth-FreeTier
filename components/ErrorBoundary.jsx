import { Component } from "react";
import { View, Text, Pressable } from "react-native";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-[#F8FAFC] items-center justify-center px-8">
          <View className="w-14 h-14 rounded-2xl bg-[#0F172A] items-center justify-center mb-5">
            <Text className="text-[#D97706] text-[20px] font-bold">!</Text>
          </View>
          <Text className="text-[#0F172A] text-[16px] font-bold text-center">
            Something went wrong
          </Text>
          <Text className="text-[#64748B] text-[13px] text-center mt-2 leading-5">
            We hit an unexpected error loading this screen. Your data is safe.
          </Text>
          <Pressable
            onPress={this.handleRetry}
            className="mt-6 bg-[#0F172A] rounded-full px-6 py-3 active:opacity-90"
          >
            <Text className="text-white text-[13px] font-semibold">Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
