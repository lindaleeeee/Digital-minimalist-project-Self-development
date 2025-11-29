package com.example.focushabit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.example.focushabit.model.Habit

@Composable
fun HabitSelectionScreen(habits: List<Habit>, onHabitClick: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1E1E1E))
            .padding(16.dp)
    ) {
        Text(
            text = "무엇을 했나요?",
            style = MaterialTheme.typography.headlineMedium,
            color = Color.White,
            modifier = Modifier.padding(vertical = 24.dp)
        )
        
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(habits) { habit ->
                HabitItemCard(habit = habit, onClick = {
                    if (!habit.isCompleted) onHabitClick(habit.id)
                })
            }
        }
    }
}

@Composable
fun HabitItemCard(habit: Habit, onClick: () -> Unit) {
    val backgroundColor = if (habit.isCompleted) Color.DarkGray else Color(habit.color)
    val alpha = if (habit.isCompleted) 0.5f else 1.0f
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(80.dp)
            .clickable(enabled = !habit.isCompleted, onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor.copy(alpha = alpha))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = habit.icon, style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = habit.name,
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White,
                    textDecoration = if (habit.isCompleted) TextDecoration.LineThrough else null
                )
            }
            if (habit.isCompleted) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Completed",
                    tint = Color.Green
                )
            }
        }
    }
}

