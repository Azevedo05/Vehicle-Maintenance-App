import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';

import { useTheme } from '@/contexts/ThemeContext';
import { useLocalization } from '@/contexts/LocalizationContext';

type AlertButtonStyle = 'default' | 'cancel' | 'destructive';

export interface AlertButtonConfig {
  text?: string;
  onPress?: () => void;
  style?: AlertButtonStyle;
}

export interface AlertConfig {
  title: string;
  message: string;
  buttons?: AlertButtonConfig[];
}

export interface ToastConfig {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

interface AlertContextValue {
  showAlert: (config: AlertConfig) => void;
  showToast: (config: ToastConfig) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export const useAppAlert = (): AlertContextValue => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAppAlert must be used within AlertProvider');
  }
  return ctx;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<AlertConfig | null>(null);
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastProgress = useRef(new Animated.Value(0)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [toastSize, setToastSize] = useState<{ width: number; height: number } | null>(null);

  const styles = createStyles(colors);

  const showAlert = useCallback((config: AlertConfig) => {
    // Fallback buttons if none provided
    const buttons = config.buttons && config.buttons.length > 0
      ? config.buttons
      : [{ text: t('common.ok') }];

    setCurrent({ ...config, buttons });
    setVisible(true);
  }, [t]);

  const showToast = useCallback(
    (config: ToastConfig) => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      setToast(config);
      setToastVisible(true);

      toastProgress.setValue(0);
      toastOpacity.setValue(0);
      setToastSize(null);

      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      Animated.timing(toastProgress, {
        toValue: 1,
        duration: config.durationMs ?? 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      toastTimeoutRef.current = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }).start(() => {
          setToastVisible(false);
          setToast(null);
        });
        toastTimeoutRef.current = null;
      }, config.durationMs ?? 5000);
    },
    [toastOpacity, toastProgress]
  );

  const handleButtonPress = (index: number) => {
    if (!current || !current.buttons) return;
    const button = current.buttons[index];
    setVisible(false);
    setTimeout(() => {
      button?.onPress?.();
    }, 150);
  };

  const handleToastAction = () => {
      if (!toast || !toast.onAction) {
      setToastVisible(false);
      return;
    }
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    Animated.timing(toastOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setToastVisible(false);
      setToast(null);
      setTimeout(() => {
        toast.onAction?.();
      }, 100);
    });
  };

  return (
    <AlertContext.Provider value={{ showAlert, showToast }}>
      {children}
      <Modal
        visible={visible && !!current}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} />
          <View style={styles.card}>
            {current?.title ? (
              <Text style={styles.title}>{current.title}</Text>
            ) : null}
            {current?.message ? (
              <Text style={styles.message}>{current.message}</Text>
            ) : null}
            <View
              style={[
                styles.actionsRow,
                (current?.buttons?.length ?? 0) === 1 && styles.actionsRowSingle,
              ]}
            >
              {current?.buttons?.map((button, index) => {
                const style = button.style ?? 'default';
                const isSingle = (current.buttons?.length ?? 0) === 1;
                return (
                  <TouchableOpacity
                    key={`${button.text ?? index}-${style}`}
                    style={[
                      isSingle ? styles.buttonSingle : styles.button,
                      style === 'cancel' && styles.buttonCancel,
                      style === 'destructive' && styles.buttonDestructive,
                    ]}
                    onPress={() => handleButtonPress(index)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        isSingle ? styles.buttonSingleText : styles.buttonText,
                        style === 'cancel' && styles.buttonTextCancel,
                        style === 'destructive' && styles.buttonTextDestructive,
                      ]}
                    >
                      {button.text ?? t('common.ok')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {toastVisible && toast && (
        <View style={styles.toastContainer} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.toastCard,
              {
                opacity: toastOpacity,
                transform: [
                  {
                    translateY: toastOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              },
            ]}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setToastSize({ width, height });
            }}
          >
            {toastSize && (
              <Svg
                pointerEvents="none"
                style={StyleSheet.absoluteFillObject}
                width={toastSize.width}
                height={toastSize.height}
              >
                <AnimatedRect
                  x={1.5}
                  y={1.5}
                  width={toastSize.width - 3}
                  height={toastSize.height - 3}
                  rx={(toastSize.height - 3) / 2}
                  ry={(toastSize.height - 3) / 2}
                  stroke={colors.primary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                  strokeDasharray={
                    2 * (toastSize.width + toastSize.height - 6)
                  }
                  strokeDashoffset={toastProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 2 * (toastSize.width + toastSize.height - 6)],
                  })}
                />
              </Svg>
            )}
            <Text style={styles.toastMessage}>{toast.message}</Text>
            {toast.actionLabel && toast.onAction && (
              <TouchableOpacity
                style={styles.toastActionButton}
                onPress={handleToastAction}
                activeOpacity={0.8}
              >
                <Text style={styles.toastActionText}>{toast.actionLabel}</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      )}
    </AlertContext.Provider>
  );
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      // Leve escurecimento só para destacar o blur, sem "apagar" o ecrã
      backgroundColor: '#00000022',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    card: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingHorizontal: 20,
      paddingVertical: 18,
      borderWidth: 1,
      borderColor: colors.primary,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    message: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    actionsRowSingle: {
      justifyContent: 'center',
    },
    button: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.surface,
    },
    buttonSingle: {
      marginTop: 8,
      paddingVertical: 12,
    },
    buttonCancel: {
      backgroundColor: 'transparent',
    },
    buttonDestructive: {
      backgroundColor: colors.error + '20',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    buttonSingleText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      textAlign: 'center',
    },
    buttonTextCancel: {
      color: colors.textSecondary,
    },
    buttonTextDestructive: {
      color: colors.error,
    },
    toastContainer: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 24,
      alignItems: 'center',
    },
    toastCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 480,
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 0,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    toastMessage: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      marginRight: 12,
    },
    toastActionButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    toastActionText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
  });


