package com.example.focushabit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun LauncherScreen(onYesClick: () -> Unit, onNoClick: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF1E1E1E)) // Dark Mode
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "07:00",
            style = MaterialTheme.typography.displayLarge,
            color = Color.White,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "아침 루틴 알람",
            style = MaterialTheme.typography.titleMedium,
            color = Color.Gray
        )
        Spacer(modifier = Modifier.height(48.dp))
        
        Text(
            text = "지금 습관을 수행하시겠습니까?",
            style = MaterialTheme.typography.headlineSmall,
            color = Color.White
        )
        Spacer(modifier = Modifier.height(32.dp))
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            Button(
                onClick = onNoClick,
                colors = ButtonDefaults.buttonColors(containerColor = Color.DarkGray),
                modifier = Modifier.weight(1f).padding(end = 8.dp).height(56.dp)
            ) {
                Text("나중에 (NO)", color = Color.White)
            }
            
            Button(
                onClick = onYesClick,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF6C63FF)),
                modifier = Modifier.weight(1f).padding(start = 8.dp).height(56.dp)
            ) {
                Text("지금 할래요 (YES)", color = Color.White)
            }
        }
    }
}

