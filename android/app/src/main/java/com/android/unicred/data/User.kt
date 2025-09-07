package com.android.unicred.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class User(
    val id: String,
    val username: String,
    val accessType: AccessType,
    val email: String? = null,
    val fullName: String? = null,
    val studentId: String? = null
) : Parcelable

enum class AccessType {
    STUDENT,
    RECRUITER,
    UNIVERSITY
}