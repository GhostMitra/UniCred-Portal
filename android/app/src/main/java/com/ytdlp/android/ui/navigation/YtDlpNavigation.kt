package com.ytdlp.android.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.ytdlp.android.ui.screens.about.AboutScreen
import com.ytdlp.android.ui.screens.customcommand.CustomCommandScreen
import com.ytdlp.android.ui.screens.downloaddirectory.DownloadDirectoryScreen
import com.ytdlp.android.ui.screens.format.FormatScreen
import com.ytdlp.android.ui.screens.general.GeneralScreen
import com.ytdlp.android.ui.screens.interfaceinteraction.InterfaceInteractionScreen
import com.ytdlp.android.ui.screens.lookandfeel.LookAndFeelScreen
import com.ytdlp.android.ui.screens.network.NetworkScreen
import com.ytdlp.android.ui.screens.settings.SettingsScreen

@Composable
fun YtDlpNavigation(
    navController: NavHostController,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = "settings",
        modifier = modifier
    ) {
        composable("settings") {
            SettingsScreen(
                onNavigateToGeneral = { navController.navigate("general") },
                onNavigateToDownloadDirectory = { navController.navigate("download_directory") },
                onNavigateToFormat = { navController.navigate("format") },
                onNavigateToNetwork = { navController.navigate("network") },
                onNavigateToCustomCommand = { navController.navigate("custom_command") },
                onNavigateToLookAndFeel = { navController.navigate("look_and_feel") },
                onNavigateToInterfaceInteraction = { navController.navigate("interface_interaction") },
                onNavigateToAbout = { navController.navigate("about") }
            )
        }
        
        composable("general") {
            GeneralScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("download_directory") {
            DownloadDirectoryScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("format") {
            FormatScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("network") {
            NetworkScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("custom_command") {
            CustomCommandScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("look_and_feel") {
            LookAndFeelScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("interface_interaction") {
            InterfaceInteractionScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("about") {
            AboutScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}