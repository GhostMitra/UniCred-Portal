package com.android.unicred.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.android.unicred.ui.screens.auth.LoginScreen
import com.android.unicred.ui.screens.auth.SignupScreen
import com.android.unicred.ui.screens.recruiter.RecruiterPortal
import com.android.unicred.ui.screens.student.StudentPortal
import com.android.unicred.ui.screens.university.UniversityPortal
import com.android.unicred.ui.viewmodel.AuthViewModel

@Composable
fun UniCredNavigation(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController(),
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val authState by authViewModel.authState.collectAsStateWithLifecycle()
    
    NavHost(
        navController = navController,
        startDestination = if (authState.user != null) {
            when (authState.user.accessType) {
                com.android.unicred.data.AccessType.STUDENT -> "student_portal"
                com.android.unicred.data.AccessType.RECRUITER -> "recruiter_portal"
                com.android.unicred.data.AccessType.UNIVERSITY -> "university_portal"
            }
        } else {
            "login"
        },
        modifier = modifier
    ) {
        composable("login") {
            LoginScreen(
                onLoginSuccess = { user ->
                    authViewModel.setUser(user)
                    when (user.accessType) {
                        com.android.unicred.data.AccessType.STUDENT -> navController.navigate("student_portal")
                        com.android.unicred.data.AccessType.RECRUITER -> navController.navigate("recruiter_portal")
                        com.android.unicred.data.AccessType.UNIVERSITY -> navController.navigate("university_portal")
                    }
                },
                onNavigateToSignup = {
                    navController.navigate("signup")
                }
            )
        }
        
        composable("signup") {
            SignupScreen(
                onSignupSuccess = {
                    navController.popBackStack()
                },
                onBackToLogin = {
                    navController.popBackStack()
                }
            )
        }
        
        composable("student_portal") {
            StudentPortal(
                user = authState.user!!,
                onLogout = {
                    authViewModel.logout()
                    navController.navigate("login") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }
        
        composable("recruiter_portal") {
            RecruiterPortal(
                user = authState.user!!,
                onLogout = {
                    authViewModel.logout()
                    navController.navigate("login") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }
        
        composable("university_portal") {
            UniversityPortal(
                user = authState.user!!,
                onLogout = {
                    authViewModel.logout()
                    navController.navigate("login") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }
    }
}