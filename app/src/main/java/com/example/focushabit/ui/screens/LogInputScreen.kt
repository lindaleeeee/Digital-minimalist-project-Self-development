package com.example.focushabit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.focushabit.model.Habit

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LogInputScreen(habit: Habit, onSaveClick: () -> Unit) {
    var note by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1E1E1E))
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // 헤더
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(text = habit.icon, style = MaterialTheme.typography.displaySmall)
            Spacer(modifier = Modifier.width(12.dp))
            Text(text = habit.name, style = MaterialTheme.typography.headlineMedium, color = Color.White)
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // 그래프 영역 (Mock)
        Card(
            modifier = Modifier.fillMaxWidth().height(200.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF2D2D2D)),
            shape = RoundedCornerShape(16.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                // 실제 구현 시 Vico/MPAndroidChart 사용
                Text("📊 Weekly Progress Chart Placeholder", color = Color.Gray)
                
                // 시각적 효과를 위한 간단한 Bar 표현
                Row(
                    modifier = Modifier.fillMaxSize().padding(24.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.Bottom
                ) {
                    listOf(0.3f, 0.5f, 0.2f, 0.8f, 1.0f, 0.6f, 0.4f).forEach { height ->
                        Box(
                            modifier = Modifier
                                .width(20.dp)
                                .fillMaxHeight(height)
                                .background(Color(habit.color), RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                        )
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // 메모 입력
        OutlinedTextField(
            value = note,
            onValueChange = { note = it },
            label = { Text("메모를 남겨보세요", color = Color.Gray) },
            modifier = Modifier.fillMaxWidth().height(120.dp),
            colors = TextFieldDefaults.outlinedTextFieldColors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                focusedBorderColor = Color(habit.color),
                unfocusedBorderColor = Color.Gray
            )
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // 버튼 영역 (음성 & 저장)
        Row(modifier = Modifier.fillMaxWidth()) {
            IconButton(
                onClick = { /* Voice Input Mock */ },
                modifier = Modifier
                    .size(56.dp)
                    .background(Color.DarkGray, CircleShape)
            ) {
                Icon(Icons.Default.Mic, contentDescription = "Voice", tint = Color.White)
            }
            
            Spacer(modifier = Modifier.width(12.dp))
            
            Button(
                onClick = onSaveClick,
                modifier = Modifier.weight(1f).height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(habit.color))
            ) {
                Text("기록 저장", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        }
    }
}

