package com.ytdlp.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.core.view.WindowCompat
import androidx.navigation.compose.rememberNavController
import com.ytdlp.android.ui.navigation.YtDlpNavigation
import com.ytdlp.android.ui.theme.YtDlpAndroidTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        setContent {
            YtDlpAndroidTheme {
                YtDlpApp()
            }
        }
    }
}

@Composable
fun YtDlpApp() {
    val navController = rememberNavController()
    
    Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
        YtDlpNavigation(
            navController = navController,
            modifier = Modifier.padding(innerPadding)
        )
    }
}