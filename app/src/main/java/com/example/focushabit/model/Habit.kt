package com.example.focushabit.model

data class Habit(
    val id: String,
    val name: String,
    val icon: String, // Emoji
    val color: Long, // 0xFF...
    val isCompleted: Boolean = false
)

val mockHabits = listOf(
    Habit("1", "아침 명상", "🧘", 0xFF6C63FF, isCompleted = true), // 완료됨 (회색 처리 예정)
    Habit("2", "기술 블로그 읽기", "📚", 0xFFFF6584, isCompleted = false),
    Habit("3", "영양제 먹기", "💊", 0xFF43D097, isCompleted = false),
    Habit("4", "스트레칭", "🤸", 0xFFFFC107, isCompleted = false)
)

val mockQuotes = listOf(
    "성공은 매일 반복되는 작은 노력들의 합이다.",
    "오늘 걷지 않으면 내일은 뛰어야 한다.",
    "가장 큰 위험은 아무런 위험도 감수하지 않는 것이다."
)

