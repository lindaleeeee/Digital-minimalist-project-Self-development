package com.example.focushabit

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.focushabit.model.mockHabits
import com.example.focushabit.model.mockQuotes
import com.example.focushabit.ui.screens.HabitSelectionScreen
import com.example.focushabit.ui.screens.LauncherScreen
import com.example.focushabit.ui.screens.LogInputScreen
import com.example.focushabit.ui.screens.QuoteScreen
import com.example.focushabit.ui.theme.FocusHabitLauncherTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FocusHabitLauncherTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FocusHabitApp()
                }
            }
        }
    }
}

@Composable
fun FocusHabitApp() {
    val navController = rememberNavController()
    
    NavHost(navController = navController, startDestination = "launcher") {
        // 1. 런처 화면 (Yes/No)
        composable("launcher") {
            LauncherScreen(
                onYesClick = { navController.navigate("habit_select") },
                onNoClick = { navController.navigate("quote") }
            )
        }
        
        // 2. 습관 선택 화면
        composable("habit_select") {
            HabitSelectionScreen(
                habits = mockHabits,
                onHabitClick = { habitId -> 
                    navController.navigate("log_input/$habitId") 
                }
            )
        }
        
        // 3. 기록 및 통계 화면
        composable("log_input/{habitId}") { backStackEntry ->
            val habitId = backStackEntry.arguments?.getString("habitId")
            val habit = mockHabits.find { it.id == habitId } ?: mockHabits[0]
            LogInputScreen(
                habit = habit,
                onSaveClick = { 
                    // 저장 후 종료 시뮬레이션 (실제로는 백스택 정리)
                    navController.popBackStack("launcher", inclusive = true) 
                }
            )
        }
        
        // 4. 명언 카드 화면 (NO 선택 시)
        composable("quote") {
            QuoteScreen(
                quote = mockQuotes.random(),
                onCloseClick = { 
                    // 앱 종료 시뮬레이션
                    navController.popBackStack("launcher", inclusive = true) 
                }
            )
        }
    }
}

