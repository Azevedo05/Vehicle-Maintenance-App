import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { MaintenanceTask } from "@/types/maintenance";
import { Vehicle } from "@/types";
import { createStyles } from "@/styles/maintenance.styles";
import { format } from "date-fns";
import { pt, enUS } from "date-fns/locale";

interface MaintenanceCalendarProps {
  tasks: {
    task: MaintenanceTask;
    vehicle: Vehicle;
    isDue: boolean;
    daysUntilDue?: number;
    milesUntilDue?: number;
  }[];
  onTaskPress?: (vehicleId: string) => void;
}

export function MaintenanceCalendar({ tasks, onTaskPress }: MaintenanceCalendarProps) {
  const { colors, isDark } = useTheme();
  const { t, language } = useLocalization();
  const styles = createStyles(colors);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useMemo(() => {
    // Setup Portuguese locale for the calendar
    LocaleConfig.locales["pt-PT"] = {
      monthNames: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      monthNamesShort: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      dayNames: [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      today: "Hoje",
    };

    // Setup English locale explicitly to avoid errors
    LocaleConfig.locales["en"] = {
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      today: "Today",
    };

    // Set the calendar locale based on the app's selected language
    if (language === "pt-PT") {
      LocaleConfig.defaultLocale = "pt-PT";
    } else {
      LocaleConfig.defaultLocale = "en";
    }
  }, [language]);

  // Generate marked dates for the calendar
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    tasks.forEach(({ task, isDue, daysUntilDue }) => {
      // Only date-based tasks, or tasks that have a date
      if (task.nextDueDate) {
        const dateStr = format(new Date(task.nextDueDate), "yyyy-MM-dd");
        
        if (!marks[dateStr]) {
          marks[dateStr] = { dots: [] };
        }

        // Determine color based on status
        let dotColor = colors.primary; // default upcoming
        if (isDue && (daysUntilDue !== undefined && daysUntilDue <= 0)) {
           dotColor = colors.error; // overdue
        } else if (isDue) {
           dotColor = colors.warning; // due soon
        }

        marks[dateStr].dots.push({
          key: task.id,
          color: dotColor,
        });
      }
    });

    // Add selected date styling
    if (marks[selectedDate]) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: "#FFFFFF"
      };
    } else {
      marks[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: "#FFFFFF"
      };
    }

    return marks;
  }, [tasks, selectedDate, colors]);

  const selectedDateTasks = useMemo(() => {
     return tasks.filter(t => t.task.nextDueDate && format(new Date(t.task.nextDueDate), "yyyy-MM-dd") === selectedDate);
  }, [tasks, selectedDate]);



  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={{ marginHorizontal: 16, marginTop: 8, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.card,
          borderWidth: 1, borderColor: colors.border }}>
        <Calendar
          current={selectedDate}
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          markingType={'multi-dot'}
          theme={{
            calendarBackground: colors.card,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colors.primary,
            dayTextColor: colors.text,
            textDisabledColor: colors.textSecondary + '50',
            dotColor: colors.primary,
            selectedDotColor: '#ffffff',
            arrowColor: colors.primary,
            disabledArrowColor: colors.border,
            monthTextColor: colors.text,
            indicatorColor: colors.primary,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14
          }}
          firstDay={1} // Monday
          enableSwipeMonths={true}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error }} />
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{t("maintenance.overdue")}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning }} />
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{t("maintenance.due_soon")}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{t("maintenance.scheduled")}</Text>
        </View>
      </View>

      <View style={{ marginHorizontal: 16, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>
             {format(new Date(selectedDate), "dd MMMM yyyy", { locale: language === "pt-PT" ? pt : enUS })}
          </Text>
          
          {selectedDateTasks.length === 0 ? (
             <Text style={[styles.emptyText, { paddingHorizontal: 0, textAlign: 'left', marginTop: 8 }]}>
                {t("maintenance.empty_title_all_done")} {/* Reusing for now */}
             </Text>
          ) : (
             <View style={{ gap: 12, marginTop: 8 }}>
                {selectedDateTasks.map(({ task, vehicle, isDue, daysUntilDue }) => {
                   let isOverdue = isDue && daysUntilDue !== undefined && daysUntilDue <= 0;
                   let isDueSoon = isDue && !isOverdue;
                   
                   return (
                      <TouchableOpacity 
                         key={task.id} 
                         style={[
                           styles.taskCard, 
                           isOverdue && styles.overdueTaskCard,
                           isDueSoon && styles.dueSoonTaskCard
                         ]}
                         onPress={() => onTaskPress?.(vehicle.id)}
                      >
                         <View style={styles.taskInfo}>
                            <Text style={styles.taskTitle}>{task.title || task.type}</Text>
                            <Text style={styles.taskVehicle}>{vehicle.make} {vehicle.model}</Text>
                            <Text style={isOverdue ? styles.taskOverdue : isDueSoon ? styles.taskDueSoon : styles.taskScheduled}>
                               {isOverdue ? t("maintenance.overdue") : isDueSoon ? t("maintenance.due_soon") : t("maintenance.scheduled")}
                            </Text>
                         </View>
                      </TouchableOpacity>
                   )
                })}
             </View>
          )}

      </View>
    </ScrollView>
  );
}
