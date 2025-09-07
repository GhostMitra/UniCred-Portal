package com.android.unicred.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Student(
    val id: String,
    val name: String,
    val email: String,
    val credentials: List<Credential>,
    val status: StudentStatus,
    val studentId: String,
    val program: String,
    val enrollmentDate: String,
    val gpa: Double,
    val creditsCompleted: Int,
    val totalCredits: Int,
    val advisor: String,
    val phone: String? = null,
    val address: String? = null
) : Parcelable

enum class StudentStatus {
    ACTIVE,
    GRADUATED,
    INACTIVE
}