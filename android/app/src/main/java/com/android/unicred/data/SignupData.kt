package com.android.unicred.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class SignupData(
    val userType: AccessType,
    val name: String,
    val email: String,
    val password: String,
    val validId: String
) : Parcelable

@Parcelize
data class LoginRequest(
    val id: String,
    val password: String,
    val accessType: AccessType
) : Parcelable

@Parcelize
data class LoginResponse(
    val user: User,
    val token: String? = null
) : Parcelable